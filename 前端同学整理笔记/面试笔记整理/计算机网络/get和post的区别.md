1. 参数传输
- get的参数传输直接放在url中，写在?后，使用&来分隔不同的传输内容
- post的参数可以通过request body（请求体）来完成
2. 传输长度
- 因为get的参数需要在url中传输，所以出于浏览器或服务器对url的长度限制，参数的传输是有限制的
- post请求时参数放在request body中，所以在传输的时候，理论上是没有长度限制的，除非服务器对特定的请求进行大小限制
3. 安全性
- get请求的内容放在url上，传输的参数会被看到，所以对于一些需要保密的操作，是不能使用get操作的
- post请求因为放在request body中，所以用户不能直接看到传输的参数，相对于get请求来说是比较安全的
4. 编码方式
- get请求只能进行url编码
- post请求可以使用多种编码方式
> application/x-www-form-urlencoded：最常见的编码格式，大部分服务器都支持，以key-value的形式传输  
>```json
>
>```
> multipart/form-data：这是在上传文件时，会使用到的编码方式  
> application/json：这种编码方式传递到后台的是序列化后的json字符串  
> ```json
>{"name":"john","age":18}
>```
> text/xml：如同其编码名，这里使用xml做为传输格式
5. 参数数据类型
- get只接受ASCII码
- post没有要求
6. 缓存
- get会被自动cache
- post需要手动设置才会cache


---

7. **单次请求的传输数据包**（仅在部分浏览器会出现，是因浏览器和本地操作系统的原因，不建议提起）
- get请求只传输一次数据包，直接将header和data一并发送出去
- post请求传输两次数据包，第一次发送header，得到100响应后，再将data发送出去，得到200响应