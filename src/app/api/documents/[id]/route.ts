import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../../lib/database';
import { unlink } from 'fs/promises';
import path from 'path';

// GET - الحصول على مستند محدد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;

    const document = await executeQuery(`
      SELECT 
        d.*,
        c.name as client_name,
        ca.title as case_title,
        ca.case_number
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN cases ca ON d.case_id = ca.id
      WHERE d.id = ?
    `, [documentId]);

    if (!Array.isArray(document) || document.length === 0) {
      return NextResponse.json(
        { success: false, message: 'المستند غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: document[0]
    });

  } catch (error) {
    console.error('خطأ في الحصول على المستند:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - تحديث مستند
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    const body = await request.json();
    const {
      category,
      description,
      client_id,
      case_id
    } = body;

    // تحديث المستند
    await executeQuery(`
      UPDATE documents SET
        category = ?, description = ?, client_id = ?, case_id = ?, updated_at = NOW()
      WHERE id = ?
    `, [category, description, client_id || null, case_id || null, documentId]);

    // الحصول على المستند المحدث
    const updatedDocument = await executeQuery(`
      SELECT 
        d.*,
        c.name as client_name,
        ca.title as case_title,
        ca.case_number
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN cases ca ON d.case_id = ca.id
      WHERE d.id = ?
    `, [documentId]);

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المستند بنجاح',
      data: (updatedDocument as any[])[0]
    });

  } catch (error) {
    console.error('خطأ في تحديث المستند:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - حذف مستند
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;

    // الحصول على معلومات المستند
    const document = await executeQuery(
      'SELECT file_path FROM documents WHERE id = ?',
      [documentId]
    ) as any[];

    if (document.length === 0) {
      return NextResponse.json(
        { success: false, message: 'المستند غير موجود' },
        { status: 404 }
      );
    }

    // حذف الملف من النظام
    try {
      const filePath = path.join(process.cwd(), 'public', document[0].file_path);
      await unlink(filePath);
    } catch (fileError) {
      console.warn('تعذر حذف الملف:', fileError);
      // نتابع حذف السجل من قاعدة البيانات حتى لو فشل حذف الملف
    }

    // حذف السجل من قاعدة البيانات
    await executeQuery('DELETE FROM documents WHERE id = ?', [documentId]);

    return NextResponse.json({
      success: true,
      message: 'تم حذف المستند بنجاح'
    });

  } catch (error) {
    console.error('خطأ في حذف المستند:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
