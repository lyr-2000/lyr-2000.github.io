# cookie

## 简介
由于HTTP本身是无状态的，服务器无法记住发送请求的客户端。cookie实际上是一小段文本信息（只有4k大小），如果服务器要记住发起请求的用户的状态，就可以使用cookie来实现。  
当客户端向服务器端发送请求的时候，服务器端向客户端发回一个cookie，而客户端将该cookie保存下来，每次发送请求的时候带上这个cookie，因为服务器端也存有该cookie，所以可以通过检查来cookie来确认用户的状态。

## 过程
当用户发起登录请求时，cookie的设置会经历下面的过程

1. 客户端发送一个请求到服务器
2. 服务器发送一个http响应到客户端，其中包括set-cookie的头部
3. 客户端保存响应中的cookie，再向服务器发送请求，请求中包含cookie的头部
4. 服务器返回响应数据

## 过程
如果不在浏览器中设置过期事件，cookie被保存在**内存**中，生命周期随浏览器的关闭而结束，这种cookie简称为会话cookie。如果在浏览器中设置了cookie的过期事件，cookie会被保存在**硬盘**中，关闭浏览器后，cookie数据仍然存在，直到过期事件结束才消失。

## 属性
### name=value
键值对，可以设置要保持的key/value，要注意的是这里的name不能和其他属性重名

### Expires
该属性用来设置cookie的有效期。cookie中的maxAge用来表示该属性，单位为秒。  

当Expires缺省的时候，默认为会话性cookie，值保存在客户端中，当用户关闭浏览器的时候，该cookie失效。

Cookie中通过getMaxAge()和setMaxAge(int maxAge)来读写该属性。maxAge有3种值，分别为正数，负数和0。  

如果maxAge为正数，则cookie会在对应的时间结束后自动失效。浏览器会将maxAge为正数的cookie写入对应的**cookie文件**中（每个浏览器的存放位置不同）。只要在该时间内，不管用户重新打开浏览器甚至是电脑，都还是可以保持登录状态的。

如果maxAge为0，则表示立即删除cookie，一旦执行该方法，cookie会马上失效。

如果maxAge为负数，则cookie会在浏览器关闭的时候失效，与为0的情况不同的是，为负数的情况下，cookie还会保持一段时间。

### domain
该属性用来设置生成cookie的域名  
cookie无法跨域名使用，只能在当前域名下使用

正常情况下，同一个一级域名下的两个二级域名也不能交互使用cookie,比如test1.mcrwayfun.com和test2.mcrwayfun.com，因为二者的域名不完全相同。如果想要mcrwayfun.com名下的二级域名都可以使用该Cookie，需要设置Cookie的domain参数为.mcrwayfun.com，这样使用test1.mcrwayfun.com和test2.mcrwayfun.com就能访问同一个cookie

要注意的是，不能跨域设置域名

### path
path属性决定允许访问Cookie的路径。比如，设置为"/"表示允许所有路径都可以使用Cookie

### secure
http除了是无状态的外，还是不安全的。信息不经任何处理就会在网络上传输。可以通过将cookie的secure属性设置为true来让浏览器只在https和SSL中传输此类cookie

### HttpOnly
HttpOnly属性是cookie的一个扩展，它使JavaScript脚本无法获取Cookie，其目的是为了防止跨站脚本攻击对cookie信息的窃取

也即是说，无法通过document.cookie来得到cookie信息了

### SameSite
SameSite 属性可以让 Cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）

SameSite 可以有下面三种值：

1. Strict 仅允许一方请求携带 Cookie，即浏览器将只发送相同站点请求的 Cookie，即当前网页 URL 与请求目标 URL 完全一致。
2. Lax 允许部分第三方请求携带 Cookie
3. None 无论是否跨站都会发送 Cookie

2 月份发布的 Chrome80 版本中默认屏蔽了第三方的 Cookie，之前默认是none，Chrome80后默认为Lax

跨站表示有效顶级域名+二级域名不同
![](https://user-gold-cdn.xitu.io/2020/3/22/171004c9fb0eab31?w=958&h=351&f=png&s=245829)

## 修改删除cookie  
HttpServletResponse提供的Cookie操作只有一个addCookie(Cookie cookie)，所以想要修改Cookie只能使用一个同名的Cookie来覆盖原先的Cookie。如果要删除某个Cookie，则只需要新建一个同名的Cookie，并将maxAge设置为0，并覆盖原来的Cookie即可。  
新建的Cookie，除了value、maxAge之外的属性，比如name、path、domain都必须与原来的一致才能达到修改或者删除的效果。否则，浏览器将视为两个不同的Cookie不予覆盖。


参考文章
https://juejin.im/post/5e718ecc6fb9a07cda098c2d#heading-14