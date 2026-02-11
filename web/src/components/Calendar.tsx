import React, { useMemo } from 'react';
import { dowForJstNoon, getTodayYmdJst, ymdToDayNumJst } from '../lib/date';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function ymdOf(year: number, month0: number, day: number): string {
  return `${year}-${pad2(month0 + 1)}-${pad2(day)}`;
}

export function Calendar({
  cursorYear,
  cursorMonth0,
  fromYmd,
  toYmd,
  videoDates,
  onChangeCursor,
  onPickDay,
}: {
  cursorYear: number;
  cursorMonth0: number;
  fromYmd: string | null;
  toYmd: string | null;
  videoDates: Set<string>;
  onChangeCursor: (year: number, month0: number) => void;
  onPickDay: (ymd: string) => void;
}) {
  const todayYmd = getTodayYmdJst();

  const cells = useMemo(() => {
    const y = cursorYear;
    const m = cursorMonth0;
    const firstYmd = ymdOf(y, m, 1);
    const firstDow = dowForJstNoon(firstYmd); // 0..6

    const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    const daysInPrevMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();

    const fromNum = fromYmd ? ymdToDayNumJst(fromYmd) : null;
    const toNumRaw = toYmd ? ymdToDayNumJst(toYmd) : null;
    const toNum = toNumRaw ?? fromNum;
    const a = fromNum != null && toNum != null ? Math.min(fromNum, toNum) : null;
    const b = fromNum != null && toNum != null ? Math.max(fromNum, toNum) : null;

    const out: Array<{
      ymd: string;
      day: number;
      isOther: boolean;
      cls: string;
    }> = [];

    for (let i = 0; i < 42; i++) {
      const n = i - firstDow + 1;
      let day = n;
      let yy = y;
      let mm = m;
      let isOther = false;

      if (day <= 0) {
        isOther = true;
        mm = m - 1;
        if (mm < 0) {
          mm = 11;
          yy = y - 1;
        }
        day = daysInPrevMonth + day;
      } else if (day > daysInMonth) {
        isOther = true;
        mm = m + 1;
        if (mm > 11) {
          mm = 0;
          yy = y + 1;
        }
        day = day - daysInMonth;
      }

      const ymd = ymdOf(yy, mm, day);
      const num = ymdToDayNumJst(ymd);

      const isFrom = fromYmd === ymd;
      const isTo = toYmd === ymd;
      const inRange = a != null && b != null && num != null && num >= a && num <= b;
      const isToday = ymd === todayYmd;
      const hasVideo = videoDates.has(ymd);

      const cls = [
        'day',
        isOther ? 'other' : '',
        inRange ? 'in' : '',
        isFrom ? 'from' : '',
        isTo ? 'to' : '',
        isToday ? 'today' : '',
        hasVideo ? 'hasVideo' : '',
      ]
        .filter(Boolean)
        .join(' ');

      out.push({ ymd, day, isOther, cls });
    }

    return out;
  }, [cursorYear, cursorMonth0, fromYmd, toYmd, videoDates, todayYmd]);

  const monthLabel = `${cursorYear}年${cursorMonth0 + 1}月`;

  return (
    <div className="calWrap" aria-label="日付範囲">
      <div className="calHeader">
        <button
          className="btn"
          type="button"
          onClick={() => {
            let m = cursorMonth0 - 1;
            let y = cursorYear;
            if (m < 0) {
              m = 11;
              y -= 1;
            }
            onChangeCursor(y, m);
          }}
        >
          ◀
        </button>
        <span className="mono" id="calLabel">
          {monthLabel}
        </span>
        <button
          className="btn"
          type="button"
          onClick={() => {
            let m = cursorMonth0 + 1;
            let y = cursorYear;
            if (m > 11) {
              m = 0;
              y += 1;
            }
            onChangeCursor(y, m);
          }}
        >
          ▶
        </button>
      </div>

      <div className="calGrid" role="grid">
        {['日', '月', '火', '水', '木', '金', '土'].map((d) => (
          <div key={d} className="dow" role="columnheader">
            {d}
          </div>
        ))}

        {cells.map((c) => (
          <button
            key={c.ymd}
            type="button"
            className={c.cls}
            role="gridcell"
            title={c.ymd}
            onClick={() => {
              // When user clicks a day in other month, update cursor first.
              if (c.isOther) {
                const yy = Number(c.ymd.slice(0, 4));
                const mm = Number(c.ymd.slice(5, 7)) - 1;
                onChangeCursor(yy, mm);
              }
              onPickDay(c.ymd);
            }}
          >
            <span>{c.day}</span>
            <span className="dot" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
