# axios跨域
在自己写的一个项目中，想要直接将学号和密码发到学校的教务系统，结果跨域了。。。。。。
原代码
```javascript
// url为要访问的域名
axios.get(`${url}?method=authUser&xh=${this.sNo}&pwd=${this.password}`)
.then((res) => {
    // ...
}).catch((err) => {
	// ...
})
```
​​​​​​​![在这里插入图片描述](https://img-blog.csdnimg.cn/20190907154833783.png)
在网上找解决跨域的问题时，看到很多都是修改config下的...文件，但是vue-cli脚手架创建的vue3项目中并没有config文件夹，所以直接去到官方文档查找配置
### 解决方法
在package.json同级文件夹下创建vue.config.js，配置如下
```javascript
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'url', //设置要访问的域名和端口号
                changeOrigin: true, //设置为跨域
                pathRewrite: {
                    '^/api': '/' //这里理解成用‘/api’代替target里面的地址，在后面发起请求时，/api就会代替target中的值，可以实现跨域
                }
            }
        }
    }
}
```
修改我们的请求代码
```javascript
axios.get(`/api/app.do?method=authUser&xh=${this.sNo}&pwd=${this.password}`)
            .then((res) => {
                // ...
            }).catch((err) => {
				// ...
            })
```
这里使用/api替换了原来的url，实现跨域
# axios发起post请求后端无法接收数据
在第一次使用axios向后台发送post请求时，发现自己发送的数据后端没有接收到，后端用的是spring框架，但是同样的请求我使用自己的node服务器测试时却好好的
原代码
```javascript
axios.post(url,{data:data})
  .then(res => {
      // ...
  }).catch(err => {
      // ...
  })
```
我用node服务器打印请求发过拉的数据，都能得到```{"data":1}```，但是后端那里总是只能得到null
在查看前后端代码后总是觉得没问题，唯一的变数只有axios了，所以去到淘宝镜像上看axios的使用，看到特性里面的概述
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190907170037504.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
大概就是说可以对请求中的数据和响应的数据做格式转换，而且会自动对json数据做转换，我尝试将上面的请求改成使用非json格式传输
```javascript
axios.post(url,`data=${data}`)
  .then(res => {
      // ...
  }).catch(err => {
      // ...
  })
```
意料之中的成功了，那么为什么呢，在查阅资料后，终于在GitHub上找到了对应的源码
```javascript
transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Accept');
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    // 看这里------------------------------------------
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }]
```
当判断为对象时，会把headers设置为application/json;charset=utf-8，也就是Content-Type，而根据项目组里的后端同学所说的，服务端要求的是```Content-Type': 'application/x-www-form-urlencoded```，我试着在发送请求前将headers设置为application/x-www-form-urlencoded，结果还是不行，大概是因为源码中对headers的修改在自己的设置之后实现的，但是这样写的话，要写出一串很长的字符串，感觉挺麻烦的，那就可以尝试下面的方法

因为源码中是通过transformRequest来修改headers的，而这个方法我们其实也可以自己实现，所以我们只要在发送请求的时候自己来实现这个方法就可以了，这里通过修改data的数据结构来达到目的
```javascript
import Qs from 'qs'
axios({
	url:url,
	data:{
		data:data
	},
	transformRequest: [function (data) {
	    // 对data的数据格式进行修改
	    return Qs.stringify(data)
    }],
	headers: {
		'deviceCode': 'A95ZEF1-47B5-AC90BF3'
	})
	 .then(res => {
      // ...
  }).catch(err => {
      // ...
  })
```
上面是将data的数据格式进行转换，但是我们也可以选择修改处理data的方式
```javascript

axios({
	url:url,
	data:{
		data:data
	},
	transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Accept');
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    // 看这里------------------------------------------
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      let _data = Object.keys(data)
	      return encodeURI(_data.map(name => `${name}=${data[name]}`).join('&'));
	    }
	    return data;
	  }])
	 .then(res => {
      // ...
  }).catch(err => {
      // ...
  })
```
---
参考文档
[淘宝镜像axios的文档](https://npm.taobao.org/package/axios)
[github源码所在的位置](https://github.com/axios/axios/blob/master/dist/axios.js)
