---
title: "基于ping 命令探测学习"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



**免责声明：**

这个是我学习网络的笔记，不要拿笔记上的方法来做坏事,后果自负





###  hping3使用方法



hping3

**hping** 是 面向命令行的用于生成和解析TCP/IP协议数据包汇编/分析的开源工具。作者是Salvatore Sanfilippo，界面灵感来自ping（8）unix命令，**目前最新版是 hping3**，它支持TCP，UDP，ICMP和RAW-IP协议，具有跟踪路由模式，能够在覆盖的信道之间发送文件以及许多其他功能，支持使用tcl脚本自动化地调用其API。**hping是安全审计、防火墙测试等工作的标配工具**。**hping 优势在于能够定制数据包的各个部分，因此用户可以灵活对目标机进行细致地探测。**



```shell
hping3 -c 1000 -d 120 -S -w 64 -p 80 --flood --rand-source www.lyr-2000.xyz

# --flood 洪水式攻击
# 让大量请求处于等待状态 sync
# 然后服务器瘫痪
# 这个就是 ddos 攻击原理
# 解决ddos 攻击的方法
:<<EOF
1. 扩容
2. 分流
--rand-source # 表示伪造源IP地址，局域网中伪造
-w 64 = TCP 窗口大小
-S 只是发送 SYN 数据包
-c 1000   1000个请求


EOF

```







###  fping 命令使用方法

[fping 官网](https://fping.org/)



fping是一个小型命令行工具，用于向网络主机发送ICMP （ Internet控制消息协议 ）回应请求，类似于ping，但在ping多个主机时性能要高得多。 fping完全不同于ping，因为您可以在命令行上定义任意数量的主机，或者指定包含要ping的IP地址或主机列表的文件。例如，使用fping，我们可以指定完整的网络范围（ 192.168.0.1/24 ）。 它会向主机发送Fping请求，并以循环方式移动到另一个目标主机。 与ping不同，Fping基本上用于编写脚本。



```shell
 fping 172.28.18.178
 :<<Note
 # 下面是 命令的返回结果
 172.28.18.178 is alive
 
 ifconfig # 查看本地ip的信息
 inet addr:192.168.1.105 Bcast:192.168.1.255 Mask:255.255.255.0分别是ip地址/网关/子网掩码
 
 Note
 
 
 fping -a -g 192.168.1.1/24
  
:<<NOTE
 192.168.1.1
192.168.1.2
192.168.1.3
192.168.1.10

 
 NOTE
 
fping -ag 192.168.1.1 192.168.1.254 > fpint.txt


```



###  arping 原理





ARP协议： 叫做 地址解析协议 address resolution protocol , 的缩写， 计算机通过 ARP协议将IP地址转换为 MAC地址

RARP协议 是反过来，reverse的意思，将 MAC地址转为 IP地址



arp协议。在同一以太网中，通过地址解析协议，源主机可以通过目的主机的IP地址获得目的主机的MAC地址。arping程序就是完成上述过程的程序。

arping，用来向局域网内的其它主机发送ARP请求的指令，它可以用来测试局域网内的某个IP是否已被使用。 



arp协议就是通过广播去发送给局域网中的各种主机 【广播请求，单播回应 】





#####  cut命令截取关键信息

```shell
 arping 172.28.16.1  -c 1 | grep "bytes from"
 :<<EOF
 42 bytes from 00:15:5d:64:c0:c5 (172.28.16.1): index=0 time=261.500 usec
 # 可以后面 用个 cut 命令， 类型java 字符串的 split 方法 
 EOF
 
  arping 172.28.16.1  -c 1 | grep "bytes from" | cut -d " " -f 5
  
  
:<<EOF
# 这里不会的  就 cut  --help
Mandatory arguments to long options are mandatory for short options too.
  -b, --bytes=LIST        select only these bytes
  -c, --characters=LIST   select only these characters
  -d, --delimiter=DELIM   use DELIM instead of TAB for field delimiter
  -f, --fields=LIST       select only these fields;  also print any line
                            that contains no delimiter character, unless
                            the -s option is specified
  -n                      (ignored)
      --complement        complement the set of selected bytes, characters
                            or fields
  -s, --only-delimited    do not print lines not containing delimiters
      --output-delimiter=STRING  use STRING as the output delimiter
                            the default is to use the input delimiter
  -z, --zero-terminated    line delimiter is NUL, not newline

# 可以知道 -f 就是 选择数组的下标
EOF


 arping 172.28.16.1  -c 1 | grep "bytes from" | cut -d " " -f 5 | cut -d "(" -f 2 | cut -
d ")" -f 1

# 返回结果： 172.28.16.1


```





###  awk 命令的基本使用

```shell
 echo "hello wowld" | awk -F" "  '{print $1}'
 :<<EOF
 hello
 # -F 用来指定分隔符
 
 EOF
```



192.168.1.1解释：

  192.168.1.1属于IP地址的C类地址，属于保留IP，专门用于路由器设置。



DNS定义：

  DNS 是计算机域名系统 (Domain Name System 或Domain Name Service) 的缩写，它是由解析器以及域名服务器组成的。

  DNS 命名用于 Internet的 TCP/IP网络中，通过用户友好的名称查找计算机和服务。当用户在应用程序中输入 DNS 名称时，DNS 服务可以将此名称解析为与之相关的其他信息。



192.168.1.1的DNS地址查询方法：

1、 在“开始”中找到“运行”（或者直接【Win】+【R】）

2、在管理员界面中输入命令：ipconfig/all然后按Enter键确认即可显示Windows IP配置，在这里可以查看到DNS服务器地址。





####  ifconfig查看网段

```shell
ifconfig eth0
# 可以列出 地址
:<<EOF
inet 192.168.1.53 ,netmask 255.255.255.0
那么 192.168.1 前面这个部分就是网段

EOF
```



####  查看网络中存活的主机

```shell
netdiscover -i eth0 -r 192.168.1.0/24
# 主动模式探测太危险了
# 一般会选择被动, 发送给本机的数据包，就收下
# 网卡被设置混杂模式来侦听 网络中的 arp数据包
netdiscover -p

```







