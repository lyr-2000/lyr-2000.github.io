---
title: "lc.1390.四因数"
date: 2021-08-14T22:42:48+08:00
draft: false

---





### [1390\. 四因数](https://leetcode-cn.com/problems/four-divisors/)

Difficulty: **中等**


给你一个整数数组 `nums`，请你返回该数组中恰有四个因数的这些整数的各因数之和。

如果数组中不存在满足题意的整数，则返回 `0` 。

**示例：**

```
输入：nums = [21,4,7]
输出：32
解释：
21 有 4 个因数：1, 3, 7, 21
4 有 3 个因数：1, 2, 4
7 有 2 个因数：1, 7
答案仅为 21 的所有因数的和。
```

**提示：**

*   `1 <= nums.length <= 10^4`
*   `1 <= nums[i] <= 10^5`


#### Solution

Language: ****

```cpp
class Solution {
public:
    int sumFourDivisors(vector<int>& nums) {
        int  res=0;

        for(int u: nums) {
            int sum =0,cnt = 0;
            for(int i=1;i*i<=u;++i) {
                if(u % i == 0) 
                {
                    cnt++;
                    sum += i; 
                    if(u/i != i) {
                        cnt ++;
                        sum += u/i;
                    }
                }
               
             
            }
           //  printf("%d %d\n",sum,cnt);
            if(cnt ==  4) {
                res += sum;
            }
        }
        return res;
    }
};
```











###  预处理解法

**预备知识**

- [算数基本定理](https://baike.baidu.com/item/%E7%AE%97%E6%9C%AF%E5%9F%BA%E6%9C%AC%E5%AE%9A%E7%90%86)
  
- [埃拉托斯特尼筛法](https://baike.baidu.com/item/%E5%9F%83%E6%8B%89%E6%89%98%E6%96%AF%E7%89%B9%E5%B0%BC%E7%AD%9B%E6%B3%95) 或更高级的欧拉筛法





```cpp
class Solution {
public:
    int sumFourDivisors(vector<int>& nums) {
        // C 是数组 nums 元素的上限，C3 是 C 的立方根
        int C = 100000, C3 = 46;
        
        vector<int> isprime(C + 1, 1);
        vector<int> primes;

        // 埃拉托斯特尼筛法
        for (int i = 2; i <= C; ++i) {
            if (isprime[i]) {
                primes.push_back(i);
            }
            for (int j = i + i; j <= C; j += i) {
                isprime[j] = 0;
            }
        }

        // 欧拉筛法
        /*
        for (int i = 2; i <= C; ++i) {
            if (isprime[i]) {
                primes.push_back(i);
            }
            for (int prime: primes) {
                if (i * prime > C) {
                    break;
                }
                isprime[i * prime] = 0;
                if (i % prime == 0) {
                    break;
                }
            }
        }
        */
        
        // 通过质数表构造出所有的四因数
        unordered_map<int, int> factor4;
        for (int prime: primes) {
            if (prime <= C3) {
                factor4[prime * prime * prime] = 1 + prime + prime * prime + prime * prime * prime;
            }
        }
        for (int i = 0; i < primes.size(); ++i) {
            for (int j = i + 1; j < primes.size(); ++j) {
                if (primes[i] <= C / primes[j]) {
                    factor4[primes[i] * primes[j]] = 1 + primes[i] + primes[j] + primes[i] * primes[j];
                }
                else {
                    break;
                }
            }
        }

        int ans = 0;
        for (int num: nums) {
            if (factor4.count(num)) {
                ans += factor4[num];
            }
        }
        return ans;
    }
};

 
```

