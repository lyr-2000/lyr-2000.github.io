---
title: "链表倒数第K个节点"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---

## 链表倒数第K个节点

输入一个链表，输出该链表中倒数第 kk 个结点。

**注意：**

- `k >= 1`;
- 如果 kk 大于链表长度，则返回 NULL;

#### 样例

```
输入：链表：1->2->3->4->5 ，k=2

输出：4
```





## 解题代码

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* findKthToTail(ListNode* pListHead, int k) {
        int fcnt = 0,skip = 0;
        ListNode * p = pListHead;
        int K = k;
        while(k--) {
            if(p==NULL) break;
            p = p->next;
            skip++;
        }
       // printf("skip:=%d,k:=%d\n",skip,k);
        if(skip < K) return NULL;
        //printf("skip:=%d,k:=%d\n",skip,k);
        ListNode *q = pListHead;
        while(p) {
            p = p->next;
            q = q->next;
        }
        //cout << q ->val <<endl;
        return q;
    }
};
```

