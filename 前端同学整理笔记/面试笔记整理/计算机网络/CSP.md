https://www.cnblogs.com/wuguanglin/p/XSS.html

CSP 的实质就是白名单制度，开发者明确告诉客户端，哪些外部资源可以加载和执行，等同于提供白名单。它的实现和执行全部由浏览器完成，开发者只需提供配置。

两种方法可以启用 CSP。一种是通过 HTTP 头信息的Content-Security-Policy的字段。

```
Content-Security-Policy: script-src 'self'; object-src 'none';
style-src cdn.example.org third-party.org; child-src https:
```

另一种是通过网页的\<meta>标签。

```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">
```

上面的两段设置，做了如下限制
- 脚本：只信任当前域名
- \<object>标签：不信任任何URL，即不加载任何资源
- 样式表：只信任cdn.example.org和third-party.org
- 框架（frame）：必须使用HTTPS协议加载
- 其他资源：没有限制


## 资源加载限制
以下选项限制各类资源的加载。

- script-src：外部脚本
- style-src：样式表
- img-src：图像
- media-src：媒体文件（音频和视频）
- font-src：字体文件
- object-src：插件（比如 Flash）
- child-src：框架
- frame-ancestors：嵌入的外部资源（比如\<frame>、\<iframe>、\<embed>和\<applet>）
- connect-src：HTTP 连接（通过 XHR、WebSockets、EventSource等）
- worker-src：worker脚本
- manifest-src：manifest 文件

## default-src
default-src用来设置上面各个选项的默认值
```
Content-Security-Policy: default-src 'self'
```

上面代码限制所有的外部资源，都只能从当前域名加载。

如果同时设置某个单项限制（比如font-src）和default-src，前者会覆盖后者，即字体文件会采用font-src的值，其他资源依然采用default-src的值。

## URL限制
- frame-ancestors：限制嵌入框架的网页
- base-uri：限制\<base#href>
- form-action：限制\<form#action>

## report-uri
有时，我们不仅希望防止 XSS，还希望记录此类行为。report-uri就用来告诉浏览器，应该把注入行为报告给哪个网址。
```
Content-Security-Policy: default-src 'self'; ...; report-uri /my_amazing_csp_report_parser;
```
上面代码指定，将注入行为报告给/my_amazing_csp_report_parser这个 URL。

浏览器会使用POST方法，发送一个JSON对象，下面是一个例子。
```json
{
  "csp-report": {
    "document-uri": "http://example.org/page.html",
    "referrer": "http://evil.example.com/",
    "blocked-uri": "http://evil.example.com/evil.js",
    "violated-directive": "script-src 'self' https://apis.google.com",
    "original-policy": "script-src 'self' https://apis.google.com; report-uri http://example.org/my_amazing_csp_report_parser"
  }
}
```

# Content-Security-Policy-Report-Only
除了Content-Security-Policy，还有一个Content-Security-Policy-Report-Only字段，表示不执行限制选项，只是记录违反限制的行为。

它必须与report-uri选项配合使用。
```
Content-Security-Policy-Report-Only: default-src 'self'; ...; report-uri /my_amazing_csp_report_parser;
```

# 选项值
每个限制选项可以设置以下几种值，这些值就构成了白名单。

- 主机名：example.org，https://example.com:443
- 路径名：example.org/resources/js/
- 通配符：*.example.org，*://*.example.com:*（表示任意协议、任意子域名、任意端口）
- 协议名：https:、data:
- 关键字'self'：当前域名，需要加引号
- 关键字'none'：禁止加载任何外部资源，需要加引号

多个值也可以并列，用空格分隔。
```
Content-Security-Policy: script-src 'self' https://apis.google.com
```
如果同一个限制选项使用多次，只有第一次会生效。

## 错误的写法
```
script-src https://host1.com; script-src https://host2.com
```
## 正确的写法
```
script-src https://host1.com https://host2.com
```
如果不设置某个限制选项，就是默认允许任何值。

# 注意点
（1）script-src和object-src是必设的，除非设置了default-src。

因为攻击者只要能注入脚本，其他限制都可以规避。而object-src必设是因为 Flash 里面可以执行外部脚本。

（2）必须特别注意 JSONP 的回调函数。

```html
<script
src="/path/jsonp?callback=alert(document.domain)//">
</script>
```
上面的代码中，虽然加载的脚本来自当前域名，但是通过改写回调函数，攻击者依然可以执行恶意代码。