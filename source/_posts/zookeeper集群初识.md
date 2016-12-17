title: zookeeper集群初识
date: 2015-06-17 19:25:56
categories: 技术
tags: [zookeeper,分布式]
toc: false
---
>今天研究了一下zookeeper，对于互联网公司来说，分布式架构是必须的，zookeeper正是针对分布式应用的高性能协调服务，提供包括配置维护、名字服务、分布式同步、组服务等。

下面介绍一下配置zookeeper集群的过程
1. 复制三个zookeeper，比如
2. 配置每一个zookeeper的zoo.cfg，比如
``` bash
tickTime=2000    
initLimit=10
syncLimit=5
#指定dataDir目录
dataDir=/Users/bear_lee/development/zookeeper/data/zookeeper3
dataLogDir=/Users/bear_lee/development/zookeeper/logs/zookeeper3
#clientPort：zookeeper的端口号，在同一台机器下不同zookeeper端口号不能一样
clientPort=2183
server.1=127.0.0.1:2881:3881
server.2=127.0.0.1:2882:3882
server.3=127.0.0.1:2883:3883
```
3. 在3个zookeeper的dataDir目录下面分别创建文件，取名myid，分别写入1、2、3。其中1，2，3分别指的是zoo.cfg文件中的server.1 server.2 server.3
4. 启动3个zookeeper：
``` python
$ ./zkServer.sh start
```
5. 随便进入一个zookeeper，启动zkCli，然后我们会发现连接了另一个zookeeper，该zookeeper则是整个集群的leader
``` python
$ ./zkCli.sh
```
