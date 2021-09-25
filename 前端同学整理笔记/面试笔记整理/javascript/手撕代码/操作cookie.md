取cookie
```javascript
function getCookie(name) {           
    var arr = document.cookie.split(';');           
    for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('=');
        var arrTest = arr2[0].trim();        
        if (arrTest == name) {         
            return arr2[1];
        }
    }
}
```
document.cookie直接赋值name-value时，默认浏览器关闭时cookie失效
存cookie：
```javascript
function setCookie(name, value, expires = 10) {
    var date = new Date();
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000)
    document.cookie =`${name}=${value};expires="${date.toGMTString()};path=/;`
}
```
删cookie：
```javascript
// 立即删除
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = `${name}=${cval};expires=${exp.toGMTString()};`
    }
}
```