export interface Employee {
  id: string;
  tab_number: string;
  full_name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  password: string;
  role: 'employee' | 'medic' | 'canteen_operator' | 'hr_admin' | 'security_admin';
  avatar_url?: string;
  pass_id: string;
  shift: string;
  hire_date: string;
  description?: string;
}

export const EMPLOYEES: Employee[] = [
  {
    id: '18dc9d8e-2ce5-41b0-bc42-30bc1b166d1b',
    tab_number: '20481',
    full_name: 'Иванов Иван Иванович',
    position: 'Инженер-технолог молочного производства',
    department: 'Цех детского питания №1',
    email: 'ivanov@bellakt.by',
    phone: '+375 (29) 782-45-12',
    password: '123456',
    role: 'employee',
    avatar_url: '/ivan_ivanov.jpg',
    pass_id: 'BLT-PASS-2026-20481-9812',
    shift: 'Смена А (07:00 – 15:30)',
    hire_date: '12.04.2019',
    description: 'Ведущий специалист по контролю термической обработки и гомогенизации детских смесей',
  },
  {
    id: '06815411-5977-4df4-8f7b-7a6df2cba830',
    tab_number: '20592',
    full_name: 'Ковалева Елена Сергеевна',
    position: 'Мастер смены цеха сухих молочных продуктов',
    department: 'Цех сухих смесей №2',
    email: 'kovaleva@bellakt.by',
    phone: '+375 (29) 651-33-89',
    password: '123456',
    role: 'employee',
    pass_id: 'BLT-PASS-2026-20592-3341',
    shift: 'Смена Б (15:30 – 24:00)',
    hire_date: '03.09.2020',
    description: 'Руководитель производственной смены сушильно-вакуумных установок',
  },
  {
    id: 'fcf0457b-73a1-492e-83ae-330f4c147a72',
    tab_number: '19844',
    full_name: 'Смирнов Дмитрий Алексеевич',
    position: 'Наладчик автоматических линий и оборудования',
    department: 'Цех фасовки и упаковки готовой продукции',
    email: 'smirnov@bellakt.by',
    phone: '+375 (29) 540-12-78',
    password: '123456',
    role: 'employee',
    pass_id: 'BLT-PASS-2026-19844-7719',
    shift: 'Смена А (07:00 – 15:30)',
    hire_date: '15.11.2017',
    description: 'Ответственный за бесперебойную работу фасовочных автоматов и укупорочных линий',
  },
  {
    id: 'e3d2c1b0-4567-4890-a123-211050000001',
    tab_number: '21105',
    full_name: 'Волкова Анна Михайловна',
    position: 'Врач-терапевт здравпункта',
    department: 'Медицинская служба / Санпропускник',
    email: 'volkova@bellakt.by',
    phone: '+375 (29) 819-64-30',
    password: '123456',
    role: 'medic',
    pass_id: 'BLT-PASS-2026-21105-1044',
    shift: 'Дневная смена (08:00 – 16:30)',
    hire_date: '01.02.2022',
    description: 'Ежедневный предсменный осмотр сотрудников, ведение электронного журнала здоровья',
  },
  {
    id: 'd2c1b0a9-3456-4789-9012-187320000002',
    tab_number: '18732',
    full_name: 'Григорьев Сергей Николаевич',
    position: 'Водитель службы логистики и доставки',
    department: 'Транспортно-логистический цех',
    email: 'grigoriev@bellakt.by',
    phone: '+375 (29) 324-90-11',
    password: '123456',
    role: 'employee',
    pass_id: 'BLT-PASS-2026-18732-5521',
    shift: 'Сменный график 2/2',
    hire_date: '10.06.2016',
    description: 'Доставка сырья и охлажденного молока с филиалов и фермерских хозяйств Гродненщины',
  },
  {
    id: 'c1b0a9f8-2345-4678-8901-174090000003',
    tab_number: '17409',
    full_name: 'Павлова Татьяна Викторовна',
    position: 'Старший специалист по персоналу',
    department: 'Управление по работе с персоналом (HR)',
    email: 'pavlova@bellakt.by',
    phone: '+375 (29) 112-87-65',
    password: '123456',
    role: 'hr_admin',
    pass_id: 'BLT-PASS-2026-17409-9022',
    shift: 'Офисный график (08:30 – 17:00)',
    hire_date: '20.08.2015',
    description: 'Оформление кадровых справок, трудовых договоров и графиков отпусков',
  },
];

export const DEFAULT_EMPLOYEE: Employee = EMPLOYEES[0];

export function findEmployeeByLoginOrTab(identifier: string): Employee | undefined {
  const clean = identifier.trim().toLowerCase();
  return EMPLOYEES.find(
    (e) =>
      e.tab_number.toLowerCase() === clean ||
      e.email.toLowerCase() === clean ||
      e.email.toLowerCase().startsWith(clean)
  );
}

export function getEmployeeById(id: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.id === id);
}

export function getEmployeeByTabNumber(tabNumber: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.tab_number === tabNumber.trim());
}
