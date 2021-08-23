---
title: "SYN 泛洪攻击"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



## 几种泛洪攻击原理

1. syn泛洪攻击

2. ack泛洪攻击

3. http泛洪攻击

4. slowloris 攻击

   



## 查看 系统 tcp连接状态



```shell
netstat -an | grep tcp
```



![image-20210822212516885](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_22_21__25_19image-20210822212516885.png)

### syn泛洪的原理

![image-20210822212547166](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_22_21__25_47image-20210822212547166.png)

客户端疯狂发送 syn 和服务器简历连接， 服务端 回发 syn + ack ，但是客户端收到了却不应答 【服务器端一直保持 syn_recv 】





### slowloris 攻击原理

在正常 http头部中，是以2个 CLRF `\r\n` 表示 http headers头部结束的

如果去掉一个( `\r\n` )表示头部未结束，客户端再发送任意头部保持连接，耗尽服务器连接数，造成拒绝服务攻击



![image-20210822213325974](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_22_21__33_26image-20210822213325974.png)



















