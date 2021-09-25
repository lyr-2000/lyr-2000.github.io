1. 检查动画

该功能可以用于查看动画的对应元素和调整动画时间,重新播放动画

可以查看的动画有css的动画js的动画，但是canvas的动画不行

在控制台中可以通过ctrl+shift+p打开command menu,输入show Animations

![](https://user-gold-cdn.xitu.io/2020/2/27/170865d46180cb1d?w=833&h=169&f=png&s=12192)

界面如图

![](https://user-gold-cdn.xitu.io/2020/2/28/1708763e63563430?w=1011&h=458&f=png&s=65804)

2. 截图

截图是我们常用的功能，同样在ctrl+shift+p中我们可以找到截图的相关功能

输入screenshot就会出现四个选项

![](https://user-gold-cdn.xitu.io/2020/2/28/170876b2f825de65?w=686&h=195&f=png&s=14936)

依次是区域，全屏，节点和可视区域

3. 访问上一次操作在控制台显示的结果

注意，这里显示不是使用console打印出来的东西，而是在控制台输入一条命令会显示出来的东西  
在控制台输入$_即可获得

如图
![](https://user-gold-cdn.xitu.io/2020/2/28/17087833862b06b3?w=852&h=149&f=png&s=16560)

4. 复制内容

在控制台可以通过copy方法复制内容到剪贴板中  
如图

![](https://user-gold-cdn.xitu.io/2020/2/28/17087872a08308cf?w=473&h=139&f=png&s=8859)

粘贴出来就会是下面的内容
```json
{
  "foo": "1",
  "bar": "2"
}
```

但如果我们用的是window或者navigator这样的对象，那复制出来的内容可能与我们所想的不符，比如说如图复制window

![](https://user-gold-cdn.xitu.io/2020/2/28/1708788572018e22?w=831&h=142&f=png&s=12376)
粘贴出来会是下面这样的字符串
```
[object Window]
```

5. 滚动到视图区域

在element里面右键点击一个元素节点，选择里面的scroll into view即可滚动到元素的视图区域

![](https://user-gold-cdn.xitu.io/2020/2/28/170878d1b3e2f49b?w=390&h=521&f=png&s=37286)