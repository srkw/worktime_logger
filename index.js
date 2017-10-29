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
    case 'start':
      console.log(startTime);
      if (!logging) { startLogging() };
      break;
    case 'e':
    case 'end':
      if (logging) { endLogging(startTime) };
      break;
    case 'l':
    case 'log':
      // console.log('=====================');
      // singleLog(moment());
      console.log(log);
      break;
    case 'l w':
    case 'log w':
    case 'log week':
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

  diff = `${hours}:${minutes}`;

  const date = moment().format(LOG_FORMAT);
  const result = {
    startTime: startTime.format('HH:mm'),
    endTime: endTime.format('HH:mm'),
    diff: diff
  }
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
      console.log(line);
    });
    console.log('=====================');
  } else {
    console.log('ログがありません');
  }
  // TODO: 合計時間
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
