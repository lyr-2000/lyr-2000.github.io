---
title: "nmap工具使用"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



###  nmap工具原理



1 nmap扫描主要有 TCP 全连接扫描（会被扫描机器留下记录）， 半连接扫描（不会留下记录）



![image-20210921154650539](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_09_21_15_46_52image-20210921154650539.png)







```shell
:<<EOF
SCAN TECHNIQUES:
             -sS/sT/sA/sW/sM: TCP SYN/Connect()/ACK/Window/Maimon scans
             -sU: UDP Scan
             -sN/sF/sX: TCP Null, FIN, and Xmas scans
             --scanflags <flags>: Customize TCP scan flags
             -sI <zombie host[:probeport]>: Idle scan
             -sY/sZ: SCTP INIT/COOKIE-ECHO scans
             -sO: IP protocol scan
             -b <FTP relay host>: FTP bounce scan

EOF


#nmap 代码写入
 nmap -sS 1.15.x.x  -p 80,8080,8081,8082,443,2028,8888,21,5050,8828

```





#### scapy 命令行使用



```shell
>>> ICMP().display()
###[ ICMP ]###
  type= echo-request
  code= 0
  chksum= None
  id= 0x0
  seq= 0x0

>>> IP().display()
###[ IP ]###
  version= 4
  ihl= None
  tos= 0x0
  len= None
  id= 1
  flags=
  frag= 0
  ttl= 64
  proto= hopopt
  chksum= None
  src= 127.0.0.1
  dst= 127.0.0.1
  \options\



 sr1(IP(dst='1.15.108.110')/TCP(flags="S", dport=80),timeout=6)
 
 
 # 建立TCP连接 伪造数据包
```







