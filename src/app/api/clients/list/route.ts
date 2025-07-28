import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../../lib/database';

// GET - الحصول على قائمة مبسطة من العملاء للاستخدام في النماذج
export async function GET(request: NextRequest) {
  try {
    const clients = await executeQuery(`
      SELECT 
        id,
        name,
        email,
        phone
      FROM clients 
      WHERE status = 'ACTIVE'
      ORDER BY name ASC
    `);

    return NextResponse.json({
      success: true,
      data: clients
    });

  } catch (error) {
    console.error('خطأ في الحصول على قائمة العملاء:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
