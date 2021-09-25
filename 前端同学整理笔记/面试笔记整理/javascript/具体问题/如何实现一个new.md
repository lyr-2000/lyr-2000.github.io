```javascript
function _new(fn,...args){
    let obj = object.create(fn.prototype)
    let res = fn.call(obj,...args)
    return typeof res === "object"?res:obj
}
```