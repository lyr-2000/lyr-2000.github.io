# test
```javascript
/a/.test("a")
// true
```
# match
```javascript
var res = "abc".match(/a/)
console.log(res)
// ["a", index: 0, input: "abc", groups: undefined]
```
- res[0]： 匹配到的元素
- res.index：匹配到的第一个位置
- res.input：匹配的字符串
- res.groups：为有命名的分组名及其值

若没有匹配到，返回null

# matchAll
```javascript
var regexp = /t(?<e>e)(?<stNum>st(\d?))/g;
var str = 'test1test2';

var array = [...str.matchAll(regexp)];
```
array打印如下图  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200120173557852.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
该方法会将字符串与传入的正则进行匹配，返回每个匹配的结果及每个分组的匹配结果，groups为有命名的分组名及其值，index为匹配开始的下标，length为返回的数组长度

# exec
用于检索字符串中的正则表达式的匹配，字符串中有匹配的值返回该匹配值，否则返回 null

与match不同的是，exec是RegExp的方法
```javascript
var res = /a/.exec("abc")
console.log(res)
// ["a", index: 0, input: "abc", groups: undefined]
```