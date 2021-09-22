---
title: "lc.1392.最长快乐前缀"
date: 2021-08-14T22:42:48+08:00
draft: false

---









### [1392\. 最长快乐前缀](https://leetcode-cn.com/problems/longest-happy-prefix/)

Difficulty: **困难**


「快乐前缀」是在原字符串中既是 **非空** 前缀也是后缀（不包括原字符串自身）的字符串。

给你一个字符串 `s`，请你返回它的 **最长快乐前缀**。

如果不存在满足题意的前缀，则返回一个空字符串。

**示例 1：**

```
输入：s = "level"
输出："l"
解释：不包括 s 自己，一共有 4 个前缀（"l", "le", "lev", "leve"）和 4 个后缀（"l", "el", "vel", "evel"）。最长的既是前缀也是后缀的字符串是 "l" 。
```

**示例 2：**

```
输入：s = "ababab"
输出："abab"
解释："abab" 是最长的既是前缀也是后缀的字符串。题目允许前后缀在原字符串中重叠。
```

**示例 3：**

```
输入：s = "leetcodeleet"
输出："leet"
```

**示例 4：**

```
输入：s = "a"
输出：""
```

**提示：**

*   `1 <= s.length <= 10^5`
*   `s` 只含有小写英文字母


#### Solution

Language: ****

```cpp
class Solution {
public:
    string longestPrefix(string s) {
        int n = s.size();
        vector<int> fail(n, -1);
        for (int i = 1; i < n; ++i) {
            int j = fail[i - 1];
            while (j != -1 && s[j + 1] != s[i]) {
                j = fail[j];
            }
            if (s[j + 1] == s[i]) {
                fail[i] = j + 1;
            }
        }
        return s.substr(0, fail[n - 1] + 1);
    }
};
```





###  另一种写法

```cpp
class Solution {
public:
    string longestPrefix(string s) {
        int n = s.size();
        vector<int> fail(n, -1);
        for (int i = 1,j=-1; i < n; ++i) {
            while(j!=-1 && s[j+1] != s[i]) j = fail[j];
            if(s[j+1 ] == s[i]) ++j;
            fail[i] = j;
            
        }
        return s.substr(0, fail[n - 1] + 1);
    }
};
```

