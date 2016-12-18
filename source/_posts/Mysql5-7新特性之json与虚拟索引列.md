title: Mysql5.7新特性之json与虚拟索引列
date: 2016-04-13 22:40:02
categories: 技术
tags: [mysql,json]
toc: true
---
# 1.整体介绍
> 最近公司在搞一个项目，感觉mysql5.7的json非常适合这个项目场景，但是对这个新特性没有一个深入的了解，于是便让我对Mysql5.7进行一个性能上的测试，其目的就是为了核实两个场景：
> - 在相同数据量的情况下，json字段与普通字段对聚合函数操作性能上的差异
> - 在相同数据量的情况下，虚拟索引列与普通二级索引列查询性能上的差异想

先来看一下DDL:
``` python
CREATE TABLE ding_ding
(
id bigint NOT NULL AUTO_INCREMENT,
appId INT NOT NULL,
amount BIGINT NOT NULL,
accountDate DATE NOT NULL,
mobile varchar(128) not null,
instValue json not null,
PRIMARY KEY (id),
INDEX index_appId (appId),
INDEX index_accountDate (accountDate),
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

<!--more-->

插入数据：
``` python
INSERT INTO ding_ding (id, appId, amount, accountDate, mobile, instValue) VALUES (1, 2, 858, '2016-03-14', '15002232698', '{"appId": 2, "amount": 858, "mobile": "15002232698", "accountDate": 1457969652057}');
INSERT INTO ding_ding (id, appId, amount, accountDate, mobile, instValue) VALUES (2, 3, 254, '2016-01-16', '15002232690', '{"appId": 3, "amount": 254, "mobile": "15002232690", "accountDate": 1452959310695}');
........
```
分别为instValue字段的appId和accountDate创建虚拟列以及二级索引：
``` python
ALTER TABLE ding_ding ADD virtualAppId int GENERATED ALWAYS AS (json_extract(instValue,'$.appId')) VIRTUAL;
ALTER TABLE ding_ding ADD index index_virtual_appId (virtualAppId);
ALTER TABLE ding_ding ADD virtualAccountDate date GENERATED ALWAYS AS (from_unixtime(instValue->"$.accountDate"/1000)) VIRTUAL;
ALTER TABLE ding_ding ADD index index_virtual_accountDate (virtualAccountDate);
```
好，大功告成！下面要对以上几点进行解析,分别是：
1. mysql5.7的json类型字段
2. generated column是什么
3. virtual index column
5. 性能测试数据表
6. 题外话，generated column上创建索引与Oracle的函数索引的区别

# 2.mysql5.7的json类型字段
在mysql5.7以后，新增了对json数据类型的支持，这个特性真的是让人振奋人心，本来mysql是传统的关系型数据库，这次有了json支持，我个人感觉真的可以秒杀所有nosql了！一大堆文档数据库们已经哭晕在厕所有木有！
下面来看一下官方给出的json特性：
- JSON数据有效性检查：BLOB类型无法在数据库层做这样的约束性检查
- 查询性能的提升：查询不需要遍历所有字符串才能找到数据
- 支持索引：通过虚拟列的功能可以对JSON中的部分数据进行索引

# 3.generated column是什么
generated column是MySQL 5.7引入的新特性，所谓generated column，就是数据库中这一列由其他列计算而得，我们以官方参考手册中的例子予以说明。
例如：对于直角三角形来说，a²+b²=c²。很明显，只要知道a和b，就可以算出c，这时候数据库里只存放a和b，斜边c使用generated column
``` python
CREATE TABLE triangle (
  sidea DOUBLE,
  sideb DOUBLE,
  sidec DOUBLE AS (SQRT(sidea * sidea + sideb * sideb))
);
INSERT INTO triangle (sidea, sideb) VALUES(1,1),(3,4),(6,8);
```
查询结果：
``` python
mysql> SELECT * FROM triangle;
+-------+-------+--------------------+
| sidea | sideb | sidec              |
+-------+-------+--------------------+
|     1 |     1 | 1.4142135623730951 |
|     3 |     4 |                  5 |
|     6 |     8 |                 10 |
+-------+-------+--------------------+
```
官方给出使用generated column的好处：
> Stored generated columns can be used as a materialized cache for complicated conditions that are costly to calculate on the fly.
> 我理解的意思就是generated column可以极大提升复杂条件计算出来的列的性能

有了上述理解，我们可以更好的理解项目中这句话：
``` python
ALTER TABLE ding_ding ADD virtualAccountDate date GENERATED ALWAYS AS (from_unixtime(instValue->"$.accountDate"/1000)) VIRTUAL;
```
这里的<font color='red'><b>GENERATED ALWAYS AS</b></font>的意思就是说以后每次插入的新数据，都是通过规则将virtualAccountDate列计算出来的，在这里是通过获取json字段类型key为accountDate的数据

# 4.virtual index column
除了mysql5.7对json特性支持以外，另一个让人振奋人心的莫过于新增了虚拟列的这样一个东西。
顾名思义，virtual column就是一个虚拟列，在MySQL 5.7中，支持两种generated column，即virtual generated column和stored generated column，前者只将generated column保存在数据字典中（表的元数据），并不会将这一列数据持久化到磁盘上；后者会将generated column持久化到磁盘上，而不是每次读取的时候计算所得。很明显，后者存放了可以通过已有数据计算而得的数据，需要更多的磁盘空间，与virtual column相比并没有优势，因此，MySQL 5.7中，不指定generated column的类型，默认是virtual column。此外
- stored generated column性能较差
- 如果需要stored generated column的话，可能在generated column上建立索引更加合适
知道了什么是虚拟列，那么虚拟索引列当然是虚拟列加上索引喽！当然了，虚拟索引列也是通过传统的B+树索引即可实现对JSON格式部分属性的快速查询。使用方法是首先创建该虚拟列，然后在该虚拟列上创建索引：
``` python
ALTER TABLE ding_ding ADD virtualAppId int GENERATED ALWAYS AS (json_extract(instValue,'$.appId')) VIRTUAL;
ALTER TABLE ding_ding ADD index index_virtual_appId (virtualAppId);
```
下面看一下官方文档对virtual和stored解释：
- VIRTUAL : Column values are not stored, but are evaluated when rows are read, immediately after any BEFORE triggers.
列值不存储，而是被读取行时进行评估，之后立即用 BEFORE触发器。虚拟列不带存储。
- STORED : Column values are evaluated and stored when rows are inserted or updated.
列值进行评估，并行被插入或更新时存储。存放的列确实需要的存储空间，并可以被索引。
> 友情提示：
> - 在MySQL 5.7.8之前，虚拟列不能建立索引。在MySQL 5.7.8，InnoDB的支持在虚拟列辅助索引
> - json类型字段不支持直接索引
> - 虚拟索引列只支持二级索引，其它的索引类型不支持
> - 虚拟索引列不能被当做一个外键来使用
> - 添加或在虚拟列删除一个辅助索引是就地操作。 Adding or dropping a secondary index on a virtual column is an in-place operation.

# 5.性能测试数据表
下面是在20W/100W/500W数据的情况下，json字段与普通字段对聚合函数操作性能上的差异
![sum](Mysql5.7新特性之json与虚拟索引列/SUM.jpeg)
![count](Mysql5.7新特性之json与虚拟索引列/COUNT.jpeg)
![COUNT(DISTICT)](Mysql5.7新特性之json与虚拟索引列/COUNT_DISTICT.jpeg)
![MAX](Mysql5.7新特性之json与虚拟索引列/MAX.jpeg)
![MIN](Mysql5.7新特性之json与虚拟索引列/MIN.jpeg)
![AVG](Mysql5.7新特性之json与虚拟索引列/AVG.jpeg)
![virtual_index](Mysql5.7新特性之json与虚拟索引列/virtual_index.jpeg)

> 上面的测试结果也验证了之前的两个场景：
> mysql5.7上，在相同数据量的情况下，虚拟索引和普通索引查询效率基本一致
> 在大数据量情况下不推荐用聚合函数计算json数据，但是如果json key建立了虚拟列，可以对该虚拟列进行聚合操作，效率跟普通列一样

我们可以发现，对于有些业务比如根据日期范围汇总金额的这种场景，在json里key为amount的情况下，我们可以把amount单独建立一个虚拟列virtualAmount，然后做汇总的时候使用sum(virtualAmount)，效率要比直接使用sum(json->"$.amount")大得多！

# 6.题外话，generated column上创建索引与Oracle的函数索引的区别
介绍完MySQL在generated column上的索引，熟悉Oracle的同学这时候可能会想起Oracle的函数索引，在MySQL的generated column列上建立索引与Oracle的函数索引比较类似，又有所区别：
例如，我们有一张表，如下所示：
``` python
CREATE TABLE t1 (first_name VARCHAR(10), last_name VARCHAR(10));
Query OK, 0 rows affected (0.11 sec)
```
假设这时候需要建一个full_name的索引，在Oracle中，我们可以直接在创建索引的时候使用函数，如下所示：
``` python
alter table t1 add index full_name_idx(CONCAT(first_name,' ',last_name));
```
但是，上面这条语句在MySQL中就会报错。在MySQL中，我们可以先新建一个generated column，然后再在这个generated column上建索引，如下所示：
``` python
mysql> alter table t1 add column full_name VARCHAR(255) GENERATED ALWAYS AS (CONCAT(first_name,' ',last_name));
mysql> alter table t1 add index full_name_idx(full_name);
```
乍一看，MySQL需要在表上增加一列，才能够实现类似Oracle的函数索引，似乎代价会高很多。但是，我们在第2部分说过，对于virtual generated column，MySQL只是将这一列的元信息保存在数据字典中，并不会将这一列数据持久化到磁盘上，因此，在MySQL的virtual generated column上建立索引和Oracle的函数索引类似，并不需要更多的代价，只是使用方式有点不一样而已。
