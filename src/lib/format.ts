/** تنسيق السعر بالجنيه المصري. */
export function egp(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('en-EG')} ج.م`;
}

/** رقم مختصر للعدادات: 1,240 أو 12.5 ألف */
export function compact(n: number): string {
  if (n >= 1_000_000) return `${trim(n / 1_000_000)} مليون`;
  if (n >= 1000) return `${trim(n / 1000)} ألف`;
  return n.toLocaleString('en-EG');
}

function trim(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(v < 10 ? 2 : 1).replace(/\.?0+$/, '');
}

const AR_DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function timeLabel(date: Date): string {
  let h = date.getHours();
  const m = date.getMinutes();
  const period = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${period}`;
}

export function dayLabel(date: Date): string {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (sameDay(date, today)) return 'النهارده';
  if (sameDay(date, tomorrow)) return 'بكرة';
  return AR_DAYS[date.getDay()];
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'دلوقتي';
  if (min < 60) return `من ${min} د`;
  const h = Math.floor(min / 60);
  if (h < 24) return `من ${h} س`;
  return dayLabel(new Date(iso));
}

/** تحية مناسبة لوقت اليوم. */
export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'صباح الفل';
  if (h < 17) return 'نهارك سعيد';
  return 'مساء الخير';
}
