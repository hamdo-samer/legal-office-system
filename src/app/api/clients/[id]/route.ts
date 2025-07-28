import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../../lib/database';

// GET - الحصول على عميل محدد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;

    const client = await executeQuery(`
      SELECT 
        c.*,
        COUNT(ca.id) as cases_count
      FROM clients c
      LEFT JOIN cases ca ON c.id = ca.client_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [clientId]);

    if (!Array.isArray(client) || client.length === 0) {
      return NextResponse.json(
        { success: false, message: 'العميل غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: client[0]
    });

  } catch (error) {
    console.error('خطأ في الحصول على العميل:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - تحديث عميل
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;
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

    // التحقق من عدم تكرار البريد الإلكتروني (باستثناء العميل الحالي)
    const existingClient = await executeQuery(
      'SELECT id FROM clients WHERE email = ? AND id != ?',
      [email, clientId]
    ) as any[];

    if (existingClient.length > 0) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني موجود مسبقاً' },
        { status: 400 }
      );
    }

    // تحديث العميل
    await executeQuery(`
      UPDATE clients SET
        name = ?, email = ?, phone = ?, national_id = ?,
        address = ?, date_of_birth = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, email, phone, nationalId || null, address || null, dateOfBirth || null, notes || null, clientId]);

    // الحصول على العميل المحدث
    const updatedClient = await executeQuery(`
      SELECT 
        c.*,
        COUNT(ca.id) as cases_count
      FROM clients c
      LEFT JOIN cases ca ON c.id = ca.client_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [clientId]);

    return NextResponse.json({
      success: true,
      message: 'تم تحديث العميل بنجاح',
      data: (updatedClient as any[])[0]
    });

  } catch (error) {
    console.error('خطأ في تحديث العميل:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - حذف عميل
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;

    // التحقق من وجود العميل
    const client = await executeQuery(
      'SELECT id FROM clients WHERE id = ?',
      [clientId]
    ) as any[];

    if (client.length === 0) {
      return NextResponse.json(
        { success: false, message: 'العميل غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من وجود قضايا مرتبطة
    const cases = await executeQuery(
      'SELECT COUNT(*) as count FROM cases WHERE client_id = ?',
      [clientId]
    ) as any[];

    if (cases[0].count > 0) {
      return NextResponse.json(
        { success: false, message: 'لا يمكن حذف العميل لوجود قضايا مرتبطة به' },
        { status: 400 }
      );
    }

    // حذف العميل
    await executeQuery('DELETE FROM clients WHERE id = ?', [clientId]);

    return NextResponse.json({
      success: true,
      message: 'تم حذف العميل بنجاح'
    });

  } catch (error) {
    console.error('خطأ في حذف العميل:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
