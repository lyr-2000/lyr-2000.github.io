---
title: "lc.354.俄罗斯套娃信封问题"
date: 2021-08-14T22:42:48+08:00
draft: false



---

 









### [354\. 俄罗斯套娃信封问题](https://leetcode-cn.com/problems/russian-doll-envelopes/)

Difficulty: **困难**


给你一个二维整数数组 `envelopes` ，其中 `envelopes[i] = [w<sub style="display: inline;">i</sub>, h<sub style="display: inline;">i</sub>]` ，表示第 `i` 个信封的宽度和高度。

当另一个信封的宽度和高度都比这个信封大的时候，这个信封就可以放进另一个信封里，如同俄罗斯套娃一样。

请计算 **最多能有多少个** 信封能组成一组“俄罗斯套娃”信封（即可以把一个信封放到另一个信封里面）。

**注意**：不允许旋转信封。

**示例 1：**

```
输入：envelopes = [[5,4],[6,4],[6,7],[2,3]]
输出：3
解释：最多信封的个数为 3, 组合为: [2,3] => [5,4] => [6,7]。
```

**示例 2：**

```
输入：envelopes = [[1,1],[1,1],[1,1]]
输出：1
```

**提示：**

*   `1 <= envelopes.length <= 5000`
*   `envelopes[i].length == 2`
*   `1 <= w<sub style="display: inline;">i</sub>, h<sub style="display: inline;">i</sub> <= 10<sup>4</sup>`

#### Solution





###  解题思路分析

原理：

1. 先对数组排序， 转化为一个 从小到大顺序的 数组
2. 这个问题就可以理解为 求 有向图的最长路径
   1. 定义 $result_{路径大小} = dist(e1,e2,e3...e_n)$
   2. 这样就可以理解为最长上升子序列模型 并且求解





Language: ****

```cpp
inline bool cmp(vector<int> & a, vector<int> &b) {
    if (a[0] == b[0]) {
        return a[1] < b[1];
    }
    return a[0] < b[0];
}
 

class Solution {
public:
    int maxEnvelopes(vector<vector<int>>& envelopes) {
        sort(envelopes.begin(),envelopes.end(), cmp);

        int n = envelopes.size();
        vector<int> dp(n,0);
        int maxLen = 0;
        for(int i=0;i<n;++i) {
            dp[i] = 1;
            for(int j=0;j<i;++j) {
                int dx = envelopes[i][0] - envelopes[j][0];
                int dy = envelopes[i][1] - envelopes[j][1];
                if ( dx > 0 && dy > 0) {
                    dp[i] = max(dp[i],dp[j] + 1);
                }
            }
            maxLen = max(maxLen, dp[i]);
        }
        return maxLen;


    }
};
```

