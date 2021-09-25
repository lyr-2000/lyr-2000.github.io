# indexedDB

## indexedDB的打开
---
使用window.indexedDB.open打开一个数据库，该方法接收两个参数，第一个参数为要打开的数据库的名字，第二个为数据库对应的版本号

如果要打开的数据库不存在，则会先创建该数据库
## indexedDB的基本事件
---
* error：打开数据库失败
* success：打开数据库成功
* upgradeneeded：数据库升级（如果是新建数据库，即从版本0-->1，也会触发该事件）

## 建表
---
在做增删改查操作前，我们首先要进行建表的操作
这里我们在upgradeneeded事件中建立一张表并插入数据
```javascript
request.addEventListener('upgradeneeded', event => {
    let db = event.target.result;
    if (!db.objectStoreNames.contains('person')) {
        let objStore = db.createObjectStore('person', {
            keyPath: 'id'
        })
    }
})
```

## 增删改查
---
### 增
