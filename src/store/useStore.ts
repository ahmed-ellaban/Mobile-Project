import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { DISHES, MOTHERS, MOTHER_REPLIES, PLATFORM_STATS } from '@/data/mock';
import type { ChefProfile, Dish, Message, Mother, Order, OrderStatus } from '@/data/types';
import type { PickupSlot } from '@/lib/slots';

export type BasketLine = { dishId: string; qty: number };

type State = {
  hydrated: boolean;
  onboarded: boolean;
  userName: string;
  phone: string;
  favorites: string[];

  mothers: Mother[];
  dishes: Dish[];

  basketMotherId: string | null;
  basket: BasketLine[];

  orders: Order[];
  chats: Record<string, Message[]>;
  typing: Record<string, boolean>;

  chef: ChefProfile | null;
};

type Actions = {
  setHydrated: () => void;
  finishOnboarding: () => void;
  setProfile: (name: string, phone: string) => void;
  toggleFavorite: (motherId: string) => void;

  addToBasket: (dish: Dish) => 'ok' | 'different-mother';
  setQty: (dishId: string, qty: number) => void;
  clearBasket: () => void;
  replaceBasketWith: (dish: Dish) => void;

  placeOrder: (slot: PickupSlot, note?: string) => Order;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;

  sendMessage: (motherId: string, text: string) => void;
  receiveMessage: (motherId: string, text: string) => void;
  setTyping: (motherId: string, typing: boolean) => void;

  registerChef: (profile: Omit<ChefProfile, 'motherId'>) => void;
  upsertDish: (dish: Omit<Dish, 'id' | 'motherId'> & { id?: string }) => void;
  toggleDishAvailability: (dishId: string) => void;
  removeDish: (dishId: string) => void;
};

export type Store = State & Actions;

const uid = () => Math.random().toString(36).slice(2, 10);
const pickupCode = () => Math.floor(1000 + Math.random() * 9000).toString();

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboarded: false,
      userName: '',
      phone: '',
      favorites: [],
      mothers: MOTHERS,
      dishes: DISHES,
      basketMotherId: null,
      basket: [],
      orders: [],
      chats: {},
      typing: {},
      chef: null,

      setHydrated: () => set({ hydrated: true }),
      finishOnboarding: () => set({ onboarded: true }),
      setProfile: (userName, phone) => set({ userName, phone }),
      toggleFavorite: (motherId) =>
        set((s) => ({
          favorites: s.favorites.includes(motherId)
            ? s.favorites.filter((id) => id !== motherId)
            : [...s.favorites, motherId],
        })),

      addToBasket: (dish) => {
        const { basketMotherId, basket } = get();
        if (basketMotherId && basketMotherId !== dish.motherId && basket.length > 0) {
          return 'different-mother';
        }
        const existing = basket.find((l) => l.dishId === dish.id);
        set({
          basketMotherId: dish.motherId,
          basket: existing
            ? basket.map((l) => (l.dishId === dish.id ? { ...l, qty: l.qty + 1 } : l))
            : [...basket, { dishId: dish.id, qty: 1 }],
        });
        return 'ok';
      },
      replaceBasketWith: (dish) => set({ basketMotherId: dish.motherId, basket: [{ dishId: dish.id, qty: 1 }] }),
      setQty: (dishId, qty) =>
        set((s) => {
          const basket =
            qty <= 0
              ? s.basket.filter((l) => l.dishId !== dishId)
              : s.basket.map((l) => (l.dishId === dishId ? { ...l, qty } : l));
          return { basket, basketMotherId: basket.length ? s.basketMotherId : null };
        }),
      clearBasket: () => set({ basket: [], basketMotherId: null }),

      placeOrder: (slot, note) => {
        const { basket, basketMotherId, dishes } = get();
        const items = basket
          .map((l) => {
            const d = dishes.find((x) => x.id === l.dishId);
            return d ? { dishId: d.id, name: d.name, emoji: d.emoji, price: d.price, qty: l.qty } : null;
          })
          .filter((x): x is NonNullable<typeof x> => x !== null);
        const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
        const order: Order = {
          id: uid(),
          code: pickupCode(),
          motherId: basketMotherId ?? '',
          items,
          subtotal,
          motherShare: Math.round((subtotal * PLATFORM_STATS.motherSharePercent) / 100),
          status: 'pending',
          pickupStart: slot.start,
          pickupEnd: slot.end,
          pickupLabel: slot.label,
          pickupDay: slot.day,
          note: note?.trim() || undefined,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          orders: [order, ...s.orders],
          basket: [],
          basketMotherId: null,
          mothers: s.mothers.map((m) => (m.id === order.motherId ? { ...m, ordersCount: m.ordersCount + 1 } : m)),
        }));
        return order;
      },
      setOrderStatus: (orderId, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)) })),

      sendMessage: (motherId, text) => {
        const msg: Message = { id: uid(), from: 'me', text: text.trim(), at: new Date().toISOString() };
        set((s) => ({ chats: { ...s.chats, [motherId]: [...(s.chats[motherId] ?? []), msg] } }));
        // محاكاة رد الأم في النسخة التجريبية
        const mother = get().mothers.find((m) => m.id === motherId);
        if (mother?.isMine) return;
        setTimeout(() => get().setTyping(motherId, true), 600);
        setTimeout(
          () => {
            get().setTyping(motherId, false);
            const reply = MOTHER_REPLIES[Math.floor(Math.random() * MOTHER_REPLIES.length)];
            get().receiveMessage(motherId, reply);
          },
          2200 + Math.random() * 1200
        );
      },
      receiveMessage: (motherId, text) => {
        const msg: Message = { id: uid(), from: 'mother', text, at: new Date().toISOString() };
        set((s) => ({ chats: { ...s.chats, [motherId]: [...(s.chats[motherId] ?? []), msg] } }));
      },
      setTyping: (motherId, typing) => set((s) => ({ typing: { ...s.typing, [motherId]: typing } })),

      registerChef: (profile) => {
        const motherId = 'me';
        const mother: Mother = {
          id: motherId,
          name: profile.name,
          kitchen: profile.kitchen,
          area: profile.area,
          bio: profile.bio,
          story: 'بدأت رحلتي على أبلة فهيدة النهارده. كل طلب بيوصلني هو خطوة لدخل أكبر لبيتي.',
          rating: 5,
          reviews: 0,
          ordersCount: 0,
          yearsCooking: 1,
          specialties: [],
          paletteIndex: 1,
          emoji: '👩‍🍳',
          openFrom: '11:00',
          openTo: '22:00',
          responseMinutes: 5,
          isMine: true,
        };
        set((s) => ({
          chef: { ...profile, motherId },
          mothers: [mother, ...s.mothers.filter((m) => m.id !== motherId)],
        }));
      },
      upsertDish: (dish) =>
        set((s) => {
          if (dish.id) {
            return { dishes: s.dishes.map((d) => (d.id === dish.id ? { ...d, ...dish, id: d.id } : d)) };
          }
          const created: Dish = { ...dish, id: uid(), motherId: 'me' };
          return { dishes: [created, ...s.dishes] };
        }),
      toggleDishAvailability: (dishId) =>
        set((s) => ({ dishes: s.dishes.map((d) => (d.id === dishId ? { ...d, available: !d.available } : d)) })),
      removeDish: (dishId) => set((s) => ({ dishes: s.dishes.filter((d) => d.id !== dishId) })),
    }),
    {
      name: 'abla-fahida-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        onboarded: s.onboarded,
        userName: s.userName,
        phone: s.phone,
        favorites: s.favorites,
        mothers: s.mothers,
        dishes: s.dishes,
        basketMotherId: s.basketMotherId,
        basket: s.basket,
        orders: s.orders,
        chats: s.chats,
        chef: s.chef,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);

/* ===== Selectors ===== */
// ملاحظة: في zustand v5 لازم المُحدِّد يرجّع مرجع ثابت، وإلا يحصل إعادة رسم لا نهائية.

const EMPTY_MESSAGES: Message[] = [];

export const useMother = (id: string | undefined) => useStore((s) => s.mothers.find((m) => m.id === id));

export const useDishesOf = (motherId: string | undefined) =>
  useStore(useShallow((s) => s.dishes.filter((d) => d.motherId === motherId)));

export const useChat = (motherId: string | undefined) =>
  useStore((s) => (motherId ? s.chats[motherId] : undefined) ?? EMPTY_MESSAGES);

export type BasketSummary = {
  lines: { line: BasketLine; dish: Dish }[];
  count: number;
  total: number;
  motherShare: number;
};

export function summarize(basket: BasketLine[], dishes: Dish[]): BasketSummary {
  const lines = basket
    .map((l) => ({ line: l, dish: dishes.find((d) => d.id === l.dishId) }))
    .filter((x): x is { line: BasketLine; dish: Dish } => !!x.dish);
  const count = lines.reduce((n, x) => n + x.line.qty, 0);
  const total = lines.reduce((n, x) => n + x.line.qty * x.dish.price, 0);
  return { lines, count, total, motherShare: Math.round((total * PLATFORM_STATS.motherSharePercent) / 100) };
}

/** ملخص السلة (عدد، إجمالي، نصيب الأم) بمرجع ثابت. */
export function useBasketSummary(): BasketSummary {
  const basket = useStore((s) => s.basket);
  const dishes = useStore((s) => s.dishes);
  return useMemo(() => summarize(basket, dishes), [basket, dishes]);
}

/** إجمالي ما ساهم به المستخدم في دخل الأمهات. */
export function myImpact(orders: Order[]) {
  const done = orders.filter((o) => o.status !== 'cancelled');
  const income = done.reduce((n, o) => n + o.motherShare, 0);
  const mothers = new Set(done.map((o) => o.motherId)).size;
  const meals = done.reduce((n, o) => n + o.items.reduce((k, i) => k + i.qty, 0), 0);
  return { income, mothers, meals, orders: done.length };
}
