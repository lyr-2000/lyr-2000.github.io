## 2020/04/16 一面 视频面  75min 漫长的75min面到我电脑没电（我尽量回忆）
自我介绍 做了哪些项目

1. 根据项目依次说一下在项目遇到什么问题，用的什么技术栈，整个项目的开发流程是怎样的，你在其中充当什么角色
    - 比较重视你在项目开发过程中是怎么处理的，为什么要做这个项目
    （这个时候就是吹水时间，但要记得说你会的，事先要了解好你这个项目的流程）
2. 跨域问题
    - 为什么会跨域，你怎么解决的
    - 浏览器跨域怎么解决
3. 我简历写的XSS攻击 他问我有没有了解过DOS攻击、CSRF攻击
    - 我说了解CSRF,之后开始巴拉巴拉
    - 问了SQL注入原理，前后端怎么避免
4. http和https区别
5. https优势在哪，加密方式
    - 说完之后问我https怎么确保在不同站点的传输安全（我不会但是我会使劲扯，扯到小哥自己给我解释一遍，这个过程可以跟面试官做个互动要让他觉得你是有真的在思考）
6. TCP三次握手流程，为什么不是二次握手
    - tcp和udp区别
7. http响应状态码
8. http常见请求方法，用过哪些
9. 项目怎么处理会话识别的，前后端是怎样的（我说当时用的token,之后开始讲token机制
    - 问到cookie
10. 性能优化
    - 请求优化（缓存）、渲染优化
    - 我回答的都是请求过程的一个渲染优化，之后问要是在客户端怎么优化渲染
    - 涉及SSR
    
11. 深拷贝怎么实现，原理
12. async/await用过吗，解释一下
    - 如何用es5实现async/await

vue
13. 假设一个组件A，一个组件B，需求是用这两个组件形成新的组件（最少代码），可以怎么处理
    - 这个我当时懵了，使劲扯组件嵌套、export\import，router-view
    - 小哥说尝试用插槽
14. 数据双向绑定的原理
15. 组件之间的通信
16. 生命周期
（其他不记得了）

css
17. position属性
18. 垂直居中的方式
    - 已知宽高
    - 未知宽高
19. 让一个盒子隐蔽有哪几种方式(说的越多越好)
    - display/visibility
    - position
    - margin
    - z-index
    - 透明度

20. 设计图处理，一般拿到设计图是什么格式的，你会怎么处理

## 2020/04/16 二面  痛苦煎熬 35min 电话面
 1. 介绍一下自己，做过哪些项目，平时成绩，最好的科目和最差的科目，分数多少，有学数据结构跟算法吗
 2. 说一下实践经历（个人感觉学生会社团那些不要过分花时间说你在其中担当什么职务简单带过就好，尽量说一下你是怎么处理学习跟课外活动的时间分配，你的一个学习过程）
 3. http1.0 http2.0 http2.2区别，http3.0可以怎么优化
    - 怎么解决现在http2.0的缺陷，你会怎么设计http3.0 (可怕我完全没想过这个问题，期间扯到udp，我不会但小哥一直追问)
    - http2.0 为什么用二进制格式，安全吗？ 怎么避免被篡改
    - 为什么使用udp，优缺点
 4. 了解过node吗，程度在哪里，自己有搭建过类似博客的网站吗
    - 怎么搭建一个博客，不使用任何框架的话，整个流程是怎样的
    - 了解过云服务吗
    - pc端、移动端、桌面端可以怎么构建了解过吗，知道有哪些库吗（之后说了一堆我没听过的库）
        - 提到pwa，问怎么处理，优点在哪
    - 你的后台处理能力是怎样的，单纯部署一个博客包括前后台逻辑处理你觉得你需要多久，加上性能优化你又需要多久
        - （我后面问他你是不是想要我全栈开发，小哥说是是是我就是这个意思，你全栈开发要花多久时间学习，我：？？？）
5. 你的学习过程是怎样的，有做过总结吗，你觉得你之后学习的方向在哪（我答网络和性能优化）
   - 了解我的学习深度跟广度，说了一堆我没听过的库和框架，这个过程很煎熬不要直接说没接触过，没接触过也要使劲扯（主要是看我的广度）
（记得的大概就是这些，二面问的都是网络、后台怎么处理（全栈）和前端学习广度的问题，非常煎熬，我都想直接说我不会，放过我吧）

## 2020/04/17 三面 35min
 1. 介绍一下自己，做过哪些项目，前后端怎么分工，哪个项目最有亮点，项目当中有哪些模块展开说说，遇到哪些难点
 2. 说一下自己的技术优势在哪（我技术学习社团都扯了，感觉要让面试官觉得你是一个有目标、有规划的人）
 3. 平时用的什么语言
 4. 浏览器的兼容性怎么解决
 5. 二分查找、二叉树原理是什么，哪一种更好（树），说一下为什么
 （基本上是这些）


## 2020/4/18 15min  hr面 电话面
1. 自我介绍、介绍项目经历、校园经历
2. 为什么学习前端
3. 了解家庭背景
4. 技术、学习或者性格上还有什么不足、短板
5. 再简单描述一下当时做的项目背景（为什么去做这个项目、是自主去开发还是有老师提出来指导你们只是项目的执行者）