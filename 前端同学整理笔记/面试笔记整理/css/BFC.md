# BFC有以下几个特性
- 就是使得内部的子元素不会影响到外部的元素，外部也不会影响内部的
- BFC的区域不会和float的区域重叠
- BFC计算高度时会算上浮动元素的高度


当样式为下列值其中一个时，样式设置的box会产生BFC
- overflow: auto/ hidden;（不为visiable）
- position: absolute/ fixed;
- float: left/ right;
- display: inline-block/ table-cell/ table-caption/ flex/ inline-flex  

或者元素为html根元素也会是BFC

# 应用：
## 1. 取消父子元素的margin垂直重叠
```html
<style>
.fa{
    margin-top:20px;
    background-color:#ff0;
    overflow:auto;
}
.ch{
    margin-top:30px;
    width:100px;
    height:20px;
    background-color:red;
}
</style>
<body>
    <div class="fa">
        <div class="ch"></div>
    </div>
</body>
```
这里如果不加上```over:auto```的话，整个fa看起来就会是有一个30px的margin-top，但实际上是因为ch的margin-top和fa的重叠后ch的margin值比较大导致的
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200115151739341.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/20200115151755907.png)  
可以看到ch和fa的margin重叠了，那么当我们给fa加上```overflow:auto```  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200115151931253.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200115151917669.png)  
可以看到不会重叠了，而且子元素的margin值把父元素的高度撑大了  
## 2. 自适应两栏布局
```html
<style>
    #layout {
        background-color: red;
    }
    
    .left {
        float: left;
        width: 100px;
        height: 110px;
        background-color: aqua;
    }
    
    .right {
        height: 100px;
        background-color: blueviolet;
        overflow: auto;
    }
</style>
<body>
    <div id="layout">
        <div class="left"></div>
        <div class="right"></div>
    </div>
</body>
```
这里如果不使用overflow:auto，那么right这个div会占用整行，而使用之后，因为BFC的特性，区域不会与float的box区域重叠，所以会形成右边的一个自适应区域  
## 3. 清除内部浮动  
在上面的例子中，要注意，left是浮动元素，而高度大于right，所以在页面上会出现下面这种情况
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200115150311368.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
如果想让父元素能包裹这个浮动元素，也就是清除浮动，可以将父元素变成BFC来实现，只要给#layout加上```overflow:auto```就行
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020011515052163.png)