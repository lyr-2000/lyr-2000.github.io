---
title: "sql注入漏洞"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



## 举个例子



```sql
select * from test where name = 'test' and '1' = '1'

# 程序的输入参数是  : test' and '1' = '1 
# 技巧总结：  test' and '1' = '1'  --action=search
```

### SQL 注入的不同类型







### 时间盲注的用法



通过注入特定语句，根据对页面请求的物理反馈，来判断是
否注入成功，如：在SQL语句中使用 sleep 函数看加载网页
的时间来判断注入点。
适用场景：通常是无法从显示页面上获取执行结果，甚至连
注入语句是否执行都无从得知。

例如

```sql
select * from user where id = '?'

select * from user  where id = '4' and sleep(3) -- "

```





![image-20210822170030367](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_22_17__00_32image-20210822170030367.png)



