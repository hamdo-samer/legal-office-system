import mysql from 'mysql2/promise';

// إعدادات الاتصال بقاعدة البيانات
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'legal_office_system',
  port: parseInt(process.env.DB_PORT || '3306'),
  charset: 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};

// إنشاء pool للاتصالات
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// دالة للحصول على اتصال
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', error);
    throw error;
  }
}

// دالة لتنفيذ استعلام
export async function executeQuery(query: string, params: any[] = []) {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('خطأ في تنفيذ الاستعلام:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// دالة لتنفيذ استعلام مع إرجاع النتائج والمعلومات الإضافية
export async function executeQueryWithInfo(query: string, params: any[] = []) {
  const connection = await getConnection();
  try {
    const [results, fields] = await connection.execute(query, params);
    return { results, fields };
  } catch (error) {
    console.error('خطأ في تنفيذ الاستعلام:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// دالة لتنفيذ معاملة (transaction)
export async function executeTransaction(queries: { query: string; params?: any[] }[]) {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params = [] } of queries) {
      const [result] = await connection.execute(query, params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    console.error('خطأ في تنفيذ المعاملة:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// دالة لاختبار الاتصال
export async function testConnection() {
  try {
    const connection = await getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    return true;
  } catch (error) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', error);
    return false;
  }
}

// دالة للحصول على إحصائيات قاعدة البيانات
export async function getDatabaseStats() {
  try {
    const stats = {
      users: await executeQuery('SELECT COUNT(*) as count FROM users'),
      clients: await executeQuery('SELECT COUNT(*) as count FROM clients'),
      cases: await executeQuery('SELECT COUNT(*) as count FROM cases'),
      appointments: await executeQuery('SELECT COUNT(*) as count FROM appointments'),
      contracts: await executeQuery('SELECT COUNT(*) as count FROM contracts'),
      invoices: await executeQuery('SELECT COUNT(*) as count FROM invoices'),
      documents: await executeQuery('SELECT COUNT(*) as count FROM documents'),
    };
    
    return Object.fromEntries(
      Object.entries(stats).map(([key, value]: [string, any]) => [
        key,
        Array.isArray(value) && value.length > 0 ? value[0].count : 0
      ])
    );
  } catch (error) {
    console.error('خطأ في الحصول على إحصائيات قاعدة البيانات:', error);
    throw error;
  }
}

// دالة لإنشاء جداول قاعدة البيانات (للاستخدام في التطوير)
export async function createTables() {
  const createTableQueries: string[] = [
    // يمكن إضافة استعلامات إنشاء الجداول هنا إذا لزم الأمر
  ];
  
  try {
    for (const query of createTableQueries) {
      await executeQuery(query);
    }
    console.log('✅ تم إنشاء الجداول بنجاح');
  } catch (error) {
    console.error('❌ خطأ في إنشاء الجداول:', error);
    throw error;
  }
}

// تصدير pool للاستخدام المباشر إذا لزم الأمر
export { pool };

// دالة لإغلاق جميع الاتصالات (للاستخدام عند إيقاف التطبيق)
export async function closeAllConnections() {
  try {
    await pool.end();
    console.log('✅ تم إغلاق جميع اتصالات قاعدة البيانات');
  } catch (error) {
    console.error('❌ خطأ في إغلاق اتصالات قاعدة البيانات:', error);
  }
}

// معالج الأخطاء العام
process.on('SIGINT', async () => {
  console.log('🔄 إيقاف التطبيق...');
  await closeAllConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 إيقاف التطبيق...');
  await closeAllConnections();
  process.exit(0);
});
