---
title: "ftp命令以及原理"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---





### ftp 使用总结



[ftp 使用教程](https://www.bilibili.com/video/BV1nA411x7Lb?p=3)





```shell
ftp ip
# 通过 ftp 连接远程服务器
# 图形界面搞的太慢了， 还是命令快
# l表示 local  local change directory 切换本地服务器目录
lcd c:/

binary
#切换为二进制模式
# cd /www/wwwroot/user0
# 远程服务切换目录


# 切换c盘
lcd c:/ # 本地切换



get 111 # 下载 111文件

put c://desktop/1.txt
# 这个 put 就可以上传文件了

mget *.pdf
#批量下载

```







###  ftp原理总结



[学习视频](https://www.bilibili.com/video/BV1hv411A7XL?from=search&seid=7132461697998668697&spm_id_from=333.337.0.0)

FTP 叫做文件传输协议 (File Transfer Protocol )

SFTP  ( ssh file transfer protocol) : 安全文件传输协议， sftp 是 ssh 的其中一部分



#####  FTP 和 SFTP区别

1. 协议不同：

   1. FTP 使用 TCP/IP 协议， 而 SFTP 是 ssh协议的一部分，他是一种远程登录信息

2. 链接方式：

   1. FTP 使用TCP端口 21 上的控制链接建立链接。 而SFTP是在客户端和服务器之间通过 SSH 协议（TCP端口 22 【默认是22，可以改】） 建立的安全连接传输文件

3. 安全性：

   1. SFTP 使用加密传输认证信息和传输的数据，所以 SFTP相对于FTP 是非常安全的。

    





![https://images2015.cnblogs.com/blog/803386/201704/803386-20170405160747160-333996798.png](https://images2015.cnblogs.com/blog/803386/201704/803386-20170405160747160-333996798.png)





##### 主动模式

1. 第一个 TCP 连接 【第一信道】

   1. 客户端主动发起，找FTP服务器 -- 目的端口就是 21

2. 第一个 TCP连接 【第二信道】

   



