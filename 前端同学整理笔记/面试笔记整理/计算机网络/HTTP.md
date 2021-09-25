# HTTP（超文本传输协议）
HTTP由两个程序实现，一个用户程序和一个服务器程序，客户程序和用户程序运行在两个不同的**端系统**，通过交换**HTTP报文**进行对话。  
HTTP协议是基于TCP协议出现的，

## HTTP协议格式
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191018172430683.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)

## 通用首部字段
**Cache-Control**：该字段用于控制缓存的时效性，由多个参数可选，通过“,”分隔  
例如no-cache，在客户端表示强制向源服务器再次验证资源，即不使用缓存，从源服务器获取资源，而在源服务器的响应中，表示资源可被缓存，但是每次使用都需要和源服务器确认内容  
**Connection**：Connection有两个作用，一个是控制不再转发的首部字段，该作用体现在请求中，使用Connection指定另一个首部字段，在**通过代理服务器转发**时，就会将该首部字段删除后再转发请求。如果直接发给源服务器，则不会删除相应的字段。  
第二个作用是管理持久连接，在HTTP1.1之前的HTTP版本的默认连接都是非持久性连接，若要在旧版本的HTTP上使用持久连接，就要指定该字段值为Keep-Alive。在HTTP1.1版本后，默认连接都是持久连接。当服务器要断开连接时，可通过指定首部字段的值为**Close**来断开连接  
Date：创建HTTP报文的时间  
**Via**：用于追踪客户端与服务器之间的请求和响应报文的传输路径。每当报文经过代理或网关时，会在首部字段Via中附加该服务器的信息，然后再进行转发。



## 请求头（Request Header）
**Accept**：浏览器接收的格式，如text/html；为客户端向服务器提出的想要接收的格式，可以设置多个，然后通过权重的设置来决定优先使用哪种格式。  
Accept-Charset：浏览器接收的字符集及字符集的相对优先顺序，如iso-8859-5  
**Accept-Encoding**：浏览器接收的编码格式，如gzip  
**Accept-Language**：浏览器接收的语言，如zh-cn  
Authorization：用于告知服务器，用户代理的认证信息。通常在收到401状态码响应后将改字段加入请求中。  
**Cookie**：接收到服务器传来的cookie后，之后每次都将接收到的值放在Cookie字段中发送给服务器。  
**Host**：请求的资源所处的互联网主机名和端口号。为HTTP1.1新增的字段，在HTTP1.0中，认为每个服务器对应一个IP地址，所以请求中没有必要写主机名，但是虚拟技术的发展带来了虚拟主机，在HTTP1.1中，如果没有Host头域，则会报400错误。（如果服务器未设定主机名，则直接发送一个空值）  
**If-Match**：附带条件之一，告知服务器匹配资源所用的实体标记值（ETag）。服务器通过比对If-Match的值和ETag的值，二者相同则正常处理，否则返回**412错误**（请求头中的一些前提条件失败），这时服务器无法使用**弱ETag**值。可以通过指定*为字段值来让服务器忽略ETag的存在，只要资源存在就处理请求。  
**If-None-Match**：与If-Match正好相反，仅当字段值与ETag不同时才处理。  
**If-Modified-Since**：指定一个时间，如果在这个时间后资源发生了更新，则服务器会接收请求，返回200同时返回Last-Modified指明上次修改页面的时间，否则返回304。  
If-Unmodified-Since：该字段的作用与If-Modified-Since正好相反，仅当指定的请求资源在字段值指定的时间之后才处理请求，否则返回412  
**User-Agent**：客户端标识。会将创建请求的浏览器和用户代理名称等信息传达给服务器。如：Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Safari/537.36 Core/1.70.3730.400 QQBrowser/10.5.3805.400

##响应头（Response Header）
**ETag**：告知客户端实体标识。将资源以字符串的形式做唯一标识，服务器为每份资源分配对应的ETag值，当资源更新时，ETag值也会发生变化，所以通过ETag值我们可以判断资源是否发生了更新。  
强ETag，不论实体发生什么细微变化值都会发生改变  
弱ETag，仅用于提示资源是否相同，只有资源发生了根本变化时值才会改变，弱ETag值在字段值最开始处会附加W/。  
**Expires**：过期时间，用于判断下次请求是否需要到服务端返回页面  
**Keep-Alive**：持久连接需要的一些信息，如Keep-Alive：timeout=10.max=500，通常在请求中包含字段Connection：Keep-Alive时返回  
**Last-Modified**：页面上次修改的时间  
**Server**：告知客户端当前服务器上安装的HTTP服务器应用程序的信息，还可能包括版本好和安装时启用的可选项。  
**Set-Cookie**：用于设置cookie，可同时设置多个cookie

## HTTP1.0和HTTP1.1的主要区别
1. 缓存处理  
在HTTP1.0中，我们采用Set-Cookie，Expires，Last-Modified，If-Modified-Sinced等字段来处理缓存，在HTTP1.1中，增加了更多字段来处理缓存，如ETag，If-Match，If-None-Match，If-Unmodified-Since，Cache-Control
2. 带宽优化  
在HTTP1.0中，即使客户端只是需要对象的一部分，也必须请求整个对象，这样造成了一定的带宽浪费，而在HTTP1.1中，可以通过Range来指定需要哪部分的内容，来获取对象的一部分，请求处理成功后会返回206（只返回资源的部分），若无法处理该范围请求时，则返回状态码200及全部资源。 
3. 新增状态码  
在HTTP1.1中，增加了很多新的状态码，详见https://tools.ietf.org/html/rfc2616#section-6.1.1
4. Host头域  
在HTTP1.1中，多了Host字段，而且这个字段是**必传**的，即使没有指定的主机，也要发送一个值为空的Host字段，如果没有发送该字段，会返回400状态码（请求的语法错误）
5. 长连接  
在HTTP1.0中，默认的连接方式为短连接，而在HTTP1.1中，默认的连接方式为长连接，只有在返回字段Connection：close时才会断开连接，而在HTTP1.0中，需要通过Connection：Keep-Alive来创建长连接


## HTTPS
在HTTP的基础上，HTTPS和HTTP2规定了更复杂的内容，但是保留了HTTP的**Request-Response模式**  
HTTPS有两个作用，一是确定请求的目标服务端身份，二是保证传输的数据不会被网络中间节点窃听或者篡改。  
HTTPS是使用**加密通道**来传输HTTP的内容。但是HTTPS首先与服务端建立一条**TLS加密通道**。TLS构建于TCP协议之上，它实际上是对传输的内容做一次加密，所以从传输内容上看，HTTPS跟HTTP没有任何区别。

---
### HTTPS与HTTP的一些区别
HTTPS协议需要到CA申请证书，一般免费证书很少，需要交费。

HTTP协议运行在TCP之上，所有传输的内容都是明文，HTTPS运行在SSL/TLS之上，SSL/TLS运行在TCP之上，所有传输的内容都经过加密的。

HTTP和HTTPS使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者是443。

HTTPS可以有效的防止运营商劫持，解决了防劫持的一个大问题。

---

## HTTP2
HTTP 2.0 最大的改进有两点，一是支持服务端推送，二是支持TCP连接复用。  

服务端推送能够在客户端发送第一个请求到服务端时，提前把一部分内容推送给客户端，放入缓存当中，这可以避免客户端请求顺序带来的并行度不高，从而导致的性能问题。

TCP连接复用，则使用同一个TCP连接来传输多个HTTP请求，避免了TCP连接建立时的三次握手开销，和初建TCP连接时传输窗口小的问题。