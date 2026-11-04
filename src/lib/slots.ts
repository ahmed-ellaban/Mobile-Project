import { dayLabel, timeLabel } from './format';

export type PickupSlot = {
  id: string;
  start: string; // ISO
  end: string; // ISO
  label: string; // "من 2:00 م لـ 2:30 م"
  day: string; // النهارده / بكرة
};

const LEAD_MINUTES = 120; // الأكل البيتي محتاج وقت يتعمل
const OPEN_HOUR = 11;
const CLOSE_HOUR = 22;
const STEP = 30;

/**
 * مواعيد الاستلام المتاحة خلال اليوم. لو اليوم خلص، نعرض مواعيد بكرة.
 */
export function pickupSlots(now = new Date()): PickupSlot[] {
  let cursor = new Date(now.getTime() + LEAD_MINUTES * 60000);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(Math.ceil(cursor.getMinutes() / STEP) * STEP);
  if (cursor.getHours() < OPEN_HOUR) cursor.setHours(OPEN_HOUR, 0, 0, 0);

  let closing = new Date(cursor);
  closing.setHours(CLOSE_HOUR, 0, 0, 0);

  if (cursor >= closing) {
    cursor = new Date(now);
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(OPEN_HOUR, 0, 0, 0);
    closing = new Date(cursor);
    closing.setHours(CLOSE_HOUR, 0, 0, 0);
  }

  const slots: PickupSlot[] = [];
  while (cursor < closing && slots.length < 8) {
    const end = new Date(cursor.getTime() + STEP * 60000);
    slots.push({
      id: cursor.toISOString(),
      start: cursor.toISOString(),
      end: end.toISOString(),
      label: `${timeLabel(cursor)} - ${timeLabel(end)}`,
      day: dayLabel(cursor),
    });
    cursor = end;
  }
  return slots;
}
