import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { executeQuery } from '@/lib/database';
import { sign } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // التحقق من وجود البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم في قاعدة البيانات
    console.log('Searching for user with email:', email);

    const users = await executeQuery(
      'SELECT id, name, email, password, licenseNo, specialties, country, workArea, isActive FROM lawyers WHERE email = ?',
      [email]
    );

    console.log('Users found:', Array.isArray(users) ? users.length : 0);

    if (!Array.isArray(users) || users.length === 0) {
      console.log('User not found for email:', email);
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const user = users[0] as any;

    // التحقق من أن الحساب نشط
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'الحساب غير نشط. يرجى التواصل مع الإدارة' },
        { status: 401 }
      );
    }

    // التحقق من كلمة المرور
    console.log('Checking password for user:', user.email);
    const isPasswordValid = await compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', user.email);
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // إنشاء JWT token (اختياري - للجلسات)
    const token = sign(
      { 
        userId: user.id, 
        email: user.email, 
        name: user.name 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // إرجاع بيانات المستخدم (بدون كلمة المرور)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      licenseNo: user.licenseNo,
      specialties: user.specialties,
      country: user.country,
      workArea: user.workArea,
      isActive: user.isActive
    };

    // إنشاء response مع cookie للجلسة
    const response = NextResponse.json(
      { 
        message: 'تم تسجيل الدخول بنجاح',
        user: userResponse,
        token: token
      },
      { status: 200 }
    );

    // إضافة cookie للجلسة
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 أيام
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: 'حدث خطأ في الخادم',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
