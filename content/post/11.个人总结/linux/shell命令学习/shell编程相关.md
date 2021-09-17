---
title: "shell编程相关"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



###  shell 函数调用



```shell
func() {
    name=yxc
    echo "Hello $name"

    return 123
}

output=$(func)
ret=$?

echo "output = $output"
echo "return = $ret"
```

输出结果：

```
output = Hello yxc
return = 123
```



###  文件重定向原理



每个进程默认打开3个文件描述符

- stdin 标准输入，从命令行读取数据 ， 文件描述符为0   
- stdout 标准输出，向命令行输出数据，文件描述1
- stderr 标准错误输出，向命令行输出数据，文件描述符为2



```shell
./test.sh < input.txt > output.txt  # 从input.txt中读取内容，将输出写入output.txt中
nohup command > myout.file 2>&1 & # 2 表示stderr ,重定向到 stdout 里面

```



###  exit命令原理

exit命令用来退出当前shell进程，并返回一个退出状态；使用$?可以接收这个退出状态。

exit命令可以接受一个整数值作为参数，代表退出状态。如果不指定，默认状态值是 0。

exit退出状态只能是一个介于 0~255 之间的整数，其中只有 0 表示成功，其它值都表示失败。





###  引入其他的脚本函数

用 source 或者 . 引入

```shell
#! /bin/bash
source ./app.sh
# appname 在 app.sh 里面定义了
echo $appname


```

终端其实是一个大的 .bashrc 文件，登录的时候 其实会执行 .bashrc内容

如果 我们修改了 .bashrc ，就要 source一下















