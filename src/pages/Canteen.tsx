import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Minus,
  ArrowLeft,
  Search,
  Trash2,
  ShoppingBag,
  Utensils,
  X,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { toast } from 'sonner';
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
  // ==================== 1. ХОЛОДНЫЕ БЛЮДА (8 позиций) ====================
  {
    id: 'cold-1',
    name: 'Салат "Осенний"',
    category: 'Холодные блюда',
    weight: '90 г',
    ingredients: 'Свекла, яблоки, капуста белокочанная, кукуруза консервированная, масло растительное',
    kbju: '88 ккал • Б: 1.8г • Ж: 4.2г • У: 10.8г',
    price: 1.15,
    image: '/dishes/cabbage-autumn-salad.jpg',
  },
  {
    id: 'cold-2',
    name: 'Салат "Случь"',
    category: 'Холодные блюда',
    weight: '120 г',
    ingredients: 'Помидоры свежие, чеснок, масло растительное, лук репчатый, зелень',
    kbju: '76 ккал • Б: 1.2г • Ж: 4.8г • У: 7.1г',
    price: 1.35,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cold-3',
    name: 'Сельдь с луком',
    category: 'Холодные блюда',
    weight: '25/30 г',
    ingredients: 'Сельдь слабосоленая, лук репчатый маринованный, масло растительное, зелень свежая',
    kbju: '142 ккал • Б: 9.8г • Ж: 11.2г • У: 1.6г',
    price: 1.75,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cold-4',
    name: 'Яйцо под майонезом',
    category: 'Холодные блюда',
    weight: '53/20 г',
    ingredients: 'Яйцо куриное отварное отборное, майонез провансаль, веточка зелени',
    kbju: '168 ккал • Б: 6.9г • Ж: 15.4г • У: 0.8г',
    price: 1.20,
    image: '/dishes/boiled-eggs-mayo.jpg',
  },
  {
    id: 'cold-5',
    name: 'Свекла "Любительская"',
    category: 'Холодные блюда',
    weight: '100 г',
    ingredients: 'Свекла отварная столовая, чеснок свежий, масло растительное, специи',
    kbju: '92 ккал • Б: 1.6г • Ж: 4.5г • У: 11.2г',
    price: 0.95,
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cold-6',
    name: 'Салат из птицы с грибами',
    category: 'Холодные блюда',
    weight: '100 г',
    ingredients: 'Цыплята-бройлеры, шампиньоны свежие, сыр твердый, огурцы консервированные, яйца, лук репчатый, майонез',
    kbju: '215 ккал • Б: 13.6г • Ж: 16.8г • У: 3.4г',
    price: 2.45,
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cold-7',
    name: 'Салат "Радуга"',
    category: 'Холодные блюда',
    weight: '140 г',
    ingredients: 'Морковь свежая, сыр твердый, чеснок свежий, огурцы свежие, помидоры свежие, яйца, майонез',
    kbju: '185 ккал • Б: 7.2г • Ж: 14.5г • У: 6.8г',
    price: 2.20,
    image: '/dishes/carrot-cheese-salad.jpg',
  },
  {
    id: 'cold-8',
    name: 'Сметана порционная',
    category: 'Холодные блюда',
    weight: '100 г',
    ingredients: 'Сметана пастеризованная натуральная «Беллакт» 20%',
    kbju: '206 ккал • Б: 2.6г • Ж: 20.0г • У: 3.4г',
    price: 1.10,
    image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format&fit=crop&q=80',
  },

  // ==================== 2. ПЕРВЫЕ БЛЮДА (3 позиции) ====================
  {
    id: 'soup-1',
    name: 'Суп картофельный с фасолью',
    category: 'Первые блюда',
    weight: '250 г',
    ingredients: 'Картофель отборный, фасоль красная/белая, морковь, лук пассерованный, бульон, зелень петрушки',
    kbju: '145 ккал • Б: 6.2г • Ж: 3.8г • У: 21.5г',
    price: 1.30,
    image: '/dishes/bean-potato-soup.jpg',
  },
  {
    id: 'soup-2',
    name: 'Суп молочный с макаронными изделиями',
    category: 'Первые блюда',
    weight: '250 г',
    ingredients: 'Молоко натуральное «Беллакт» 3.2%, макаронные изделия высшего сорта, масло сливочное «Беллакт», сахар, соль',
    kbju: '185 ккал • Б: 6.8г • Ж: 6.5г • У: 25.2г',
    price: 1.25,
    image: '/dishes/pasta-broth-soup.jpg',
  },
  {
    id: 'soup-3',
    name: 'Борщ с капустой и картофелем',
    category: 'Первые блюда',
    weight: '250/10 г',
    ingredients: 'Свекла столовая, капуста белокочанная, картофель, морковь, лук, томатная паста, сметана «Беллакт», зелень',
    kbju: '165 ккал • Б: 4.8г • Ж: 7.2г • У: 20.4г',
    price: 1.55,
    image: '/dishes/traditional-borscht.jpg',
  },

  // ==================== 3. ВТОРЫЕ БЛЮДА (5 позиций) ====================
  {
    id: 'main-1',
    name: 'Котлеты рубленые из цыплят-бройлеров',
    category: 'Вторые блюда',
    weight: '100/5 г',
    ingredients: 'Мясо цыплят-бройлеров рубленое, хлеб пшеничный, сухари панировочные, лук репчатый, специи',
    kbju: '265 ккал • Б: 19.5г • Ж: 14.8г • У: 13.2г',
    price: 3.20,
    image: '/dishes/chicken-cutlets.jpg',
  },
  {
    id: 'main-2',
    name: 'Мясо отварное (свинина)',
    category: 'Вторые блюда',
    weight: '75 г',
    ingredients: 'Свинина постная отварная, бульон натуральный, лавровый лист, черный перец горошком',
    kbju: '218 ккал • Б: 21.0г • Ж: 15.0г • У: 0.0г',
    price: 3.60,
    image: '/dishes/boiled-pork-plate.jpg',
  },
  {
    id: 'main-3',
    name: 'Жаркое по-домашнему',
    category: 'Вторые блюда',
    weight: '300 г',
    ingredients: 'Свинина отборная тушеная, картофель молодой, лук репчатый, соус томатный домашний, чеснок, специи',
    kbju: '385 ккал • Б: 22.4г • Ж: 20.6г • У: 27.5г',
    price: 4.20,
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'main-4',
    name: 'Рыба жареная (филе)',
    category: 'Вторые блюда',
    weight: '100 г',
    ingredients: 'Филе хека натуральное, мука пшеничная в/с, масло растительное, специи для рыбы, лимон',
    kbju: '190 ккал • Б: 20.2г • Ж: 8.9г • У: 7.2г',
    price: 3.40,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'main-5',
    name: 'Поджарка',
    category: 'Вторые блюда',
    weight: '75/25 г',
    ingredients: 'Свинина соломкой, лук репчатый пассерованный, соус томатный, перец черный, зелень',
    kbju: '275 ккал • Б: 18.2г • Ж: 21.0г • У: 4.2г',
    price: 3.35,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80',
  },

  // ==================== 4. ГАРНИРЫ (3 позиции) ====================
  {
    id: 'side-1',
    name: 'Картофель запеченный',
    category: 'Гарниры',
    weight: '150 г',
    ingredients: 'Картофель дольками, масло растительное, паприка, розмарин, соль',
    kbju: '162 ккал • Б: 2.8г • Ж: 5.4г • У: 26.0г',
    price: 1.20,
    image: 'https://images.unsplash.com/photo-1518013034458-30b0ee243591?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'side-2',
    name: 'Каша гречневая',
    category: 'Гарниры',
    weight: '150 г',
    ingredients: 'Крупа гречневая ядрица, масло сливочное «Беллакт», соль пищевая',
    kbju: '175 ккал • Б: 5.5г • Ж: 4.8г • У: 28.5г',
    price: 0.85,
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'side-3',
    name: 'Смесь овощная "VIP"',
    category: 'Гарниры',
    weight: '100 г',
    ingredients: 'Брокколи, капуста цветная, стручковая фасоль, морковь беби, кукуруза десертная, сливочное масло',
    kbju: '78 ккал • Б: 2.9г • Ж: 3.2г • У: 9.6г',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef2396e?w=500&auto=format&fit=crop&q=80',
  },

  // ==================== 5. НАПИТКИ (11 позиций) ====================
  {
    id: 'drink-1',
    name: 'Нектар апельсиновый порционный',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Апельсиновый сок концентрированный, сахарный сироп, регулятор кислотности',
    kbju: '94 ккал • Б: 0.4г • Ж: 0.0г • У: 23.0г',
    price: 1.45,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-2',
    name: 'Нектар "Тропиканка" порционный',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Смесь соков тропических фруктов (манго, маракуйя, апельсин, ананас), сахарный сироп',
    kbju: '96 ккал • Б: 0.3г • Ж: 0.0г • У: 23.8г',
    price: 1.45,
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-3',
    name: 'Кефир порционный',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Кефир натуральный 2.5% «Беллакт» на живых кефирных грибках',
    kbju: '106 ккал • Б: 5.6г • Ж: 5.0г • У: 8.0г',
    price: 0.90,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-4',
    name: 'Чай без сахара',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Чай черный байховый высшего сорта свежезаваренный',
    kbju: '2 ккал • Б: 0.1г • Ж: 0.0г • У: 0.3г',
    price: 0.35,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-5',
    name: 'Молоко порционное',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Молоко питьевое пастеризованное «Беллакт» 3.2%',
    kbju: '118 ккал • Б: 6.0г • Ж: 6.4г • У: 9.4г',
    price: 0.80,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-6',
    name: 'Сок томатный с мякотью',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Томатный сок прямого отжима с мякотью, соль пищевая йодированная',
    kbju: '42 ккал • Б: 1.6г • Ж: 0.2г • У: 8.4г',
    price: 1.20,
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-7',
    name: 'Компот из смеси сухофруктов',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Яблоки сушеные, груши, изюм, чернослив, сахарный сироп',
    kbju: '88 ккал • Б: 0.4г • Ж: 0.0г • У: 21.6г',
    price: 0.70,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-8',
    name: 'Нектар ананасовый порционный',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Ананасовый концентрированный сок, подготовленная вода, сахарный сироп',
    kbju: '98 ккал • Б: 0.3г • Ж: 0.0г • У: 24.2г',
    price: 1.45,
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-9',
    name: 'Чай с сахаром',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Чай черный байховый свежезаваренный, сахар-песок',
    kbju: '58 ккал • Б: 0.1г • Ж: 0.0г • У: 14.5г',
    price: 0.45,
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-10',
    name: 'Сок березовый порционный 0.75',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Сок березовый натуральный, сахар, кислота лимонная',
    kbju: '52 ккал • Б: 0.1г • Ж: 0.0г • У: 13.0г',
    price: 0.90,
    image: 'https://images.unsplash.com/photo-1546853020-ca4909aef454?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'drink-11',
    name: 'Компот из свежих яблок',
    category: 'Напитки',
    weight: '200 г',
    ingredients: 'Яблоки свежие отборные садовые, сахарный сироп, вода',
    kbju: '76 ккал • Б: 0.3г • Ж: 0.0г • У: 18.8г',
    price: 0.65,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&auto=format&fit=crop&q=80',
  },

  // ==================== 6. КОНДИТЕРСКИЕ И МУЧНЫЕ ИЗДЕЛИЯ (5 позиций) ====================
  {
    id: 'pastry-1',
    name: 'Ватрушка с творогом',
    category: 'Кондитерские и мучные изделия',
    weight: '75 г',
    ingredients: 'Тесто дрожжевое сдобное, начинка из натурального творога «Беллакт» 9%, ванилин',
    kbju: '215 ккал • Б: 8.2г • Ж: 6.4г • У: 31.0г',
    price: 1.40,
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pastry-2',
    name: 'Пирожки печеные с начинкой вареная сгущенка',
    category: 'Кондитерские и мучные изделия',
    weight: '75 г',
    ingredients: 'Тесто сдобное печеное румяное, начинка: цельное сгущенное молоко вареное «Беллакт»',
    kbju: '248 ккал • Б: 5.6г • Ж: 7.2г • У: 40.5г',
    price: 1.30,
    image: 'https://images.unsplash.com/photo-1621236378699-8597faf6a173?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pastry-3',
    name: 'Пирожки жареные с начинкой вареная сгущенка',
    category: 'Кондитерские и мучные изделия',
    weight: '75 г',
    ingredients: 'Тесто дрожжевое жареное во фритюре, начинка: натуральная вареная сгущенка «Беллакт»',
    kbju: '272 ккал • Б: 5.2г • Ж: 11.4г • У: 37.2г',
    price: 1.30,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pastry-4',
    name: 'Бриошь с какао',
    category: 'Кондитерские и мучные изделия',
    weight: '100 г',
    ingredients: 'Сдобное воздушное тесто на сливочном масле, натуральный какао-порошок «Беллакт», сахарная глазурь',
    kbju: '340 ккал • Б: 7.8г • Ж: 14.5г • У: 44.8г',
    price: 1.80,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pastry-5',
    name: 'Сырники п/ф',
    category: 'Кондитерские и мучные изделия',
    weight: '110/20 г',
    ingredients: 'Полуфабрикат сырников из отборного творога «Беллакт», мука в/с, сметана «Беллакт» / ягодный джем',
    kbju: '280 ккал • Б: 16.5г • Ж: 11.2г • У: 28.0г',
    price: 2.70,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
  },

  // ==================== 7. ХЛЕБОБУЛОЧНЫЕ ИЗДЕЛИЯ (4 позиции) ====================
  {
    id: 'bread-1',
    name: 'Хлеб черный',
    category: 'Хлебобулочные изделия',
    weight: '1 кус (35 г)',
    ingredients: 'Мука ржаная хлебопекарная обдирная, закваска, солод, соль',
    kbju: '72 ккал • Б: 2.2г • Ж: 0.4г • У: 14.8г',
    price: 0.18,
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'bread-2',
    name: 'Батон',
    category: 'Хлебобулочные изделия',
    weight: '1 кус (35 г)',
    ingredients: 'Мука пшеничная высшего сорта, вода, дрожжи, сахар, масло растительное',
    kbju: '92 ккал • Б: 2.8г • Ж: 1.1г • У: 18.2г',
    price: 0.18,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'bread-3',
    name: 'Хлеб пшеничный "Мультизлаковый микс"',
    category: 'Хлебобулочные изделия',
    weight: '1 кус (40 г)',
    ingredients: 'Мука пшеничная 1 сорт, семена льна, кунжут, хлопья овсяные, солод',
    kbju: '98 ккал • Б: 3.4г • Ж: 2.2г • У: 16.5г',
    price: 0.25,
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'bread-4',
    name: 'Хлеб "Бородинский"',
    category: 'Хлебобулочные изделия',
    weight: '1 кус (35 г)',
    ingredients: 'Мука ржаная обойная, мука пшеничная 2 сорт, солод ржаной ферментированный, кориандр, патока',
    kbju: '76 ккал • Б: 2.4г • Ж: 0.5г • У: 15.6г',
    price: 0.22,
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&auto=format&fit=crop&q=80',
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

  return workdays.map((d, index) => {
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isToday = dateStr === todayStr || (now.getDay() === 0 || now.getDay() === 6 ? index === workdays.length - 1 : false);
    const isPast = !isToday && dateStr < todayStr;
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<Record<string, number>>({});

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  // Confirmation state to prevent accidental order placement
  const [isConfirmOrderOpen, setIsConfirmOrderOpen] = useState(false);

  const currentDay = daysList[dayIndex] || daysList[daysList.length - 1];

  const totalCartCount: number = (Object.values(cart) as number[]).reduce((a: number, b: number) => a + b, 0);
  const totalCartPrice: number = (Object.entries(cart) as [string, number][]).reduce((sum: number, [id, count]: [string, number]) => {
    const dish = DISHES_DATABASE.find((d) => d.id === id);
    return sum + (dish ? dish.price * Number(count) : 0);
  }, 0);

  const filteredDishes = DISHES_DATABASE.filter((dish) => {
    if (activeCategory === 'В талоне') {
      if (!cart[dish.id] || cart[dish.id] <= 0) return false;
    } else if (activeCategory !== 'Все' && dish.category !== activeCategory) {
      return false;
    }
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      dish.name.toLowerCase().includes(query) ||
      dish.ingredients.toLowerCase().includes(query) ||
      dish.category.toLowerCase().includes(query)
    );
  });

  const addToCart = (dishId: string) => {
    if (currentDay.isPast) {
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

  const removeEntireDishFromCart = (dishId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[dishId];
      return next;
    });
  };

  const clearEntireCart = () => {
    setCart({});
    setIsOrderModalOpen(false);
  };

  const handleOrderSubmit = () => {
    if (totalCartCount === 0) {
      return;
    }
    setIsOrderModalOpen(false);
    setCart({});
    toast.success('Предзаказ успешно оформлен! Заказ передан на раздачу столовой.', {
      duration: 4000,
    });
  };

  const cartEntries = Object.entries(cart).filter(([_, count]) => Number(count) > 0) as [string, number][];

  return (
    <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto space-y-5 sm:space-y-6 pb-16">
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
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Меню столовой
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ОАО «Беллакт» • 39 позиций в меню
            </p>
          </div>
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
              {item.isToday && <span className="ml-1 text-[10px] opacity-80">(сегодня)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="space-y-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск блюд, ингредиентов (борщ, котлеты, сыр, хек...)"
            className="pl-10 pr-9 h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              title="Очистить поиск"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar with Counts */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'Все'
                ? DISHES_DATABASE.length
                : DISHES_DATABASE.filter((d) => d.category === cat).length;

            return (
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
                {cat} ({count})
              </button>
            );
          })}

          {totalCartCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveCategory('В талоне')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'В талоне'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[#002B7F] dark:text-blue-300 hover:bg-blue-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              В талоне ({totalCartCount})
            </button>
          )}
        </div>
      </div>

      {/* Dishes Grid or Empty State */}
      {filteredDishes.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            {activeCategory === 'В талоне'
              ? 'В вашем талоне пока нет выбранных блюд. Добавьте желаемые блюда из меню ниже.'
              : 'По вашему запросу ничего не найдено. Попробуйте изменить поисковый запрос или выбрать другую категорию.'}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('Все');
            }}
            className="mt-4 text-xs font-semibold rounded-xl"
          >
            Показать все блюда (39)
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredDishes.map((dish) => {
            const inCartCount = cart[dish.id] || 0;

            return (
              <div
                key={dish.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/75 text-white text-xs font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
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
                  {inCartCount > 0 ? (
                    <div className="flex items-center justify-between bg-[#E8F1FC] dark:bg-blue-950/40 rounded-xl p-1 border border-blue-100 dark:border-blue-900/50">
                      <button
                        type="button"
                        onClick={() => removeFromCart(dish.id)}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-[#002B7F] dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-sm shadow-2xs cursor-pointer transition-colors"
                        title="Уменьшить количество или удалить"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-xs sm:text-sm text-[#002B7F] dark:text-blue-300">
                        {inCartCount} шт.
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(dish.id)}
                        disabled={currentDay.isPast}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-2xs transition-colors ${
                          currentDay.isPast
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            : 'bg-[#002B7F] hover:bg-[#0B4DA2] text-white cursor-pointer'
                        }`}
                        title={currentDay.isPast ? 'Заказ на прошедшую дату недоступен' : 'Добавить ещё'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : currentDay.isPast ? (
                    <Button
                      disabled
                      variant="secondary"
                      className="w-full rounded-xl text-xs font-semibold h-9 opacity-60 bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                    >
                      Заказ недоступен
                    </Button>
                  ) : (
                    <Button
                      onClick={() => addToCart(dish.id)}
                      className="w-full bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl text-xs sm:text-sm font-bold h-9 shadow-xs cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[2.5px]" />
                      Добавить
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Bottom Cart Bar (if items in cart) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-20 sm:bottom-24 left-0 right-0 z-40 px-3 sm:px-6 lg:px-8 pointer-events-none">
          <div className="w-full max-w-6xl lg:max-w-7xl 2xl:max-w-[1500px] mx-auto">
            <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-none mx-auto pointer-events-auto">
              <div className="w-full bg-[#002B7F] dark:bg-blue-900/95 text-white rounded-2xl shadow-xl p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 border border-blue-700/50 backdrop-blur-xs max-w-full overflow-hidden">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="text-[11px] sm:text-xs text-blue-200 font-medium truncate">
                    Выбрано: <span className="font-bold text-white">{totalCartCount}</span> блюд(а)
                    <span className="hidden md:inline"> • Списание в счёт з/п</span>
                  </div>
                  <div className="text-sm sm:text-lg font-extrabold truncate">
                    <span className="hidden sm:inline">Итого: </span>
                    {totalCartPrice.toFixed(2)} руб.
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    onClick={clearEntireCart}
                    className="text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-xl px-2 sm:px-2.5 py-1 text-xs font-semibold h-8 sm:h-9"
                    title="Очистить всё"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:mr-1 shrink-0" />
                    <span className="hidden sm:inline">Очистить</span>
                  </Button>
                  <Button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="bg-white hover:bg-slate-100 text-[#002B7F] font-extrabold rounded-xl px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm shadow-md cursor-pointer shrink-0 h-8 sm:h-9 whitespace-nowrap"
                  >
                    Оформить<span className="hidden sm:inline">&nbsp;заказ</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Review Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl bg-white dark:bg-slate-900 p-4 sm:p-5 border-slate-200 dark:border-slate-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Оформление предзаказа в столовой
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Selected dishes breakdown with active removal & quantity editing */}
            <div className="space-y-2 max-h-60 overflow-y-auto overflow-x-hidden pr-1 divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              {cartEntries.length === 0 ? (
                <div className="py-6 text-center text-slate-500 dark:text-slate-400 text-xs">
                  В талоне нет выбранных блюд
                </div>
              ) : (
                cartEntries.map(([id, count]) => {
                  const dish = DISHES_DATABASE.find((d) => d.id === id);
                  if (!dish) return null;
                  return (
                    <div key={id} className="py-2.5 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                              {dish.name}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
                              {dish.price.toFixed(2)} руб. / шт.
                            </div>
                          </div>
                        </div>

                        {/* Price & Delete on top row */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right font-bold text-slate-900 dark:text-white text-xs sm:text-sm whitespace-nowrap">
                            {(dish.price * Number(count)).toFixed(2)} руб.
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEntireDishFromCart(dish.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Удалить из заказа"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity Stepper Row */}
                      <div className="flex items-center justify-between pl-12">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Количество порций:
                        </span>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => removeFromCart(dish.id)}
                            className="w-6 h-6 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                            title="Уменьшить"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-slate-900 dark:text-white">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(dish.id)}
                            disabled={currentDay.isPast}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                              currentDay.isPast
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                : 'bg-[#002B7F] text-white hover:bg-[#0B4DA2] cursor-pointer'
                            }`}
                            title={currentDay.isPast ? 'Недоступно' : 'Увеличить'}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
                <strong className="text-slate-900 dark:text-white font-semibold truncate ml-2">{employeeData?.full_name || 'Иванов И.И.'}</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Способ оплаты:</span>
                <strong className="text-slate-900 dark:text-white font-semibold whitespace-nowrap ml-2">В счёт зарплаты</strong>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setIsOrderModalOpen(false)}
              className="rounded-xl text-xs sm:text-sm font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 min-h-[44px] cursor-pointer"
            >
              Закрыть
            </Button>
            <Button
              onClick={() => {
                if (totalCartCount === 0 || currentDay.isPast) return;
                setIsConfirmOrderOpen(true);
              }}
              disabled={totalCartCount === 0 || currentDay.isPast}
              className="bg-[#002B7F] hover:bg-[#0B4DA2] text-white rounded-xl text-xs sm:text-sm font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] shadow-xs whitespace-nowrap"
            >
              Подтвердить заказ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog to prevent accidental order placement */}
      <Dialog open={isConfirmOrderOpen} onOpenChange={setIsConfirmOrderOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl bg-white dark:bg-slate-900 p-4 sm:p-6 border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D6E6F9] dark:bg-blue-950/70 text-[#002B7F] dark:text-blue-300 flex items-center justify-center shrink-0">
                <Utensils className="w-5 h-5 stroke-[2.2px]" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Подтверждение предзаказа
                </DialogTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ОАО «Беллакт» • Столовая предприятия
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Дата питания:</span>
                <strong className="text-slate-900 dark:text-white font-semibold">{currentDay.label}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Выбрано блюд:</span>
                <strong className="text-slate-900 dark:text-white font-semibold">{totalCartCount} шт.</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Сотрудник:</span>
                <strong className="text-slate-900 dark:text-white font-semibold truncate ml-2">{employeeData?.full_name || 'Иванов И.И.'}</strong>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">Сумма к списанию:</span>
                <span className="font-extrabold text-base text-[#002B7F] dark:text-blue-400">
                  {totalCartPrice.toFixed(2)} руб.
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Вы точно хотите оформить предзаказ? 
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOrderOpen(false)}
              className="w-full sm:w-auto rounded-xl text-xs sm:text-sm font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 min-h-[44px] cursor-pointer"
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                setIsConfirmOrderOpen(false);
                handleOrderSubmit();
              }}
              className="w-full sm:w-auto bg-[#002B7F] hover:bg-[#0B4DA2] active:bg-[#002161] text-white rounded-xl text-xs sm:text-sm font-bold min-h-[44px] cursor-pointer transition-colors shadow-xs whitespace-nowrap"
            >
              Да, подтвердить заказ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
