---
title: "git学习"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR

---



###  git 有3个状态





工作区 -> 暂存区 -> 版本库

[练习 git 网站](https://learngitbranching.js.org/?locale=zh_CN)





有一个head 指针指向 当前暂存区的节点， 如果我提交新代码到暂存区

就新增加一个节点，内容复制到新节点里面，并且将 head 指向这个新节点



![https://upload-images.jianshu.io/upload_images/14340223-46fb90f6af8af539.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/500/format/webp](https://upload-images.jianshu.io/upload_images/14340223-46fb90f6af8af539.png?imageMogr2/auto-orient/strip|imageView2/2/w/500/format/webp)

工作区 -> git add . -> 暂存区 --> git commit  --> 版本库



```shell
git log 
# git log 查看日志
git reset --hard  HEAD^
git reset --hard  HEAD~
# 都表示回退一个版本
git reset --hard  HEAD^^
# 回退2个版本
git reset --hard  版本号
# 回退特定版本
git reset --hard HEAD~10
# 回退10个版本
git reflog
# 查看 head 指针的移动历史
git diff file_
# 查看 file_文件相对于暂存区修改了哪些内容

# 将所有的修改全部撤回
git restore 
# git restore 是将相对于工作区对于暂存区的修改全部删除掉



git branch branch_name
# 创建一个新分支
git checkout branch_name
# 切换到这个分支

git stash
# 将工作区和暂存区中尚未提交的修改存入栈中
git stash apply
# 将栈顶存储的修改回复到当前分支，但是不删除栈顶元素

git stash drop
# 删除栈顶的修改
git stash pop
# 将栈顶存储的修改回复到当前分支，同时删除栈顶元素
git stash list 
# 查看 栈中所有元素



git merge brach_name
# 将branch_name 合并到当前的分支上

git push -u origin branch_name
# 第一次要加 -u



```





####  git restore命令

[参考文档](https://www.cnblogs.com/teach/p/13997323.html)



###  删除云端分支

```shell
git push -d dev3
# 删除 远程仓库的 dev3

git branch -d dev5
# 删除本地 dev5分支

```

