'use strict';
const moment = require('moment');
const LOG_FORMAT = 'YYYY/MM/DD';
const OUTPUT_FORMAT = 'YYYY / MM / DD';

const today = moment().format(LOG_FORMAT);

// const log = {};
const log = {
  '2017/10/29': [
    'hoge',
    'huga',
    'piyo'
  ]
};
let logging = false;
let startTime;

require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
}).on('line', (line) => {
  switch(line) {
    case 's':
    case 'start':
      if (!startTime) { startLogging() };
      break;
    case 'e':
    case 'end':
      if (startTime) { endLogging() };
      break;
    case 'l':
    case 'log':
      console.log('=====================');
      singleLog(moment());
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
  // TODO: ログ開始処理
  console.log('計測中です...');
};

const endLogging = () => {
  logging = false;
  // TODO: ログ終了＋記録処理
  console.log('end');
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
