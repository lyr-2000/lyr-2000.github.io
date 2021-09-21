---
title: "lc.1363.形成3的最大倍数"
date: 2021-08-14T22:42:48+08:00
draft: false

---

### [1363\. 形成三的最大倍数](https://leetcode-cn.com/problems/largest-multiple-of-three/)

Difficulty: **困难**


给你一个整数数组 `digits`，你可以通过按任意顺序连接其中某些数字来形成 **3** 的倍数，请你返回所能得到的最大的 3 的倍数。

由于答案可能不在整数数据类型范围内，请以字符串形式返回答案。

如果无法得到答案，请返回一个空字符串。

**示例 1：**

```
输入：digits = [8,1,9]
输出："981"
```

**示例 2：**

```
输入：digits = [8,6,7,1,0]
输出："8760"
```

**示例 3：**

```
输入：digits = [1]
输出：""
```

**示例 4：**

```
输入：digits = [0,0,0,0,0,0]
输出："0"
```

**提示：**

*   `1 <= digits.length <= 10^4`
*   `0 <= digits[i] <= 9`
*   返回的结果不应包含不必要的前导零。



###  解题思路

一个数能被 3 整除，当且仅当它的各位数字之和能被 3 整除。例如数 981，它的各位数字之和为 9 + 8 + 1 = 18 能被 3 整除，同时 981 也能被 3 整除。

作者：LeetCode-Solution
链接：https://leetcode-cn.com/problems/largest-multiple-of-three/solution/xing-cheng-san-de-zui-da-bei-shu-by-leetcode-solut/
 





#####  01 背包解法

$ dp[i][j] = max(dp[i-1][j] , dp[i-1][ mod(j - digits[i-1] ,3)] + 1) $




#### Solution

Language: ****

```cpp
class Solution {
public:
    string largestMultipleOfThree(vector<int>& digits) {
        int n = digits.size();
        sort(digits.begin(),digits.end() );
        vector<vector<int> > f(n+1, vector<int>(3, INT_MIN/2));
        f[0][0] = 0;
        //01 背包问题
        for(int i=1;i<=n;++i) {
            for(int j=2;j>=0;--j) {
                f[i][j] = max(f[i-1][j],f[i-1][ ( (j - digits[i-1])%3 + 3 )%3] + 1);

            }
        }
        string res;
        for(int i=n,j=0;i;--i) {
            if(f[i][j] == f[i-1][ ( (j -digits[i-1]%3)  +3 )%3 ] + 1) {
                res += to_string(digits[i-1]);
                j =   ( (j -digits[i-1]%3) +3  ) % 3;
                if(res == "0") return res;
            }
        }
        return res;
    }
};
```