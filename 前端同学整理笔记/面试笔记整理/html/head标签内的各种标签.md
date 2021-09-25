# meta

## 定义和用法
可提供有关页面的元信息（meta-information），比如针对搜索引擎和更新频度的描述和关键词。

位于文档的头部，不包含任何内容，定义了与文档相关联的名称/值对。

## html中的meta与xhtml中的区别
html中的有结束标签，xhtml中的没有

## 属性

### **content(必需)**
content 属性提供了名称/值对中的值。该值可以是任何有效的字符串。

content 属性始终要和 name 属性或 http-equiv 属性一起使用，表示这两个属性对应内容的值。
```html
<meta http-equiv="content-type" content="text/html; charset=utf-8">
```
上面的写法对应下面的浏览器头部信息
```
content-type: text/html; charset=utf-8
```
### **charset**
可以将charset的设置放在content属性的值中，从HTML5开始，为了简化写法，meta标签添加了charset属性
```html
<meta charset="UTF-8">
```
添加了charset属性不需要再写content和name

### **http-equiv**
http-equiv属性把 content 属性关联到**HTTP 头部**。

http-equiv 属性为名称/值对提供了名称。并指示服务器在发送实际的文档之前先在要传送给浏览器的 MIME 文档头部包含名称/值对。

当服务器向浏览器发送文档时，会先发送许多名称/值对。虽然有些服务器会发送许多这种名称/值对，但是**所有服务器都至少要发送一个：content-type:text/html**。这将告诉浏览器准备接受一个 HTML 文档。

使用带有 http-equiv 属性的``` <meta> ```标签时，服务器将把名称/值对添加到发送给浏览器的内容头部。

```html
<meta http-equiv="charset" content="iso-8859-1">
<meta http-equiv="expires" content="31 Dec 2008">
```
对应下面的浏览器内容头部
```
content-type: text/html
charset:iso-8859-1
expires:31 Dec 2008
```

http-equiv可选的值有：content-type，expires，refresh，set-cookie

### **name**
name 属性提供了名称/值对中的名称。HTML 和 XHTML 标签都没有指定任何预先定义的 <meta> 名称。通常情况下，您可以自由使用对自己和源文档的读者来说富有意义的名称。

简单来说，name属性描述了页面的信息，便于搜索引擎抓取

name属性可选的值有：author，description，keywords，generator，revised，viewpoint


#### viewpoint
在移动开发中，我们通常要对viewpoint进行设置，常见下面这段代码
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
```
viewport就是设备的屏幕上能用来显示我们的网页的那一块区域，默认的viewport是**layout viewport**，也就是那个比屏幕要宽的viewport，但在进行移动设备网站的开发时，我们需要的是**ideal viewport**。width=device-width表示当前的viewpoint等于设备的宽度，width用来设置layout viewport的宽度，height用来设置layout viewport的高度。initial-scale=1.0表示页面的初始缩放值为1，maximum-scale允许用户的最大缩放值，minimum-scale允许用户的最小缩放值，user-scalable表示是否允许用户缩放，“no”不允许，“yes”允许。

缩放指的是相对于ideal viewport来进行的，比如
```html
<meta name="viewport" content="width=500, initial-scale=1">
```
width=500表示把当前的viewport宽度设为500，initial-scale=1则表示把当前viewport的宽度设为ideal viewport的宽度，浏览器该怎么办呢，一般会取较大的那个值。  
实际上viewport能控制的更多，它能表示的全部属性如下：

width：页面宽度，可以取值具体的数字，也可以是device-width，表示跟设备宽度相等。  
height：页面高度，可以取值具体的数字，也可以是device-height，表示跟设备高度相等。  
initial-scale：初始缩放比例。  
minimum-scale：最小缩放比例。  
maximum-scale：最大缩放比例。  
user-scalable：是否允许用户缩放。  
### **scheme(html5中不支持！)**
用于翻译content属性的值的方案
```html
<meta scheme="format|URI">
```
# style
这个标签就不多说了，是用来写css代码的

# link
这个标签用于引入文件

# title
定义页面的标题

# base
该标签为页面上所有链接规定默认地址或默认目标

通常情况下，浏览器会从当前文档的 URL 中提取相应的元素来填写相对 URL 中的空白。

使用``` <base> ```标签可以改变这一点。浏览器随后将不再使用当前文档的 URL，而使用指定的基本 URL 来解析所有的相对 URL。这其中包括``` <a>、<img>、<link>、<form> ```标签中的 URL。

```html
<head>
<base href="http://www.w3school.com.cn/css/" target="_blank" />
</head>

<body>
<a href="default.asp">W3School's CSS Tutorial</a>
</body>
```
但是这个标签的使用容易造成和JavaScript的配合问题，所以在实际开发中还是不建议使用

