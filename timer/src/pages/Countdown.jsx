import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountdownDisplay from '../components/CountdownDisplay';
import { calculateTimeLeft } from '../utils/calculateTimeLeft';

function Countdown() {
  const location = useLocation();
  const dateParam = new URLSearchParams(location.search).get('date');
  
  // 检查日期是否有效
  if (!dateParam) {
    return <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">無效日期</div>;
  }

  const targetDate = new Date(dateParam);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    // 每秒更新倒计时
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // 清理定时器
    return () => clearInterval(timer);
  }, [targetDate]);

  const floatingWords = ['測試', '計時', 'Countdown'];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center relative overflow-hidden">
      {timeLeft.isEnded ? (
        <div className="text-center">
          <h1 className="text-4xl mb-4">計時結束</h1>
        </div>
      ) : (
        <CountdownDisplay timeLeft={timeLeft} />
      )}
      {floatingWords.map((word, index) => (
        <motion.div
          key={index}
          className="absolute text-gray-400 text-2xl opacity-50"
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          animate={{
            x: [Math.random() * 100, Math.random() * -100, Math.random() * 100],
            y: [Math.random() * 50, Math.random() * -50, Math.random() * 50],
          }}
          transition={{ repeat: Infinity, duration: 5 + Math.random() * 5 }}
        >
          {word}
        </motion.div>
      ))}
    </div>
  );
}

export default Countdown;