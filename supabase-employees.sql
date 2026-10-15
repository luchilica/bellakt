-- ============================================================================
-- ОАО «БЕЛЛАКТ» — КОРПОРАТИВНАЯ БАЗА СОТРУДНИКОВ ДЛЯ SUPABASE (POSTGRESQL)
-- ПОЛНАЯ МИГРАЦИЯ: ГАРАНТИЯ СТРУКТУРЫ ВСЕХ ТАБЛИЦ, СНЯТИЕ ОГРАНИЧЕНИЙ И ДАННЫЕ
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ТАБЛИЦА EMPLOYEES: добавление всех недостающих колонок и снятие блокировок
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tab_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  position text,
  department text,
  email text UNIQUE,
  phone text,
  role text DEFAULT 'employee',
  avatar_url text,
  is_active boolean DEFAULT true,
  pass_id text,
  shift text,
  created_at timestamptz DEFAULT now(),
  last_login_at timestamptz
);

ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS role text DEFAULT 'employee';
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS pass_id text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS shift text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

-- Снимаем внешний ключ на auth.users, если он блокирует вставку сотрудников
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'employees_id_fkey' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.employees DROP CONSTRAINT employees_id_fkey;
  END IF;
END $$;

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Employees public read access" ON public.employees;
CREATE POLICY "Employees public read access" ON public.employees FOR SELECT USING (true);
DROP POLICY IF EXISTS "Employees full access" ON public.employees;
CREATE POLICY "Employees full access" ON public.employees FOR ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 2. ТАБЛИЦА HEALTH_JOURNALS (Санпропускник): добавление колонок temperature, kiosk_id
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.health_journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  self_status text NOT NULL,
  family_status text NOT NULL,
  temperature numeric(4,1) DEFAULT 36.6,
  confirmed_at timestamptz DEFAULT now(),
  kiosk_id text DEFAULT 'kiosk-main-1',
  created_at timestamptz DEFAULT now()
);

-- Добавляем колонки в существующую таблицу health_journals
ALTER TABLE public.health_journals ADD COLUMN IF NOT EXISTS temperature numeric(4,1) DEFAULT 36.6;
ALTER TABLE public.health_journals ADD COLUMN IF NOT EXISTS kiosk_id text DEFAULT 'kiosk-main-1';
ALTER TABLE public.health_journals ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'health_journals_employee_id_date_key'
  ) THEN
    ALTER TABLE public.health_journals ADD CONSTRAINT health_journals_employee_id_date_key UNIQUE (employee_id, date);
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;

ALTER TABLE public.health_journals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Health journals public access" ON public.health_journals;
CREATE POLICY "Health journals public access" ON public.health_journals FOR ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 3. ТАБЛИЦА PAYSLIPS (Расчетные листки): добавление колонок и уникального ключа
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  period date NOT NULL,
  accruals jsonb NOT NULL DEFAULT '[]'::jsonb,
  deductions jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_accrued numeric(10,2) NOT NULL DEFAULT 0.00,
  total_deducted numeric(10,2) NOT NULL DEFAULT 0.00,
  to_pay numeric(10,2) NOT NULL DEFAULT 0.00,
  is_verified boolean DEFAULT true,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.payslips ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT true;
ALTER TABLE public.payslips ADD COLUMN IF NOT EXISTS verified_at timestamptz;
ALTER TABLE public.payslips ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payslips_employee_id_period_key'
  ) THEN
    ALTER TABLE public.payslips ADD CONSTRAINT payslips_employee_id_period_key UNIQUE (employee_id, period);
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;

ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Payslips public access" ON public.payslips;
CREATE POLICY "Payslips public access" ON public.payslips FOR ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 4. ТАБЛИЦА SERVICES (Корпоративные сервисы): добавление колонок
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  type text NOT NULL,
  description text,
  amount numeric(10,2) NOT NULL DEFAULT 0.00,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Services public access" ON public.services;
CREATE POLICY "Services public access" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 5. ТАБЛИЦА CERTIFICATES (Справки): добавление колонок
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  purpose text,
  status text DEFAULT 'pending',
  requested_at timestamptz DEFAULT now(),
  ready_at timestamptz,
  comment text
);

ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS purpose text;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS comment text;

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Certificates public access" ON public.certificates;
CREATE POLICY "Certificates public access" ON public.certificates FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- ДАННЫЕ: СОТРУДНИКИ ОАО «БЕЛЛАКТ», НАЧИСЛЕНИЯ, САНПРОПУСКНИК, СЕРВИСЫ
-- ============================================================================

-- Вставка и обновление сотрудников
INSERT INTO public.employees (id, tab_number, full_name, position, department, email, phone, role, avatar_url, pass_id, shift, is_active)
VALUES
  (
    '18dc9d8e-2ce5-41b0-bc42-30bc1b166d1b',
    '20481',
    'Иванов Иван Иванович',
    'Инженер-технолог молочного производства',
    'Цех детского питания №1',
    'ivanov@bellakt.by',
    '+375 (29) 782-45-12',
    'employee',
    '/ivan_ivanov.jpg',
    'BLT-PASS-2026-20481-9812',
    'Смена А (07:00 – 15:30)',
    true
  ),
  (
    '06815411-5977-4df4-8f7b-7a6df2cba830',
    '20592',
    'Ковалева Елена Сергеевна',
    'Мастер смены цеха сухих молочных продуктов',
    'Цех сухих смесей №2',
    'kovaleva@bellakt.by',
    '+375 (29) 651-33-89',
    'employee',
    NULL,
    'BLT-PASS-2026-20592-3341',
    'Смена Б (15:30 – 24:00)',
    true
  ),
  (
    'fcf0457b-73a1-492e-83ae-330f4c147a72',
    '19844',
    'Смирнов Дмитрий Алексеевич',
    'Наладчик автоматических линий и оборудования',
    'Цех фасовки и упаковки готовой продукции',
    'smirnov@bellakt.by',
    '+375 (29) 540-12-78',
    'employee',
    NULL,
    'BLT-PASS-2026-19844-7719',
    'Смена А (07:00 – 15:30)',
    true
  ),
  (
    'e3d2c1b0-4567-4890-a123-211050000001',
    '21105',
    'Волкова Анна Михайловна',
    'Врач-терапевт здравпункта',
    'Медицинская служба / Санпропускник',
    'volkova@bellakt.by',
    '+375 (29) 819-64-30',
    'medic',
    NULL,
    'BLT-PASS-2026-21105-1044',
    'Дневная смена (08:00 – 16:30)',
    true
  ),
  (
    'd2c1b0a9-3456-4789-9012-187320000002',
    '18732',
    'Григорьев Сергей Николаевич',
    'Водитель службы логистики и доставки',
    'Транспортно-логистический цех',
    'grigoriev@bellakt.by',
    '+375 (29) 324-90-11',
    'employee',
    NULL,
    'BLT-PASS-2026-18732-5521',
    'Сменный график 2/2',
    true
  ),
  (
    'c1b0a9f8-2345-4678-8901-174090000003',
    '17409',
    'Павлова Татьяна Викторовна',
    'Старший специалист по персоналу',
    'Управление по работе с персоналом (HR)',
    'pavlova@bellakt.by',
    '+375 (29) 112-87-65',
    'hr_admin',
    NULL,
    'BLT-PASS-2026-17409-9022',
    'Офисный график (08:30 – 17:00)',
    true
  )
ON CONFLICT (tab_number) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  position = EXCLUDED.position,
  department = EXCLUDED.department,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  pass_id = EXCLUDED.pass_id,
  shift = EXCLUDED.shift,
  is_active = EXCLUDED.is_active;

-- Журнал здоровья
INSERT INTO public.health_journals (employee_id, date, self_status, family_status, temperature, confirmed_at, kiosk_id)
VALUES
  ('18dc9d8e-2ce5-41b0-bc42-30bc1b166d1b', CURRENT_DATE, 'healthy', 'healthy', 36.6, now(), 'kiosk-main-1'),
  ('06815411-5977-4df4-8f7b-7a6df2cba830', CURRENT_DATE, 'healthy', 'healthy', 36.5, now(), 'kiosk-dairy-2'),
  ('fcf0457b-73a1-492e-83ae-330f4c147a72', CURRENT_DATE, 'healthy', 'healthy', 36.7, now(), 'kiosk-pack-3'),
  ('e3d2c1b0-4567-4890-a123-211050000001', CURRENT_DATE, 'healthy', 'healthy', 36.6, now(), 'kiosk-med-1'),
  ('d2c1b0a9-3456-4789-9012-187320000002', CURRENT_DATE, 'healthy', 'healthy', 36.6, now(), 'kiosk-auto-1'),
  ('c1b0a9f8-2345-4678-8901-174090000003', CURRENT_DATE, 'healthy', 'healthy', 36.4, now(), 'kiosk-admin-1')
ON CONFLICT (employee_id, date) DO NOTHING;

-- Расчетные листки (Август 2026 и Сентябрь 2026)
INSERT INTO public.payslips (employee_id, period, accruals, deductions, total_accrued, total_deducted, to_pay, is_verified)
VALUES
  -- Август 2026
  (
    '18dc9d8e-2ce5-41b0-bc42-30bc1b166d1b',
    '2026-08-01',
    '[{"name":"Оклад по часам и ставке","amount":920.00},{"name":"Премия за качество (30%)","amount":276.00},{"name":"Выслуга лет (15%)","amount":138.00},{"name":"Ночные смены","amount":116.00},{"name":"Контрактная надбавка","amount":500.00},{"name":"Матпомощь к оздоровлению","amount":200.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":279.50},{"name":"Пенсионный взнос ФСЗН (1%)","amount":21.50},{"name":"Профсоюзный взнос (1%)","amount":21.50},{"name":"Оказанные услуги столовой","amount":115.40},{"name":"Аванс","amount":131.00}]'::jsonb,
    2150.00, 568.90, 1581.10, true
  ),
  (
    '06815411-5977-4df4-8f7b-7a6df2cba830',
    '2026-08-01',
    '[{"name":"Оклад мастера смены","amount":1150.00},{"name":"Премия за выполнение плана смены (35%)","amount":402.50},{"name":"Надбавка за руководство сменой","amount":280.00},{"name":"Доплата за вечерние и ночные часы","amount":147.50},{"name":"Контрактная надбавка","amount":400.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":309.40},{"name":"Пенсионный взнос ФСЗН (1%)","amount":23.80},{"name":"Профсоюзный взнос (1%)","amount":23.80},{"name":"Питание в столовой","amount":92.00},{"name":"Аванс","amount":200.00}]'::jsonb,
    2380.00, 649.00, 1731.00, true
  ),
  (
    'fcf0457b-73a1-492e-83ae-330f4c147a72',
    '2026-08-01',
    '[{"name":"Оклад наладчика 6-го разряда","amount":980.00},{"name":"Премия за коэффициент техготовности (25%)","amount":245.00},{"name":"Надбавка за работу со сложным ЧПУ","amount":195.00},{"name":"Контрактная надбавка","amount":500.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":249.60},{"name":"Пенсионный взнос ФСЗН (1%)","amount":19.20},{"name":"Профсоюзный взнос (1%)","amount":19.20},{"name":"Столовая","amount":85.00},{"name":"Аванс","amount":150.00}]'::jsonb,
    1920.00, 523.00, 1397.00, true
  ),
  (
    'e3d2c1b0-4567-4890-a123-211050000001',
    '2026-08-01',
    '[{"name":"Оклад врача здравпункта","amount":950.00},{"name":"Надбавка за медстаж и категорию","amount":300.00},{"name":"Премия за санитарно-профилактическую работу","amount":200.00},{"name":"Контрактная надбавка","amount":400.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":240.50},{"name":"Пенсионный взнос ФСЗН (1%)","amount":18.50},{"name":"Профсоюзный взнос (1%)","amount":18.50},{"name":"Аванс","amount":160.00}]'::jsonb,
    1850.00, 437.50, 1412.50, true
  ),
  (
    'd2c1b0a9-3456-4789-9012-187320000002',
    '2026-08-01',
    '[{"name":"Оклад водителя 1-го класса","amount":850.00},{"name":"Классность (25%)","amount":212.50},{"name":"Надбавка за разъездной характер работы","amount":267.50},{"name":"Премия за экономию ГСМ","amount":150.00},{"name":"Контрактная надбавка","amount":300.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":231.40},{"name":"Пенсионный взнос ФСЗН (1%)","amount":17.80},{"name":"Профсоюзный взнос (1%)","amount":17.80},{"name":"Аванс","amount":140.00}]'::jsonb,
    1780.00, 407.00, 1373.00, true
  ),
  (
    'c1b0a9f8-2345-4678-8901-174090000003',
    '2026-08-01',
    '[{"name":"Оклад специалиста по кадрам","amount":1020.00},{"name":"Премия за выполнение ключевых показателей","amount":330.00},{"name":"Надбавка за сложность и напряженность","amount":250.00},{"name":"Контрактная надбавка","amount":450.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":266.50},{"name":"Пенсионный взнос ФСЗН (1%)","amount":20.50},{"name":"Профсоюзный взнос (1%)","amount":20.50},{"name":"Аванс","amount":180.00}]'::jsonb,
    2050.00, 487.50, 1562.50, true
  ),
  -- Сентябрь 2026
  (
    '18dc9d8e-2ce5-41b0-bc42-30bc1b166d1b',
    '2026-09-01',
    '[{"name":"Оклад по часам и ставке","amount":920.00},{"name":"Премия за качество (32%)","amount":294.40},{"name":"Выслуга лет (15%)","amount":138.00},{"name":"Ночные смены","amount":127.60},{"name":"Контрактная надбавка","amount":500.00},{"name":"Премия ко Дню работников пищевой промышленности","amount":200.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":283.40},{"name":"Пенсионный взнос ФСЗН (1%)","amount":21.80},{"name":"Профсоюзный взнос (1%)","amount":21.80},{"name":"Оказанные услуги столовой","amount":112.60},{"name":"Аванс","amount":135.00}]'::jsonb,
    2180.00, 574.60, 1605.40, true
  ),
  (
    '06815411-5977-4df4-8f7b-7a6df2cba830',
    '2026-09-01',
    '[{"name":"Оклад мастера смены","amount":1150.00},{"name":"Премия за выполнение плана смены (35%)","amount":402.50},{"name":"Надбавка за руководство сменой","amount":280.00},{"name":"Доплата за вечерние и ночные часы","amount":147.50},{"name":"Контрактная надбавка","amount":400.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":309.40},{"name":"Пенсионный взнос ФСЗН (1%)","amount":23.80},{"name":"Профсоюзный взнос (1%)","amount":23.80},{"name":"Питание в столовой","amount":92.00},{"name":"Аванс","amount":200.00}]'::jsonb,
    2380.00, 649.00, 1731.00, true
  ),
  (
    'fcf0457b-73a1-492e-83ae-330f4c147a72',
    '2026-09-01',
    '[{"name":"Оклад наладчика 6-го разряда","amount":980.00},{"name":"Премия за коэффициент техготовности (25%)","amount":245.00},{"name":"Надбавка за работу со сложным ЧПУ","amount":195.00},{"name":"Контрактная надбавка","amount":500.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":249.60},{"name":"Пенсионный взнос ФСЗН (1%)","amount":19.20},{"name":"Профсоюзный взнос (1%)","amount":19.20},{"name":"Столовая","amount":85.00},{"name":"Аванс","amount":150.00}]'::jsonb,
    1920.00, 523.00, 1397.00, true
  ),
  (
    'e3d2c1b0-4567-4890-a123-211050000001',
    '2026-09-01',
    '[{"name":"Оклад врача здравпункта","amount":950.00},{"name":"Надбавка за медстаж и категорию","amount":300.00},{"name":"Премия за санитарно-профилактическую работу","amount":200.00},{"name":"Контрактная надбавка","amount":400.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":240.50},{"name":"Пенсионный взнос ФСЗН (1%)","amount":18.50},{"name":"Профсоюзный взнос (1%)","amount":18.50},{"name":"Аванс","amount":160.00}]'::jsonb,
    1850.00, 437.50, 1412.50, true
  ),
  (
    'd2c1b0a9-3456-4789-9012-187320000002',
    '2026-09-01',
    '[{"name":"Оклад водителя 1-го класса","amount":850.00},{"name":"Классность (25%)","amount":212.50},{"name":"Надбавка за разъездной характер работы","amount":267.50},{"name":"Премия за экономию ГСМ","amount":150.00},{"name":"Контрактная надбавка","amount":300.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":231.40},{"name":"Пенсионный взнос ФСЗН (1%)","amount":17.80},{"name":"Профсоюзный взнос (1%)","amount":17.80},{"name":"Аванс","amount":140.00}]'::jsonb,
    1780.00, 407.00, 1373.00, true
  ),
  (
    'c1b0a9f8-2345-4678-8901-174090000003',
    '2026-09-01',
    '[{"name":"Оклад специалиста по кадрам","amount":1020.00},{"name":"Премия за выполнение ключевых показателей","amount":330.00},{"name":"Надбавка за сложность и напряженность","amount":250.00},{"name":"Контрактная надбавка","amount":450.00}]'::jsonb,
    '[{"name":"Подоходный налог (13%)","amount":266.50},{"name":"Пенсионный взнос ФСЗН (1%)","amount":20.50},{"name":"Профсоюзный взнос (1%)","amount":20.50},{"name":"Аванс","amount":180.00}]'::jsonb,
    2050.00, 487.50, 1562.50, true
  )
ON CONFLICT (employee_id, period) DO UPDATE SET
  accruals = EXCLUDED.accruals,
  deductions = EXCLUDED.deductions,
  total_accrued = EXCLUDED.total_accrued,
  total_deducted = EXCLUDED.total_deducted,
  to_pay = EXCLUDED.to_pay;

-- Сервисы и льготы
INSERT INTO public.services (employee_id, date, type, description, amount)
VALUES
  ('18dc9d8e-2ce5-41b0-bc42-30bc1b166d1b', CURRENT_DATE, 'Льготное питание', 'Компенсация 50% стоимости горячих обедов в заводской столовой', 45.00),
  ('18dc9d8e-2ce5-41b0-bc42-30bc1b166d1b', CURRENT_DATE, 'ФОК и бассейн', 'Корпоративный абонемент в оздоровительный комплекс г. Волковыск', 35.00),
  ('06815411-5977-4df4-8f7b-7a6df2cba830', CURRENT_DATE, 'Оздоровление детей', 'Путевка в детский оздоровительный лагерь «Зорька» (дотация 70%)', 210.00),
  ('fcf0457b-73a1-492e-83ae-330f4c147a72', CURRENT_DATE, 'Спецодежда и СИЗ', 'Комплект брендированной формы с повышенной защитой', 120.00),
  ('e3d2c1b0-4567-4890-a123-211050000001', CURRENT_DATE, 'Медицинская страховка', 'Добровольное медицинское страхование «Белэксимгарант»', 85.00),
  ('d2c1b0a9-3456-4789-9012-187320000002', CURRENT_DATE, 'Корпоративная связь', 'Безлимитный служебный тариф А1 для междугородней логистики', 25.00),
  ('c1b0a9f8-2345-4678-8901-174090000003', CURRENT_DATE, 'Повышение квалификации', 'Курсы трудового права и документооборота Республики Беларусь', 140.00);
