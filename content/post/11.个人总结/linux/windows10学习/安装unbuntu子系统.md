---
title: "安装unbuntu子系统学习"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---





###  安装unbuntu子系统笔记



1. 开启虚拟化，开启 windows子系统配置
2. 安装软件【略】



####  修改root密码



```shell
sudo passwd root
# 设置新密码
```





####  设置国内 apt镜像源

```shell
sudo cp /etc/apt/sources.list ~/sources.listbf
#编辑文件
sudo vim sources.list


```





清华的镜像
https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/
阿里的镜像
https://developer.aliyun.com/mirror/ubuntu?spm=a2c6h.13651102.0.0.3e221b11ZksbHC



```shell
# 1. 编辑并且复制进去
sudo vim sources.list
sudo apt-get update
# 更新为最新软件园


# 安装 中文语言包【默认都是英文的环境】
 sudo apt-get install language-pack-zh-han*
 
 # 配置中文环境
 sudo vi /etc/profile
 # 设置中文， 最后一行加上这句
 LANG=zh_CN.UTF-8
 
 # 重装 ssh ,有需要的就重装
 sudo apt-get remove openssh-server
 sudo apt-get install openssh-server
 
 # 修改虚拟机 ssh 服务端口
sudo vim /etc/ssh/sshd_config 
# 设置 修改 比如 Port 2222
# 可以开放 PermitPasswordLogin yes

sudo service ssh --full-restart
# 重启 ssh 服务
# windows 下 连接命令
ssh root@192.168.1.15 -p 2222


```



```shell
# 2、apt安装必要软件
sudo apt-get install xxx
gcc / g++ /gdb /make /ctags /   #指令tree      #如果想配置vim的话可以看上个视频



```

















###  windows 下 虚拟机命令的使用

```powershell
wsl -l -v 
# 列出所有的虚拟机状态
wsl --shutdown 
# 关闭虚拟机

```







###  windows terminal 的皮肤设置







###  linux 建立软连接快捷方式



```shell
ln -s /mnt/d/ASUS/Desktop   ./.Desktop
 
```

















