import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

// GET - الحصول على جميع المواعيد
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const clientId = searchParams.get('clientId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.*,
        c.name as client_name,
        u.name as lawyer_name
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN users u ON a.lawyer_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND a.appointment_date = ?';
      params.push(date);
    }

    if (clientId) {
      query += ' AND a.client_id = ?';
      params.push(clientId);
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const appointments = await executeQuery(query, params);

    // الحصول على العدد الإجمالي
    let countQuery = 'SELECT COUNT(*) as total FROM appointments WHERE 1=1';
    const countParams: any[] = [];

    if (status && status !== 'all') {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (date) {
      countQuery += ' AND appointment_date = ?';
      countParams.push(date);
    }

    if (clientId) {
      countQuery += ' AND client_id = ?';
      countParams.push(clientId);
    }

    const countResult = await executeQuery(countQuery, countParams) as any[];
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في الحصول على المواعيد:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - إضافة موعد جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      clientId,
      date,
      time,
      duration,
      type,
      location,
      description,
      notes
    } = body;

    // التحقق من البيانات المطلوبة
    if (!title || !clientId || !date || !time || !duration || !type) {
      return NextResponse.json(
        { success: false, message: 'البيانات المطلوبة مفقودة' },
        { status: 400 }
      );
    }

    // التحقق من عدم تعارض المواعيد
    const conflictingAppointment = await executeQuery(`
      SELECT id FROM appointments 
      WHERE appointment_date = ? 
      AND appointment_time = ? 
      AND status != 'CANCELLED'
    `, [date, time]) as any[];

    if (conflictingAppointment.length > 0) {
      return NextResponse.json(
        { success: false, message: 'يوجد موعد آخر في نفس التوقيت' },
        { status: 400 }
      );
    }

    // إدراج الموعد الجديد (افتراض أن المحامي الأول هو المسؤول)
    const lawyerId = 1; // يمكن تحديده من الجلسة لاحقاً

    const result = await executeQuery(`
      INSERT INTO appointments (
        title, client_id, lawyer_id, appointment_date, appointment_time,
        duration, type, location, description, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED')
    `, [title, clientId, lawyerId, date, time, duration, type, location, description, notes]);

    const insertResult = result as any;
    const newAppointmentId = insertResult.insertId;

    // الحصول على الموعد المُدرج مع البيانات المرتبطة
    const newAppointment = await executeQuery(`
      SELECT 
        a.*,
        c.name as client_name,
        u.name as lawyer_name
      FROM appointments a
      LEFT JOIN clients c ON a.client_id = c.id
      LEFT JOIN users u ON a.lawyer_id = u.id
      WHERE a.id = ?
    `, [newAppointmentId]);

    return NextResponse.json({
      success: true,
      message: 'تم إضافة الموعد بنجاح',
      data: (newAppointment as any[])[0]
    }, { status: 201 });

  } catch (error) {
    console.error('خطأ في إضافة الموعد:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
