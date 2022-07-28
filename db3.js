'use strict';

// require('datetime-helper');
const wnl = require('./wnl');
const jq = require('./jq');
const sqlite3 = require('better-sqlite3');
const dth = require('datetime-helper')
const db = new sqlite3('wnl.db3');

let createSql = 'CREATE TABLE IF NOT EXISTS perpetual_calendar (';
createSql += 'gregorian_calendar TEXT NOT NULL, ';
createSql += 'leap_month TEXT NOT NULL, ';
createSql += 'lunar_calendar TEXT NOT NULL, ';
createSql += 'year TEXT NOT NULL, ';
createSql += 'month TEXT NOT NULL, ';
createSql += 'day TEXT NOT NULL, ';
createSql += 'solar_term_name1 TEXT NOT NULL, ';
createSql += 'solar_term_datetime1 NUMERIC NOT NULL, ';
createSql += 'solar_term_name2 TEXT NOT NULL, ';
createSql += 'solar_term_datetime2 NUMERIC NOT NULL, ';
createSql += 'solar_term_name3 TEXT NOT NULL, ';
createSql += 'solar_term_datetime3 NUMERIC NOT NULL';
createSql += ');';

const tableIndexSql1 = 'CREATE UNIQUE INDEX idx_gregorian_calendar on perpetual_calendar (gregorian_calendar);';
const tableIndexSql2 = 'CREATE INDEX idx_lunar_calendar on perpetual_calendar (leap_month, lunar_calendar);';

db.prepare(createSql).run();
db.prepare(tableIndexSql1).run();
db.prepare(tableIndexSql2).run();

let insertSql = 'INSERT INTO perpetual_calendar ';
insertSql += '(gregorian_calendar, leap_month, lunar_calendar, year, month, day, solar_term_name1, solar_term_datetime1, solar_term_name2, solar_term_datetime2, solar_term_name3, solar_term_datetime3) ';
insertSql += 'VALUES';
insertSql += ' (@gregorian_calendar, @leap_month, @lunar_calendar, @year, @month, @day, @solar_term_name1, @solar_term_datetime1, @solar_term_name2, @solar_term_datetime2, @solar_term_name3, @solar_term_datetime3);';

const insert = db.prepare(insertSql);

const insertMany = db.transaction((wnl) => {
    for (const day of wnl) {
        try{
            insert.run(day);
        }catch(e){
            console.log(day);
        }
    }
});

const many = [];

for (let i = 0; i < wnl.length; i++) {
    let jq = getJieQi(wnl[i].gl);
    if (jq.length === 0) {
        break;
    }
    many.push({
        gregorian_calendar: wnl[i].gl,
        leap_month: wnl[i].ry,
        lunar_calendar: wnl[i].nl,
        year: getGanZhiOrder(wnl[i].ngz),
        month: getGanZhiOrder(wnl[i].ygz),
        day: getGanZhiOrder(wnl[i].rgz),
        solar_term_name1: getJieQiMingOrder(jq[0]),
        // solar_term_datetime1: jq[1].getUnixTimeSec(),
        solar_term_datetime1: dth.getUnixTimeSec(jq[1]),
        solar_term_name2: getJieQiMingOrder(jq[2]),
        // solar_term_datetime2: jq[3].getUnixTimeSec(),
        solar_term_datetime2: dth.getUnixTimeSec(jq[3]),
        solar_term_name3: getJieQiMingOrder(jq[4]),
        // solar_term_datetime3: jq[5].getUnixTimeSec()
        solar_term_datetime3: dth.getUnixTimeSec(jq[5])
    });
}

insertMany(many);

function getJieQi(x) {
    let result = [];
    let a1 = x.split(',');
    let a1_0 = a1[0], a1_1 = '0' + a1[1], a1_2 = '0' + a1[2];
    let a2 = a1_0 + '-' + a1_1.substr(a1_1.length - 2, 2) + '-' + a1_2.substr(a1_2.length - 2, 2);
    // let a3 = new Date(a2).getUnixTimeSec();
    let a3 = dth.getUnixTimeSec(new Date(a2));

    for (let jqinfo = jq.jq, j = 0; j < jqinfo.length; j++) {
        if (j + 1 === jqinfo.length) break;
        let a4 = jqinfo[j].split(' ');
        let a5 = jqinfo[j + 1].split(' ');
        // let a6 = a4[1].getUnixTimeSec();
        // let a7 = a5[1].getUnixTimeSec();
        let a6 = dth.getUnixTimeSec(a4[1]);
        let a7 = dth.getUnixTimeSec(a5[1]);
        if (a3 >= a6 && a3 < a7) {
            let tmpStr = jqinfo[j - 1] + ' ' + jqinfo[j] + ' ' + jqinfo[j + 1];
            let tmpArr = tmpStr.split(' ');
            result = [
                tmpArr[0],
                tmpArr[1] + ' ' + tmpArr[2],
                tmpArr[3],
                tmpArr[4] + ' ' + tmpArr[5],
                tmpArr[6],
                tmpArr[7] + ' ' + tmpArr[8]
            ];
            break;
        }
    }
    return result;
}

function getGanZhiOrder(x) {
    if (x === '甲子') return "0";
    if (x === '乙丑') return "1";
    if (x === '丙寅') return "2";
    if (x === '丁卯') return "3";
    if (x === '戊辰') return "4";
    if (x === '己巳') return "5";
    if (x === '庚午') return "6";
    if (x === '辛未') return "7";
    if (x === '壬申') return "8";
    if (x === '癸酉') return "9";
    if (x === '甲戌') return "10";
    if (x === '乙亥') return "11";
    if (x === '丙子') return "12";
    if (x === '丁丑') return "13";
    if (x === '戊寅') return "14";
    if (x === '己卯') return "15";
    if (x === '庚辰') return "16";
    if (x === '辛巳') return "17";
    if (x === '壬午') return "18";
    if (x === '癸未') return "19";
    if (x === '甲申') return "20";
    if (x === '乙酉') return "21";
    if (x === '丙戌') return "22";
    if (x === '丁亥') return "23";
    if (x === '戊子') return "24";
    if (x === '己丑') return "25";
    if (x === '庚寅') return "26";
    if (x === '辛卯') return "27";
    if (x === '壬辰') return "28";
    if (x === '癸巳') return "29";
    if (x === '甲午') return "30";
    if (x === '乙未') return "31";
    if (x === '丙申') return "32";
    if (x === '丁酉') return "33";
    if (x === '戊戌') return "34";
    if (x === '己亥') return "35";
    if (x === '庚子') return "36";
    if (x === '辛丑') return "37";
    if (x === '壬寅') return "38";
    if (x === '癸卯') return "39";
    if (x === '甲辰') return "40";
    if (x === '乙巳') return "41";
    if (x === '丙午') return "42";
    if (x === '丁未') return "43";
    if (x === '戊申') return "44";
    if (x === '己酉') return "45";
    if (x === '庚戌') return "46";
    if (x === '辛亥') return "47";
    if (x === '壬子') return "48";
    if (x === '癸丑') return "49";
    if (x === '甲寅') return "50";
    if (x === '乙卯') return "51";
    if (x === '丙辰') return "52";
    if (x === '丁巳') return "53";
    if (x === '戊午') return "54";
    if (x === '己未') return "55";
    if (x === '庚申') return "56";
    if (x === '辛酉') return "57";
    if (x === '壬戌') return "58";
    if (x === '癸亥') return "59";
}

function getJieQiMingOrder(x) {
    if (x === '立春') return "0";
    if (x === '惊蛰') return "1";
    if (x === '清明') return "2";
    if (x === '立夏') return "3";
    if (x === '芒种') return "4";
    if (x === '小暑') return "5";
    if (x === '立秋') return "6";
    if (x === '白露') return "7";
    if (x === '寒露') return "8";
    if (x === '立冬') return "9";
    if (x === '大雪') return "10";
    if (x === '小寒') return "11";
}