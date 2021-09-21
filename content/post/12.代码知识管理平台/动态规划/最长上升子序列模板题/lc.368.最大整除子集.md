---
title: "lc.368.最大整除子集"
date: 2021-08-14T22:42:48+08:00
draft: false


---

 





### [368\. 最大整除子集](https://leetcode-cn.com/problems/largest-divisible-subset/)

Difficulty: **中等**

给你一个由 **无重复** 正整数组成的集合 `nums` ，请你找出并返回其中最大的整除子集 `answer` ，子集中每一元素对 `(answer[i], answer[j])` 都应当满足：

*   `answer[i] % answer[j] == 0` ，或
*   `answer[j] % answer[i] == 0`

如果存在多个有效解子集，返回其中任何一个均可。

**示例 1：**

```
输入：nums = [1,2,3]
输出：[1,2]
解释：[1,3] 也会被视为正确答案。
```

**示例 2：**

```
输入：nums = [1,2,4,8]
输出：[1,2,4,8]
```

**提示：**

*   `1 <= nums.length <= 1000`
*   `1 <= nums[i] <= 2 * 10<sup>9</sup>`
*   `nums` 中的所有整数 **互不相同**

#### Solution







####  解题思路

转化为有向图的最长路径求解



![https://pic.leetcode-cn.com/1619113882-RQBrmp-image.png](https://pic.leetcode-cn.com/1619113882-RQBrmp-image.png)













Language: ****

```cpp
class Solution {
public:
    vector<int> largestDivisibleSubset(vector<int>& nums) {
        if(nums.size() == 0) return {};
        int n = nums.size();
        sort(nums.begin(), nums.end() );
        vector<int> dp(n+1);
        int pos = 0;
        for(int i=0;i<n;++i) {
            dp[i] = 1;
             
            for(int j=0;j<i;++j) {
                if( nums[i]  % nums[j] == 0) {
                    dp[i] = max(dp[i],dp[j] + 1);
                }
            }
            if(dp[pos] < dp[i]) pos = i;
        }
        vector<int> res;
        // if(dp[pos] >= 1) {
        res.push_back(nums[pos]);
        // }
        while(dp[pos] > 1) {
            for(int i=0;i<pos;++i) {
                if(nums[pos] % nums[i] == 0) {
                    if(dp[pos] == dp[i] + 1) {
                        res.push_back(nums[i]);
                        pos = i;
                        break;
                    }
                }
            }
        }
        return res;

    }
};
```





#### 其他作者的代码



```cpp

class Solution {
public:

    vector<int> largestDivisibleSubset(vector<int>& nums) {
        int n = nums.size();
        //获得有序数组
        sort(nums.begin(),nums.end());
        //matrix[i].first  代表 到该节点的最长步数
        //matrix[i].second 代表 最长步数时的上一个节点
        vector<pair<int,int>> matrix(n,pair<int,int>(0,0));

        int maxDis = -1;
        int maxPos ;
        //从前往后遍历
        for(int i = 0 ; i < n ; i++){
            for(int j = i+1 ; j < n ; j++){
                if(nums[j]%nums[i]==0){
                    //满足题目条件的情况下
                    //若从当前节点（i）往目标节点（j）的步数较之前的元素更大，则更新最长步数与上一个节点
                    if( matrix[i].first+1 >matrix[j].first){
                        matrix[j] = pair<int,int>(matrix[i].first+1,i);
                    }
                }
            }
            //每一轮遍历结束后检查是否为最大值（当前节点i的最大步数只由i之前的元素决定）
            //记录下最大值所在的位置
            if(matrix[i].first>maxDis){
                maxDis = matrix[i].first;
                maxPos = i;
            }
        }
        //根据最大步数所在的位置，逆向推出所选子集
        vector<int> re;
        re.push_back(nums[maxPos]);
        int nowpos = maxPos;
        while(matrix[nowpos].first!=0){
            re.push_back(nums[matrix[nowpos].second]);
            nowpos=matrix[nowpos].second;
        }
        return re;
    }
};

 
```

作者：jyj-4
链接：https://leetcode-cn.com/problems/largest-divisible-subset/solution/c-zhuan-hua-wei-you-xiang-tu-de-zui-chan-qdii/