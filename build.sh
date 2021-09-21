git add  .
git commit -am'sync md files'
# git push
# 拉去笔记合并

git pull

# 先拉去远程的改变，和 本地的改变 merge 之后，得到一个新的版本
git push

echo "笔记拉取成功"

nohup sh  _rebuild.sh &

echo "execute OK " 



