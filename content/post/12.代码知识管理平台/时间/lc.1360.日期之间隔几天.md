---
title: "lc.1360.日期之间隔几天"
date: 2021-08-14T22:42:48+08:00
draft: false


---







### [1360\. 日期之间隔几天](https://leetcode-cn.com/problems/number-of-days-between-two-dates/)

Difficulty: **简单**


请你编写一个程序来计算两个日期之间隔了多少天。

日期以字符串形式给出，格式为 `YYYY-MM-DD`，如示例所示。

**示例 1：**

```
输入：date1 = "2019-06-29", date2 = "2019-06-30"
输出：1
```

**示例 2：**

```
输入：date1 = "2020-01-15", date2 = "2019-12-31"
输出：15
```

**提示：**

*   给定的日期是 `1971` 年到 `2100` 年之间的有效日期。


#### Solution

Language: ****









```cpp
class Solution {
public:
    int daysBetweenDates(string date1, string date2) {
        return abs(getDay(date1) - getDay(date2));
    }

    inline bool isLeapYear(int y) {
        return (  0 == y%4 && y%100) || (0 == y%400);
    }
     int m_days[13] = {0,31,28,31,30,31,30,31,31,30,31,30,31};
    int getDay(string & w) {
        int  y,  month,   day;
        sscanf(w.c_str(),"%d-%d-%d", &y , &month, &day);
        int days = 0;
        for(int i=1971;i<y;++i) {
            days += 365 + isLeapYear(i);
        }
       
        for(int i=1;i<month;++i) {
            if(i == 2) days += 28 + isLeapYear(y);
            else days += m_days[i];
        }
        return days + day;
    }
};
```







###  调api方法



```java
import java.time.*;
import java.time.temporal.ChronoUnit;
class Solution {
    public int daysBetweenDates(String date1, String date2) {
        return (int)Math.abs(LocalDate.parse(date1).until(LocalDate.parse(date2),ChronoUnit.DAYS));
    }
}
```

