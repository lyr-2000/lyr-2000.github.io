---
title: "骰子的点数"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR

---



将一个骰子投掷 n  次，获得的总点数为 s ，s  的可能范围为 $ n∼6n $ 。

掷出某一点数，可能有多种掷法，例如投掷 2 次，掷出  3 点，共有 [1,2], [2,1] 两种掷法。

请求出投掷 n 次，掷出 $n∼6n$  点分别有多少种掷法。

#### 样例1

```
输入：n=1

输出：[1, 1, 1, 1, 1, 1]

解释：投掷1次，可能出现的点数为1-6，共计6种。每种点数都只有1种掷法。所以输出[1, 1, 1, 1, 1, 1]。
```

#### 样例2

```
输入：n=2

输出：[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]

解释：投掷2次，可能出现的点数为2-12，共计11种。每种点数可能掷法数目分别为1,2,3,4,5,6,5,4,3,2,1。

      所以输出[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]。
```



## 解题思路：

###  递归解法：

```cpp
class Solution {
public:
    vector<int> numberOfDice(int n) {
        vector<int> res;
        for(int i=n,maxN = n*6;i<=maxN;++i)
        //    res += dfs(n,i);
            res.push_back(dfs(n,i));//[n,6*n]
        return res;
    }
    
    int dfs(int cnt,int sum) {
        if(sum < 0) return 0;
        if(cnt ==0 ) return sum == 0;
        int res = 0;
        for(int i=1;i<=6;++i) res+= dfs(cnt-1,sum - i);
        return res;
    }
};

```







#### dp解法



##### DP 方程

- 状态表示 $dp[i][j]$ 表示前面 i次 总和为 j 的方案数
- 边界条件 $dp[0][0] = 1$

$$
dp[i][j] = dp[i][j] + dp[i-1][i-k]
$$



#### 解题代码

```cpp
class Solution {
public:
    vector<int> numberOfDice(int n) {
        vector<int> res;
        vector<vector<int>> dp(n+1,vector<int>(n*6+1));
        dp[0][0] = 1;
        for(int i=1;i<=n;++i) 
        {
            for(int j=1;j<=6*i;++j) {
                //枚举k ，也就是最后一次的投骰子 值域 是 [1,6] 
                for(int k=1;j-k>=0 && k<=6;++k) {
                    dp[i][j] += dp[i-1][j- k];
                }
            }
        }
        // for(int i=n,maxN = n*6;i<=maxN;++i)
        // //    res += dfs(n,i);
        //     res.push_back(dfs(n,i));//[n,6*n]
        for(int i=n;i<=n*6;++i)
            res.push_back(dp[n][i]);
        return res;
    }
    
    int dfs(int cnt,int sum) {
        if(sum < 0) return 0;
        if(cnt ==0 ) return sum == 0;
        int res = 0;
        for(int i=1;i<=6;++i) res+= dfs(cnt-1,sum - i);
        return res;
    }
};

```













