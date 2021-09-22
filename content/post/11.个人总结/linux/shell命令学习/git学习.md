---
title: "git学习"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR

---



###  git 有3个状态





工作区 -> 暂存区 -> 版本库

[练习 git 网站](https://learngitbranching.js.org/?locale=zh_CN)

![这里写图片描述](https://res.cloudinary.com/dqxtn0ick/image/upload/v1510578830/article/git/git-arch.png)



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

## 2.5. 分支

```bash
# 列出所有本地分支
$ git branch
# 列出所有远程分支
$ git branch -r
# 列出所有本地分支和远程分支
$ git branch -a
# 新建一个分支，但依然停留在当前分支
$ git branch [branch-name]
# 新建一个分支，并切换到该分支
$ git checkout -b [branch]
# 新建一个分支，指向指定commit
$ git branch [branch] [commit]
# 新建一个分支，与指定的远程分支建立追踪关系
$ git branch --track [branch] [remote-branch]
# 切换到指定分支，并更新工作区
$ git checkout [branch-name]
# 切换到上一个分支
$ git checkout -
# 建立追踪关系，在现有分支与指定的远程分支之间
$ git branch --set-upstream [branch] [remote-branch]
# 合并指定分支到当前分支
$ git merge [branch]
# 选择一个commit，合并进当前分支
$ git cherry-pick [commit]
# 删除分支
$ git branch -d [branch-name]
# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
```

## 2.6. 标签

```bash
# 列出所有tag
$ git tag
# 新建一个tag在当前commit
$ git tag [tag]
# 新建一个tag在指定commit
$ git tag [tag] [commit]
# 删除本地tag
$ git tag -d [tag]
# 删除远程tag
$ git push origin :refs/tags/[tagName]
# 查看tag信息
$ git show [tag]
# 提交指定tag
$ git push [remote] [tag]
# 提交所有tag
$ git push [remote] --tags
# 新建一个分支，指向某个tag
$ git checkout -b [branch] [tag]
```

## 2.7. 查看信息

```bash
# 显示有变更的文件
$ git status
# 显示当前分支的版本历史
$ git log
# 显示commit历史，以及每次commit发生变更的文件
$ git log --stat
# 搜索提交历史，根据关键词
$ git log -S [keyword]
# 显示某个commit之后的所有变动，每个commit占据一行
$ git log [tag] HEAD --pretty=format:%s
# 显示某个commit之后的所有变动，其"提交说明"必须符合搜索条件
$ git log [tag] HEAD --grep feature
# 显示某个文件的版本历史，包括文件改名
$ git log --follow [file]
$ git whatchanged [file]
# 显示指定文件相关的每一次diff
$ git log -p [file]
# 显示过去5次提交
$ git log -5 --pretty --oneline
# 显示所有提交过的用户，按提交次数排序
$ git shortlog -sn
# 显示指定文件是什么人在什么时间修改过
$ git blame [file]
# 显示暂存区和工作区的差异
$ git diff
# 显示暂存区和上一个commit的差异
$ git diff --cached [file]
# 显示工作区与当前分支最新commit之间的差异
$ git diff HEAD
# 显示两次提交之间的差异
$ git diff [first-branch]...[second-branch]
# 显示今天你写了多少行代码
$ git diff --shortstat "@{0 day ago}"
# 显示某次提交的元数据和内容变化
$ git show [commit]
# 显示某次提交发生变化的文件
$ git show --name-only [commit]
# 显示某次提交时，某个文件的内容
$ git show [commit]:[filename]
# 显示当前分支的最近几次提交
$ git reflog
```

## 2.8. 远程同步

```bash
# 下载远程仓库的所有变动
$ git fetch [remote]
# 显示所有远程仓库
$ git remote -v
# 显示某个远程仓库的信息
$ git remote show [remote]
# 增加一个新的远程仓库，并命名
$ git remote add [shortname] [url]
# 取回远程仓库的变化，并与本地分支合并
$ git pull [remote] [branch]
# 上传本地指定分支到远程仓库
$ git push [remote] [branch]
# 强行推送当前分支到远程仓库，即使有冲突
$ git push [remote] --force
# 推送所有分支到远程仓库
$ git push [remote] --all
```

## 2.9. 撤销

```bash
# 恢复暂存区的指定文件到工作区
$ git checkout [file]
# 恢复某个commit的指定文件到暂存区和工作区
$ git checkout [commit] [file]
# 恢复暂存区的所有文件到工作区
$ git checkout .
# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
$ git reset [file]
# 重置暂存区与工作区，与上一次commit保持一致
$ git reset --hard
# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
$ git reset [commit]
# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
$ git reset --hard [commit]
# 重置当前HEAD为指定commit，但保持暂存区和工作区不变
$ git reset --keep [commit]
# 新建一个commit，用来撤销指定commit
# 后者的所有变化都将被前者抵消，并且应用到当前分支
$ git revert [commit]
# 暂时将未提交的变化移除，稍后再移入
$ git stash
$ git stash pop
```

## 2.10. 其他

```bash
# 生成一个可供发布的压缩包
$ git archive
# 设置换行符为LF
git config --global core.autocrlf false
#拒绝提交包含混合换行符的文件
git config --global core.safecrlf true
```

参考文章：

- http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html



# . Git常用命令

| 分类 | 子类                        | git command                                                  | zsh alias |
| ---- | --------------------------- | ------------------------------------------------------------ | --------- |
| 分支 | 查看当前分支                | `git branch`                                                 | gb        |
|      | 创建新分支,仍停留在当前分支 | git branch <new branch>                                      |           |
|      | 创建并切换到新分支          | git checkout -b <new branch>                                 | gcb       |
|      | 切换分支                    | git checkout <branch>                                        |           |
|      | 合并分支                    | git checkout <branch> #切换到要合并的分支git merge –no-ff <to be merged branch> #合并指定分支到当前分支 |           |
| 提交 | 查看状态                    | git status                                                   | gst       |
|      | 查看修改部分                | git diff --color                                             | gd        |
|      | 添加文件到暂存区            | git add --all                                                |           |
|      | 提交本地仓库                | git commit -m "<message>"                                    |           |
|      | 推送到指定分支              | git push -u origin <branch>                                  |           |
|      | 查看提交日志                | git log                                                      | -         |

# 



3、执行脚本

```bash
chmod +x rename.sh

sh rename.sh
```

4、查看新 Git 历史有没有错误。

```bash
#可以看到提交记录的用户信息已经修改为新的用户信息
git log 
```

5、确认提交内容，重新提交（可以先把rename.sh移除掉）

```bash
git push --force --tags origin 'refs/heads/*'
```

# 7. 撤销已经push的提交

```bash
# 本地仓库回退到某一版本
git reset -hard <commit-id>
# 强制 PUSH，此时远程分支已经恢复成指定的 commit 了
git push origin master --force
```

