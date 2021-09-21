---
title: "redis数据结构"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---





##  redis 为什么最大 512M



redis中用int来修饰len字段，int为4个字节，也就是32位，那么最大能表示 $2^32$ 次方。所以2^32/8/1024/1024=512m



redis  使用 SDS 对  string 类型 的  key  进行了压缩

```cpp
struct __attribute__ ((__packed__)) sdshdr5 {
    unsigned char flags; /* 3 lsb of type, and 5 msb of string length */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr8 {
    uint8_t len; /* used */
    uint8_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr16 {
    uint16_t len; /* used */
    uint16_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr32 {
    uint32_t len; /* used */
    uint32_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr64 {
    uint64_t len; /* used */
    uint64_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};

```



```cpp
/* Helper function for sdssplitargs() that converts a hex digit into an
 * integer from 0 to 15 */
/* 将表示 16 进制的字符转换为对应的整数值 */
int hex_digit_to_int(char c) {
    switch(c) {
    case '0': return 0;
    case '1': return 1;
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
    case '5': return 5;
    case '6': return 6;
    case '7': return 7;
    case '8': return 8;
    case '9': return 9;
    case 'a': case 'A': return 10;
    case 'b': case 'B': return 11;
    case 'c': case 'C': return 12;
    case 'd': case 'D': return 13;
    case 'e': case 'E': return 14;
    case 'f': case 'F': return 15;
    default: return 0;
    }
}

```

redis单个key存入512M大小

1。key不要太长，尽量不要超过1024字节，这不仅消耗内存，而且会降低查找的效率。

2。key也不要太短，太短的话，key的可读性会降低

3。在一个项目中，key最好使用统一的命名模式，例如：user:123

我们熟悉的redis支持5种数据类型，其实不止5种，我们会主要介绍这5种。String(字符串)，hash(哈希)，list（列表），set(集合)及zset(sorted set:有序集合)等


一个key对应一个value。String类型是二进制安全的，意思是String可以包含任何数据。比如jpg图片或者序列化的对象。String类型是redis最基本的数据类型，一个键最大能存储512MB。



```cpp
/*-----------------------------------------------------------------------------
 * String Commands
 * 字符串相关命令
 *----------------------------------------------------------------------------*/

/* 检查字符串是否超过允许的最大长度（512MB） */
static int checkStringLength(client *c, long long size) {
    if (size > 512*1024*1024) {
        /* 超过则返回异常信息给客户端 */
        addReplyError(c,"string exceeds maximum allowed size (512MB)");
        return C_ERR;
    }
    return C_OK;
}
//其实作者是对 这个 size 做了检查， 超过 512M 直接异常，不鸟你


```

####  redis key 使用注意点

著作权归https://pdai.tech所有。 链接：https://www.pdai.tech/md/db/nosql-redis/db-redis-x-redis-ds.html

- **二进制安全**

因为C字符串以空字符作为字符串结束的标识，而对于一些二进制文件（如图片等），内容可能包括空字符串，因此C字符串无法正确存取；而所有 SDS 的API 都是以处理二进制的方式来处理 `buf` 里面的元素，并且 SDS 不是以空字符串来判断是否结束，而是以 len 属性表示的长度来判断字符串是否结束。



![https://www.pdai.tech/_images/db/redis/db-redis-object-2-3.png](https://www.pdai.tech/_images/db/redis/db-redis-object-2-3.png)





##  redis 主从哨兵



著作权归https://pdai.tech所有。 链接：https://www.pdai.tech/md/db/nosql-redis/db-redis-x-copy.html

**主从复制的作用**主要包括：

- **数据冗余**：主从复制实现了数据的热备份，是持久化之外的一种数据冗余方式。
- **故障恢复**：当主节点出现问题时，可以由从节点提供服务，实现快速的故障恢复；实际上是一种服务的冗余。
- **负载均衡**：在主从复制的基础上，配合读写分离，可以由主节点提供写服务，由从节点提供读服务（即写Redis数据时应用连接主节点，读Redis数据时应用连接从节点），分担服务器负载；尤其是在写少读多的场景下，通过多个从节点分担读负载，可以大大提高Redis服务器的并发量。
- **高可用基石**：除了上述作用以外，主从复制还是哨兵和集群能够实施的基础，因此说主从复制是Redis高可用的基础。

主从库之间采用的是**读写分离**的方式。

- 读操作：主库、从库都可以接收；
- 写操作：首先到主库执行，然后，主库将写操作同步给从库。

![https://www.pdai.tech/_images/db/redis/db-redis-copy-1.png](https://www.pdai.tech/_images/db/redis/db-redis-copy-1.png)







##  redis list 的源码 

#### 	 adlist 源码

```cpp
/* adlist.h - A generic doubly linked list implementation
 *
 */

#ifndef __ADLIST_H__
#define __ADLIST_H__

/* Node, List, and Iterator are the only data structures used currently. */

/* 双向链表节点 */
typedef struct listNode {
    struct listNode *prev;
    struct listNode *next;
    void *value;
} listNode;

/* 有方向的迭代器 */
typedef struct listIter {
    listNode *next;
    /* 0：从头遍历  1：从尾遍历 */
    int direction;
} listIter;

/* 双向链表 */
typedef struct list {
    listNode *head;
    listNode *tail;
    void *(*dup)(void *ptr);
    void (*free)(void *ptr);
    int (*match)(void *ptr, void *key);
    unsigned long len;
} list;

/* Functions implemented as macros */
#define listLength(l) ((l)->len)
#define listFirst(l) ((l)->head)
#define listLast(l) ((l)->tail)
#define listPrevNode(n) ((n)->prev)
#define listNextNode(n) ((n)->next)
#define listNodeValue(n) ((n)->value)

#define listSetDupMethod(l,m) ((l)->dup = (m))
#define listSetFreeMethod(l,m) ((l)->free = (m))
#define listSetMatchMethod(l,m) ((l)->match = (m))

#define listGetDupMethod(l) ((l)->dup)
#define listGetFreeMethod(l) ((l)->free)
#define listGetMatchMethod(l) ((l)->match)

/* Prototypes */
list *listCreate(void);
void listRelease(list *list);
void listEmpty(list *list);
list *listAddNodeHead(list *list, void *value);
list *listAddNodeTail(list *list, void *value);
list *listInsertNode(list *list, listNode *old_node, void *value, int after);
void listDelNode(list *list, listNode *node);
listIter *listGetIterator(list *list, int direction);
listNode *listNext(listIter *iter);
void listReleaseIterator(listIter *iter);
list *listDup(list *orig);
listNode *listSearchKey(list *list, void *key);
listNode *listIndex(list *list, long index);
void listRewind(list *list, listIter *li);
void listRewindTail(list *list, listIter *li);
void listRotateTailToHead(list *list);
void listRotateHeadToTail(list *list);
void listJoin(list *l, list *o);

/* Directions for iterators */
/* 0：从头遍历  1：从尾遍历 */
#define AL_START_HEAD 0
#define AL_START_TAIL 1

#endif /* __ADLIST_H__ */

```



##  redis geo hash算法原理

https://blog.csdn.net/qq_31821675/article/details/107249646



[相关的 geohash网站](http://geohash.gofreerange.com/)



麦叔饭后思考地图后台如何根据自己所在位置查询来查询附近餐馆的呢？苦思冥想了半天，小麦想出了个方法：计算所在位置P与北京所有餐馆的距离，然后返回距离<=1000米的餐馆。小得意了一会儿，小麦发现北京的餐馆何其多啊，这样计算不得了，于是想了，既然知道经纬度了，那它应该知道自己在西城区，那应该计算所在位置P与西城区所有餐馆的距离啊，机机运用了递归的思想，想到了西城区也很多餐馆啊，应该计算所在位置P与所在街道所有餐馆的距离，这样计算量又小了，效率也提升了。

小麦的计算思想很朴素，就是通过过滤的方法来减小参与计算的餐馆数目，从某种角度上讲，机机在使用索引技术。

一提到索引，大家脑子里马上浮现出B树索引，因为大量的数据库（如MySQL、oracle、PostgreSQL等）都在使用B树。B树索引本质上是对索引字段进行排序，然后通过类似二分查找的方法进行快速查找，即它要求索引的字段是可排序的，一般而言，可排序的是一维字段，比如时间、年龄、薪水等等。但是对于空间上的一个点（二维，包括经度和纬度），如何排序呢？又如何索引呢？解决的方法很多，下文介绍一种方法来解决这一问题。

思想：如果能通过某种方法将二维的点数据转换成一维的数据，那样不就可以继续使用B树索引了嘛。那这种方法真的存在嘛，答案是肯定的。目前很火的GeoHash算法就是运用了上述思想。



把  $ (x,y) $ 转化为  u , 二维的数变成了一个 一维的数 u, 然后 这些 数据 u 就可以通过 类似 建立索引的方式进行快速查找了。

 **GeoHash 算法将二维的经纬度数据映射到一维的整数，这样所有的元素都将在挂载到一条线上，距离靠近的二维坐标映射到一维后的点之间距离也会很接近。当我们想要计算「附近的人时」，首先将目标位置映射到这条线上，然后在这个一维的线上获取附近的点就行了。**







```cpp
int geohashEncode(const GeoHashRange *long_range, const GeoHashRange *lat_range,
                  double longitude, double latitude, uint8_t step,
                  GeoHashBits *hash) {
    /* Check basic arguments sanity. */
    if (hash == NULL || step > 32 || step == 0 ||
        RANGEPISZERO(lat_range) || RANGEPISZERO(long_range)) return 0;

    /* Return an error when trying to index outside the supported
     * constraints. */
    if (longitude > GEO_LONG_MAX || longitude < GEO_LONG_MIN ||
        latitude > GEO_LAT_MAX || latitude < GEO_LAT_MIN) return 0;

    hash->bits = 0;
    hash->step = step;

    if (latitude < lat_range->min || latitude > lat_range->max ||
        longitude < long_range->min || longitude > long_range->max) {
        return 0;
    }

    double lat_offset =
        (latitude - lat_range->min) / (lat_range->max - lat_range->min);
    double long_offset =
        (longitude - long_range->min) / (long_range->max - long_range->min);

    /* convert to fixed point based on the step size */
     /* 根据设置的step大小, 转换为一个固定的值 */
    lat_offset *= (1ULL << step);
    long_offset *= (1ULL << step);
    hash->bits = interleave64(lat_offset, long_offset);
    return 1;
}

```







##  redis CRC 循环冗余校验算法

    CRC即循环冗余校验码，是信息系统中一种常见的检错码。大学课程中的“计算机网络”、“计算机组成”等课程中都有提及。我们可能都了解它的数学原理，在试卷上手工计算一个CRC校验码，并不是难事。但是计算机不是人，现实世界中的数学原理需要转化为计算机算法才能实现目的。实际上作为计算机专业背景人并不会经常使用或接触到CRC的计算机算法实现的原理，通常是电子学科背景的人士会接触的比较多点。计算机当然是可以直接模拟出CRC的原始算法的（我们手工计算的算法），但是效率肯定不高。那我们来看一下计算机是如何实现CRC校验码算法的吧！
 

 ```cpp
 #include "server.h"
 
 /*
  * Copyright 2001-2010 Georges Menie (www.menie.org)
  * Copyright 2010-2012 Salvatore Sanfilippo (adapted to Redis coding style)
  * All rights reserved.
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are met:
  *
  *     * Redistributions of source code must retain the above copyright
  *       notice, this list of conditions and the following disclaimer.
  *     * Redistributions in binary form must reproduce the above copyright
  *       notice, this list of conditions and the following disclaimer in the
  *       documentation and/or other materials provided with the distribution.
  *     * Neither the name of the University of California, Berkeley nor the
  *       names of its contributors may be used to endorse or promote products
  *       derived from this software without specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY
  * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
  * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
 
 /* CRC16 implementation according to CCITT standards.
  *
  * Note by @antirez: this is actually the XMODEM CRC 16 algorithm, using the
  * following parameters:
  *
  * Name                       : "XMODEM", also known as "ZMODEM", "CRC-16/ACORN"
  * Width                      : 16 bit
  * Poly                       : 1021 (That is actually x^16 + x^12 + x^5 + 1)
  * Initialization             : 0000
  * Reflect Input byte         : False
  * Reflect Output CRC         : False
  * Xor constant to output CRC : 0000
  * Output for "123456789"     : 31C3
  */
 
 static const uint16_t crc16tab[256]= {
     0x0000,0x1021,0x2042,0x3063,0x4084,0x50a5,0x60c6,0x70e7,
     0x8108,0x9129,0xa14a,0xb16b,0xc18c,0xd1ad,0xe1ce,0xf1ef,
     0x1231,0x0210,0x3273,0x2252,0x52b5,0x4294,0x72f7,0x62d6,
     0x9339,0x8318,0xb37b,0xa35a,0xd3bd,0xc39c,0xf3ff,0xe3de,
     0x2462,0x3443,0x0420,0x1401,0x64e6,0x74c7,0x44a4,0x5485,
     0xa56a,0xb54b,0x8528,0x9509,0xe5ee,0xf5cf,0xc5ac,0xd58d,
     0x3653,0x2672,0x1611,0x0630,0x76d7,0x66f6,0x5695,0x46b4,
     0xb75b,0xa77a,0x9719,0x8738,0xf7df,0xe7fe,0xd79d,0xc7bc,
     0x48c4,0x58e5,0x6886,0x78a7,0x0840,0x1861,0x2802,0x3823,
     0xc9cc,0xd9ed,0xe98e,0xf9af,0x8948,0x9969,0xa90a,0xb92b,
     0x5af5,0x4ad4,0x7ab7,0x6a96,0x1a71,0x0a50,0x3a33,0x2a12,
     0xdbfd,0xcbdc,0xfbbf,0xeb9e,0x9b79,0x8b58,0xbb3b,0xab1a,
     0x6ca6,0x7c87,0x4ce4,0x5cc5,0x2c22,0x3c03,0x0c60,0x1c41,
     0xedae,0xfd8f,0xcdec,0xddcd,0xad2a,0xbd0b,0x8d68,0x9d49,
     0x7e97,0x6eb6,0x5ed5,0x4ef4,0x3e13,0x2e32,0x1e51,0x0e70,
     0xff9f,0xefbe,0xdfdd,0xcffc,0xbf1b,0xaf3a,0x9f59,0x8f78,
     0x9188,0x81a9,0xb1ca,0xa1eb,0xd10c,0xc12d,0xf14e,0xe16f,
     0x1080,0x00a1,0x30c2,0x20e3,0x5004,0x4025,0x7046,0x6067,
     0x83b9,0x9398,0xa3fb,0xb3da,0xc33d,0xd31c,0xe37f,0xf35e,
     0x02b1,0x1290,0x22f3,0x32d2,0x4235,0x5214,0x6277,0x7256,
     0xb5ea,0xa5cb,0x95a8,0x8589,0xf56e,0xe54f,0xd52c,0xc50d,
     0x34e2,0x24c3,0x14a0,0x0481,0x7466,0x6447,0x5424,0x4405,
     0xa7db,0xb7fa,0x8799,0x97b8,0xe75f,0xf77e,0xc71d,0xd73c,
     0x26d3,0x36f2,0x0691,0x16b0,0x6657,0x7676,0x4615,0x5634,
     0xd94c,0xc96d,0xf90e,0xe92f,0x99c8,0x89e9,0xb98a,0xa9ab,
     0x5844,0x4865,0x7806,0x6827,0x18c0,0x08e1,0x3882,0x28a3,
     0xcb7d,0xdb5c,0xeb3f,0xfb1e,0x8bf9,0x9bd8,0xabbb,0xbb9a,
     0x4a75,0x5a54,0x6a37,0x7a16,0x0af1,0x1ad0,0x2ab3,0x3a92,
     0xfd2e,0xed0f,0xdd6c,0xcd4d,0xbdaa,0xad8b,0x9de8,0x8dc9,
     0x7c26,0x6c07,0x5c64,0x4c45,0x3ca2,0x2c83,0x1ce0,0x0cc1,
     0xef1f,0xff3e,0xcf5d,0xdf7c,0xaf9b,0xbfba,0x8fd9,0x9ff8,
     0x6e17,0x7e36,0x4e55,0x5e74,0x2e93,0x3eb2,0x0ed1,0x1ef0
 };
 
 uint16_t crc16(const char *buf, int len) {
     int counter;
     uint16_t crc = 0;
     for (counter = 0; counter < len; counter++)
             crc = (crc<<8) ^ crc16tab[((crc>>8) ^ *buf++)&0x00FF];
     return crc;
 }
 
 ```





##  redis 内存回收机制



因为 C 语言并不具备自动的内存回收功能，所以 Redis 在自己的对象系统中构建了一个引用计数（[reference counting](http://en.wikipedia.org/wiki/Reference_counting)）技术实现的内存回收机制，通过这一机制，程序可以通过跟踪对象的引用计数信息，在适当的时候自动释放对象并进行内存回收。

每个对象的引用计数信息由 `redisObject` 结构的 `refcount` 属性记录：



```cpp
typedef struct redisObject {
 
    // ...
 
    // 引用计数
    int refcount;
 
    // ...
 
} robj;
```

