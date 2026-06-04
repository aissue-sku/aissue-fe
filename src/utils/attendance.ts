const KEY = 'aissue_attendance';

export const getDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getTodayDateKey = (): string => getDateKey(new Date());

export const getAttendance = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

export const markAttendance = (dateKey: string = getTodayDateKey()): void => {
  const list = getAttendance();
  if (!list.includes(dateKey)) {
    list.push(dateKey);
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {}
  }
};

// 이번 주(월~일) 날짜 7개 반환
export const getThisWeekDates = (): Date[] => {
  const today = new Date();
  const day = today.getDay(); // 0(일) ~ 6(토)
  const diff = day === 0 ? -6 : 1 - day; // 월요일로 보정
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};
