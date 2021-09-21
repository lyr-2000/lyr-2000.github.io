---
title: "lc.740.删除并获得点数"
date: 2021-08-14T22:42:48+08:00
draft: false

---





### [740\. 删除并获得点数](https://leetcode-cn.com/problems/delete-and-earn/)

Difficulty: **中等**


给你一个整数数组 `nums` ，你可以对它进行一些操作。

每次操作中，选择任意一个 `nums[i]` ，删除它并获得 `nums[i]` 的点数。之后，你必须删除 **所有** 等于 `nums[i] - 1` 和 `nums[i] + 1` 的元素。

开始你拥有 `0` 个点数。返回你能通过这些操作获得的最大点数。

**示例 1：**

```
输入：nums = [3,4,2]
输出：6
解释：
删除 4 获得 4 个点数，因此 3 也被删除。
之后，删除 2 获得 2 个点数。总共获得 6 个点数。
```

**示例 2：**

```
输入：nums = [2,2,3,3,3,4]
输出：9
解释：
删除 3 获得 3 个点数，接着要删除两个 2 和 4 。
之后，再次删除 3 获得 3 个点数，再次删除 3 获得 3 个点数。
总共获得 9 个点数。
```

**提示：**

*   `1 <= nums.length <= 2 * 10<sup>4</sup>`
*   `1 <= nums[i] <= 10<sup>4</sup>`

#### Solution





###  解题思路

这个问题也可以转化为 求有向图的最长路径问题

建模方法：

1. 设 有向图的边权 为 收益
2.  $f(i->j) = w_{i,j}$



由于删除 u 就删除了所有的 u-1 和 u + 1, 这里 我们就可以理解为打家劫舍问题



$dp[i] = max(dp[i-1],dp[i-2] + profit(i))$









Language: ****

```cpp
class Solution {
public:
    int deleteAndEarn(vector<int>& nums) {
        int n = nums.size();
        if(n == 0) return 0;
        unordered_map<int,int> dp , cnt;
        int up = -1;
        for(int u: nums) {
            cnt[u] ++;
            up = max(up,u);

        }
        for(int i=1;i<=up;++i) {
            dp[i] = max(dp[i-1] , dp[i-2] + cnt[i]*i);
        }


       
        return dp[up];
    }
};
```





