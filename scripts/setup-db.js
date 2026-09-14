import fs from 'fs';
import path from 'path';
import pg from 'pg';
const { Client } = pg;

const connectionString = process.argv[2] || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('\n❌ Ошибка: Не указана строка подключения к базе данных!');
  console.log('\nИспользование:');
  console.log('  node scripts/setup-db.js "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"\n');
  process.exit(1);
}

async function run() {
  console.log('🔌 Подключение к базе данных Supabase...');
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Успешно подключено к PostgreSQL!');

    const schemaPath = path.resolve('supabase-schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📜 Выполнение схемы supabase-schema.sql...');
    await client.query(sql);
    console.log('✅ Все таблицы и RLS политики успешно созданы!');

    // Seed test dishes
    console.log('🥗 Наполнение справочника блюд...');
    await client.query(`
      INSERT INTO dishes (name, category, weight_g, calories, price) VALUES
      ('Борщ белорусский с пампушками', 'Первые', '250/30', 320, 1.40),
      ('Суп гороховый с копченостями', 'Первые', '250', 290, 1.20),
      ('Котлета «Домашняя» мясная', 'Вторые', '100', 450, 2.80),
      ('Филе птицы запеченное с сыром', 'Вторые', '120', 380, 3.50),
      ('Пюре картофельное со сливочным маслом', 'Гарниры', '150', 180, 0.90),
      ('Каша гречневая рассыпчатая', 'Гарниры', '150', 160, 0.70),
      ('Салат «Витаминный» из капусты', 'Холодные', '100', 95, 0.90),
      ('Салат «Оливье» с ветчиной', 'Холодные', '120', 210, 1.60),
      ('Компот из сухофруктов', 'Напитки', '200', 110, 0.60),
      ('Чай черный с лимоном', 'Напитки', '200', 40, 0.40)
      ON CONFLICT DO NOTHING;
    `);

    // Seed news
    console.log('📢 Добавление корпоративных новостей...');
    await client.query(`
      INSERT INTO news_vacancies (type, title, body) VALUES
      ('news', 'Изменение графика работы столовой в праздничные дни', 'Уважаемые сотрудники! 15 сентября столовая предприятия работает с 11:00 до 15:00.'),
      ('news', 'Открытие нового спортивного сезона в ФОК', 'Сотрудникам ОАО «Беллакт» предоставляются льготные абонементы на посещение бассейна и тренажерного зала.'),
      ('vacancy', 'Инженер-технолог молочного производства', 'Требования: высшее профильное образование, знание технологических регламентов. Полный соцпакет.'),
      ('vacancy', 'Экономист в отдел материально-технического снабжения', 'Требования: опыт работы от 2 лет, знание 1С:Предприятие.')
      ON CONFLICT DO NOTHING;
    `);

    console.log('\n🎉 БАЗА ДАННЫХ ПОЛНОСТЬЮ НАСТРОЕНА И ГОТОВА К РАБОТЕ!\n');
  } catch (err) {
    console.error('❌ Ошибка при выполнении SQL:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
