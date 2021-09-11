---
title: "最小的k个数"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR

---

## 最小的 k个数





输入 n  个整数，找出其中最小的 k 个数。

**注意：**

- 输出数组内元素请按从小到大顺序排序;

#### 数据范围

$1≤k≤n≤1000$

 

#### 样例

```
输入：[1,2,3,4,5,6,7,8] , k=4

输出：[1,2,3,4]
```







## 解题代码



```cpp
class Solution {
public:
    vector<int> getLeastNumbers_Solution(vector<int> input, int k) {
        priority_queue<int> q;
        for(int u :input) {
            
            q.push(u);
            if(q.size() > k) q.pop();
        }
        if(q.size() > k) q.pop();
        vector<int> res;
        while(q.size()) res.push_back(q.top()), q.pop();
        reverse(res.begin(),res.end());
        
        return res;
        
        
    }
};
```



