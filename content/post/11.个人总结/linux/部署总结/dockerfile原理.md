---
title: "dockerfile原理"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---

## 什么是dockerfile

- 为开发团队提供完全一致的开发环境

- 拿所构建的镜像通过 Dockerfile文件构建一个新的镜像开始工作
- 部署时，无缝移植



[学习视频](https://www.bilibili.com/video/BV1kv41147rR?p=17)



```shell

FROM kyungw00k/lrun:1.1.4

LABEL maintainer Kyungwook Park <parksama@gmail.com>

ENV LJUDGE_VERSION=0.6.1

# INSTALL LJUDGE BINARY
RUN wget "https://github.com/quark-zju/ljudge/releases/download/v${LJUDGE_VERSION}/ljudge_${LJUDGE_VERSION}_amd64.deb" && \
    dpkg -i "ljudge_${LJUDGE_VERSION}_amd64.deb" && \
    rm -f "ljudge_${LJUDGE_VERSION}_amd64.deb"

CMD ["/usr/bin/ljudge"]
```







## OJ api 使用总结



```json
{
    "cmd": [{
        "args": ["a"],
        "env": ["PATH=/usr/bin:/bin"],
        "files": [{
            "content": "12222 1000"
        }, {
            "name": "stdout",
            "max":  20
        }
        ],
        "cpuLimit": 10000000000,
        "memoryLimit": 104857600,
        "procLimit": 50,
        "strictMemoryLimit": false,
        "copyIn": {
            "a": {
                "fileId": "ZTWZPBKN33KX4E7I"
            }
        } ,
        "copyOutCached" : ["stdout"]
      
      
    }]
}

```



#### 返回结果

```json
[
     {
          "status": "Accepted",
          "exitStatus": 0,
          "time": 1121985,
          "memory": 262144,
          "runTime": 1597074,
          "fileIds": {
               "stdout": "V5VKUBBGPXSYYTFW"
          }
     }
]
```





## 输入使用服务器下的文件







```json
{
    "cmd": [{
        "args": ["a"],
        "env": ["PATH=/usr/bin:/bin"],
        "files": [{
            "fileId" :"BXLBTQTVLEYZH6TX"
        }, {
            "name": "stdout",
            "max":  20
        }
        ],
        "cpuLimit": 10000000000,
        "memoryLimit": 104857600,
        "procLimit": 50,
        "strictMemoryLimit": false,
        "copyIn": {
            "a": {
                "fileId": "ZTWZPBKN33KX4E7I"
            }
        }  
    
      
      
    }]
}

```

返回：

```json
[
     {
          "status": "Accepted",
          "exitStatus": 0,
          "time": 1119534,
          "memory": 262144,
          "runTime": 1599273,
          "files": {
               "stdout": "13226\n"
          }
     }
]
```

