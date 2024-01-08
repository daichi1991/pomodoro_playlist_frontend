'use client';

import { useEffect, useState } from "react";

interface Props {
  workTime?: number;
  breakTime?: number;
  longBreakTime?: number;
  termCount?: number;
  termRepeatCount?: number;
  progress?: number;
}

export const TimeAllocationBar: React.FC<Props> = (props: Props) => {
  const { workTime, breakTime, longBreakTime, termCount, termRepeatCount, progress } = props;
  const [pomodoroOrder, setPomodoroOrder] = useState<{ 'mode': string, time: number }[]>([]);
  const [pomodoroAllocation, setPomodoroAllocation] = useState<{ 'mode': string, time: number, rate: number }[]>([]);
  const [sumTime, setSumTime] = useState<number>(0);

  const getBarColor = (mode: string) => {
    if (mode === 'work') {
      return 'bg-blue-700';
    }
    if (mode === 'break') {
      return 'bg-green-600';
    }
    if (mode === 'longBreak') {
      return 'bg-green-600';
    }
  }

  const getBarRound = (index: number, length: number) => {
    if (index === 0) {
      return 'rounded-l-full';
    }
    if (index === length - 1) {
      return 'rounded-r-full';
    }
    return '';
  }

  const getBarWidth = (rate: number) => {
    return `${rate * 100}%`;
  }

  const getBarStyle = (index: number, length: number) => {
    const style = {
      width: getBarWidth(pomodoroAllocation[index].rate),
    };
    return style;
  }

  const getBar = (index: number, length: number) => {
    const style = getBarStyle(index, length);
    const color = getBarColor(pomodoroAllocation[index].mode);
    const round = getBarRound(index, length);
    return (
      <div className={`h-3 ${color} ${round}`} style={style}></div>
    )
  }

  const getProgress = () => {
    if (!progress) return;
    const currentProgressRate = progress / sumTime * 100;
    return (
      <svg width="10" height="10" style={{ left: `calc(${currentProgressRate}% - 5px)` }} className="relative">
        <path d="M0 0 L10 0 L5 10 Z" style={{fill: "gray"}}></path>
      </svg>
    )
  }

  useEffect(() => {
    const firstBase = [];
    if (workTime) {
      firstBase.push({ mode: 'work', time: workTime });
    }
    if (breakTime) {
      firstBase.push({ mode: 'break', time: breakTime });
    }
    if (longBreakTime) {
      firstBase.push({ mode: 'longBreak', time: longBreakTime });
    }
    setPomodoroOrder(firstBase);
    const secoundBase:{mode:string, time:number}[] = [];
    if (termCount) {
      for (let i = 0; i < termCount; i++) {
        firstBase.forEach((base) => {
          if (base.mode === 'work') {
            secoundBase.push(base);
          }
          if (i < termCount - 1 && base.mode === 'break') {
            secoundBase.push(base);
          }
          if (i === termCount - 1 && base.mode === 'longBreak') {
            secoundBase.push(base);
          }
        });
      }
      setPomodoroOrder(secoundBase);
    }
    if (termRepeatCount) {
      const thirdBase:{mode:string, time:number}[] = [];
      for (let i = 0; i < termRepeatCount; i++) {
        secoundBase.forEach((base) => {
          thirdBase.push(base);
        });
      }
      setPomodoroOrder(thirdBase);
    }
  }, [breakTime, longBreakTime, termCount, termRepeatCount, workTime]);

  useEffect(() => {
    const sum = pomodoroOrder.reduce((prev, current) => {
      return prev + current.time;
    }, 0);
    setSumTime(sum);
    console.log(sum);
    const allocation = pomodoroOrder.map((order) => {
      return { mode: order.mode, time: order.time, rate: order.time / sum };
    });
    setPomodoroAllocation(allocation);
    console.log(allocation);
  }, [pomodoroOrder]);

  return (
    <div className="w-full">
      {getProgress()}
      <div className="w-full bg-gray-100 rounded-full h-3 dark:bg-gray-700 flex">
        {pomodoroAllocation.map((allocation, index) => {
          return getBar(index, pomodoroAllocation.length);
        })}
      </div>
      <div className="flex justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">0</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{sumTime / 60 / 1000}</div>
      </div>
    </div>
  )
}