# 1. Promise.all
参数：数组
返回：一个promise对象
功能：该方法接受一个数组作为参数，数组成员为Promise对象，若不是Promise对象，则先使用Promise.resolve方法变为对象。而事实上，数组参数中的每个值都会经过Promise.resolve方法的过滤。若数组中所有Promise对象的状态都变成已成功，则该方法返回的Promise对象的状态也变为已成功；若数组中有一个Promise对象状态变为已失败，则第一个变为已失败的对象的返回值传递给最后返回的Promise对象，该对象状态也变为已失败。

```javascript
Promise._all = function(promises){
    return new Promise((resolve,reject)=>{
        // 将可遍历的类型转为数组形式
        promises = Array.from(promises)
        // 若数组长度为0，则直接resolve([])
        if(promises.length === 0){
            resolve([])
        }else{
            // 使用一个变量count来计算当前已完成的promise
            let count = 0
            for(let i=0;i<promises.length;i++){
                Promise.resolve(promises[i]).then(val=>{
                    promises[i] = val
                    // 若完成的promise数量和数组长度一致，说明全部完成，则返回处理好的数组
                    if(++count === promises.length){
                        resolve([promises])
                    }
                }).catch(err=>{
                    reject(err)
                })
            }
        }
    })
}
```
## 测试
全部完成
```javascript
var p1 = new Promise((res,rej)=>{
    res(1)
})
var p2 = new Promise((res,rej)=>{
    res(2)
})
var p3 = new Promise((res,rej)=>{
    res(3)
})
Promise._all([p1,p2,p3]).then(val=>{
    console.log(val)
})
//  [1, 2, 3]
```
一个失败
```javascript
var p1 = new Promise((res,rej)=>{
    res(1)
})
var p2 = new Promise((res,rej)=>{
    rej(2)
})
var p3 = new Promise((res,rej)=>{
    res(3)
})
Promise._all([p1,p2,p3]).catch(err=>{
    console.log(err)
})
// 2
```



# 2. Promise.race
参数：数组
返回：一个promise对象
功能：该方法与Promise.finally一样，都传入一个数组做为参数，但是返回的promise对象的状态，由数组中最先发生状态改变的promise决定，如果传入一个空数组，状态永远不会发生改变
```javascript
Promise._race = function(promises){
    promises = Array.from(promises)
    return new Promise((resolve,reject)=>{
        promises.forEach(p=>{
            Promise.resolve(p).then(val=>{
                resolve(val)
            }).catch(err=>{
                reject(err)
            })
        })
    })
}
```


# 3. Promise.finally
参数：一个回调方法
返回：一个promise对象
功能：Promise.finally执行的时候，不管原来的状态变为resolve或是变为reject，都会去执行传入的回调方法
```javascript
Promise._finally = function(callback){
    return this.then(val=>{
        return Promise.resolve(callback()).then(()=>{
            return val
        })
    },err=>{
        return Promise.resolve(callback()).then(()=>{
            throw err
        })
    })
}
```