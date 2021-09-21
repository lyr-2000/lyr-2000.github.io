---
title: "等差数列划分 II -子序列"
date: 2021-08-14T22:42:48+08:00
draft: false

---











### [446\. 等差数列划分 II - 子序列](https://leetcode-cn.com/problems/arithmetic-slices-ii-subsequence/)

Difficulty: **困难**


给你一个整数数组 `nums` ，返回 `nums` 中所有 **等差子序列** 的数目。

如果一个序列中 **至少有三个元素** ，并且任意两个相邻元素之差相同，则称该序列为等差序列。

*   例如，`[1, 3, 5, 7, 9]`、`[7, 7, 7, 7]` 和 `[3, -1, -5, -9]` 都是等差序列。
*   再例如，`[1, 1, 2, 5, 7]` 不是等差序列。

数组中的子序列是从数组中删除一些元素（也可能不删除）得到的一个序列。

*   例如，`[2,5,10]` 是 `[1,2,1,_**2**_,4,1,**_5_**,_**10**_]` 的一个子序列。

题目数据保证答案是一个 **32-bit** 整数。

**示例 1：**

```
输入：nums = [2,4,6,8,10]
输出：7
解释：所有的等差子序列为：
[2,4,6]
[4,6,8]
[6,8,10]
[2,4,6,8]
[4,6,8,10]
[2,4,6,8,10]
[2,6,10]
```

**示例 2：**

```
输入：nums = [7,7,7,7,7]
输出：16
解释：数组中的任意子序列都是等差子序列。
```

**提示：**

*   `1  <= nums.length <= 1000`
*   `-2<sup>31</sup> <= nums[i] <= 2<sup>31</sup> - 1`


#### Solution

Language: ****

```cpp
class Solution {
public:
    int numberOfArithmeticSlices(vector<int>& nums) {
        #define ll long long

        int n = nums.size();
        unordered_map<ll,ll> dp[n];
        int ans = 0;
        for(int i=0;i<n;++i) {
            for(int j=0;j<i;++j) {
                ll d = (ll)nums[i] - nums[j];
                int cnt = dp[j][d];
                ans += cnt;
                dp[i][d] = dp[i][d] + cnt + 1;
            }
        }
        return ans;

    }
};


```

