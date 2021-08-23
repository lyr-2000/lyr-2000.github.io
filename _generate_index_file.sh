#!/bin/bash
echo "["`date +%Y-%m-%d--%H:%M:%S`"]运行自动生成脚本";  

# 调用方法  sh _genenrate_file.sh  content 
# path = $1
# echo "path is $1"
#ifs input file seperator `
# IFS="\n"
inputPath="content"
# inputPath=$1
#打印所有文件
# fileList=`ls $inputPath`

# for file in `ls $inputPath`
# for dir in `find   $inputPath -type d`

 (`echo "find   $inputPath -type d"`)  | while read dir
do 

if [  ! -f "$dir/_index.md"   ] 
then 
# echo "/$dir/_index.md 没有生成"

genDir="$dir/_index.md"
# 替换 content前缀
genDir=${genDir/content/}
# [  -f "$dir/_index.md" ] && echo "present   $dir/_index.md"
# echo  $genDir
`sudo hugo new "$genDir"`
# echo "$dir is not OK"

fi

# content/post/05.软件和系统/02.系统相关


#    [ -f $file ] && echo   $file
# if [ -f "$dir/_index.md" ]
#  then 
# echo "$dir already has _index file";
# else 
# # echo "$dir is not OK"

# fi 


#    if [ -d $file ] 
#    	then
# # 遍历打印所有文件
# 	echo "$file is an directory"
#    else 
#     echo "$file is an file"
#    fi 

done 





# echo $path
# for i in path do
	#  echo $i 

# done






