import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

// GET - الحصول على جميع العملاء
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        c.*,
        COUNT(ca.id) as cases_count
      FROM clients c
      LEFT JOIN cases ca ON c.id = ca.client_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND c.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' GROUP BY c.id ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const clients = await executeQuery(query, params);

    // الحصول على العدد الإجمالي
    let countQuery = 'SELECT COUNT(*) as total FROM clients WHERE 1=1';
    const countParams: any[] = [];

    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await executeQuery(countQuery, countParams) as any[];
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في الحصول على العملاء:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - إضافة عميل جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      nationalId,
      address,
      dateOfBirth,
      notes
    } = body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'الاسم والبريد الإلكتروني والهاتف مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من عدم تكرار البريد الإلكتروني
    const existingClient = await executeQuery(
      'SELECT id FROM clients WHERE email = ?',
      [email]
    ) as any[];

    if (existingClient.length > 0) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني موجود مسبقاً' },
        { status: 400 }
      );
    }

    // إدراج العميل الجديد
    const result = await executeQuery(`
      INSERT INTO clients (
        name, email, phone, national_id, address, date_of_birth, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `, [name, email, phone, nationalId || null, address || null, dateOfBirth || null, notes || null]);

    const insertResult = result as any;
    const newClientId = insertResult.insertId;

    // الحصول على العميل المُدرج
    const newClient = await executeQuery(`
      SELECT 
        c.*,
        COUNT(ca.id) as cases_count
      FROM clients c
      LEFT JOIN cases ca ON c.id = ca.client_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [newClientId]);

    return NextResponse.json({
      success: true,
      message: 'تم إضافة العميل بنجاح',
      data: (newClient as any[])[0]
    }, { status: 201 });

  } catch (error) {
    console.error('خطأ في إضافة العميل:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
