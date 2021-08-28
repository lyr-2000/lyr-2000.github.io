---
title: "OJ 环境安装"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR


---



## 安装OJ 环境的过程



[安装的文档](https://opensource.qduoj.com/#/judger/api)



2.1、安装安全计算模型 libseccomp
RunC 默认的编译配置是支持 seccomp 的，所以我们需要先安装libseccomp,
如果是centos系统的话，就安装 libseccomp-devel：

```shell
yum install -y libseccomp-devel
```



如果是ubuntu系统，就安装libseccomp-dev：

```shell
sudo apt install libseccomp-dev
```



seccomp 的全称为 secure computing mode，即安全计算模型，这是 Lin









