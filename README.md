# 数据库版万年历
公元1900-01-01至2099-12-31截止的日历信息，包含节气，数据库查询即可，无需天文等计算方式

## 环境

```
apache httpd + php 站点目录指向本目录
```

```
打开网页，运行网页版万年历（网页版万年历源于 寿星天文历(V5.10)许剑伟(福建莆田第十中学)保留版权）
例如：http://127.0.0.1/wnl.html
```

```
单击【月历】，单击【跑】，在web目录下，得到wnl.json，
内容为 公元1900-01-01 到 2099-12-31截止的日历信息
注：编辑该文件，在文件内容开始添加： 中括号左半边"["， 删除文件尾"," 逗号，文件末尾添加中括号右半边"]"
```
 
```
单击【年历】，输入【公元1899年】，【最多202年】，在web目录下，得到jq.json，
内容为 公元1899-1-1 到 2100-12-31截止的二十四节气信息，总计2423个节和交节时间
不用任何修改
``` 

```
创建nodejs运行环境，安装依赖
npm i datetime-helper
npm i better-sqlite3
```

```
运行js脚本db3.js，得到wnl.db3的sqlite3的数据库文件，
免去以天文计算等工具制作的日历的计算方式，直接数据库查询即可。
nodejs db3.js
重新生成数据库文件，请先删除wnl.db3文件，以免创建数据库失败。
```

## 数据库查询语句
```
例如
查询公历 1970年1月1日
select * from perpetual_calendar where gregorian_calendar = "1970,1,1";
查询农历 2020年闰4月20日
select * from perpetual_calendar where leap_month = "1" and gregorian_calendar = "1970,1,1";
```

## 数据表perpetual_calendar字段说明
```
gregorian_calendar,   公历 唯一索引
leap_month,           闰月 
lunar_calendar,       农历 （闰月+农历 组合索引）
year,                 年干支 （以0-59序号代表，初始甲子0，结束癸亥59）
month,                月干支
day,                  日干支
solar_term_name1,     节名 （二十四节气中的节名，以0-11序号代表，初始立春0，结束小寒11）
solar_term_datetime1, 交节时间 （二十四节气中的节的交节时间，值为unix time）
solar_term_name2,     节名
solar_term_datetime2, 交节时间
solar_term_name3,     节名
solar_term_datetime3  交节时间
注：三个节名和交接时间，分别是，当日的前一个节，当日现在所处的节，和当日的下一个节。
```
