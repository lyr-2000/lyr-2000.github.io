# 通用的API

以localStorage为例
1. **setItem()**  

该方法传入两个参数，第一个参数表示传进去的值要存储在哪个属性名上，第二个参数表示要传进去的值
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191013195920796.png)
如果传入了第一个参数为对象里面原有的属性，那就会覆盖原来的值
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191013200056710.png)
当使用该方法传入一个对象时，因为localStorage目前只支持传入字符串，所以传入的内容会变为```"[object Object]"```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191013200634286.png)
除了这种方法之外，也可以使用点运算符来设置，当然也可以通过ES6中的方括号的写法来设置
```javascript
window.localStorage.text='content'

let t='text'
window.localStorage[t]='content'
```

2. **getItem()**  

该方法传入一个参数，表示要获取的值对应的属性名
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191013200204433.png)

3. **removeItem()**

该方法传入一个参数，表示要删除的值对应的属性名  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191013200300826.png)

4. **clear()**

clear方法用于清空localStorage对象里面的属性

# localStorage

localStorage是只读的，可以修改其属性

localStorage用于保存当前网站在本地浏览器的信息，保存的数据没有期限，除非手动删除。在localStorage中保存的数据，即使关闭窗口重新打开也不会被消失。（sessionStorage在关闭窗口后保存的数据会消失）

要注意的是，同一个域名共享一个localStorage对象，当然，同一域名但是不同浏览器是不共享一个localStorage对象的

通过```window.localStorage```来获取localStorage对象


## 局限
1. localStorage无法被爬虫抓取到
2. localStorage本质上是对字符串的读取，如果存储内容过多的话会消耗内存空间，导致页面变卡
3. 存储的值限定为字符串类型，若要存储json格式要进行转换
4. 有一些浏览器不支持，比如IE8以上才支持localStorage

## 为localStorage设置过期时间
相对于sessionStorage来说，localStorage没有过期时间，但是如果我们想使用localStorage来设置过期时间，可以通过修改其set方法和get方法来实现
## localStorage空间满了的处理方法
如果localStorage存满了或者存进去的数据大于localStorage对象存储数据的最大容量的话，那么就会出现报错

https://www.cnblogs.com/kidney/p/9058352.html

# sessionStorage

sessionStorage和localStorage类似，可以**临时**保存在同一窗口（或标签页）的数据，但是与localStorage不同的是，sessionStorage的有效时间是一个会话，在关闭窗口或者标签页的时候数据会被清除    
但是sessionStorage在当前标签页不关闭调转的情况下，还是能保存着的  
sessionStorage和localStorage一样，存储的空间一般为5MB

## 上面两个对象存储数据的问题
在控制台中就能修改这些数据，所以不应该将敏感数据放在这两个对象中

# cookie

如果不在浏览器中设置过期事件，cookie被保存在内存中，生命周期随浏览器的关闭而结束，这种cookie简称为会话cookie。如果在浏览器中设置了cookie的过期事件，cookie会被保存在硬盘中，关闭浏览器后，cookie数据仍然存在，直到过期事件结束才消失。

cookie只有4k左右大小


# localStorage和sessionStorage的区别
1. 时效性

2. 相同浏览器的不同页面间可以共享相同的 localStorage（页面属于相同域名和端口），但是不同页面或标签页间无法共享sessionStorage的信息

比如https://blog.csdn.net/zemprogram/article/list和https://blog.csdn.net/zemprogram/article/list/2

它们之间的localStorage可以共享，但是sessionStorage不可以共享