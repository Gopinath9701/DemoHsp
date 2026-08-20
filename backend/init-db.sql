-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Role-based access)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'Lab Technician',
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    contact_person VARCHAR(100),
    contact_person_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Patient Visits (New table for tracking visits and billing)
CREATE TABLE IF NOT EXISTS patient_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    visit_date DATE DEFAULT CURRENT_DATE,
    visit_time TIME DEFAULT CURRENT_TIME,
    reason_for_visit VARCHAR(255),
    doctor_assigned VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Registered',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Billing Table (New)
CREATE TABLE IF NOT EXISTS billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_id UUID REFERENCES patient_visits(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    test_type VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    payment_method VARCHAR(50),
    bill_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Lab Records & Flow Tracking
CREATE TABLE IF NOT EXISTS lab_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES patient_visits(id) ON DELETE CASCADE,
    test_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Sample Collected',
    results_summary TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Notification Logs (Email / SMS / WhatsApp triggers)
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL,
    recipient VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Mock Data for Instant Presentation
INSERT INTO users (name, email, role, status) VALUES
('Dr. Ramesh Rao', 'ramesh@labdemo.com', 'Admin', 'Active'),
('Priya Sharma', 'priya@labdemo.com', 'Receptionist', 'Active'),
('Vikram Patel', 'vikram@labdemo.com', 'Doctor', 'Active')
ON CONFLICT DO NOTHING;

INSERT INTO patients (id, name, age, gender, email, phone, address, contact_person, contact_person_phone) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ananya Verma', 29, 'Female', 'ananya@example.com', '+919876543210', '123 Park Street, Mumbai', 'Rakesh Verma', '+919876543211'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Rahul Nair', 45, 'Male', 'rahul@example.com', '+919812345678', '456 MG Road, Bangalore', 'Neha Nair', '+919812345679')
ON CONFLICT DO NOTHING;

INSERT INTO patient_visits (patient_id, visit_date, reason_for_visit, doctor_assigned, status) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', CURRENT_DATE, 'Routine Checkup', 'Dr. Vikram Patel', 'Completed'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', CURRENT_DATE, 'Blood Test', 'Dr. Vikram Patel', 'Completed')
ON CONFLICT DO NOTHING;

INSERT INTO billing (visit_id, patient_id, test_type, amount, discount, final_amount, payment_status, payment_method, bill_date) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Complete Blood Count', 1500, 0, 1500, 'Paid', 'Cash', CURRENT_DATE),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Lipid Profile', 2000, 200, 1800, 'Paid', 'Card', CURRENT_DATE)
ON CONFLICT DO NOTHING;

INSERT INTO lab_records (patient_id, visit_id, test_type, status, results_summary) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Complete Blood Count (CBC)', 'Report Generated', 'Hemoglobin: 13.5 g/dL, Platelets: 250k - Normal'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Lipid Profile', 'In Processing', 'Awaiting centrifuge results')
ON CONFLICT DO NOTHING;
