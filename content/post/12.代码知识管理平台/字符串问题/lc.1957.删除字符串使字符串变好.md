---
title: "lc.1957.删除字符串使字符串变好"
date: 2021-08-14T22:42:48+08:00
draft: false

---



 

### [1957\. 删除字符使字符串变好](https://leetcode-cn.com/problems/delete-characters-to-make-fancy-string/)

Difficulty: **简单**


一个字符串如果没有 **三个连续** 相同字符，那么它就是一个 **好字符串** 。

给你一个字符串 `s` ，请你从 `s` 删除 **最少** 的字符，使它变成一个 **好字符串** 。

请你返回删除后的字符串。题目数据保证答案总是 **唯一的** 。

**示例 1：**

```
输入：s = "leeetcode"
输出："leetcode"
解释：
从第一组 'e' 里面删除一个 'e' ，得到 "leetcode" 。
没有连续三个相同字符，所以返回 "leetcode" 。
```

**示例 2：**

```
输入：s = "aaabaaaa"
输出："aabaa"
解释：
从第一组 'a' 里面删除一个 'a' ，得到 "aabaaaa" 。
从第二组 'a' 里面删除两个 'a' ，得到 "aabaa" 。
没有连续三个相同字符，所以返回 "aabaa" 。
```

**示例 3：**

```
输入：s = "aab"
输出："aab"
解释：没有连续三个相同字符，所以返回 "aab" 。
```

**提示：**

*   `1 <= s.length <= 10<sup>5</sup>`
*   `s` 只包含小写英文字母。


#### Solution

Language: ****

```cpp
class Solution {
public:
    string makeFancyString(string s) {
        int n = s.size();
        string res;
        for(int i=0;i<n;++i) {
            char cur = s[i];
            int skip = 0;
            while(i + skip < n && cur == s[i + skip]) {
                ++skip;
            }
            if (skip  < 3) {
                // 跳过 1次
                for(int j=0;j<skip;++j) res.push_back(cur);
            }else {
                //skip >=3
                for(int j=0;j<2;++j) res.push_back(cur);
            }
             i = i+ skip -1;
        }
        return res;
    }
};
```

