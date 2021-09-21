---
title: "cpp学习和使用"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR


---





###  open 函数 api学习



```cpp
// #include<bits/stdc++.h>
#include<sys/types.h>
#include<sys/stat.h>
#include<fcntl.h>
#include<unistd.h>
#include<stdlib.h>

#include<stdio.h>

// #include <iostream>
// using namespace std;

int main(void) {
  
  int fd = 0;
  //打开 已经存在的文件
  fd = open("hello.txt",O_RDWR);
  if (fd == -1) {
    perror("操作错误  open file error");
    exit(1);
  }
  printf("fd:= %d \n",fd);
  //关闭文件
  int res = close(fd);
  printf("res:= %d\n",res);

  //cout << fd <<endl;
  
  
  
  return 0;
}
```

```shell
#编译方法
gcc pid.cpp -o a.out

[root@VM-0-7-centos judgeServer_QD]# ./a.out 
fd:= 3 
res:= 0
```

打开已经存在的文件，fd 是 3



1. read

   1. 返回值：

      1. -1 读取文件失败
      2. 0 读取文件成功
      3. $>0$ 读取到的字节数

      