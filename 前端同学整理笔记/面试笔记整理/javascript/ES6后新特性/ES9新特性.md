## 1. 关于rest和spread属性的扩展  
在ES6中，我们可以通过...来传入不定数的参数，也可以用来给数组赋值
```javascript
function sum(...rest){
    let sum = 0;
    for(let i = 0;i<rest.length;i++){
        sum+=rest[i];
    }
    return sum;
}
sum(1,2,3,4); // 10

[a,b,...c]=[1,2,3,4,5]; //a=1 b=2 c=[3,4,5]
```
在ES9中，...可以用来给对象解构赋值
```javascript
{a,b,...other}={a:1,b:2,c:3,d:4,e:5}; // a=1 b=2 other={c:3,d:4,e:5}
```

## 2. 异步迭代
for-await-of

## 3. promise.prototype.finally  
我们知道promise可以变为fulfilled状态和rejected状态，相应会去执行then方法和catch方法，而finally方法则是无论成功或是失败都会执行
```javascript
let a = 1;
function judge(resolve,reject){
    if(a>0){
        resolve(a);
    }else{
        reject(a);
    }
}
new Promise(judge).then(val=>{
    console.log('then',val);
}).catch(err=>{
    console.log('catch',err);
}).finally(()=>{
    console.log('finally');
})
// then 1
// finally
a=-1;
new Promise(judge).then(val=>{
    console.log('then',val);
}).catch(err=>{
    console.log('catch',err);
}).finally(()=>{
    console.log('finally');
})
// catch -1
// finally
```

## 4. 后行断言 
在之前的JavaScript中，只有先行断言，而在ES2018中引入了后行断言

### 先行断言
/x(?=y)/  匹配在y前面的x

/x(?!y)/  匹配x不在y前面的x

/\d(?=%)/.exec('1% 2') // 匹配后面有%的数字
// ["1"]
/\d(?!%)/.exec('1% 2') // 匹配后面没%的数字
// ["2"]
### 后行断言
/(?<=y)x/ 匹配在y后面的x

/(?<!y)x/ 匹配不在y后面的x
```javascript
/(?<=\$)\d/.exec('$1 2')
// ["1"]
/(?<!\$)\d/.exec('$1 2')
// ["2"]
```
### 后行断言带来的问题
后行断言会按先右后左的匹配顺序，会导致一些不同的结果
```javascript
/^(\d+)(\d+)$/.exec('1053') // ["1053", "105", "3"]
/(?<=(\d+)(\d+))$/.exec('1053') // ["", "1", "053"]
```
上面代码中，第一行的代码没有使用后行断言，由于在贪婪模式下（会尽可能地多匹配），所以第一个括号内匹配的数字个数为3个，第二个括号内匹配的数字个数为1个，所以是"105"，"3"。而第二段代码使用了后行断言，从右边匹配起，也同样在贪婪模式下，右边的括号内会匹配3个数字，左边的括号匹配1个数字，所以是"1"，"053"。

## 5. 匹配字符\p{...}和\P{...}
在ES9中，正则式中可以通过\p{...}匹配Unicode字符，使用\P{...}来匹配非Unicode字符  
{}内可以传入想要匹配的内容，比如匹配ASCII字符  
因为是要判断Unicode字符，所以需要加上ES6中的u修斯符，否则{}内的东西会被视为量词
```javascript
/^\p{ASCII}+$/u.test('ABC@')  // true
/^\p{ASCII}+$/u.test('ABC🙃') // false
```

除了ASCII外，还能传入其他的内容，利用\p我们可以做到匹配所有的Unicode字符，不只是匹配ASCII字符  
像下面的数字字符，我们使用\d无法完全匹配，因为有些字符不是ASCII编码的  
```javascript
/\d/u.test('𝟏𝟐𝟑𝟜𝟝𝟞𝟩𝟪𝟫𝟬𝟭𝟮𝟯𝟺𝟻𝟼') // false
```
但是通过使用\p，传入相应的值，我们可以匹配到这些其他编码的数值
```javascript
/\p{Decimal_Number}/u.test('𝟏𝟐𝟑𝟜𝟝𝟞𝟩𝟪𝟫𝟬𝟭𝟮𝟯𝟺𝟻𝟼') // true
```

\p{}可传入的字符可以在[此处](https://github.com/tc39/proposal-regexp-unicode-property-escapes)找到  

## 6. 正则分组命名
在以往的正则表达式中，我们可以采用分组来将正则表达式其中一部分做为整体替换，比如下面这个  
```javascript
'2019-02-22'.replace(/(\d{4})-(\d{2})-(\d{2})/,'$2/$3/$1')
// "02/22/2019"
```
而在ES2018中，我们可以为这些分组命名
```javascript
'2019-02-22'.replace(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,'$<month>/$<day>/$<year>') // "02/22/2019"
```
这样写使得我们在匹配时更加语义化且明确  
使用\k<分组名>可引用正则表达式中具名组的值
```javascript
const RE_TWICE = /^(?<word>[a-z]+)!\k<word>$/;
RE_TWICE.test('abc!abc') // true
```

## 7. s修饰符
s修饰符是为了解决.匹配单个字符时的特殊情况，.可以匹配任意单个字符，但四个字节的 UTF-16 字符（可以使用u修饰符解决）和行终止符无法匹配。以下四个为行终止符  
- U+000A 换行符（\n）
- U+000D 回车符（\r）
- U+2028 行分隔符（line separator）
- U+2029 段分隔符（paragraph separator）
```javascript
/a.b/.test('a\nb');
// false
/a.b/s.test('a\nb');
// true
```