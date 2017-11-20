'use strict';
const moment = require('moment');
const fs = require('fs');
const LOG_FORMAT = 'YYYY/MM/DD';
const OUTPUT_FORMAT = 'YYYY / MM / DD';

let log = {};

const readFromLogFile = (path) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    log = JSON.parse(data);
  });
};

const isExistFile = (path) => {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
  }
};

if (isExistFile('./log.txt')) {
  readFromLogFile('./log.txt');
}
let logging = false;
let startTime;

const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

reader.on('line', (line) => {
  switch(line) {
    case 's':
      if (!logging) startLogging();
      break;
    case 'e':
      if (logging) endLogging(startTime);
      break;
    case 'l':
      console.log('=====================');
      singleLog(moment());
      break;
    case 'lw':
      console.log('=====================');
      weekLog();
      break;
    default:
      console.log('登録されていないコマンドです');
      break;
  };
});

reader.on('close', () => {
  updateToLogFile('log.txt', JSON.stringify(log));
});

const updateToLogFile = (path, data) => {
  fs.writeFile(path, data, (err) => {
    if (err) throw err;
  });
};

const startLogging = () => {
  logging = true;
  startTime = moment();
  console.log(startTime.format('YYYY年MM月DD日 HH時mm分'));
  console.log('計測中です...');
};

const endLogging = (startTime) => {
  logging = false;
  const endTime = moment();

  let diff = endTime.diff(startTime);
  diff = Math.round(diff / 1000);

  let hours, minutes;
  if (diff < 60) {
    hours = 0;
    minutes = Math.round(diff / 60);
  } else {
    hours = Math.round(diff / (60 * 60));
    minutes = Math.round((diff - (hours * 60 * 60)) / 60);
  }

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

const calculateTotal = (date) => {
  let totalMinutes = 0
  log[date].forEach((value) => {
    totalMinutes += value.hours * 60 + value.minutes;
  })
  return {
    hours: (totalMinutes - totalMinutes % 60) / 60,
    minutes: totalMinutes % 60
  };
};

const calculateAverage = ({hours, minutes}, days) => {
  const totalMinutes = hours * 60 + minutes;
  return {
    hours: Math.round((((totalMinutes - totalMinutes % 60) / 60) / days) * 10) / 10,
    minutes: Math.round((totalMinutes % 60 / days) * 10) / 10
  };
};

const singleLog = (date) => {
  console.log(date.format(OUTPUT_FORMAT));
  if (log[date.format(LOG_FORMAT)]) {
    log[date.format(LOG_FORMAT)].forEach((line) => {
      console.log(`    ${line.startTime} - ${line.endTime}  : ${line.hours}h ${line.minutes}m`);
    });
    const total = calculateTotal(date.format(LOG_FORMAT));
    console.log(`合計 : ${total.hours}h ${total.minutes}m`);
    console.log('=====================');
  } else {
    console.log('    ログがありません');
    console.log('=====================');
  }
};

const weekLog = () => {
  const week = [];
  const total = {hours: 0, minutes: 0};
  for(let i = 0; i < 7; i++) {
    week.push(moment().subtract(i, 'days'));
  }
  week.forEach((date) => {
    console.log(date);
    singleLog(date);
    if (log[date.format(LOG_FORMAT)]) {
      log[date.format(LOG_FORMAT)].forEach((v) => {
        total.hours += v.hours;
        total.minutes += v.minutes;
      })
    }
  });
  console.log(`週合計稼働時間 : ${total.hours}h ${total.minutes}m`);
  const average = calculateAverage(total, 7);
  console.log(`週平均稼働時間 : ${average.hours}h ${average.minutes}m`);
}
