-- ============================================================================
-- БАЗА ДАННЫХ КОРПОРАТИВНОГО ПОРТАЛА ОАО «БЕЛЛАКТ» (PostgreSQL / Supabase)
-- КОМПЛЕКСНОЕ УСИЛЕНИЕ БЕЗОПАСНОСТИ, RLS, СЕРВЕРНЫЕ ТРИГГЕРЫ И АУДИТ
-- ============================================================================

-- 1. Создание основных таблиц
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tab_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  position text,
  department text,
  email text UNIQUE,
  avatar_url text,
  is_active boolean DEFAULT true,
  role text DEFAULT 'employee' CHECK (role IN ('employee', 'medic', 'canteen_operator', 'hr_admin', 'security_admin')),
  created_at timestamptz DEFAULT now(),
  last_login_at timestamptz
);

CREATE TABLE IF NOT EXISTS health_journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  self_status text NOT NULL,
  family_status text NOT NULL,
  temperature numeric(4,1) DEFAULT 36.6,
  confirmed_at timestamptz DEFAULT now(),
  kiosk_id text,
  UNIQUE(employee_id, date)
);

CREATE TABLE IF NOT EXISTS dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  weight_g text,
  composition text,
  calories integer,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  photo_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  dish_id uuid REFERENCES dishes(id) ON DELETE CASCADE NOT NULL,
  is_available boolean DEFAULT true,
  UNIQUE(date, dish_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  order_date date NOT NULL,
  total_amount numeric(10,2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
  status text DEFAULT 'created' CHECK (status IN ('created', 'confirmed', 'ready', 'completed', 'cancelled')),
  qr_code text,
  kiosk_id text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  dish_id uuid REFERENCES dishes(id) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0 AND quantity <= 50),
  price numeric(10,2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  period date NOT NULL,
  accruals jsonb NOT NULL,
  deductions jsonb NOT NULL,
  total_accrued numeric(12,2) NOT NULL DEFAULT 0.00,
  total_deducted numeric(12,2) NOT NULL DEFAULT 0.00,
  to_pay numeric(12,2) NOT NULL DEFAULT 0.00,
  is_verified boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, period)
);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  type text NOT NULL,
  description text,
  amount numeric(10,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'in_progress', 'ready', 'rejected')),
  receive_method text,
  file_url text,
  requested_at timestamptz DEFAULT now(),
  ready_at timestamptz
);

CREATE TABLE IF NOT EXISTS news_vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('news', 'vacancy', 'alert', 'announcement')),
  title text NOT NULL,
  body text,
  published_at timestamptz DEFAULT now(),
  is_published boolean DEFAULT true
);

-- Таблица журнала аудита безопасности ИБ (Immutable Security Audit Log)
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  ip_address text,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 2. Включение Row Level Security (RLS)
-- ============================================================================
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
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Сброс устаревших политик для чистоты
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON employees;
DROP POLICY IF EXISTS "Employees can view authenticated profiles" ON employees;
DROP POLICY IF EXISTS "Employees can update own profile" ON employees;
DROP POLICY IF EXISTS "Dishes are viewable by everyone" ON dishes;
DROP POLICY IF EXISTS "Daily menu is viewable by everyone" ON daily_menu;
DROP POLICY IF EXISTS "News are viewable by everyone" ON news_vacancies;
DROP POLICY IF EXISTS "Employees can manage own health journal" ON health_journals;
DROP POLICY IF EXISTS "Employees can manage own orders" ON orders;
DROP POLICY IF EXISTS "Employees can view own order items" ON order_items;
DROP POLICY IF EXISTS "Employees can insert own order items" ON order_items;
DROP POLICY IF EXISTS "Employees can view own payslips" ON payslips;
DROP POLICY IF EXISTS "Employees can view own services" ON services;
DROP POLICY IF EXISTS "Employees can manage own certificates" ON certificates;

-- ============================================================================
-- 3. Строгие RLS Политики
-- ============================================================================

-- EMPLOYEES:
-- Анонимный доступ запрещён! Просматривать профили могут ТОЛЬКО аутентифицированные сотрудники.
CREATE POLICY "Employees can view authenticated profiles" ON employees
  FOR SELECT
  TO authenticated
  USING (true);

-- Редактировать профиль может только сам сотрудник (свои контактные данные)
CREATE POLICY "Employees can update own profile" ON employees
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DISHES & MENU:
-- Публичное меню доступно для чтения аутентифицированным пользователям и терминалам
CREATE POLICY "Dishes are viewable by authenticated users" ON dishes
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Daily menu is viewable by authenticated users" ON daily_menu
  FOR SELECT
  TO authenticated
  USING (is_available = true);

-- NEWS:
CREATE POLICY "News are viewable by authenticated users" ON news_vacancies
  FOR SELECT
  TO authenticated
  USING (is_published = true);

-- HEALTH JOURNALS (Специальные персданные / Санпропускник):
-- Чтение только своих записей
CREATE POLICY "Employees can view own health journal" ON health_journals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = employee_id);

-- Вставка только на ТЕКУЩУЮ дату (запрет внесения задним или будущим числом)
CREATE POLICY "Employees can insert current date health journal" ON health_journals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = employee_id AND
    date = CURRENT_DATE
  );

-- Изменение и удаление записей журнала здоровья сотрудникам ЗАПРЕЩЕНО (неизменяемый сан-журнал)

-- ORDERS (Заказы столовой):
-- Чтение только своих заказов
CREATE POLICY "Employees can view own orders" ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = employee_id);

-- Создание заказа: только от своего имени со статусом 'created' на дату не ранее сегодняшней
CREATE POLICY "Employees can insert own orders" ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = employee_id AND
    (status IS NULL OR status = 'created') AND
    order_date >= CURRENT_DATE
  );

-- Обновление заказа: сотрудник может только ОТМЕНИТЬ заказ со статуса 'created' до 'cancelled'
CREATE POLICY "Employees can cancel pending orders" ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = employee_id AND status = 'created')
  WITH CHECK (auth.uid() = employee_id AND status = 'cancelled');

-- Удаление заказов КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО (защита от мошенничества и удаления чеков)
-- DELETE-политика отсутствует -> клиентский DELETE всегда заблокирован RLS

-- ORDER_ITEMS:
-- Чтение только своих позиций
CREATE POLICY "Employees can view own order items" ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.employee_id = auth.uid()
    )
  );

-- Вставка позиций только в свой заказ в статусе 'created'
CREATE POLICY "Employees can insert own order items" ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.employee_id = auth.uid()
        AND orders.status = 'created'
    )
  );

-- PAYSLIPS (Расчетные листки - коммерческая и персональная тайна):
-- Строго чтение только владельцем
CREATE POLICY "Employees can view only own payslips" ON payslips
  FOR SELECT
  TO authenticated
  USING (auth.uid() = employee_id);

-- SERVICES:
CREATE POLICY "Employees can view own services" ON services
  FOR SELECT
  TO authenticated
  USING (auth.uid() = employee_id);

-- CERTIFICATES (Справки):
CREATE POLICY "Employees can view own certificates" ON certificates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = employee_id);

CREATE POLICY "Employees can request certificates" ON certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = employee_id AND
    (status IS NULL OR status = 'processing')
  );

-- AUDIT_LOGS:
-- Клиент не имеет прямого доступа к чтению/записи журнала аудита (запись только через серверные триггеры)
CREATE POLICY "Audit logs service only" ON audit_logs
  FOR ALL
  TO service_role
  USING (true);

-- ============================================================================
-- 4. Серверные триггеры защиты данных и финансовой целостности
-- ============================================================================

-- ТРИГГЕР 1: Автоматическая проверка и подстановка официальной цены блюда (Анти-фрод)
CREATE OR REPLACE FUNCTION fn_enforce_order_item_price()
RETURNS TRIGGER AS $$
DECLARE
  v_official_price numeric(10,2);
  v_is_active boolean;
BEGIN
  -- Получаем актуальную цену и статус блюда из справочника
  SELECT price, is_active INTO v_official_price, v_is_active
  FROM dishes
  WHERE id = NEW.dish_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Блюдо с ID % не найдено в справочнике столовой', NEW.dish_id;
  END IF;

  IF NOT v_is_active THEN
    RAISE EXCEPTION 'Блюдо временно недоступно для заказа';
  END IF;

  -- Принудительно перезаписываем цену официальной, игнорируя значение от клиента
  NEW.price := v_official_price;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_order_item_price ON order_items;
CREATE TRIGGER trg_enforce_order_item_price
  BEFORE INSERT OR UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION fn_enforce_order_item_price();


-- ТРИГГЕР 2: Автоматический серверный пересчёт итоговой суммы заказа
CREATE OR REPLACE FUNCTION fn_recalculate_order_total()
RETURNS TRIGGER AS $$
DECLARE
  v_target_order_id uuid;
  v_new_total numeric(10,2);
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_target_order_id := OLD.order_id;
  ELSE
    v_target_order_id := NEW.order_id;
  END IF;

  SELECT COALESCE(SUM(quantity * price), 0.00)
  INTO v_new_total
  FROM order_items
  WHERE order_id = v_target_order_id;

  UPDATE orders
  SET total_amount = v_new_total
  WHERE id = v_target_order_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_recalculate_order_total ON order_items;
CREATE TRIGGER trg_recalculate_order_total
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION fn_recalculate_order_total();


-- ТРИГГЕР 3: Логирование критических событий безопасности в audit_logs
CREATE OR REPLACE FUNCTION fn_audit_security_events()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'orders' AND TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, event_type, details)
    VALUES (NEW.employee_id, 'ORDER_CREATED', jsonb_build_object('order_id', NEW.id, 'order_date', NEW.order_date, 'kiosk_id', NEW.kiosk_id));
  ELSIF TG_TABLE_NAME = 'orders' AND TG_OP = 'UPDATE' AND NEW.status = 'cancelled' THEN
    INSERT INTO audit_logs (user_id, event_type, details)
    VALUES (NEW.employee_id, 'ORDER_CANCELLED', jsonb_build_object('order_id', NEW.id));
  ELSIF TG_TABLE_NAME = 'health_journals' AND TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, event_type, details)
    VALUES (NEW.employee_id, 'HEALTH_JOURNAL_SUBMITTED', jsonb_build_object('date', NEW.date, 'self_status', NEW.self_status));
  ELSIF TG_TABLE_NAME = 'certificates' AND TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, event_type, details)
    VALUES (NEW.employee_id, 'CERTIFICATE_REQUESTED', jsonb_build_object('type', NEW.type));
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_orders ON orders;
CREATE TRIGGER trg_audit_orders
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION fn_audit_security_events();

DROP TRIGGER IF EXISTS trg_audit_health ON health_journals;
CREATE TRIGGER trg_audit_health
  AFTER INSERT ON health_journals
  FOR EACH ROW
  EXECUTE FUNCTION fn_audit_security_events();

DROP TRIGGER IF EXISTS trg_audit_certificates ON certificates;
CREATE TRIGGER trg_audit_certificates
  AFTER INSERT ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION fn_audit_security_events();

-- ============================================================================
-- 5. Хранимая процедура безопасного оформления заказа (Atomic RPC)
-- ============================================================================
CREATE OR REPLACE FUNCTION place_canteen_order(
  p_order_date date,
  p_items jsonb, -- [{"dish_id": "...", "quantity": 1}]
  p_kiosk_id text DEFAULT 'web'
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_item jsonb;
  v_dish_id uuid;
  v_qty integer;
  v_price numeric(10,2);
  v_is_active boolean;
  v_total numeric(10,2) := 0.00;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Требуется аутентификация для оформления заказа';
  END IF;

  IF p_order_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Заказ на прошедшие даты запрещён регламентом столовой';
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Талон заказа пуст';
  END IF;

  -- Создаем запись заказа
  INSERT INTO orders (employee_id, order_date, total_amount, status, kiosk_id)
  VALUES (v_user_id, p_order_date, 0.00, 'created', p_kiosk_id)
  RETURNING id INTO v_order_id;

  -- Добавляем позиции с серверной проверкой цен
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_dish_id := (v_item->>'dish_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;

    IF v_qty <= 0 OR v_qty > 50 THEN
      RAISE EXCEPTION 'Некорректное количество порций: %', v_qty;
    END IF;

    SELECT price, is_active INTO v_price, v_is_active
    FROM dishes WHERE id = v_dish_id;

    IF NOT FOUND OR NOT v_is_active THEN
      RAISE EXCEPTION 'Блюдо % недоступно для заказа', v_dish_id;
    END IF;

    INSERT INTO order_items (order_id, dish_id, quantity, price)
    VALUES (v_order_id, v_dish_id, v_qty, v_price);

    v_total := v_total + (v_price * v_qty);
  END LOOP;

  -- Обновляем QR-код талона
  UPDATE orders
  SET qr_code = 'BELLAKT-ORDER-' || v_order_id::text
  WHERE id = v_order_id;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'total_amount', v_total
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
