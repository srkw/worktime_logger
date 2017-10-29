'use strict';
const moment = require('moment');
const LOG_FORMAT = 'YYYY/MM/DD';
const OUTPUT_FORMAT = 'YYYY / MM / DD';

const today = moment().format(LOG_FORMAT);

const log = {};
let logging = false;
let startTime;

require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
}).on('line', (line) => {
  switch(line) {
    case 's':
      if (!logging) { startLogging() };
      break;
    case 'e':
      if (logging) { endLogging(startTime) };
      break;
    case 'l':
      console.log('=====================');
      singleLog(moment());
      // console.log(log);
      break;
    case 'l w':
      console.log('=====================');
      weekLog();
      break;
    default:
      console.log('登録されていないコマンドです');
      break;
  };
});

const startLogging = () => {
  logging = true;
  startTime = moment();
  console.log('計測中です...');
};

const endLogging = (startTime) => {
  logging = false;
  const endTime = moment();

  let diff = endTime.diff(startTime);
  diff = Math.round(diff / 1000);

  const hours = Math.round(diff / (60 * 60));
  const minutes = Math.round((diff - (hours * 60 * 60)) / 60);

  const date = moment().format(LOG_FORMAT);
  const result = {
    startTime: startTime.format('HH:mm'),
    endTime: endTime.format('HH:mm'),
    hours: hours,
    minutes: minutes
  };
  if (log[date]) {
    log[date].push(result);
  } else {
    log[date] = [result];
  }
  
  console.log('計測を終了しました');
};

const singleLog = (date) => {
  console.log(date.format(OUTPUT_FORMAT));
  if (log[date.format(LOG_FORMAT)]) {
    log[date.format(LOG_FORMAT)].forEach((line) => {
      console.log(`    ${line.startTime} - ${line.endTime}  : ${line.hours}h ${line.minutes}m`);
    });
    const total = calculateTotal(date.format(LOG_FORMAT));
    console.log(`total : ${total.hours}h ${total.minutes}m`);
    console.log('=====================');
  } else {
    console.log('ログがありません');
  }
  // TODO: 合計時間
};

const calculateTotal = (date) => {
  console.log(log[date]);
  let totalMinutes = 0
  log[date].forEach((value) => {
    totalMinutes += value.hours * 60 + value.minutes;
  })
  return {
    hours: (totalMinutes - totalMinutes % 60) / 60,
    minutes: totalMinutes % 60
  };
};

const weekLog = (date) => {
  const week = [];
  for(let i = 0; i < 7; i++) {
    week.push(date.subtract(i, 'days').format(LOG_FORMAT));
  }
  week.forEach((date) => {
    singleLog(date);
  });
  // TODO: 合計時間
  // TODO: 平均時間
}
