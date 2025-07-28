import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // جلب جميع المستخدمين (بدون كلمات المرور)
    const users = await executeQuery(`
      SELECT id, name, email, phone, licenseNo, specialties, country, workArea, isActive, createdAt 
      FROM lawyers 
      ORDER BY createdAt DESC
    `);

    return NextResponse.json(
      { 
        users: users,
        count: Array.isArray(users) ? users.length : 0
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        error: 'حدث خطأ في جلب المستخدمين',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
