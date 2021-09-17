
hugo -D

rm -rf /www/wwwroot/doc.lyr-2000.xyz/*


\cp -r public/*  /www/wwwroot/doc.lyr-2000.xyz/

# git add .

# git commit -am'generate html files'
# git push

git add .
git commit -am'generate html file'
git push


