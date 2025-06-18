export function calculateTimeLeft(targetDate) {
  const start = new Date('2030-01-01T00:00:00');
  const now = new Date();
  const diff = now - target;

  // 检查日期是否无效或已结束
  if (isNaN(targetDate.getTime()) || now >= targetDate || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

  // 计算剩余时间
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isEnded: false };
}