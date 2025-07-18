import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import CountdownDisplay from "../components/CountdownDisplay";
import { calculateTimeLeft } from "../utils/calculateTimeLeft";

function Countdown() {
  const location = useLocation();
  const dateParam = new URLSearchParams(location.search).get("date");

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // 檢查日期是否有效
  if (!dateParam) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        無效日期
      </div>
    );
  }

  const targetDate = new Date(dateParam);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  // 監聽視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 每秒更新倒計時
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  let floatingWords;
  if (timeLeft.isEnded) {
    floatingWords = [
      "要不要準備重考?",
      "考這甚麼成績，你對得起我嗎",
      "辛苦供你上學就為了考成這樣?",
      "趕快去找補習班準備重考",
      "在這邊浪費我的錢不如趕快去工作賺錢",
      "怎麼在休息?指考快開始了不知道?",
    ];
  } else {
    floatingWords = [
      "學測都快到了，還不讀書?",
      "隔壁家3歲就開始準備學測，你呢?",
      "你有意識到距離學測還有多久嗎? 還在玩?",
      "要不開始準備重考?",
      "現在不讀書，以後有得是後悔",
    ];
  }
  // 使用 useMemo 儲存初始位置和速度，確保分佈均勻
  const wordPositions = useMemo(() => {
    if (windowSize.width === 0 || windowSize.height === 0) {
      return floatingWords.map(() => ({
        x: 0,
        y: 0,
        speedX: (Math.random() - 0.5) * 100,
        speedY: (Math.random() - 0.5) * 100,
      }));
    }

    return floatingWords.map((_, index) => {
      const maxWidth = 100; // 假設文字最大寬度
      const maxHeight = 50; // 假設文字最大高度
      // 均勻分佈初始位置，避免堆積
      const gridSize = Math.ceil(Math.sqrt(floatingWords.length));
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      return {
        x: ((col + Math.random()) * (windowSize.width - maxWidth)) / gridSize,
        y: ((row + Math.random()) * (windowSize.height - maxHeight)) / gridSize,
        speedX: (Math.random() - 0.1) * 100,
        speedY: (Math.random() - 0.1) * 100,
      };
    });
  }, [windowSize]);

  // 儲存 DOM 元素的參考
  const wordRefs = useRef(floatingWords.map(() => null));

  // 自定義動畫循環
  useEffect(() => {
    let animationFrameId;

    const updatePositions = () => {
      wordPositions.forEach((pos, index) => {
        const element = wordRefs.current[index];
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const deltaTime = 1 / 60; // 假設 60 FPS
        let newX = pos.x + pos.speedX * deltaTime;
        let newY = pos.y + pos.speedY * deltaTime;

        // 邊界檢查，基於文字左上角
        if (newX <= 0) {
          newX = 0;
          pos.speedX = -pos.speedX;
        } else if (newX + rect.width + 10 >= windowSize.width) {
          newX = windowSize.width - rect.width - 10;
          pos.speedX = -pos.speedX;
        }

        if (newY <= 0) {
          newY = 0;
          pos.speedY = -pos.speedY;
        } else if (newY + rect.height >= windowSize.height) {
          newY = windowSize.height - rect.height;
          pos.speedY = -pos.speedY;
        }

        pos.x = newX;
        pos.y = newY;

        // 更新位置，基於左上角
        element.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

        // 調試日誌，確認位置和尺寸
        // console.log(`Word ${index}: x=${newX}, y=${newY}, width=${rect.width}, height=${rect.height}`);
      });

      animationFrameId = requestAnimationFrame(updatePositions);
    };

    if (windowSize.width > 0 && windowSize.height > 0) {
      animationFrameId = requestAnimationFrame(updatePositions);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [windowSize, wordPositions]);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <div className="absolute inset-0 flex justify-center items-center z-10">
        {timeLeft.isEnded ? (
          <div className="text-center">
            <h1 className="text-4xl mb-4">恭喜考完</h1>
          </div>
        ) : (
          <CountdownDisplay timeLeft={timeLeft} />
        )}
      </div>
      {floatingWords.map((word, index) => (
        <motion.div
          key={index}
          className="absolute text-gray-400 text-2xl opacity-50 pointer-events-none"
          style={{
            maxWidth: "max-content",
            transform: `translate(${wordPositions[index].x}px, ${wordPositions[index].y}px)`,
            transformOrigin: "top left",
            left: 0,
            top: 0,
          }}
          ref={(el) => (wordRefs.current[index] = el)}
        >
          {word}
        </motion.div>
      ))}
      <div className="absolute bottom-0 right-0 p-4 text-gray-700 text-sm z-20">
        預設一月倒數第二個星期六
      </div>
    </div>
  );
}

export default Countdown;
