（转载）
# 编译器和解释器
之所以存在编译器和解释器，是因为机器不能直接理解我们所写的代码，所以在执行程序之前，需要将我们所写的代码“翻译”成机器能读懂的机器语言。按语言的执行流程，可以把语言划分为编译型语言和解释型语言。

编译型语言在程序执行之前，需要经过编译器的编译过程，并且编译之后会直接保留机器能读懂的二进制文件，这样每次运行程序时，都可以直接运行该二进制文件，而不需要再次重新编译了。比如C/C++、GO等都是编译型语言。

而由解释型语言编写的程序，在每次运行时都需要通过解释器对程序进行动态解释和执行。比如Python、JavaScript等都属于解释型语言。
![](https://user-gold-cdn.xitu.io/2020/3/27/1711c38cc5cd9094?w=1223&h=563&f=png&s=118357)

从图中你可以看出这二者的执行流程，大致可阐述为如下：

1. 在编译型语言的编译过程中，编译器首先会依次对源代码进行词法分析、语法分析，生成抽象语法树（AST），然后是优化代码，最后再生成处理器能够理解的机器码。如果编译成功，将会生成一个可执行的文件。但如果编译过程发生了语法或者其他的错误，那么编译器就会抛出异常，最后的二进制文件也不会生成成功。

2. 在解释型语言的解释过程中，同样解释器也会对源代码进行词法分析、语法分析，并生成抽象语法树（AST），不过它会再基于抽象语法树生成字节码，最后再根据字节码来执行程序、输出结果。

![](https://user-gold-cdn.xitu.io/2020/3/27/1711c397cc2c0e06?w=1167&h=636&f=png&s=199708)


# 生成抽象语法树和执行上下文
v8会将源代码转为**抽象语法树（AST）**，并生成执行上下文

下面看看AST是什么和怎样生成AST
## AST是什么
下面这段代码
```javascript
var myName = "极客时间"
function foo(){
  return 23;
}
myName = "geektime"
foo()
```
转换成AST后会变成
![](/img/javascript/AST.png)

AST是非常重要的一种数据结构，在很多项目中有着广泛的应用。其中最著名的一个项目是Babel。Babel是一个被广泛使用的代码转码器，可以将ES6代码转为ES5代码，这意味着你可以现在就用ES6编写程序，而不用担心现有环境是否支持ES6。Babel的工作原理就是先将ES6源码转换为AST，然后再将ES6语法的AST转换为ES5语法的AST，最后利用ES5的AST生成JavaScript源代码。

除了Babel外，还有ESLint也使用AST。ESLint是一个用来检查JavaScript编写规范的插件，其检测流程也是需要将源码转换为AST，然后再利用AST来检查代码规范化的问题。

## 怎样生成AST
### 分词
分词又称为词法分析，其作用是将一行行的源码拆解成一个个token。所谓token，指的是语法上不可能再分的、最小的单个字符或字符串。你可以参考下图来更好地理解什么是token。

![](https://user-gold-cdn.xitu.io/2020/3/27/1711c429531380df?w=1116&h=650&f=png&s=139495)


有了AST后，v8就会根据AST生成相应的执行上下文

### 解析
解析又称为语法分析，其作用是将上一步生成的token数据，根据语法规则转为AST。如果源码符合语法规则，这一步就会顺利完成。但如果源码存在语法错误，这一步就会终止，并抛出一个“语法错误”。

## 生成字节码
有了AST之后，解释器就会根据AST生成相应的字节码，并解释执行字节码

其实一开始V8并没有字节码，而是直接将AST转换为机器码，由于执行机器码的效率是非常高效的，所以这种方式在发布后的一段时间内运行效果是非常好的。但是随着Chrome在手机上的广泛普及，特别是运行在512M内存的手机上，内存占用问题也暴露出来了，因为V8需要消耗大量的内存来存放转换后的机器码。为了解决内存占用问题，V8团队大幅重构了引擎架构，引入字节码，并且抛弃了之前的编译器，最终花了将进四年的时间，实现了现在的这套架构。

字节码就是介于AST和机器码之间的一种代码。但是与特定类型的机器码无关，字节码需要通过解释器将其转换为机器码后才能执行。

![](https://user-gold-cdn.xitu.io/2020/3/27/1711c47a10bd103f?w=1156&h=443&f=png&s=120830)

从图中可以看出，机器码所占用的空间远远超过了字节码，所以使用字节码可以减少系统的内存使用。


## 执行代码
通常，如果有一段第一次执行的字节码，解释器Ignition会逐条解释执行。在执行字节码的过程中，如果发现有热点代码（HotSpot），比如一段代码被重复执行多次，这种就称为热点代码，那么后台的编译器TurboFan就会把该段热点的字节码编译为**高效的机器码**，然后当再次执行这段被优化的代码时，只需要执行编译后的机器码就可以了，这样就大大提升了代码的执行效率。


对于JavaScript工作引擎，除了V8使用了“字节码+JIT”技术之外，苹果的SquirrelFish Extreme和Mozilla的SpiderMonkey也都使用了该技术。

这么多语言的工作引擎都使用了“字节码+JIT”技术，因此理解JIT这套工作机制还是很有必要的。你可以结合下图看看JIT的工作过程：

![](https://user-gold-cdn.xitu.io/2020/3/27/1711c4966967f115?w=662&h=890&f=png&s=91393)


# JavaScript的性能优化
到这里相信你现在已经了解V8是如何执行一段JavaScript代码的了。在过去几年中，JavaScript的性能得到了大幅提升，这得益于V8团队对解释器和编译器的不断改进和优化。

虽然在V8诞生之初，也出现过一系列针对V8而专门优化JavaScript性能的方案，比如隐藏类、内联缓存等概念都是那时候提出来的。不过随着V8的架构调整，你越来越不需要这些微优化策略了，相反，对于优化JavaScript执行效率，你应该将优化的中心聚焦在单次脚本的执行时间和脚本的网络下载上，主要关注以下三点内容：

提升单次脚本的执行速度，避免JavaScript的长任务霸占主线程，这样可以使得页面快速响应交互，可以通过异步的形式或者将复杂计算放入web worker来避免主线程被长期霸占；

避免大的内联脚本，因为在解析HTML的过程中，解析和编译也会占用主线程；

减少JavaScript文件的容量，因为更小的文件会提升下载速度，并且占用更低的内存。