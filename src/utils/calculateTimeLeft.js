export function calculateTimeLeft(bornDate) {
  const now = new Date();
  const gsatDate = getGSATSaturday(bornDate);
  const diff =  gsatDate - now;


  // Check if date is a valid date
  if (isNaN(gsatDate.getTime()) || now > gsatDate  || diff <= 0) {
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

function getGSATSaturday(inputDate) {
    const month = inputDate.getMonth() + 1; // getMonth() 返回 0-11，需加 1
    const year = inputDate.getFullYear();
    
    // 根據月份決定年份加 17 或 18
    const targetYear = month >= 9 ? year + 18 : year + 17;
    
    // 設置目標日期為該年份的 1 月 31 日
    const janLast = new Date(targetYear, 0, 31); // 0 表示 1 月
    
    // 找到 1 月最後一天是星期幾
    const lastDayOfJan = janLast.getDay(); // 0 (週日) 到 6 (週六)
    
    // 計算倒數第二個星期六
    // 1 月最後一天如果是星期六，則倒數第二個星期六是 1 月倒數 8 天
    // 如果最後一天是星期五，則倒數第二個星期六是倒數 7 天，以此類推
    const daysToSubtract = lastDayOfJan === 6 ? 8 : (15 - lastDayOfJan);
    const targetSaturday = new Date(targetYear, 0, 31 - daysToSubtract);
    
    return targetSaturday;
}

function getDateDifference(inputDate) {
    const now = new Date('2025-07-03T16:20:00'); // 當前時間：2025-07-03 16:20 CST
    const targetDate = getGSATSaturday(inputDate);
    
    // 計算時間差（毫秒）
    const diffMs = targetDate - now;
    
    // 轉換為天數
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    return {
        targetDate: targetDate.toLocaleDateString('zh-TW'), // 格式化日期
        daysDifference: diffDays
    };
}

// 示例
const date1 = new Date('2025-09-01');
const date2 = new Date('2025-08-31');