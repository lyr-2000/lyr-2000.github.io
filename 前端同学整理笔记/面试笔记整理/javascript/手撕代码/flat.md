```javascript
function _flat(arr){
    let res = []
    for(let i=0;i<arr.length;i++){
        if(Array.isArray(arr[i])){
            res = [...res,..._flat(arr[i])]
            // res = res.concat(_flat(arr[i]))
        }else{
            res.push(arr[i])
        }
    }
    return res
}
```