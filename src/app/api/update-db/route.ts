import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting complete database setup...');

    // إنشاء قاعدة البيانات إذا لم تكن موجودة
    try {
      await executeQuery(`
        CREATE DATABASE IF NOT EXISTS legal_office_system
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci
      `);
      console.log('✅ Database created or exists');
    } catch (error) {
      console.log('Database might already exist');
    }

    // استخدام قاعدة البيانات
    try {
      await executeQuery(`USE legal_office_system`);
      console.log('✅ Using legal_office_system database');
    } catch (error) {
      console.log('Error switching to database:', error);
    }

    // التحقق من وجود الجداول
    console.log('✅ Checking existing tables...');

    // إنشاء جدول المحامين الموحد
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS lawyers (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(191) UNIQUE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        licenseNo VARCHAR(100) UNIQUE NOT NULL,
        specialties VARCHAR(255) NOT NULL,
        country VARCHAR(100) NOT NULL,
        workArea VARCHAR(255) NOT NULL,
        experience INT DEFAULT NULL,
        bio TEXT DEFAULT NULL,
        avatar VARCHAR(500) DEFAULT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Created lawyers table');

    // إضافة الفهارس بشكل منفصل
    const lawyerIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_lawyers_email ON lawyers(email)',
      'CREATE INDEX IF NOT EXISTS idx_lawyers_country ON lawyers(country)',
      'CREATE INDEX IF NOT EXISTS idx_lawyers_workArea ON lawyers(workArea)',
      'CREATE INDEX IF NOT EXISTS idx_lawyers_specialties ON lawyers(specialties)',
      'CREATE INDEX IF NOT EXISTS idx_lawyers_licenseNo ON lawyers(licenseNo)',
      'CREATE INDEX IF NOT EXISTS idx_lawyers_phone ON lawyers(phone)'
    ];

    for (const indexQuery of lawyerIndexes) {
      try {
        await executeQuery(indexQuery);
      } catch (error) {
        console.log('Index might already exist:', error);
      }
    }
    console.log('✅ Created/verified lawyer indexes');

    // إنشاء جدول القضايا
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS cases (
        id VARCHAR(191) PRIMARY KEY,
        caseNumber VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT DEFAULT NULL,
        caseType ENUM('CIVIL', 'CRIMINAL', 'COMMERCIAL', 'FAMILY', 'ADMINISTRATIVE', 'LABOR', 'OTHER') NOT NULL,
        status ENUM('OPEN', 'CLOSED', 'SUSPENDED', 'APPEALED') DEFAULT 'OPEN',
        court VARCHAR(255) DEFAULT NULL,
        opponent VARCHAR(255) DEFAULT NULL,
        clientName VARCHAR(255) DEFAULT NULL,
        clientPhone VARCHAR(50) DEFAULT NULL,
        clientEmail VARCHAR(191) DEFAULT NULL,
        startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endDate TIMESTAMP NULL,
        lawyerId VARCHAR(191) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Created cases table');

    // إضافة المفاتيح الخارجية والفهارس للقضايا
    const caseConstraints = [
      'CREATE INDEX IF NOT EXISTS idx_cases_caseNumber ON cases(caseNumber)',
      'CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status)',
      'CREATE INDEX IF NOT EXISTS idx_cases_caseType ON cases(caseType)',
      'CREATE INDEX IF NOT EXISTS idx_cases_lawyer ON cases(lawyerId)',
      'CREATE INDEX IF NOT EXISTS idx_cases_clientName ON cases(clientName)'
    ];

    for (const constraintQuery of caseConstraints) {
      try {
        await executeQuery(constraintQuery);
      } catch (error) {
        console.log('Constraint might already exist:', error);
      }
    }

    // إضافة المفتاح الخارجي
    try {
      await executeQuery(`ALTER TABLE cases ADD CONSTRAINT fk_cases_lawyer FOREIGN KEY (lawyerId) REFERENCES lawyers(id) ON DELETE RESTRICT`);
    } catch (error) {
      console.log('Foreign key might already exist');
    }

    console.log('✅ Created/verified case constraints');

    // إضافة بيانات تجريبية
    try {
      await executeQuery(`
        INSERT IGNORE INTO lawyers (id, name, email, phone, password, licenseNo, specialties, country, workArea, experience, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'lawyer_1',
        'المحامي أحمد محمد',
        'admin@legaloffice.com',
        '+966501234567',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
        'LAW123456',
        'CIVIL',
        'SA',
        'الرياض',
        10,
        'محامي متخصص في القانون المدني مع خبرة 10 سنوات'
      ]);
      console.log('✅ Added sample data');
    } catch (error) {
      console.log('Sample data might already exist');
    }

    return NextResponse.json(
      {
        message: 'تم إنشاء قاعدة البيانات والجداول بنجاح! يمكنك الآن تجربة التسجيل.',
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ في إنشاء قاعدة البيانات',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
