import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  UtensilsCrossed,
  Receipt,
  X,
  CreditCard,
  QrCode,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

export interface Dish {
  id: string;
  name: string;
  category:
    | 'Холодные блюда'
    | 'Первые блюда'
    | 'Вторые блюда'
    | 'Гарниры'
    | 'Напитки'
    | 'Кондитерские и мучные изделия'
    | 'Хлебобулочные изделия';
  weight: string;
  ingredients: string;
  kbju: string; // e.g. "180 ккал • Б: 15г • Ж: 8г • У: 20г"
  price: number;
  image: string;
}

const CATEGORIES = [
  'Все',
  'Холодные блюда',
  'Первые блюда',
  'Вторые блюда',
  'Гарниры',
  'Напитки',
  'Кондитерские и мучные изделия',
  'Хлебобулочные изделия',
] as const;

const DISHES_DATABASE: Dish[] = [
  {
    id: 'd1',
    name: 'Борщ с говядиной и сметаной «Беллакт»',
    category: 'Первые блюда',
    weight: '300/20 г',
    ingredients: 'Говядина отборная, свекла, капуста свежая, картофель, сметана 20% «Беллакт», зелень укропа',
    kbju: '185 ккал • Б: 14г • Ж: 9г • У: 18г',
    price: 4.80,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd2',
    name: 'Суп куриный с домашней лапшой',
    category: 'Первые блюда',
    weight: '300 г',
    ingredients: 'Филе цыпленка-бройлера, яичная лапша, морковь, лук пассерованный, свежая зелень',
    kbju: '210 ккал • Б: 19г • Ж: 8г • У: 16г',
    price: 4.10,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd3',
    name: 'Солянка мясная сборная',
    category: 'Первые блюда',
    weight: '320/15 г',
    ingredients: 'Буженина, колбаски охотничьи, оливки, маслины, лимон, маринованные огурцы, сметана',
    kbju: '270 ккал • Б: 18г • Ж: 17г • У: 11г',
    price: 5.40,
    image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd4',
    name: 'Котлета мясная «По-волковысски»',
    category: 'Вторые блюда',
    weight: '130/50 г',
    ingredients: 'Фарш свино-говяжий, лучок репчатый, сухарики панировочные, грибной сливочный соус',
    kbju: '310 ккал • Б: 22г • Ж: 20г • У: 8г',
    price: 4.90,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd5',
    name: 'Драники картофельные со сметаной и шкварками',
    category: 'Вторые блюда',
    weight: '250/50 г',
    ingredients: 'Белорусский отборный картофель, мука, сметана 20% «Беллакт», грудинка жареная',
    kbju: '420 ккал • Б: 11г • Ж: 27г • У: 35г',
    price: 4.60,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef2396e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd6',
    name: 'Филе хека, запеченное с сыром «Беллакт»',
    category: 'Вторые блюда',
    weight: '160 г',
    ingredients: 'Филе хека, сыр твердый «Беллакт», томаты свежие, соус сливочный, пряные травы',
    kbju: '240 ккал • Б: 26г • Ж: 11г • У: 4г',
    price: 5.20,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd7',
    name: 'Салат витаминный из свежей капусты',
    category: 'Холодные блюда',
    weight: '150 г',
    ingredients: 'Капуста белокочанная, морковь соломкой, яблоки, клюква, масло растительное',
    kbju: '95 ккал • Б: 2г • Ж: 4г • У: 12г',
    price: 1.80,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd8',
    name: 'Салат «Столичный» с ветчиной',
    category: 'Холодные блюда',
    weight: '160 г',
    ingredients: 'Ветчина, картофель отварной, яйцо куриное, горошек зеленый, соленые огурцы, майонез',
    kbju: '220 ккал • Б: 9г • Ж: 16г • У: 13г',
    price: 2.70,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd9',
    name: 'Пюре картофельное на молоке «Беллакт»',
    category: 'Гарниры',
    weight: '180 г',
    ingredients: 'Картофель отборный, натуральное пастеризованное молоко «Беллакт», сливочное масло 82.5%',
    kbju: '170 ккал • Б: 3г • Ж: 7г • У: 24г',
    price: 1.60,
    image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd10',
    name: 'Каша гречневая рассыпчатая с маслом',
    category: 'Гарниры',
    weight: '180 г',
    ingredients: 'Крупа гречневая ядрица первого сорта, сливочное масло, соль пищевая',
    kbju: '190 ккал • Б: 6г • Ж: 5г • У: 32г',
    price: 1.40,
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd11',
    name: 'Сырники из свежего творога «Беллакт»',
    category: 'Кондитерские и мучные изделия',
    weight: '150/30 г',
    ingredients: 'Творог 9% «Беллакт», мука высшего сорта, ванилин, сметана «Беллакт», джем ягодный',
    kbju: '290 ккал • Б: 19г • Ж: 11г • У: 28г',
    price: 3.20,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd12',
    name: 'Булочка с маком и глазурью',
    category: 'Хлебобулочные изделия',
    weight: '80 г',
    ingredients: 'Мука пшеничная в/с, маковая начинка, сливочное масло, сахарный сироп',
    kbju: '240 ккал • Б: 5г • Ж: 7г • У: 41г',
    price: 1.10,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd13',
    name: 'Хлеб ржано-пшеничный «Волковысский»',
    category: 'Хлебобулочные изделия',
    weight: '50 г (2 кусочка)',
    ingredients: 'Мука ржаная сеяная, мука пшеничная, солод, закваска',
    kbju: '90 ккал • Б: 3г • Ж: 1г • У: 19г',
    price: 0.30,
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'd14',
    name: 'Компот из лесных ягод и клюквы',
    category: 'Напитки',
    weight: '250 мл',
    ingredients: 'Черника, брусника, клюква свежая, сахарный сироп, мята',
    kbju: '85 ккал • Б: 0г • Ж: 0г • У: 21г',
    price: 1.00,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80',
  },
];

export interface CanteenDayItem {
  label: string;
  date: string;
  isToday: boolean;
  isPast: boolean;
}

export function generateCanteenDays(): CanteenDayItem[] {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const weekDayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const ruMonths = [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ];

  const workdays: Date[] = [];
  const cur = new Date(now);
  cur.setHours(0, 0, 0, 0);

  // If today is a weekend, shift back to Friday
  if (cur.getDay() === 0) {
    cur.setDate(cur.getDate() - 2);
  } else if (cur.getDay() === 6) {
    cur.setDate(cur.getDate() - 1);
  }

  // Collect the 5 most recent workdays (Mon-Fri) without weekends or future dates
  while (workdays.length < 5) {
    const day = cur.getDay();
    if (day >= 1 && day <= 5) {
      workdays.unshift(new Date(cur));
    }
    cur.setDate(cur.getDate() - 1);
  }

  return workdays.map((d) => {
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;
    const isPast = dateStr < todayStr;
    const label = `${weekDayNames[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')} ${ruMonths[d.getMonth()]}`;
    return {
      label,
      date: dateStr,
      isToday,
      isPast,
    };
  });
}

export default function Canteen() {
  const { employeeData } = useAuthStore();
  const [daysList] = useState<CanteenDayItem[]>(() => generateCanteenDays());
  const [dayIndex, setDayIndex] = useState<number>(() => {
    const list = generateCanteenDays();
    const todayIdx = list.findIndex((d) => d.isToday);
    return todayIdx !== -1 ? todayIdx : list.length - 1;
  });
  const [activeCategory, setActiveCategory] = useState<string>('Все');
  const [cart, setCart] = useState<Record<string, number>>({
    d1: 1, // Pre-selected 1 borscht
    d4: 1, // 1 cutlet
    d9: 1, // 1 mashed potato
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedShiftTime, setSelectedShiftTime] = useState('12:30 - 13:00 (Обед смены №1)');
  const [lastOrderNumber, setLastOrderNumber] = useState('ОБЕД-8821');

  const currentDay = daysList[dayIndex] || daysList[daysList.length - 1];
  const isToday = currentDay?.isToday;
  const isPast = currentDay?.isPast;

  const filteredDishes =
    activeCategory === 'Все'
      ? DISHES_DATABASE
      : DISHES_DATABASE.filter((d) => d.category === activeCategory);

  const addToCart = (dishId: string) => {
    if (!isToday) {
      toast.info('Предзаказ доступен только на сегодняшнюю смену');
      return;
    }
    setCart((prev) => ({
      ...prev,
      [dishId]: (prev[dishId] || 0) + 1,
    }));
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => {
      const current = prev[dishId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[dishId];
        return next;
      }
      return { ...prev, [dishId]: current - 1 };
    });
  };

  const totalCartCount: number = (Object.values(cart) as number[]).reduce((a: number, b: number) => a + b, 0);
  const totalCartPrice: number = (Object.entries(cart) as [string, number][]).reduce((sum: number, [id, count]: [string, number]) => {
    const dish = DISHES_DATABASE.find((d) => d.id === id);
    return sum + (dish ? dish.price * Number(count) : 0);
  }, 0);

  const handleOrderSubmit = () => {
    if (totalCartCount === 0) {
      toast.error('Корзина пуста');
      return;
    }
    const newOrderNum = `ОБЕД-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastOrderNumber(newOrderNum);
    setIsOrderModalOpen(false);
    setIsReceiptOpen(true);
    toast.success('Предзаказ успешно оформлен! Сумма списана в счёт заработной платы.');
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 my-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs shrink-0"
            title="Назад на главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
            Меню столовой
          </h1>
        </div>

        {/* Days of Week Switcher (Mon-Fri) */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto max-w-full sm:max-w-fit">
          {daysList.map((item, idx) => (
            <button
              key={item.date}
              type="button"
              onClick={() => setDayIndex(idx)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                dayIndex === idx
                  ? 'bg-[#002B7F] text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#002B7F] text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredDishes.map((dish) => {
          const inCartCount = cart[dish.id] || 0;

          return (
            <div
              key={dish.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/75 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                    {dish.weight}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-white dark:bg-slate-800 text-[#002B7F] dark:text-blue-400 font-bold text-xs px-2.5 py-0.5 rounded-md shadow-2xs border border-slate-100 dark:border-slate-700">
                    {dish.price.toFixed(2)} руб.
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {dish.ingredients}
                  </p>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 px-2 py-1 rounded-md">
                    {dish.kbju}
                  </div>
                </div>
              </div>

              {/* Add to Cart / Quantity controls */}
              <div className="p-4 pt-0">
                {isToday ? (
                  inCartCount > 0 ? (
                    <div className="flex items-center justify-between bg-[#E8F1FC] dark:bg-blue-950/40 rounded-xl p-1 border border-blue-100 dark:border-blue-900/50">
                      <button
                        type="button"
                        onClick={() => removeFromCart(dish.id)}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-[#002B7F] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-sm shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm text-[#002B7F] dark:text-blue-300">
                        {inCartCount} шт.
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(dish.id)}
                        className="w-8 h-8 rounded-lg bg-[#002B7F] hover:bg-[#0B4DA2] text-white flex items-center justify-center font-bold text-sm shadow-2xs cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(dish.id)}
                      className="w-full bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl text-xs sm:text-sm font-bold h-9 shadow-xs cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[2.5px]" />
                      В обеденный талон
                    </Button>
                  )
                ) : (
                  <Button
                    disabled
                    variant="secondary"
                    className="w-full rounded-xl text-xs font-semibold h-9 opacity-60 dark:bg-slate-800 dark:text-slate-400"
                  >
                    Заказ недоступен
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Cart Bar (if items in cart and today) */}
      {isToday && totalCartCount > 0 && (
        <div className="fixed bottom-20 sm:bottom-24 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="w-full max-w-6xl lg:max-w-7xl 2xl:max-w-[1500px] mx-auto">
            <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto pointer-events-auto">
              <div className="w-full bg-[#002B7F] dark:bg-blue-900/95 text-white rounded-2xl shadow-xl p-3.5 sm:p-4 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 border border-blue-700/50 backdrop-blur-xs">
                <div className="space-y-0.5">
                  <div className="text-xs text-blue-200 font-medium">
                    Выбрано: {totalCartCount} блюд(а) • Списание в счёт з/п
                  </div>
                  <div className="text-base sm:text-lg font-extrabold">
                    Итого: {totalCartPrice.toFixed(2)} руб.
                  </div>
                </div>
                <Button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="bg-white hover:bg-slate-100 text-[#002B7F] font-extrabold rounded-xl px-4 py-2 text-xs sm:text-sm shadow-md cursor-pointer"
                >
                  Оформить заказ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 p-5 border-slate-200 dark:border-slate-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Оформление предзаказа в столовой
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Сумма будет списана с лицевого счёта сотрудника при начислении заработной платы.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Selected dishes breakdown */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              {(Object.entries(cart) as [string, number][]).map(([id, count]) => {
                const dish = DISHES_DATABASE.find((d) => d.id === id);
                if (!dish) return null;
                return (
                  <div key={id} className="flex justify-between items-center pt-2 first:pt-0">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{dish.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs">
                        {count} × {dish.price.toFixed(2)} руб.
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {(dish.price * Number(count)).toFixed(2)} руб.
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Итого к списанию:</span>
              <span className="font-extrabold text-base text-[#002B7F] dark:text-blue-400">
                {totalCartPrice.toFixed(2)} руб.
              </span>
            </div>

            {/* Shift & Employee Info */}
            <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3 text-xs sm:text-sm space-y-1.5 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Сотрудник:</span>
                <strong className="text-slate-900 dark:text-white font-semibold">{employeeData?.full_name || 'Иванов И.И.'}</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Способ оплаты:</span>
                <strong className="text-slate-900 dark:text-white font-semibold">В счёт заработной платы</strong>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setIsOrderModalOpen(false)}
              className="rounded-xl text-xs sm:text-sm font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              Отмена
            </Button>
            <Button
              onClick={handleOrderSubmit}
              className="bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors"
            >
              Подтвердить заказ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Receipt Modal */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border-slate-200 dark:border-slate-800 shadow-xl text-center">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-4 ring-emerald-50 dark:ring-emerald-900/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Электронный талон на обед
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
            Предъявите QR-код на раздаче в столовой или на кассе
          </DialogDescription>

          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3">
            {/* Realistic QR Visual */}
            <div className="w-40 h-40 bg-white p-2 rounded-xl border border-slate-200 dark:border-slate-600 shadow-2xs flex items-center justify-center">
              <QrCode className="w-32 h-32 text-[#002B7F]" />
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Талон: {lastOrderNumber}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {employeeData?.full_name || 'Иванов Иван Иванович'} • Таб. № {employeeData?.tab_number || '20481'}
            </div>
          </div>

          <div className="mt-5">
            <Button
              onClick={() => setIsReceiptOpen(false)}
              className="w-full bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl font-bold text-xs sm:text-sm py-2.5 cursor-pointer transition-colors"
            >
              Понятно
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
