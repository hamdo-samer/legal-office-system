import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

// GET - الحصول على جميع المستندات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const clientId = searchParams.get('clientId');
    const caseId = searchParams.get('caseId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // بناء الاستعلام
    let query = `
      SELECT 
        d.*,
        c.name as client_name,
        ca.title as case_title,
        ca.case_number
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN cases ca ON d.case_id = ca.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND d.category = ?';
      params.push(category);
    }

    if (clientId) {
      query += ' AND d.client_id = ?';
      params.push(clientId);
    }

    if (caseId) {
      query += ' AND d.case_id = ?';
      params.push(caseId);
    }

    if (search) {
      query += ' AND (d.name LIKE ? OR d.original_name LIKE ? OR d.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY d.created_at DESC';

    // الحصول على المستندات
    const documents = await executeQuery(query + ' LIMIT ? OFFSET ?', [...params, limit, offset]);

    // الحصول على العدد الإجمالي
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN cases ca ON d.case_id = ca.id
      WHERE 1=1
    `;
    const countParams: any[] = [];

    if (category && category !== 'all') {
      countQuery += ' AND d.category = ?';
      countParams.push(category);
    }

    if (clientId) {
      countQuery += ' AND d.client_id = ?';
      countParams.push(clientId);
    }

    if (caseId) {
      countQuery += ' AND d.case_id = ?';
      countParams.push(caseId);
    }

    if (search) {
      countQuery += ' AND (d.name LIKE ? OR d.original_name LIKE ? OR d.description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await executeQuery(countQuery, countParams) as any[];
    const total = countResult[0].total;

    return NextResponse.json({
      success: true,
      data: documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في الحصول على المستندات:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
