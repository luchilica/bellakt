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
  Info,
  UtensilsCrossed,
  Receipt,
  X,
  CreditCard,
  QrCode,
  Calendar,
  AlertCircle,
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

// Weekdays Mon-Fri according to specification (canteen closed on weekends)
const DAYS_LIST = [
  { label: 'Пн, 07 Сен', date: '2026-09-07', isToday: false, isPast: true },
  { label: 'Вт, 08 Сен', date: '2026-09-08', isToday: false, isPast: true },
  { label: 'Ср, 09 Сен', date: '2026-09-09', isToday: false, isPast: true },
  { label: 'Чт, 10 Сен', date: '2026-09-10', isToday: true, isPast: false },
  { label: 'Пт, 11 Сен', date: '2026-09-11', isToday: false, isPast: false, isFuture: true },
];

export default function Canteen() {
  const { employeeData } = useAuthStore();
  const [dayIndex, setDayIndex] = useState(3); // Default: Today (Thursday 10 Sep)
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

  const currentDay = DAYS_LIST[dayIndex] || DAYS_LIST[3];
  const isToday = currentDay.isToday;
  const isPast = currentDay.isPast;
  const isFuture = (currentDay as any).isFuture;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs shrink-0"
            title="Назад на главную"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Меню столовой
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Комплексное питание столовой ОАО «Беллакт»
            </p>
          </div>
        </div>

        {/* Days of Week Switcher (Mon-Fri) */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
          {DAYS_LIST.map((item, idx) => (
            <button
              key={item.date}
              type="button"
              onClick={() => setDayIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                dayIndex === idx
                  ? 'bg-[#002B7F] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {item.label}
              {item.isToday && (
                <span className="ml-1.5 text-[11px] font-bold px-1.5 py-0.5 bg-emerald-600 text-white rounded-md">
                  сегодня
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Banner based on day */}
      {isPast && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 text-amber-900 text-xs sm:text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Архивное меню за прошедший день. Оформление предзаказа недоступно.</span>
        </div>
      )}

      {isFuture && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 text-[#002B7F] text-xs sm:text-sm font-medium">
          <Info className="w-5 h-5 text-[#002B7F] shrink-0" />
          <span>Предварительное меню на следующий рабочий день. Заказ откроется с 07:00.</span>
        </div>
      )}

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
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
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
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/75 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                    {dish.weight}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-white text-[#002B7F] font-bold text-xs px-2.5 py-0.5 rounded-md shadow-2xs border border-slate-100">
                    {dish.price.toFixed(2)} руб.
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dish.ingredients}
                  </p>
                  <div className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                    {dish.kbju}
                  </div>
                </div>
              </div>

              {/* Add to Cart / Quantity controls */}
              <div className="p-4 pt-0">
                {isToday ? (
                  inCartCount > 0 ? (
                    <div className="flex items-center justify-between bg-[#E8F1FC] rounded-xl p-1 border border-blue-100">
                      <button
                        type="button"
                        onClick={() => removeFromCart(dish.id)}
                        className="w-8 h-8 rounded-lg bg-white text-[#002B7F] hover:bg-slate-50 flex items-center justify-center font-bold text-sm shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm text-[#002B7F]">
                        {inCartCount} шт.
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(dish.id)}
                        className="w-8 h-8 rounded-lg bg-[#002B7F] text-white hover:bg-[#001E59] flex items-center justify-center font-bold text-sm shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(dish.id)}
                      className="w-full bg-[#002B7F] hover:bg-[#001D56] text-white rounded-xl text-xs sm:text-sm font-bold h-9 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[2.5px]" />
                      В обеденный талон
                    </Button>
                  )
                ) : (
                  <Button
                    disabled
                    variant="secondary"
                    className="w-full rounded-xl text-xs font-semibold h-9 opacity-60"
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
        <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 w-[92%] max-w-xl bg-[#002B7F] text-white rounded-2xl shadow-xl p-3 sm:p-4 z-40 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4">
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
      )}

      {/* Order Confirmation Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white p-5 border-slate-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Оформление предзаказа в столовой
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600">
              Сумма будет списана с лицевого счёта сотрудника при начислении заработной платы.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Selected dishes breakdown */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 divide-y divide-slate-100 text-xs sm:text-sm">
              {(Object.entries(cart) as [string, number][]).map(([id, count]) => {
                const dish = DISHES_DATABASE.find((d) => d.id === id);
                if (!dish) return null;
                return (
                  <div key={id} className="flex justify-between items-center pt-2 first:pt-0">
                    <div>
                      <div className="font-semibold text-slate-900">{dish.name}</div>
                      <div className="text-slate-500 text-xs">
                        {count} × {dish.price.toFixed(2)} руб.
                      </div>
                    </div>
                    <div className="font-bold text-slate-900">
                      {(dish.price * Number(count)).toFixed(2)} руб.
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="font-bold text-sm text-slate-900">Итого к списанию:</span>
              <span className="font-extrabold text-base text-[#002B7F]">
                {totalCartPrice.toFixed(2)} руб.
              </span>
            </div>

            {/* Shift & Employee Info */}
            <div className="bg-slate-50 rounded-xl p-3 text-xs sm:text-sm space-y-1.5 border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Сотрудник:</span>
                <strong className="text-slate-900 font-semibold">{employeeData?.full_name || 'Иванов И.И.'}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Способ оплаты:</span>
                <strong className="text-slate-900 font-semibold">В счёт заработной платы</strong>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setIsOrderModalOpen(false)}
              className="rounded-xl text-xs sm:text-sm font-semibold"
            >
              Отмена
            </Button>
            <Button
              onClick={handleOrderSubmit}
              className="bg-[#002B7F] hover:bg-[#001D56] text-white rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
            >
              Подтвердить заказ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Receipt Modal */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white p-6 border-slate-200 shadow-xl text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-4 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Электронный талон на обед
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-600 mb-4">
            Предъявите QR-код на раздаче в столовой или на кассе
          </DialogDescription>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3">
            {/* Realistic QR Visual */}
            <div className="w-40 h-40 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center">
              <QrCode className="w-32 h-32 text-[#002B7F]" />
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-slate-900">
              Талон: {lastOrderNumber}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {employeeData?.full_name || 'Иванов Иван Иванович'} • Таб. № {employeeData?.tab_number || '20481'}
            </div>
          </div>

          <div className="mt-5">
            <Button
              onClick={() => setIsReceiptOpen(false)}
              className="w-full bg-[#002B7F] hover:bg-[#001D56] text-white rounded-xl font-bold text-xs sm:text-sm py-2.5 cursor-pointer"
            >
              Понятно
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
