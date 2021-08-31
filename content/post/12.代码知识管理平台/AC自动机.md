---
title: "ac自动机"
date: 2021-08-14T22:42:48+08:00
draft: false
---



## ac自动机算法



### ac自动机图示

![https://gimg2.baidu.com/image_search/src=http%253A%252F%252Fimg2018.cnblogs.com%252Fblog%252F1822986%252F202001%252F1822986-20200124041147668-310016003.jpg&refer=http%253A%252F%252Fimg2018.cnblogs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632842265&t=49981f5323f9dd21ea9b497f80d7434e](https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg2018.cnblogs.com%2Fblog%2F1822986%2F202001%2F1822986-20200124041147668-310016003.jpg&refer=http%3A%2F%2Fimg2018.cnblogs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632842265&t=49981f5323f9dd21ea9b497f80d7434e)



### KMP 算法原理



```cpp
#include <bits/stdc++.h>
#define next abcdefg
using namespace std;
const int MAXN  = 1E6+10;
int next[MAXN];
int n,m;
//string p,q;
char p[MAXN],q[MAXN];

void kmp() {
    for(int i=2;i<=n;++i) {
        //0
        int j = next[i-1];
        //前面相等，后面不相等
        while(j && p[i] != p[j+1]) j=next[j];
        if(p[i] == p[j+1]) ++j;//j==0,并且 p[i] == p[1] ,和第1个相等，前缀长度+1
        next[i] = j;
    }
    for(int i=1,j=0;i<=m;++i) {
       //int j=next[i-1];
        while(j && q[i] != p[j+1]) j=next[j];
        if(q[i] == p[j+1]) ++j;
        if(j==n) {
            //前缀长度为n,完全匹配
            printf("%d ", i-j);
            j = next[j];
        }
    }
}

int main()
{
    cin>>n>>p+1>>m>>q+1;
    kmp();
    return 0;
}
```



### ac自动机解题代码



```
 while(hh<=tt)
    {
        int t = q[hh++];//队列popleft
        for(int i=0;i<26;i++)
        {
            int p = tr[t][i];//p:自动机中某个第i层结点的idx -> KMP中的i 
            // if(p)
            // {
            //     int j = ne[t];
            //     while(j && !tr[j][i]) j = ne[j];
            //     if(tr[j][i]) j = tr[j][i];
            //     ne[p] = j;
            //     q[++tt] = p;
            // }
            // 优化思路 在没有匹配时 把while循环多次跳 优化为 直接跳到ne指针最终跳到的位置
            // 数学归纳法
            // 假定在循环第i层时，前i-1层都求对了
            // 在第i层没找到字母i,那么去第i-1层父结点t的next指针的位置就是它最终应该跳到的位置
            if(!p) tr[t][i] = tr[ne[t]][i];//ne[t]:j  如果不存在儿子tr[t][i]的话
            // 如果存在儿子节点 则对儿子节点的next指针赋值为tr[ne[t]][i]
            else
            {
                ne[p] = tr[ne[t]][i];
                q[++tt] = p;
            }
        }
 
```







### 例题



给定 nn 个长度不超过 5050 的由小写英文字母组成的单词，以及一篇长为 mm 的文章。

请问，有多少个单词在文章中出现了。

#### 输入格式

第一行包含整数 TT，表示共有 TT 组测试数据。

对于每组数据，第一行一个整数 nn，接下去 nn 行表示 nn 个单词，最后一行输入一个字符串，表示文章。

#### 输出格式

对于每组数据，输出一个占一行的整数，表示有多少个单词在文章中出现。

#### 数据范围

1≤n≤1041≤n≤104,
1≤m≤1061≤m≤106

#### 输入样例：

```
1
5
she
he
say
shr
her
yasherhs
```

#### 输出样例：

```
3
```





### 解题代码



```cpp
#include <bits/stdc++.h>
#define next abcde
using namespace std;
const int MAXN = 1e4+10;
const int MAXM = 1e6+10;
char article[MAXM];
char str[MAXM];
//小写英文
int son[MAXN*55][26],flag;
int word_cnt[MAXN*55];
int next[MAXN*55];
int n,t;
void insert() 
{
    int len = strlen(str);
    int p= 0;
    for(int i=0;i<len;++i)
    {
        int pos = str[i] - 'a';
        if(son[p][ pos ] ==0) son[p][ pos ] = ++flag;
        p = son[p][pos];    
    }
    word_cnt[p]++;
    
}

void build() 
{
    queue<int> q;
    for(int i=0;i<26;++i)
    {
        if(son[0][i]) q.push(son[0][i]);
    }
    while(q.size()) {
        int t = q.front();q.pop();
        for(int i=0;i<26;++i) {
            int j = next[t];
            int id = son[t][i];
            if(id) {
                //存在子节点
                while(j && son[j][i] == 0) j = next[j]; //不存在 t的下一位和 i相等
                if(son[j][i]) j = son[j][i];//相当于 j++;
                next[id] = j;
                //入队
                q.push(id);//层序遍历
            }
        }
    }
}
void handle() {
    memset(son,0,sizeof son);
    memset(next,0,sizeof next);
    memset(word_cnt,0,sizeof word_cnt);
    for(int i=0;i<n;++i) {
        cin>>str;
        insert();
    }
    build();
    cin>>str;
    int res=0;
    for(int i=0,j=0;str[i];++i) {
        int t = str[i] - 'a';
        while(j && !son[j][t]) j = next[j];
        if(son[j][t]) j = son[j][t];
        int p = j;
        while(p) {
            res += word_cnt[p];
            word_cnt[p] = 0;
            p = next[p];
        }
    }
    cout << res <<endl;
    
}
int main()
{
    cin>>t;
    while(t--) {
        cin>>n;
        handle();
    }
    
    
    
    return 0;
}
```

###  修复DNA



生物学家终于发明了修复DNA的技术，能够将包含各种遗传疾病的DNA片段进行修复。

为了简单起见，DNA看作是一个由’A’, ‘G’ , ‘C’ , ‘T’构成的字符串。

修复技术就是通过改变字符串中的一些字符，从而消除字符串中包含的致病片段。

例如，我们可以通过改变两个字符，将DNA片段”AAGCAG”变为”AGGCAC”，从而使得DNA片段中不再包含致病片段”AAG”，”AGC”，”CAG”，以达到修复该DNA片段的目的。

需注意，被修复的DNA片段中，仍然只能包含字符’A’, ‘G’ , ‘C’ , ‘T’。

请你帮助生物学家修复给定的DNA片段，并且修复过程中改变的字符数量要尽可能的少。

#### 输入格式

输入包含多组测试数据。

每组数据第一行包含整数N，表示致病DNA片段的数量。

接下来N行，每行包含一个长度不超过20的非空字符串，字符串中仅包含字符’A’, ‘G’ , ‘C’ , ‘T’，用以表示致病DNA片段。

再一行，包含一个长度不超过1000的非空字符串，字符串中仅包含字符’A’, ‘G’ , ‘C’ , ‘T’，用以表示待修复DNA片段。

最后一组测试数据后面跟一行，包含一个0，表示输入结束。

#### 输出格式

每组数据输出一个结果，每个结果占一行。

输入形如”Case x: y”，其中x为测试数据编号（从1开始），y为修复过程中所需改变的字符数量的最小值，如果无法修复给定DNA片段，则y为”-1”。

#### 数据范围

1≤N≤501≤N≤50

#### 输入样例：

```
2
AAA
AAG
AAAG    
2
A
TG
TGAATG
4
A
G
C
T
AGT
0
```

#### 输出样例：

```
Case 1: 1
Case 2: 4
Case 3: -1
```





### 解题代码



```cpp
#include <bits/stdc++.h>
#define  next fail
#define dp f
using namespace std;

const int MAXN = 60, MAXLEN = 1010,INF = 0x3f3f3f3f;
char str[MAXLEN],word[MAXLEN] ;
int next[MAXLEN];
int n,m;
int tr[MAXLEN][4],dp[MAXLEN][MAXLEN],flag;
int get(char c) {
    if (c=='A') return 0;
    if (c=='G') return 1;
    if (c == 'C') return 2;
    return 3;
}
int T;
void insert() {
    int p=0;
    for(int i=1;str[i];++i) {
        int t = get(str[i]);
        if(tr[p][t] ==0) tr[p][t]= ++flag;
        p = tr[p][t];
    }
    word[p] = 1;
}
void build() {
    queue<int> q;
    for(int i=0;i<4;++i) {
        if(tr[0][i]) q.push(tr[0][i]);
    }
    while(q.size()) {
        int parent = q.front();q.pop();
        for(int i=0;i<4;++i) {
            int id = tr[parent][i];
            if(!id) {
                tr[parent][i] = tr[next[parent]][i];
            }else {
                next[id] = tr[next[parent]][i];
                q.push(id);
                word[id] |= word[next[id]];
            }
         
        }
    }
}
 
void handle() {
    
    //有问题的 DNA数量
    for(int i=0;i<n;++i) 
    {
        cin>> str+1;
        //病毒串
        insert();
    }
    build();
    cin>> str+1;
    m = strlen(str+1);
    //状态表示f[i][j]: 考虑主串中前i个字符，且当前自动机匹配到下标是j的方案
    dp[0][0] = 0;
    for(int i=1;i<=m;++i) {
        //char cur = str[i];
        //枚举 ac自动机里面的所有 node
        for(int j=0;j<=flag;++j) {
            for(int k=0;k<4;++k) {
                int t = get(str[i]) !=k;
                int id = tr[j][k];
                if(!word[id]) {
                    //没有走到这个节点，可以加起来
                    //表示 走到 id 这个状态的话，总数有多少条路径
                    dp[i][id] = min(dp[i][id],dp[i-1][j] + t);
                }
            }
        }
        
    }
    int res = INF;
    for(int i=0;i<=flag;++i)
        res = min(res,dp[m][i]);
    if( res == INF) res = -1;
    printf("Case %d: %d\n",++T,res);
    
}

int main()
{
    // int t;
    while(cin>>n,n) {
        memset(dp,0x3f,sizeof dp);
        memset(word,0,sizeof word);
        memset(tr,0,sizeof tr);
        memset(next,0,sizeof next);
        flag = 0;
        handle();
    }
   
    
    return 0;
    
    
}
```





