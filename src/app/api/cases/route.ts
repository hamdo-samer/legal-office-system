import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { randomUUID } from 'crypto';

// GET - الحصول على جميع القضايا
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        c.*,
        l.name as lawyer_name
      FROM cases c
      LEFT JOIN lawyers l ON c.lawyerId = l.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND c.status = ?';
      params.push(status);
    }

    if (clientId) {
      query += ' AND c.clientName LIKE ?';
      params.push(`%${clientId}%`);
    }

    query += ' ORDER BY c.createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const cases = await executeQuery(query, params);

    // الحصول على العدد الإجمالي
    let countQuery = 'SELECT COUNT(*) as total FROM cases WHERE 1=1';
    const countParams: any[] = [];

    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (clientId) {
      countQuery += ' AND clientName LIKE ?';
      countParams.push(`%${clientId}%`);
    }

    const countResult = await executeQuery(countQuery, countParams) as any[];
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: cases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في الحصول على القضايا:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - إضافة قضية جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      caseNumber,
      caseType,
      clientName,
      clientPhone,
      clientEmail,
      court,
      opponent,
      description,
      startDate,
      lawyerId
    } = body;

    // التحقق من البيانات المطلوبة
    if (!title || !caseNumber || !caseType || !clientName || !startDate || !lawyerId) {
      return NextResponse.json(
        { success: false, message: 'البيانات المطلوبة مفقودة' },
        { status: 400 }
      );
    }

    // التحقق من عدم تكرار رقم القضية
    const existingCase = await executeQuery(
      'SELECT id FROM cases WHERE caseNumber = ?',
      [caseNumber]
    ) as any[];

    if (existingCase.length > 0) {
      return NextResponse.json(
        { success: false, message: 'رقم القضية موجود مسبقاً' },
        { status: 400 }
      );
    }

    // إنشاء القضية الجديدة
    const caseId = randomUUID();

    await executeQuery(`
      INSERT INTO cases (
        id, caseNumber, title, description, caseType, status, court, opponent,
        clientName, clientPhone, clientEmail, startDate, lawyerId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, 'OPEN', ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [caseId, caseNumber, title, description, caseType, court, opponent, clientName, clientPhone, clientEmail, startDate, lawyerId]);

    // الحصول على القضية المُدرجة مع البيانات المرتبطة
    const newCase = await executeQuery(`
      SELECT
        c.*,
        l.name as lawyer_name
      FROM cases c
      LEFT JOIN lawyers l ON c.lawyerId = l.id
      WHERE c.id = ?
    `, [caseId]);

    return NextResponse.json({
      success: true,
      message: 'تم إضافة القضية بنجاح',
      data: (newCase as any[])[0]
    }, { status: 201 });

  } catch (error) {
    console.error('خطأ في إضافة القضية:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
