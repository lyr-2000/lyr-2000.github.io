在网上查找资料的时候，看到很多关于Vue双向绑定的文章都直接说是通过Object.defineProperty实现的，但我隐约记得去年看过尤大的视频，记得好像是用proxy实现的，所以又好好找了一下，果然，在vue3.0中，已经改用proxy实现了
# 双向绑定的简单思路
在谈论vue2和vue3中各自的双向绑定形式前，我们先了解一下基本的思路
要做到双向绑定，即是在我们修改数据时，视图发生变化，而在视图发生变化时，我们要去修改其对应的数据，而视图的变化，相对简单，因为我们可以使用各种监听事件，当事件被触发时，我们就去修改相应的数据，而数据的变化，相对来说就难以去监听了，因为数据没有所谓的事件，所以我们要去采用别的方式

# vue2.x
在vue2.x中，双向绑定是通过监听对象的get和set操作来实现的，即是Object.defineProperty
我们通过Object.defineProperty的使用来简单地展示一下如何通过监听数据的变化来改变视图
首先明确一下Object.defineProperty的用法，Object.defineProperty用来监听对象的属性，这里监听set和get操作
```javascript
let obj={
	a:1
}
let val=1
let newVal=2
Object.defineProperty(obj,'a',{
	get(){
		console.log('数据被获取')
		return val
	},
	set(){
		console.log('数据被修改/设置')
		val = newVal
	}
})
```
这样每当我们获取obj的a属性或者设置修改a属性的时候，都会被劫持并打印出相应的内容，而在vue2.x中正是采用这种监听方式
使用**发布-订阅模式**，data上的数据即是发布方，而视图的修改是订阅方，每当数据发生修改时，就会发布信息，而订阅方接受到相应的信息，就会对视图进行修改，这样就达到了数据修改时改变视图的目的，我们来模仿一下这个发布订阅的过程
```javascript
let publisher = function() {
    return {
        currentList: [],
        add: function(subscriber) {
            this.currentList.push(subscriber)
        },
        publish: function(key,content) {
            let currentList = this.currentList
            for (let i = 0; i < currentList.length; i++) { // 遍历订阅者的数组
                currentList[i].receiveText(key,content)
            }
        }
    }
}
 
let subscriber = function(name) {
    return {
        receiveText: function(key,content) {
            console.log(`视图${key}已更新，相应的内容为${content}`)
        }
    }
}

// 将data作为发布方
let data = publisher()
// 把视图修改作为订阅方
let change = subscriber()
// 让视图修改订阅data的更新
data.add(change)
data._a=1
Object.defineProperty(data,'a',{
    get(){
        return data._a
    },
    set(val){
        data.publish('a',val)
        data._a = val
    }
})
```
这样子，当我们修改data的a属性时，相应的“视图”就会发生改变了
# vue3.0
虽然Object.defineProperty可以做到我们想要的双向绑定的效果，但是在proxy出现后，它就被替代掉了
通过上面的操作我们也看到了，Object.defineProperty只能一个属性一个属性地监听，也就是说，对于data对象，我们需要进行深度遍历，去监听每一个属性的变化，而一旦我们对data一个比较深的对象直接修改它的值，那么就又得对其进行重新地遍历，非常损耗性能
反观proxy，proxy可以监听一整个对象，且基于proxy的监听，只有当一个数据被用到的时候，才会去监听它，所以就避免了上面提及的问题，在监听上大大降低了性能的消耗
## proxy
proxy是ES6中出现的新语法，可以劫持对象的13种操作，其中就有set和get的操作
```javascript
let p = new Proxy({a:1}, {
	get: function(target, property,receiver) {
		console.log('劫持到get操作')
  		return Reflect.get(target, property, receiver)
	},
	set:function(target,property,value,receiver){
		console.log('劫持到set操作');
		return Reflect.set(target, key, value, receiver);
	},
})
let obj = Object.create(p)
```
具体的proxy使用详看[ES6学习笔记（十二）Proxy代理](https://blog.csdn.net/zemprogram/article/details/86555501)
## 模拟数据监听修改视图
一样的，在vue3.0中，依然是使用发布-订阅方式来实现信息修改的发布，用一段代码来模拟一下
```javascript
var publisher = function() {
    return {
        currentList: [],
        add: function(subscriber) {
            this.currentList.push(subscriber)
        },
        publish: function(key,content) {
            let currentList = this.currentList
            for (let i = 0; i < currentList.length; i++) { // 遍历订阅者的数组
                currentList[i].receiveText(key,content)
            }
        }
    }
}
 
var subscriber = function(name) {
    return {
        receiveText: function(key,content) {
            console.log(`视图${key}已更新，相应的内容为${content}`)
        }
    }
}

// 将data作为发布方
let data = publisher()
// 把视图修改作为订阅方
let change = subscriber()
// 让视图修改订阅data的更新
data.add(change)
let proxy = new Proxy(change,{
    set:function(target,prototype,value,receiver){
        change.receiveText(prototype,value)
        return Reflect.set(target,prototype.value,receiver)
    }
})
```
相比于上面针对一个个属性设置监听，这里我们只需要对这整个对象进行监听，不管我们修改的是哪个属性，都会被劫持