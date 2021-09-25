# geolocation

geolocation是html5中用于定位用户位置的一个API

该API通过navigator.geolocation来获取用户的位置信息，一般通过其getCurrentPosition方法来获取信息

## getCurrentPosition
getCurrentPosition方法接收三个参数，第一个参数为成功的回调函数，第二个参数为失败的回调函数，第三个为一个PositionOptions对象，其中第一个参数是必要的，后面两个参数为可选的

### PositionOptions对象
PositionOptions对象有三个属性可以设置

1. enableHighAccuracy  
布尔值，表明是否使用高精度来表示结果，如果值为true，那么在设备能提供一个高精度值的时候就会使用该值，但是这么做会损耗较多的时间和电量，该值默认为false

2. timeout  
正的long类型值，表明设备必须在多长时间（单位毫秒）内返回一个位置，默认值为Infinity

3. maximumAge  
正的long类型值，表明设备可以获取多长时间内缓存的值，如果设置为0，那么无论什么时候都必须返回一个当前真实的位置信息，默认值为0


```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>GPS</title>
</head>

<body style="font-size:100">
    <p id="result"></p>
    <script>
        var result = document.getElementById("result");
        getLocation();

        //获取位置
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    showPosition, handleLocationError, {
                        maximumAge: 60000,
                        timeout: 50000,
                        enableHighAccuracy: true
                    }
                );
            } else {
                result.innerHTML = "该设备不支持gps定位";
            }
        }

        //获取位置失败处理
        function handleLocationError(error) {
            switch (error.code) {
                case 0:
                    alert("获取位置信息出错！");
                    break;
                case 1:
                    alert("您设置了阻止该页面获取位置信息！");
                    break;
                case 2:
                    alert("浏览器无法确定您的位置！");
                    break;
                case 3:
                    alert("获取位置信息超时！");
                    break;
            }
        }

        //显示位置
        function showPosition(position) {
            result.innerHTML = "经度: " + position.coords.latitude + "<br>纬度: " + position.coords.longitude;
        }
    </script>
</body>

</html>
```

## 在PC上使用geolocation的问题

我尝试过将这段代码放在谷歌上运行，发现无法获取位置，弹出了获取位置超时的信息，但是在火狐浏览器上却可以运行，

看了网上的各种博客资料，有的说是要访问被墙的API，所以无法请求到，但是网络并没有请求什么东西

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191013193216371.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)