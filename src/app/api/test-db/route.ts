import { NextRequest, NextResponse } from 'next/server';
import { testConnection, getDatabaseStats } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    // اختبار الاتصال بقاعدة البيانات
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'فشل الاتصال بقاعدة البيانات',
          error: 'Database connection failed'
        },
        { status: 500 }
      );
    }

    // الحصول على إحصائيات قاعدة البيانات
    const stats = await getDatabaseStats();

    return NextResponse.json({
      success: true,
      message: 'تم الاتصال بقاعدة البيانات بنجاح',
      data: {
        connection: 'متصل',
        stats: {
          المستخدمين: stats.users,
          العملاء: stats.clients,
          القضايا: stats.cases,
          المواعيد: stats.appointments,
          العقود: stats.contracts,
          الفواتير: stats.invoices,
          المستندات: stats.documents,
        }
      }
    });

  } catch (error) {
    console.error('خطأ في اختبار قاعدة البيانات:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'خطأ في الخادم',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
