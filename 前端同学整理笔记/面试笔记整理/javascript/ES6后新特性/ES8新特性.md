# 1. Object.values  
这个方法接收一个对象参数，将该对象中属性及其值放到一个数组中返回  
```javascript
Object.values({foo:1,bar:2}) // [1,2]
```
若传入的是一个数组，则直接返回这个数组，若数组有其他属性，则会将这个属性的值添加到返回的数组中去  
```javascript
var arr=[1,2,3];
Object.values(arr); // [1,2,3]
arr.val = 4;
Object.values(arr); // [1,2,3,4]
```
# 2. Object.entries  
这个方法接收一个对象参数，返回一个二维数组，数组中的每个成员数组的第一项为属性名，第二项为属性对应的值
```javascript
Object.entries({foo:1,bar:2}) 
// [["foo",1],["bar",2]]
```
若传入的是一个数组，则属性名变为下标的值
```javascript
Object.entries([1,2,3]) 
// [["0",1],["1",2],["2",3]]
```

3. padStart  
该方法为字符串填充方法，传入两个参数，第一个参数为要填充到的字符串长度，第二个参数为要用来填充的字符串，将第二个参数的字符串填充到字符串的开头    
```javascript
"123".padStart(5,'m') // "mm123"
"123".padStart(10,'mab') // "mabmabm123"
```
若传入的第一个参数小于原字符串的长度，则直接返回原来的字符串

4. padEnd  
该方法为字符串填充方法，用法和padStart一样，但是填充在字符串的末尾
```javascript
"123".padEnd(5,'m') // "123mm"
"123".padEnd(10,'mab') // "123mabmabm"
```

5. Object.getOwnPropertyDescriptors  
该方法可以返回对象的描述属性
```javascript
Object.getOwnPropertyDescriptors({foo:1})
/*
{
    configurable: true
    enumerable: true
    value: 1
    writable: true
    __proto__: Object
    __proto__: Object
}
*/
```

6. 函数参数列表和调用时的参数的尾逗号
```javascript
function add(a,
b){
    return a+b;
}

add(1,
2)
```
上面的这种写法，在ES5中是会报错的，但在ES8中是可以使用的

7. async  
[ES6学习笔记（十六）asnyc函数](https://blog.csdn.net/zemprogram/article/details/86596178)