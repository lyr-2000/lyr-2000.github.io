# drag&drop
拖动功能在我们做的项目中非常常见，特别是图片拖动，在验证码图片拖动里很是常见，我们通常可以通过设置元素的定位为浮动，通过在JavaScript中监听鼠标的位置，来改变元素的位置来达到拖动的效果。

而在html5中，我们可以通过在html中设置元素为可拖拽，然后在JavaScript中为相应的事件设置方法来触发拖动开始，拖动过程，拖动结束这些时刻时该做的操作

## drag相关的事件
与拖动相关的事件分为在拖动源目标（我们要拖动的元素）和在目标位置（我们要放入元素的位置）两种

在源目标的事件
1. ondragstart：在拖动开始的时候触发
2. ondrag: 元素正在拖动
3. ondragend：在拖动结束的时候触发

在目标位置的事件
1. ondragenter：拖动的元素进入目标位置的时候触发
2. ondragover：拖动的元素在目标位置上移动的时候触发
3. ondragleave：拖动的元素离开目标位置区域的时候触发
4. ondrop：拖动的元素在目标位置时松开鼠标时触发


### dataTransfer对象
该对象可以为每中MIME类型都保存一个值，但是保存在该对象中的值只能在ondrop事件对应的方法中获取到，在拖拽过程中使用这个对象目的是为了在源对象和目标位置的对象交换数据
#### 基本方法
1. setData()  
该方法传入两个参数，第一个参数为要设置的类型，第二个参数为要保存的数据  
可设置的基本类型有四种：text/plain,text/html,text/xml,text/uri-list  
如果设置的类型不在这四个类型之中的话，则会把新的类型放入类型数组的最后，当下次出现相同类型的时候，会把该类型对应的数据替换

2. getData()
该方法接收一个参数，即为要接收的类型，对应于setData()的第一个参数设置的类型，只能在ondrop中使用

3. clearData()
该方法用于清除dataTransfer对象中特定类型的数据，传入一个参数，为要清除的数据对应的类型，如果dataTransfer对象中没有对应的类型，就不做任何操作。  
该方法只能用在dragStart事件中，因为只有在该事件中dataTransfer对象才是writeable(可修改的)


通过一个例子来阐述功能和事件
```html
<!DOCTYPE html>
<html>

<head>
    <title>test</title>
    <style>
        div {
            width: 2000px;
            height: 100px;
            background-color: #666;
        }
    </style>
</head>

<body>
    <img id="img1" src='1.png' draggable="true" ondragstart="dragStart(event)" ondrag="dragging(event)" ondragend="dragEnd(event)">
    <img id="img2" src="4.png" draggable="true" ondragstart="dragStart(event)" ondrag="dragging(event)" ondragend="dragEnd(event)">

    <div id="div" ondrop="drop(event)" ondragenter="dragenter(event)" ondragleave="dragleave(event)" ondragover="dragover(event)">

    </div>
    <script type="text/javascript">
        function dragStart(e) {
            // 将当前拖动的元素的id存储起来
            e.dataTransfer.setData("Text", e.target.id);
            console.log(`begin to ${e.target}`);
        }

        function dragging(e) {
            console.log(`${e.target} is dragging`);
        }

        function dragEnd(e) {
            console.log(`${e.target} has dragged`);
        }

        function drop(e) {
            e.preventDefault();
            // 获取之前存储的元素的id
            let data = e.dataTransfer.getData("Text");
            console.log(data);
            e.target.appendChild(document.getElementById(data));
        }

        function dragenter(e) {
            console.log(`sth is dragging in the ${e.target}`)
            e.preventDefault();
        }

        function dragover(e) {
            console.log(`sth is dragging over the ${e.target}`)
            e.preventDefault();
        }

        function dragleave(e) {
            console.log(`sth is dragging out of the ${e.target}`)
            e.preventDefault();
        }
    </script>
</body>

</html>
```
