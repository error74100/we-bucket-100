export const calculateDate = (startDate, daysToAdd) => {
  // startDate를 Date 객체로 변환
  const date = new Date(startDate);

  // 주어진 일수를 날짜에 더함
  date.setDate(date.getDate() + daysToAdd - 1);

  // 날짜를 원하는 형식으로 포맷
  let year = date.getFullYear();
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);

  // 요일 계산
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  let dayOfWeek = daysOfWeek[date.getDay()];

  // 포맷된 날짜 반환
  return `${year}.${month}.${day}(${dayOfWeek})`;
};
