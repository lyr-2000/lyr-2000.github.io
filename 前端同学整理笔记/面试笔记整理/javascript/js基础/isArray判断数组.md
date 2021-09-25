Array.isArray判断原理
```javascript
Array.isArray = function(value) { 
    return Object.prototype.toString.call(value) === '[object Array]';
}
```