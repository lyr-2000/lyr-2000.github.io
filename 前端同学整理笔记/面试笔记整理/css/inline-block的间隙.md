## 产生原因
元素在被当成行内元素处理的时候，元素之间的空白符会被浏览器处理，根据white-space的处理方式，合并多余空白，HTML中的换行符被代替为一定宽度的空白，这些间距会随字体大小的变化而变化  
## 解决方法
1. 写在同一行，即元素紧挨着
2. 设置font-size为0，在子元素再设置为想设置的大小
3. 使用float:left
4. 为子元素设置margin负值
5. 设置父元素display为table，改变字间距word-spacing为-1em
```css
.parent{
    display:table;
    word-spacing:-1em;
}
```