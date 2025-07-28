import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { executeQuery } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const clientId = formData.get('clientId') as string;
    const caseId = formData.get('caseId') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'لم يتم اختيار ملف' },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'نوع الملف غير مدعوم' },
        { status: 400 }
      );
    }

    // التحقق من حجم الملف (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'حجم الملف كبير جداً (الحد الأقصى 10MB)' },
        { status: 400 }
      );
    }

    // إنشاء مجلد الرفع إذا لم يكن موجوداً
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // إنشاء اسم ملف فريد
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    const fileName = `${nameWithoutExt}_${timestamp}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    // حفظ الملف
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // حفظ معلومات الملف في قاعدة البيانات
    const fileUrl = `/uploads/${fileName}`;
    const result = await executeQuery(`
      INSERT INTO documents (
        name, original_name, file_path, file_size, file_type, 
        category, description, client_id, case_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      fileName,
      originalName,
      fileUrl,
      file.size,
      file.type,
      category || 'general',
      description || '',
      clientId || null,
      caseId || null
    ]);

    return NextResponse.json({
      success: true,
      message: 'تم رفع الملف بنجاح',
      data: {
        id: (result as any).insertId,
        name: fileName,
        originalName: originalName,
        filePath: fileUrl,
        fileSize: file.size,
        fileType: file.type,
        category: category || 'general',
        description: description || ''
      }
    });

  } catch (error) {
    console.error('خطأ في رفع الملف:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في رفع الملف', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
