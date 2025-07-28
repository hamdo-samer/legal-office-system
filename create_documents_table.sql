-- إنشاء جدول المستندات
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    category ENUM('contract', 'court_document', 'evidence', 'correspondence', 'invoice', 'general') DEFAULT 'general',
    description TEXT,
    client_id INT,
    case_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL
);

-- إدراج بيانات تجريبية للمستندات
INSERT INTO documents (name, original_name, file_path, file_size, file_type, category, description, client_id, case_id) VALUES
('contract_001_1640995200.pdf', 'عقد توكيل - أحمد محمد.pdf', '/uploads/contract_001_1640995200.pdf', 245760, 'application/pdf', 'contract', 'عقد توكيل للعميل أحمد محمد علي', 1, 1),
('evidence_002_1640995260.jpg', 'صورة المستند الأصلي.jpg', '/uploads/evidence_002_1640995260.jpg', 1024000, 'image/jpeg', 'evidence', 'صورة من المستند الأصلي للقضية', 1, 1),
('court_doc_003_1640995320.pdf', 'صحيفة الدعوى.pdf', '/uploads/court_doc_003_1640995320.pdf', 512000, 'application/pdf', 'court_document', 'صحيفة الدعوى المقدمة للمحكمة', 2, 2),
('correspondence_004_1640995380.docx', 'خطاب للمحكمة.docx', '/uploads/correspondence_004_1640995380.docx', 128000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'correspondence', 'خطاب رسمي موجه للمحكمة', 2, 2),
('invoice_005_1640995440.pdf', 'فاتورة أتعاب المحاماة.pdf', '/uploads/invoice_005_1640995440.pdf', 89600, 'application/pdf', 'invoice', 'فاتورة أتعاب المحاماة للعميل', 3, 3),
('general_006_1640995500.txt', 'ملاحظات القضية.txt', '/uploads/general_006_1640995500.txt', 4096, 'text/plain', 'general', 'ملاحظات عامة حول سير القضية', 3, 3);
