import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { executeQuery } from '@/lib/database';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      country,
      workArea,
      licenseNo,
      specialties,
      password,
      role = 'LAWYER'
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !country || !workArea || !licenseNo || !specialties || !password) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await executeQuery(
      'SELECT id FROM lawyers WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingEmail) && existingEmail.length > 0) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Check if license number already exists
    const existingLicense = await executeQuery(
      'SELECT id FROM lawyers WHERE licenseNo = ?',
      [licenseNo]
    );

    if (Array.isArray(existingLicense) && existingLicense.length > 0) {
      return NextResponse.json(
        { error: 'رقم الترخيص مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Generate UUID
    const lawyerId = randomUUID();

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Insert lawyer (single table)
    await executeQuery(
      `INSERT INTO lawyers (id, name, email, phone, password, licenseNo, specialties, country, workArea, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW())`,
      [lawyerId, name, email, phone, hashedPassword, licenseNo, specialties, country, workArea]
    );

    return NextResponse.json(
      {
        message: 'تم إنشاء الحساب بنجاح',
        lawyerId: lawyerId
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ في الخادم',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
