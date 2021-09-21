---
title: "kali的优势"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---





免责声明：

切勿使用教程中的内容进行违法活动，后果自负





1. 开源，免费，可以给任何人使用
2. 广泛支持无线协议
3. 在安全环境中开发
4. GPG 签名包和存储库
5. kali 可以用于各种 ARM 设备
6. 900多种渗透测试工具



[学习教程](https://www.bilibili.com/video/BV1SA411G7aF?p=7)





### 被动信息收集个概念

1. 利用第三方服务对目标进行被动信息收集防止被发现
2. 被动信息收集是-指： 利用第三方网站服务对目标进行访问了解，比如 google搜索
   1. 通过公开渠道，去获取目标主机的信息，从而不予目标系统之间交互，避免留下痕迹
3.  主动信息收集方式： 通过直接访问，扫描网站，这种流量经过网站的行为，比如 nmap 扫描端口，容易封你 IP









#####  信息收集的内容

1. IP地址段
2. 域名信息
3. 邮件地址
4. 文档图片数据
5. 公司地址
6. 公司组织架构
7. 联系电话/传真号码
8. 人员姓名/职务
9. 目标系统使用的技术架构，PHP 还是java，apache等
10. 公开的商业信息



##### 信息的用途

1. 信息描述目标
2. 发现目标
3. 社会工程学攻击
4. 物理缺口









###  DNS解析原理

1. 首先看浏览器是否有 DNS 缓存，这个域名对应的IP地址
2. 如果没有，先去看 系统的 host 文件有没有对应的记录
3. 如果没有host 记录，去请求 路由器有木有记录
4. 路由器也木有记录：
   1. 路由器没有 -》 去询问本地 DNS 服务器
   2. 本地DNS服务器去迭代查询 相关的服务器
      1. 这里分为迭代查询和递归查询
      2. 查询到之后，路由器本地存一份【万一别的机器也要访问，直接发给他】
      3. 然后发给网络客户端存









###  查询 IP地址的命令

```shell
# 由于使用 ping 等命令 本地好像需要 root 权限，先切一个 root 用户
su root

ping xuegod.cn -c 1
# 发一个数据包
:<<EOF
 ping baidu.com
PING baidu.com (220.181.38.251) 56(84) bytes of data.
64 bytes from 220.181.38.251 (220.181.38.251): icmp_seq=1 ttl=47 time=42.3 ms
64 bytes from 220.181.38.251 (220.181.38.251): icmp_seq=2 ttl=47 time=141 ms
64 bytes from 220.181.38.251 (220.181.38.251): icmp_seq=3 ttl=47 time=141 ms

EOF

# 由上面就知道 ping 是用的 icmp协议的


nslookup www.baidu.com

:<<EOF

# 使用 nslookup 查看命令
Server:         172.28.16.1  #DNS 服务器
Address:        172.28.16.1# DNS 服务器地址

Non-authoritative answer:
Name:   baidu.com         # 我们解析到的域名
Address: 220.181.38.148
Name:   baidu.com
Address: 220.181.38.251  # 解析到 的 IP地址


EOF


# dig 命令，收集相关的信息
dig baidu.com
:<<EOF
; <<>> DiG 9.16.1-Ubuntu <<>> baidu.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 57661
;; flags: qr rd ad; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 0
;; WARNING: recursion requested but not available

;; QUESTION SECTION:
;baidu.com.                     IN      A

;; ANSWER SECTION:
baidu.com.              0       IN      A       220.181.38.148
baidu.com.              0       IN      A       220.181.38.251

;; Query time: 0 msec
;; SERVER: 172.28.16.1#53(172.28.16.1)
;; WHEN: Tue Sep 21 11:43:23 CST 2021
;; MSG SIZE  rcvd: 68



EOF


dig www.xxx.com
:<<EOF
;; Query time: 10 msec
;; SERVER: 172.28.16.1#53(172.28.16.1)  # 这就是DNS服务器地址
;; WHEN: Tue Sep 21 11:47:58 CST 2021
;; MSG SIZE  rcvd: 66

EOF


```





####   dig 查询 dnspod 域名服务器软件信息

```shell
# dnspod 使用方法

dig txt chaos VERSION.BIND @ns3.dnsv4.com
:<<EOF
;; ANSWER SECTION:
VERSION.BIND.           0       CH      TXT     "dnsmasq-2.45"



EOF

```



###  查询企业信息

天眼查





#####  收集子域名信息

```shell
#Maltego 收集信息学习

```































