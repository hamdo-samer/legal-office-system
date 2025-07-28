import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../../lib/database';

// GET - الحصول على قضية محددة
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;

    const caseData = await executeQuery(`
      SELECT 
        c.*,
        cl.name as client_name,
        cl.email as client_email,
        cl.phone as client_phone
      FROM cases c
      LEFT JOIN clients cl ON c.client_id = cl.id
      WHERE c.id = ?
    `, [caseId]);

    if (!Array.isArray(caseData) || caseData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'القضية غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: caseData[0]
    });

  } catch (error) {
    console.error('خطأ في الحصول على القضية:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - تحديث قضية
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;
    const body = await request.json();
    const {
      title,
      case_number,
      case_type,
      status,
      client_id,
      court,
      opponent,
      start_date,
      next_session,
      description,
      notes
    } = body;

    // التحقق من البيانات المطلوبة
    if (!title || !case_number || !case_type || !client_id) {
      return NextResponse.json(
        { success: false, message: 'العنوان ورقم القضية والنوع والعميل مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من عدم تكرار رقم القضية (باستثناء القضية الحالية)
    const existingCase = await executeQuery(
      'SELECT id FROM cases WHERE case_number = ? AND id != ?',
      [case_number, caseId]
    ) as any[];

    if (existingCase.length > 0) {
      return NextResponse.json(
        { success: false, message: 'رقم القضية موجود مسبقاً' },
        { status: 400 }
      );
    }

    // تحديث القضية
    await executeQuery(`
      UPDATE cases SET
        title = ?, case_number = ?, case_type = ?, status = ?, client_id = ?,
        court = ?, opponent = ?, start_date = ?, next_session = ?, 
        description = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [title, case_number, case_type, status, client_id, court || null, opponent || null,
        start_date || null, next_session || null, description || null, notes || null, caseId]);

    // الحصول على القضية المحدثة
    const updatedCase = await executeQuery(`
      SELECT 
        c.*,
        cl.name as client_name,
        cl.email as client_email,
        cl.phone as client_phone
      FROM cases c
      LEFT JOIN clients cl ON c.client_id = cl.id
      WHERE c.id = ?
    `, [caseId]);

    return NextResponse.json({
      success: true,
      message: 'تم تحديث القضية بنجاح',
      data: (updatedCase as any[])[0]
    });

  } catch (error) {
    console.error('خطأ في تحديث القضية:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - حذف قضية
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;

    // التحقق من وجود القضية
    const caseData = await executeQuery(
      'SELECT id FROM cases WHERE id = ?',
      [caseId]
    ) as any[];

    if (caseData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'القضية غير موجودة' },
        { status: 404 }
      );
    }

    // حذف القضية
    await executeQuery('DELETE FROM cases WHERE id = ?', [caseId]);

    return NextResponse.json({
      success: true,
      message: 'تم حذف القضية بنجاح'
    });

  } catch (error) {
    console.error('خطأ في حذف القضية:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
