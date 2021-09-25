```javascript
function getParam(name, url) {
  let src = url || window.location.href
  if (name && src) {
    var r = new RegExp("(\\?|#|&|^)" + name + "=([^&^#]*)(#|&|$)")
    var m = src.match(r)
    return !m ? "" : decodeURIComponent(m[2]) // m[2]为上面第二个括号匹配的值，即为name=value中value的值
  }
  return ""
}
```

将参数变为对象返回
```javascript
function getParams(url) {
    url = url || location.href
    var _paramArray = url
        .replace(/.*?\?/, "") // 取到?后面的内容
        .replace(/#.*/, "") // 去掉#后面的内容（hash）
        .split("&") // 分割数组
    var params = {}

    _paramArray.forEach(val=>{
        let [key,value] = val.split("=")
        params[key] = value
    })

    return params
}
```