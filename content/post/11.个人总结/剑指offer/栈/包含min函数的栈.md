---
title: "包含min函数的栈"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---

## 包含min函数的栈

设计一个支持push，pop，top等操作并且可以在$O(1)$时间内检索出最小元素的堆栈。

- push(x)–将元素x插入栈中
- pop()–移除栈顶元素
- top()–得到栈顶元素
- getMin()–得到栈中最小元素

#### 样例

```
MinStack minStack = new MinStack();
minStack.push(-1);
minStack.push(3);
minStack.push(-4);
minStack.getMin();   --> Returns -4.
minStack.pop();
minStack.top();      --> Returns 3.
minStack.getMin();   --> Returns -1.
```





## 解题代码



``` cpp
class MinStack {
public:
    /** initialize your data structure here. */
    MinStack() {
        
    }
    stack<int > s;
    stack<int> ms;
    void push(int x) {
        s.push(x);
        if(ms.size() == 0) ms.push(x);
        else ms.push(min(x, ms.top()));
    }
    
    void pop() {
        ms.pop();
        s.pop();
        
    }
    
    int top() {
        return s.top();
    }
    
    int getMin() {
        return ms.top();
    }
};

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack obj = new MinStack();
 * obj.push(x);
 * obj.pop();
 * int param_3 = obj.top();
 * int param_4 = obj.getMin();
 */
```

