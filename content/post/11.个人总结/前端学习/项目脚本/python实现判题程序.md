---
title: "python实现判题程序"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR


---



## python 脚本总结

## python判题程序







```python
import os
import sys,getopt

# 比较2个文件是否相同的判题程序
#import filecmp
'''
def cmpFile(f1,f2):

   # 如果两边路径的头文件都存在，进行比较
    try:
        status = filecmp.cmp(f1, f2)
        # 为True表示两文件相同
        if status:
            print("files are the same")
        # 为False表示文件不相同
        else:
            print("files are different")
    # 如果两边路径头文件不都存在，抛异常
    except IOError:
        print("Error:"+ "File not found or failed to read")

'''
ENDL  = 10 # 定义\n 的 ascii码常量
BLANK = 32 # 空格的 ascii码常量

def arrayCmp(b1,b2):
  i = 0
  n = len(b1)
  j = 0
  m = len(b2)
 # endl = 10 # \n 的 ascii码是10
 # blank = 32
  if n==0 and m==0:
    return True
  if n==0 or m==0:
    return False
  while i<n and j<m:
    if b1[i] == b2[j]:
      #print("char:= {}".format(char(b1[i]).encode()))
      i+=1
      j+=1
    else:
      if b1[i]== BLANK:
        i+=1
      elif b2[j]== BLANK:
        j+=1
      else:
        # 两个都不是 \n, 说明内容不一样，直接 break
        return False
  while i<n:
    if b1[i] == ENDL:
      i+=1
    else:
       break
  while j<m:
   # print("idx:={},b2[j]={}, endl={}".format(j,b2[j],'\n' ) )
    if b2[j] == ENDL:
      j+=1
    else:
       break
  
  #print("lena={} ,lenb={}, i = {}, j={} ,{}".format(n,m,i,j,b2[j:]))
  return i==n and j==m

      



def compareFile(file1,file2) -> bool:
  st1 = os.stat(file1)
  st2 = os.stat(file2)
  #if st1.st_size != st2.st_size:
  #  print("大小不一样")
  #  return False
  bufSize = 1024
  # 8k 的大小
  #skipEndRow = 0
  with open(file1,'rb') as fp1,open(file2,'rb') as fp2:
    while True:
      b1 = fp1.read(bufSize)
      b2 = fp2.read(bufSize)
      # print("b1=",b1)
      # print("b2=",b2)
      # print("----------------")
      if not arrayCmp(b1,b2):
        return False
      if not b1 and not b2:
        return True
      if not b1 or not b2:
        return False
      
      
     

def parseCMD(argv) -> (str,str):
  inputfile = ''
  outputfile = ''
  try:
    opts, args = getopt.getopt(argv,"hi:o:",["file1=","file2="])
  except getopt.GetoptError:
    print("ERRORE")
    sys.exit(2)
  for opt, arg in opts:
    if opt == '-h':
        print("输入 --file1=f1 --file2=f2")
        sys.exit()
    elif opt in ( "-f1","--file1"):
        # 这边直接就可以赋值了
        inputfile = arg
    elif opt in ( "-f2","--file2"):
        outputfile = arg
    #print("({} , {})",opt,arg)
  #print '输入的文件为：', inputfile
  #print '输出的文件为：', outputfile
  if inputfile=='' or outputfile =='':
    print("ERRORf")
    sys.exit(2)
  return (inputfile,outputfile)


def main(argv):
  f1,f2 = parseCMD(argv)
  res = compareFile(f1,f2)
  if res:
    print("SUCCESS")
  else:
    print("FAIL")
  #print("file1 = {} ,file2 = {}".format(f1,f2))

if __name__ == "__main__":
   main(sys.argv[1:])
#print(compareFile('./1.txt','2.txt'))

# 使用方法“
# python compare.py --file1="./1.txt" --file2="./2.txt"

```

## python 编译程序









```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-


import os

import sys, getopt

def compileCpp(fName,out):
   if os.system(f"g++  {fName}  -o {out}"):
     print("compile error")
     exit(1)

def compileJava(fName):
 if os.system(f"javac {fName} "):
     print("compile java error")
     exit(1)

def handle(fType,fName,outFile):
	if fType in ("cpp","c++","c"):
		compileCpp(fName,outFile)
    
	else:
    print("ERROR")
		print("无法匹配到编译程序")
    return
  print("SUCCESS")
		

def main(argv):
  fileType = ''
  fileName = ''
  outFile = ''
  try:
    opts, args = getopt.getopt(argv,"h",["fileType=","fileName=","outFile="])
  except getopt.GetoptError:
    print( '出现异常了.. ' )
    sys.exit(2)
  for opt, arg in opts:
    if opt == '-h':
        print( 'help: python3 compile.py --fileType="cpp" --fileName="Main.cpp" --outFile="main"')
        sys.exit()
    elif opt in ("--fileType","-ft"):
        # 这边直接就可以赋值了
        fileType = arg
    elif opt in ("--outFile","-of"):
        outFile = arg
    elif opt in ("--fileName","-fn"):
        fileName = arg
    
  print("fileType:= {} , fileName := {} , outFile:= {}".format(fileType,fileName,outFile))
  handle(fileType,fileName,outFile)
 
 
if __name__ == "__main__":
	main(sys.argv[1:])
 
 
```



### OJ 运行程序



















