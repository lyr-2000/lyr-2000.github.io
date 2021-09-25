```javascript
let ajax = function(options) {
    // 创建XHR对象
    function createXHR() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest()
        } else if (window.ActiveXObject) {
            if (typeof arguments.callee.activeXString != 'string') {
                var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'];
                for (let i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i])
                        arguments.callee.activeXString = versions[i]
                        break
                    } catch (err) {

                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString)
        } else {
            throw new Error('No XHR object available')
        }
    }
    // 对象转换成字符串
    function dataToString(data) {
        if (typeof data == 'object') {
            let d = ''
            let keys = Object.keys(data)
            for (i = 0; i < keys.length; i++) {
                d += `${keys[i]}=${data[keys[i]]}&`
            }
            return d.slice(0, d.length - 1)
        }
        return data
    }
    // 创建XHR对象
    try {
        let xhr = createXHR()
        xhr.open(options.type, options.url)
        if (options.type == 'post') {
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
            xhr.send(dataToString(options.data))
        } else if (options.type == 'get') {
            xhr.send(null)
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let res = xhr.responseText
                options.success && options.success(res)
            }
        }
    } catch (err) {
        options.error && options.error(err)
    }
}
```

添加柯里化