export type Category = 'محشي' | 'طواجن' | 'فراخ ولحوم' | 'صيامي' | 'حلويات' | 'مخبوزات';

export const CATEGORIES: { key: Category | 'الكل'; emoji: string }[] = [
  { key: 'الكل', emoji: '🍽️' },
  { key: 'محشي', emoji: '🫑' },
  { key: 'طواجن', emoji: '🥘' },
  { key: 'فراخ ولحوم', emoji: '🍗' },
  { key: 'صيامي', emoji: '🥗' },
  { key: 'حلويات', emoji: '🍮' },
  { key: 'مخبوزات', emoji: '🥐' },
];

export type Dish = {
  id: string;
  motherId: string;
  name: string;
  description: string;
  price: number;
  unit: string; // طبق / علبة / كيلو / قطعة
  emoji: string;
  category: Category;
  serves: number; // يكفي كام فرد
  available: boolean;
  popular?: boolean;
};

export type Mother = {
  id: string;
  name: string; // ماما سعاد
  kitchen: string; // مطبخ ست الحبايب
  area: string;
  bio: string;
  story: string; // قصتها وأثر الدخل على بيتها
  rating: number;
  reviews: number;
  ordersCount: number;
  yearsCooking: number;
  specialties: string[];
  paletteIndex: number;
  emoji: string;
  openFrom: string; // "11:00"
  openTo: string; // "22:00"
  responseMinutes: number;
  isMine?: boolean;
};

export type OrderStatus = 'pending' | 'accepted' | 'cooking' | 'ready' | 'picked' | 'cancelled';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'في انتظار الموافقة',
  accepted: 'الأم وافقت 👌',
  cooking: 'الأكل بيتجهز 🔥',
  ready: 'جاهز للاستلام ✅',
  picked: 'تم الاستلام',
  cancelled: 'ملغي',
};

export type OrderItem = { dishId: string; name: string; emoji: string; price: number; qty: number };

export type Order = {
  id: string;
  code: string; // كود الاستلام
  motherId: string;
  items: OrderItem[];
  subtotal: number;
  motherShare: number;
  status: OrderStatus;
  pickupStart: string;
  pickupEnd: string;
  pickupLabel: string;
  pickupDay: string;
  note?: string;
  createdAt: string;
};

export type Message = {
  id: string;
  from: 'me' | 'mother';
  text: string;
  at: string;
};

export type ChefProfile = {
  motherId: string;
  name: string;
  kitchen: string;
  area: string;
  bio: string;
};

export type Review = { id: string; motherId: string; author: string; text: string; stars: number };
