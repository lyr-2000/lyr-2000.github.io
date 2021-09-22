---
title: "使用vim后遇到的一些问题"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
tags:
  - shell命令学习
  - vim
---



# 使用vim的问题总结



## 1. 从网页复制的 yml到编辑器，编辑器缩进不对



[解决的文章](https://blog.csdn.net/inthat/article/details/106998111)



解决vi/vim中粘贴会在行首多很多缩进和空格的问题
解决办法：

在拷贝前输入:set paste (这样的话，vim就不会启动自动缩进，而只是纯拷贝粘贴）
拷贝完成之后，输入:set nopaste (关闭paste)
将 Vim 切换到粘贴模式。可用于从一个窗口剪切或复制文本并粘贴到 Vim。它的使用会避免一些意想不到的效果。
设置此选项可用于终端上运行的 Vim，因为那里 Vim 没法区别输入和粘贴的文本。在 GUI 里，Vim 知道何者来自粘贴，即使不打开 ‘paste’ 也基本上不会做错。对 Vim 能自己处理鼠标点击的终端也是如此。

总结： 在vi/vim普通模式下执行:set paste命令，再按 i 插入就会保留原文件格式

```shell
:set paste

# 这边你直接 paste 进去
:set nopaste
# 关闭 paste
```

