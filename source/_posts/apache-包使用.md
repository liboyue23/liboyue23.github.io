title: apache 包使用
date: 2016-08-30 18:00:04
categories: 技术
tags: [java,commons]
---
## commons-lang
- java基本对象方法的工具包，对字符串、数组等基本对象的操作，弥补java.lang.api本身不足

## commons-beanutils
- bean的包装
```python
BeanUtils.copyProperties(teacher,teacherForm);
```

## commons-cli
- 处理命令的工具

## commons-codec
- 编码和解码用的

## commons-collections
- java.util的扩展

## commons-configuration
- 这个工具是用来帮助处理配置文件的，支持很多种存储方式
```python
  colors.background = #FFFFFF
  colors.foreground = #000080
  window.width = 500
  window.height = 300
  PropertiesConfiguration config = new PropertiesConfiguration("usergui.properties");
  config.setProperty("colors.background", "#000000");
  config.save();
  config.save("usergui.backup.properties");
  Integer integer = config.getInteger("window.width");
```

## commons-dbcp

## commons-dbutils
```python
QueryRunner run = new QueryRunner(dataSource);
```

## commons-httpclient

## commons-io
- 可以看成是java.io的扩展，我觉得用起来非常方便。
```python
//读取steam
IOUtils.toString(in) ;
IOUtils.closeQuietly(in);
//读取文件
FileUtils.readLines(file, "UTF-8");
//查看剩余空间
FileSystemUtils.freeSpace("C:/");
```

## commons-lang
- 这个工具包可以看成是对java.lang的扩展。提供了诸如StringUtils, StringEscapeUtils, RandomStringUtils, Tokenizer, WordUtils等工具类。

## commons-logging

## commons-math

## commons-net
- 封装了很多网络协议
1.    FTP
2.    NNTP
3.    SMTP
4.    POP3
5.    Telnet
6.    TFTP
7.    Finger
8.    Whois
9.    rexec/rcmd/rlogin
10.    Time (rdate) and Daytime
11.    Echo
12.    Discard
13.    NTP/SNTP

## commons-validator
- 用来帮助进行验证的工具。比如验证Email字符串，日期字符串等是否合法。
