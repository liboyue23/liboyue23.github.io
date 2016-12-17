title: Guava库介绍之集合相关的API
date: 2016-03-31 19:28:25
categories: 技术
tags: [Guava,工具]
toc: true
---
# 1.一些小功能
## 集合声明更简单
Java中同质的范型集合是一个很大的特色，但是有些时候他们的构造函数有点太啰嗦了，比如：
``` python
Map<String, Map<String, Integer>> lookup = new HashMap<String, Map<String, Integer>>();
```
在Java 7中通过钻石操作符<>来允许有限的非正式的类型推导。上面的例子可以这样写：
``` python
Map<String, Map<String, Integer>> lookup = new HashMap<>();
```
Guava提供了一些使用范型来进行右侧类型推导的静态函数，使得集合的声明更简单,上面的例子可以这么写：

<!--more-->

``` python
Map<String, Map<String, String>> map = Maps.newHashMap();
List<List<Map<String, String>>> list = Lists.newArrayList();
```
## 集合初始化更简单
``` python
Set<String> set = Sets.newHashSet("one", "two", "three");
Map<String, String> map = ImmutableMap.of("ON", true, "OFF", false);
```

# 2.不可变性(Immutability)
大部分Google提供的集合都提供不可变的版本。
当你不会修改一个集合，或者期望一个集合是固定不变的，那么一个很好的习惯是防御式地把它拷贝成一个不可变的集合。

注意
> Guava中提供的不可变集合的实现是不允许有空值`null`的。因为通过研究Google内部代码库发现在集合中，只有5%的情况下是允许有空值的，剩下的95%情况下最好是遇到空值就快速失败(failing fast)。如果需要空值，可以使用JDK中提供的 Collections.unmodifiableList 这类允许空值的集合实现。

更多关于使用或者避免使用null的细节见Using And Avoiding Null Explained

不可变的好处：
- 可以放心的给不信任的库使用
- 线程安全:可以被多个线程使用而不会有竞争条件发生
- 不需要同步(synchronization)的逻辑，不需要支持互斥
- 设计和实现很简单。所有不可变的集合实现比可变版本的内存效率要高，分析见这里

### 如何使用
有多种方法来得到一个不可变的集合：
1. 使用of函数
``` python
ImmutableSet<Integer> numbers = ImmutableSet.of(10, 30, 40, 50);
```
2. 使用copyOf函数
``` python
ImmutableSet<Integer> another = ImmutableSet.copyOf(numberSet);
```

所有不可变的集合都通过asList()提供了一个不可变的List(ImmutableList)视图。例如数据存储在一个ImmutableSortedSet里，可以通过sortedSet.asList().get(k)来获得第k个最小的元素。
JDK虽然提供了Collections.unmodifiableXXX方法，但是有一些问题：
- 非常笨重，使用起来很啰嗦，用着不爽
- 不安全：只有当没有对原始集合的引用时，这个函数返回的集合才是真的不可变的
- 不够高效：数据结构里还是有可变集合里关于并发修改的检查，存储哈希表的额外空间等。

# 3.新的集合类型
Guava引入的新的集合类型并没有暴露原始的构造函数，或者提供方便初始化操作的工具类，而是直接使用静态工厂函数，例如：
``` python
MultiMap<String, Integer> multiMap = HashMultiMap.create();
```
如果想让Value排序，可以使用SortedMultiSet
## MultiMap
容许一个key有多个值的MultiMap, MultiMap<K, V>可以取代传统的Map<K, Collection<V>>。也可以使用值为链表的ListMultiMap或者集合SetMultiMap。
## Multiset
Multiset支持添加多次相同的值，支持对值进行计数。
``` python
Multiset<Integer> multiSet = HashMultiset.create();
multiSet.add(10);
multiSet.add(30);
multiSet.add(30);
multiSet.add(40);
multiSet.count(30); // 2
multiSet.size(); // 4
```
## Table
表结构的数据类型Table,它像Map一样，但是支持两种键--行键(row key)和列键(column key)。

# 4.谓语(Predicate)和过滤器(Filter)
谓语(Predicate)是一个只包含一个返回布尔类型的函数的简单接口。它的作用是给定一个输入，判断是否满足条件。它可以用来过滤集合，例如实现一个过滤出老客户的Predicate。
``` python
static class LoyalCustomer implements Predicate<Customer> {
    public boolean apply(Customer customer) {
        return CustomerType.LOYAL == customer.getCustomerType();
    }
}
Collection<Customer> loyalCustomers =   Collections2.filter(customers, new LoyalCustomer());
```
filter函数的语法是：
Collection<E> filter(Collection<E> unfiltered, Predicate<E> predicate)
内置的Predicate
Predicates类包含了and，or，not in这几个静态函数来方便构建复杂的谓语。
``` python
Predicate<String> commonList = and(in(list1), in(list2, or(in(list3));
```
Predicates类也包含了很多非常方便的函数，例如notNull, instanceOf, contains等。
``` python
SortedMaps.filterValues(map, Predicates.notNull());

SortedMaps.filterValues(map, Predicates.notNull());
```
