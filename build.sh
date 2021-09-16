git add  .
git commit -am'sync md files'
git push
# 拉去笔记合并

git pull
echo "笔记拉取成功"

nohup sh  _rebuild.sh &

echo "execute OK " 



