我们知道，当我们执行npm i \<name>的时候，会将相应的模块安装到node_modules中，如果没有后面的\<name>的话，就会按package.json中的dependencies和devDependencies来安装相应的模块，那么具体的流程是什么样的呢

# npm模块安装机制

1. 执行npm i命令
2. 如果有preinstall钩子，则执行相应的操作
3. 查询node_modules中是否有要安装的模块
4. 若存在，则跳过
5. 若不存在
    * 4.1 npm向registry查询模块压缩包的网址
    * 4.2 下载压缩包，放在根目录下的.npm目录中
    * 4.3 解压压缩包到node_modules目录中

接下来来详细分析里面的具体实现原理

## preinstall
pre是npm提供的钩子中的一种，npm提供了pre和post两种钩子，对应着某个npm命令执行的准备工作和清理工作，在我们执行npm run build的时候，就会默认按下面的顺序执行
```npm
npm run prebuild
npm run build
npm run postbuild
```
所以这里的preinstall就是在我们install前做的一些准备工作，前提是我们的项目里面有在这个钩子函数上写一些操作

值得一提的是，在npm4之前，prepublish也会在install前执行，在npm4时添加了一个等同功能的新钩子prepare，在npm5之后，prepublish不再在install后执行

## 执行命令时的查找工作
在我们执行npm i时，首先会去找到项目根目录下的package.json文件，对照里面的开发依赖和生产依赖即dependencies和devDependencies，查询node_modules中是否有相应的模块，如果有的话就不再下载，没有的话就找到相应的网址下载

这里如果我们在package.json中写的版本是*，即是用最新的版本，那么npm首先就会去查找registry上对应模块的网址 

registry对应的网址就是[https://registry.npmjs.org/](https://registry.npmjs.org/)  

我们要找对应的模块时，就在这个地址后面加上网址名即可，比如要找一个名为scav-cli的模块，那么就回去[https://registry.npmjs.org/scav-cli](https://registry.npmjs.org/scav-cli)寻找，此时会得到一个json对象，对象里面就会模块相应的信息，可以在里面找到最新版本号，在dist-tags属性里面的latest属性对应的版本号值  

而在这个json对象里面的version属性中每个版本对应有一个属性值，属性名即为版本号，这个属性值也为一个对象，其中的dist属性下的tarball就是该版本压缩包的网址

## npm安装模块时的两种结构
npm安装模块时，早期使用了嵌套结构
### 嵌套结构

上面说到了我们通过npm将压缩包下载到根目录的.npm目录中，然后再解压到node_modules目录中，那么我们是按什么顺序去下载相应的模块

在npm的早期版本，是通过使用嵌套结构来实现的，即以递归的方式，先对package.json中的模块进行遍历，下载里面对应的模块，如果这些模块有依赖其他的模块，再去下载对应的这些模块，依赖的这些模块可以在解压到node_modules文件夹中的package.json文件中找到，直到下载的模块没有再依赖别的模块，也就是package.json文件中再没有别的内容  

当然了，实际下载时相应依赖的模块在registry上返回的对象就能找到了，不用下载解压到node_modules时才去查看

举个例子来说，package.json下面写着两个模块的名字，分别是noRely，severalRely，noRely没有依赖其他模块，而severalRely依赖了两个模块c1和c2，那么模块的目录结构就如图
![](https://user-gold-cdn.xitu.io/2020/3/3/1709fa875bddede2?w=716&h=407&f=png&s=20195)

使用这种结构，会让模块目录node_modules的结构和package.json的结构一致，方便我们查看模块间的依赖关系，但是，这种结构也存在着比较大的问题

* 如果依赖模块过多，那么node_modules的嵌套层级将会很深，有些模块很难找到
* 在不同层级的依赖中，两个不同的模块可能依赖了同一个模块，那么此时就会导致冗余

为了解决上面的问题，npm在3.x版本将嵌套结构改为扁平结构

### 扁平结构
在扁平结构中，不管是项目直接依赖还是依赖包依赖的模块，都**优先**将其安装在node_modules的根目录下

对于上面我们提及的模块，在扁平结构下目录结构会如图
![](https://user-gold-cdn.xitu.io/2020/3/3/1709fbcaadaa283f?w=638&h=586&f=png&s=24840)
上面也说到了，我们是**优先**把模块安装到node_modules的根目录下，而如果我们在模块中找到与根目录下模块同名的依赖，就不一定会安装在node_modules的根目录了  
假如上面的severalRely依赖的模块c2的版本是1.0.1，而c1依赖了1.0.2的版本的c2，那么目录结构就会变为
![](https://user-gold-cdn.xitu.io/2020/3/3/1709fc124dd3ef46?w=674&h=520&f=png&s=28602)
也即是说，1.0.2版本的c2被安装到c1目录下的node_modules中

因此，当我们在代码中通过引用一个模块的时候，会按照下面的流程去查找模块
1. 在当前模块路径下搜索
2. 在当前模块的node_modules路径下搜索
3. 在上级模块的node_modules路径下搜索
4. 在全局路径中的node_modules路径下搜索


参考资料  
* http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html  
* http://www.ruanyifeng.com/blog/2016/01/npm-install.html  
* https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/22