1. 求幂运算符（**）  
求幂运算符功能与Math.pow()功能一样，但写起来更为便捷

2. Array.prototype.includes()  
增加了一个判断数组内有无某个元素的方法，传入两个参数，第一个参数为要找的值，第二个参数为开始找的索引，返回布尔值

如果忽略第二个参数，则默认从第一个开始找
```javascript
[1,2,3].includes(1); // true
```
如果忽略两个参数，则从第一个开始找undefined
```javascript
[undefined].includes(); // true
```
includes只能判断一些简单值，无法直接判断对象是否存在
```javascript
[{a:1}].includes({a:1}) // false
```
但如果赋值给变量，是可以判断的
```javascript
var a={foo:1};
[a].includes(a);
```
实际上就是因为在方法内部的判断使用了===

和原有的方法indexOf相比，includes直接返回布尔值，如果只是要看数组内是否有该值，使用includes更合适  
此外，includes和indexOf在判断NaN的时候存在差异，虽然NaN===NaN返回false，但是includes可以判断NaN的存在，而indexOf不行  
```javascript
[NaN].includes(NaN); // true
[NaN].indexOf(NaN); // -1
```