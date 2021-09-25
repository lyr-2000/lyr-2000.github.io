better-scroll是一个解决移动端滚动场景的一个插件


## css实现方式

我们可以简单地使用css来实现这个功能，代码如下
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        .wrap {
            height: 100px;
            overflow: hidden;
        }
        
        .content {
            height:inherit;
            overflow: scroll;
        }
    </style>
</head>

<body>
    <div class="wrap">
        <ul class="content">
            <li class="con">1</li>
            <li class="con">2</li>
            <li class="con">3</li>
            <li class="con">4</li>
            <li class="con">5</li>
            <li class="con">6</li>
            <li class="con">7</li>
            <li class="con">8</li>
        </ul>
    </div>
</body>

</html>
```