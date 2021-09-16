---
title: "neo4j基本概念"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR


---



### neo4j 基本概念





[参考学习教程](https://www.bilibili.com/video/BV1tM4y1g7fk?p=33&spm_id_from=pageDriver)



####  neo4j的数据模型

1. neo4j cql
2. 图数据库
3. 通过apache lucene 索引
4. 支持unique 约束
5. 包含一个用于执行 cql 命令的 UI： NEO4J 数据库浏览器
6. ACID 完整的特性
7. rest api ，任何编程语言都可以用
8. UI MVC 
9. 支持2种java api , cypher api 和 native java api









图数据库数据模型的主要构建块是：

- 节点
- 关系
- 属性



![image-20210916120055016](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_09_16_12_00_57image-20210916120055016.png)







![image-20210916122351584](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_09_16_12_23_53image-20210916122351584.png)







## java 操作代码



```java
@RelationshipEntity(type="WRITER_OF")
public class WriterOf extends AbstractEntity {
   @StartNode
   private Person writer;

   @EndNode
   private Book book;

   private Date startDate;
   private Date endDate;
   ……
}

@NodeEntity
public class Person extends NamedEntity {
   @Relationship(type="WRITER_OF")
   private Set<WriterOf> writings;

   @Relationship(type="READER_OF")
   private Set<Book> books;
   ……
}
```





![image-20210916132739239](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_09_16_13_27_41image-20210916132739239.png)



```mysql
select distinct 
a.from_name,
b.from_name,
c.from_name,
d.from_name,
e.from_name
from 
	star_relation a
left join star_relation b on a.from_name = b.from_name
left join star_relation c on b.from_name = c.from_name
left join star_relation d on c.from_name = d.from_name
left join star_relation e on d.from_name = e.from_name
where 
	a.from_name = '郭富城' AND e.from_name = '向华强'



```



使用 mysql 查询会有非常昂贵的代价， 是 4个笛卡尔积构成的

#### NEO4j查询

```cypher
return (:Star[name:"郭富城"])-[*..5]->(:Star{name:"向华强"})  limit 50
```



#### 关系型数据库的核心

- 节点
- 关系





####  练习

```cypher
create (:pig{name:"猪爷爷",age:15});
create (:pig{name:"猪奶奶",age:13})
// 创建了 猪爷爷和猪奶奶2个标签
// 创建关系
match (a:pig{name:"猪奶奶" }) match(a:pig{name:"猪爷爷" }) create(a)-[r:夫妻]->(b) return r;

create (:pig{name:"猪爸爸",age:12})-[:夫妻{age:5}]->(:pig{name:"猪妈妈",age:9});
match (a:pig{name:"猪爸爸"}) match(b:pig{name:"猪爷爷"}) create (b)-[r:父子]->(a) return r;
                                                                
```



![image-20210916134806092](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_09_16_13_48_06image-20210916134806092.png)





####  neo4j 修改操作

```cypher
match (n:pig{name:"猪妈妈"}) set n.age=8;
 
```



####  最短路径查询

```cypher
match p=allshortestpaths((a:Star{name:"郭富城"})-[*..5]->(b:Star{name:"向华强"}) ) return p;
```



#### 查找王菲的所有关系

```cypher
return (:Star{name:"王菲"}) -->() limit 50
```



####  其他的骚操作

```cypher
//创建多标签节点
create (a:pig:die{name:"猪祖夫",age:22}) return a.name;
//删除节点
m             
```





