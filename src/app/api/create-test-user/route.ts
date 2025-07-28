import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { executeQuery } from '@/lib/database';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // إنشاء مستخدم تجريبي بكلمة مرور معروفة
    const testPassword = '123456';
    const hashedPassword = await hash(testPassword, 12);
    const lawyerId = randomUUID();

    // حذف المستخدم التجريبي إذا كان موجود
    await executeQuery('DELETE FROM lawyers WHERE email = ?', ['test@lawyer.com']);

    // إنشاء مستخدم تجريبي جديد
    await executeQuery(`
      INSERT INTO lawyers (id, name, email, phone, password, licenseNo, specialties, country, workArea, isActive, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW())
    `, [
      lawyerId, 
      'محامي تجريبي', 
      'test@lawyer.com', 
      '+966501234567', 
      hashedPassword, 
      'TEST123', 
      'CIVIL', 
      'SA', 
      'الرياض'
    ]);

    // إنشاء مستخدم آخر بكلمة مرور "password"
    const passwordHash = await hash('password', 12);
    const lawyerId2 = randomUUID();

    await executeQuery('DELETE FROM lawyers WHERE email = ?', ['demo@lawyer.com']);

    await executeQuery(`
      INSERT INTO lawyers (id, name, email, phone, password, licenseNo, specialties, country, workArea, isActive, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW())
    `, [
      lawyerId2, 
      'محامي تجريبي 2', 
      'demo@lawyer.com', 
      '+966507654321', 
      passwordHash, 
      'DEMO123', 
      'COMMERCIAL', 
      'SA', 
      'جدة'
    ]);

    return NextResponse.json(
      { 
        message: 'تم إنشاء المستخدمين التجريبيين بنجاح',
        users: [
          {
            email: 'test@lawyer.com',
            password: '123456',
            name: 'محامي تجريبي'
          },
          {
            email: 'demo@lawyer.com', 
            password: 'password',
            name: 'محامي تجريبي 2'
          }
        ]
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { 
        error: 'حدث خطأ في إنشاء المستخدم التجريبي',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
