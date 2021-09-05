---
title: "eggjs学习记录"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



## eggjs 学习总结




## 生成验证码

```shell

yarn add svg-captcha 
yarn add cookie-parser

```

## 添加session 支持
```
yarn add egg-session

```



## 验证码跨域问题解决


这个贼坑， cookie 讲究同源策略，要相同端口相同域名，
我的 axios 的 baseURL 使用的是  127.0.0.1 ， 然后调试发现 我浏览器 是访问的 localhost, 因此 图片请求 的 requestURL 是
localhost， 和 baseURL 不一样，就导致 无法 设置 cookie，解决方法，baseURL 统一 使用 localhost，
相同域名的话，session 里面就能取到值了









