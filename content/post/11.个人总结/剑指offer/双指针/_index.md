---
title: "双指针"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR

---





请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。

假设字符串中只包含从 `a` 到 `z` 的字符。

#### 样例

```
输入："abcabc"

输出：3
```

```cpp
class Solution {
public:
    int longestSubstringWithoutDuplication(string s) {
        unordered_map<char,int> mp;
        int i=0,j=0;
        int n=s.size();
        int ans=0;
        while(i<n) {
            mp[s[i]]++;
            if(mp[s[i]]>1) {
                while(j<n && mp[s[i]] > 1) {
                    mp[s[j++]]--;
                }
            }
            ans =max(ans, i - j + 1);
            ++i;
        }
        return ans;
    }
};
```

