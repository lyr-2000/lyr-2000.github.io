---
title: "数位DP 算法"
date: 2021-08-14T22:42:48+08:00
draft: false
---



## 数位dp 算法模板

[学习视频](https://www.bilibili.com/video/BV1iE411w76B?from=search&seid=6136782306114837668)

### 核心算法原理

![image-20210830222919102](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_30_22__29_21image-20210830222919102.png)



![image-20210830223309740](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_30_22__33_09image-20210830223309740.png)

#### 参数解释

 **可选参数：**

pre:表示上一个数是多少

> 有些题目会用到前面的数

lead :前导零是否存在，lead=1存在前导零，否则不存在。

> 

sum 搜索到当前所有数字之和

> 有些题目会出现数字之和的条件

cnt 某个数字出现的次数

> 有些题目会出现某个数字出现次数的条件



```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 15;
int l, r, dp[N][N], len, a[N];
int dfs(int pos, int pre, int limit) {
    if (!pos) return 1;
    if (!limit && dp[pos][pre] != -1) return dp[pos][pre];
    int res = 0, up = limit ? a[pos] : 9;
    for (int i = 0; i <= up; i ++) {
        if (i == 4 || (i == 2 && pre == 6)) continue;
        res += dfs(pos - 1, i, limit && i == up);
    }
    return limit ? res : dp[pos][pre] = res;
}
int cal(int x) {
    memset(dp, -1, sizeof dp);
    len = 0;
    while (x) a[++ len] = x % 10, x /= 10;
    return dfs(len, 0, 1);
}
signed main() {
    while (cin >> l >> r, l || r) {
        cout << cal(r) - cal(l - 1) << endl;
    }
}
 
```











### [面试题 17.06\. 2出现的次数](https://leetcode-cn.com/problems/number-of-2s-in-range-lcci/)

Difficulty: **困难**


编写一个方法，计算从 0 到 n (含 n) 中数字 2 出现的次数。

**示例:**

```
输入: 25
输出: 9
解释: (2, 12, 20, 21, 22, 23, 24, 25)(注意 22 应该算作两次)
```

提示：

*   `n <= 10^9`


#### Solution

Language: ****

```cpp
const int MAXN = 1E9+7;
class Solution {
public:
    int numberOf2sInRange(int n) {
        vector<int> v;
        while(n) v.push_back(n%10),n/=10;
        memset(dp,-1,sizeof dp);
        return dfs(v,v.size(),0,1);
    }
    int dp[15][15];
    
    int dfs(vector<int> &v,int len,int cnt,bool limit) {
        if(len == 0) return cnt;
        if(!limit   &&  dp[len][cnt] !=-1) 
            return dp[len][cnt];
        int mx = limit? v[len-1]:9;
        //限制最高位的话，用 v[i], 否则用 9位最高位
        int res=0;
        for(int i=0;i<=mx;++i)
        {
            res += dfs(v,len-1,cnt+ ( i==2 ),limit && i==mx);

        }
        if(!limit)
            dp[len][cnt] = res;
        
        return res;
    }
};
```



## Windy数



Windy 定义了一种 Windy 数：不含前导零且相邻两个数字之差至少为 22 的正整数被称为 Windy 数。

Windy 想知道，在 AA 和 BB 之间，包括 AA 和 BB，总共有多少个 Windy 数？

#### 输入格式

共一行，包含两个整数 AA 和 BB。

#### 输出格式

输出一个整数，表示答案。

#### 数据范围

1≤A≤B≤2×1091≤A≤B≤2×109

#### 输入样例1：

```
1 10
```

#### 输出样例1：

```
9
```

#### 输入样例2：

```
25 50
```

#### 输出样例2：

```
20
```

### 解题代码



```cpp
#include <iostream>
#include <cstring>
#include <algorithm>
#include <vector>
using namespace std;

const int N =  20;
int dp[N][N],a[N] ,len;

int dfs(int pos,int pre, int lead,int limit) {
    if(0 == pos) return 1;
    
    if(!limit && !lead && dp[pos][pre]!=-1)
        return dp[pos][pre];
    int res=0, hi = limit? a[pos]:9;
    for(int i=0;i<=hi;++i) {
        if(abs(pre - i) <2) continue;
        //>=2 的加起来
        if(lead && i==0) {
            //有前导0，并且 i==0
            res += dfs(pos-1,-4,1,limit && i==hi);
            
        }else {
            res += dfs(pos-1,i,0/*已经无前导0了*/,limit && i == hi);
            
        }
    }
    return limit? res: dp[pos][pre] = res;
}

int calc(int u) {
    len = 0;
    while(u)
        a[++len] = u%10, u /=10;
    return dfs(len,-4,1,1);
}
int main()
{
    memset(dp,-1,sizeof dp);
    
    int l,r;
    cin>> l>>r;
    cout <<calc(r) - calc(l-1)<<endl;
    
    return 0;
}
```



### 数字游戏2







由于科协里最近真的很流行数字游戏。

某人又命名了一种取模数，这种数字必须满足各位数字之和 mod Nmod N 为 00。

现在大家又要玩游戏了，指定一个整数闭区间 [a.b][a.b]，问这个区间内有多少个取模数。

#### 输入格式

输入包含多组测试数据，每组数据占一行。

每组数据包含三个整数 a,b,Na,b,N。

#### 输出格式

对于每个测试数据输出一行结果，表示区间内各位数字和 mod Nmod N 为 00 的数的个数。

#### 数据范围

1≤a,b≤231−11≤a,b≤231−1,
1≤N<1001≤N<100

#### 输入样例：

```
1 19 9
```

#### 输出样例：

```
2
```





### 解题代码



```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 300;
int dp[MAXN][MAXN];
int a[MAXN],len;
int N;
//某人又命名了一种取模数，这种数字必须满足各位数字之和 mod N 为 0。
int dfs(int pos,int sum, int limit) {
    if(pos==0) return sum % N == 0;
    if(limit==0 && dp[pos][sum] != -1) return dp[pos][sum];
    int res=0;
    int hi = limit? a[pos]:9;


    for(int i=0;i<=hi;++i) {
        //满足各位数字之和  mod N  为 0
        res += dfs(pos-1,sum + i,limit && hi == i);
    }
    return limit? res: dp[pos][sum] = res;
}


int calc(int u) {
    memset(dp,-1,sizeof dp);
    len = 0;
    while(u)
        a[++len] = u%10,u/=10;
    return dfs(len,0,1);
}

int main()
{
    int l,r;
    while(cin>>l>>r>>N) {
        cout << calc(r) - calc(l-1) <<endl;
    }



    return 0;
}

 
```





