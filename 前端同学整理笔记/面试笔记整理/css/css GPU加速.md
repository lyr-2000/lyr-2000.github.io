transform:translateZ(0px)
opacity属性


通过-webkit-transform:transition3d/translateZ开启GPU硬件加速之后，有些时候可能会导致浏览器频繁闪烁或抖动

可以通过下面的样式来解决  
Chrome and Safari中
```css
.cube {
   -webkit-backface-visibility: hidden;
   -moz-backface-visibility: hidden;
   -ms-backface-visibility: hidden;
   backface-visibility: hidden;
 
   -webkit-perspective: 1000;
   -moz-perspective: 1000;
   -ms-perspective: 1000;
   perspective: 1000;
   /* Other transform properties here */
}
```
backface-visibility：隐藏被旋转的 div 元素的背面
- visible：背面可见
- hidden：背面不可见

perspective 属性定义 3D 元素距视图的距离，以像素计


猜测之所以会有闪烁的情况，是因为在渲染页面的时候，是会做分层处理的，而对于3D动画来说，如果正面和背面是平行于页面的，那么首先会绘制背面，然后再绘制正面，这样在绘制背面到绘制证明这个过程中会占用时间，而因为背面实际上没有内容，所以时间很短，只会看到一瞬的闪烁


webkit内核的浏览器
```css
.cube {
   -webkit-transform: translate3d(0, 0, 0);
   -moz-transform: translate3d(0, 0, 0);
   -ms-transform: translate3d(0, 0, 0);
   transform: translate3d(0, 0, 0);
  /* Other transform properties here */
}
```