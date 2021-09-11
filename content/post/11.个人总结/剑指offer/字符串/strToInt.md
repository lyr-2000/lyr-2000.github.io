---
title: "strTOint"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR


---



请你写一个函数 StrToInt，实现把字符串转换成整数这个功能。

当然，不能使用 atoi 或者其他类似的库函数。

#### 样例

```
输入："123"

输出：123
```

**注意**:

你的函数应满足下列条件：

1. 忽略所有行首空格，找到第一个非空格字符，可以是 ‘+/−’ 表示是正数或者负数，紧随其后找到最长的一串连续数字，将其解析成一个整数；
2. 整数后可能有任意非数字字符，请将其忽略；
3. 如果整数长度为 00，则返回 00；
4. 如果整数大于 INT_MAX($2^{31}-1$)，请返回 INT_MAX；如果整数小于INT_MIN($-2^{31}$) ，请返回 INT_MIN；





### 解题代码



```cpp
class Solution {
public:
    int strToInt(string str) {
        if(str.size() == 0) return 0;
        #define ll long long
        int flag = 1;
        int front=0;
        int LEN = str.size();
        while(front<LEN &&  str[front]==' ')++ front;
        if(str[front] =='-') flag = -1;
        if(str[front] == '+' || str[front] =='-') ++front;
        long long res=0;
        long long int_max = ((ll)1<<31) -1,
            int_min = -((ll)1<<31);
        for(int i=front,n = str.size();i<n;++i) 
        {
            if(str[i]<'0' || str[i] >'9') {
                break;
            }
            //printf("%c\n",str[i]);
            res = res*10 + (str[i] - '0');
            //if(res>int_max) return int_max;
            
            
        }
        res = res*flag;
        if(res > int_max) return int_max;
        if(res < int_min ) return int_min;
        return res;
        
        
    }
};
```



