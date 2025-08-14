import {
  addDays,
  addYears,
  differenceInCalendarDays,
  set,
} from 'date-fns';

// 커플 디데이 조회 (경과일)
export function getDDay(anniversary: Date): number {
  const today = new Date();
  return differenceInCalendarDays(today, anniversary);
}

// 남은 일수 계산
export function getDays(date: Date): number {
  const today = new Date();
  return differenceInCalendarDays(date, today);
}

// 다가오는 기념일 조회
export function getUpcomingAnniversary(dday: number, anniversary: Date) {
  const nextHundred = Math.ceil(dday / 100) * 100;
  const hundredDiff = nextHundred - dday;
  const nextHundredDate = addDays(anniversary, nextHundred);

  const nextYear = Math.ceil(dday / 365);
  const yearDiff = nextYear * 365 - dday;
  const nextYearDate = addYears(anniversary, nextYear);

  if (hundredDiff < yearDiff) {
    return {
      id: 1,
      type: `${nextHundred}일`,
      days: hundredDiff,
      date: nextHundredDate,
    };
  } else {
    return {
      id: 1,
      type: `${nextYear}주년`,
      days: yearDiff,
      date: nextYearDate,
    };
  }
}

// 생일 디데이 조회
export function getDaysToNextBirthday(birthday: Date) {
  const today = new Date();

  // 올해 생일 날짜 생성
  const nextBirthday = set(birthday, {
    year: today.getFullYear(),
  });

  // 오늘 이후가 아니면 내년 생일로
  const finalBirthday =
    nextBirthday < today ? addYears(nextBirthday, 1) : nextBirthday;

  const days = differenceInCalendarDays(finalBirthday, today);

  return {
    days,
    date: finalBirthday,
  };
}