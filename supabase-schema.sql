-- Run this in your Supabase SQL Editor

-- 1. Create tables
CREATE TABLE employees (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  tab_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  position text,
  department text,
  email text UNIQUE,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE health_journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  date date NOT NULL,
  self_status text NOT NULL,
  family_status text NOT NULL,
  confirmed_at timestamptz,
  UNIQUE(employee_id, date)
);

CREATE TABLE dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  weight_g text,
  composition text,
  calories integer,
  price numeric(10,2) NOT NULL,
  photo_url text,
  is_active boolean DEFAULT true
);

CREATE TABLE daily_menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  dish_id uuid REFERENCES dishes(id) NOT NULL,
  is_available boolean DEFAULT true,
  UNIQUE(date, dish_id)
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  order_date date NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'created',
  qr_code text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  dish_id uuid REFERENCES dishes(id) NOT NULL,
  quantity integer NOT NULL,
  price numeric(10,2) NOT NULL
);

CREATE TABLE payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  period date NOT NULL,
  accruals jsonb NOT NULL,
  deductions jsonb NOT NULL,
  total_accrued numeric(12,2),
  total_deducted numeric(12,2),
  to_pay numeric(12,2),
  UNIQUE(employee_id, period)
);

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  date date NOT NULL,
  type text NOT NULL,
  description text,
  amount numeric(10,2) NOT NULL
);

CREATE TABLE certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'processing',
  receive_method text,
  file_url text,
  requested_at timestamptz DEFAULT now(),
  ready_at timestamptz
);

CREATE TABLE news_vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  body text,
  published_at timestamptz DEFAULT now(),
  is_published boolean DEFAULT true
);

-- 2. Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_vacancies ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Publicly readable data (read-only for authenticated users)
CREATE POLICY "Public profiles are viewable by everyone" ON employees FOR SELECT USING (true);
CREATE POLICY "Dishes are viewable by everyone" ON dishes FOR SELECT USING (true);
CREATE POLICY "Daily menu is viewable by everyone" ON daily_menu FOR SELECT USING (true);
CREATE POLICY "News are viewable by everyone" ON news_vacancies FOR SELECT USING (true);

-- Employee private data (only viewable/editable by the employee)
CREATE POLICY "Employees can manage own health journal" ON health_journals FOR ALL USING (auth.uid() = employee_id);
CREATE POLICY "Employees can manage own orders" ON orders FOR ALL USING (auth.uid() = employee_id);
CREATE POLICY "Employees can view own order items" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.employee_id = auth.uid()));
CREATE POLICY "Employees can insert own order items" ON order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.employee_id = auth.uid()));
CREATE POLICY "Employees can view own payslips" ON payslips FOR SELECT USING (auth.uid() = employee_id);
CREATE POLICY "Employees can view own services" ON services FOR SELECT USING (auth.uid() = employee_id);
CREATE POLICY "Employees can manage own certificates" ON certificates FOR ALL USING (auth.uid() = employee_id);
