import { useState, useMemo } from 'react';
import { buildCalendarGrid, toISODate } from '../lib/appUtils';

export function useCalendar() {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const grid = useMemo(() => buildCalendarGrid(year, month), [year, month]);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const todayISO = toISODate(today);

  return { year, month, grid, prevMonth, nextMonth, todayISO };
}
