创建一个reconnect方法来执行websocket的重连，当发生错误即执行onerror方法的时候，触发这个重连方法
```javascript
ws.onerror = funciton(){
    console.log('发生异常了')
    reconnect();
}
```
给定一个计时器，从websocket创建开始就开始计时，当时间到达时就发送一个包，确定当前是否是连接状态

如果我们在某个时间段onmessage接收到信息的话，就是用clearTimeout清空计时器

如果我们发送到服务端的内容没有得到响应，在时间到达的时候就将调用reconnect方法

开发简易版聊天室的时候用到了心跳检测

服务端也会定时向各个客户端发送内容，如果没有接收到相关的响应，则会提醒其他聊天成员该成员已经离线了

在项目中通过navigator.onLine来判断当前是否变成离线状态，在离线状态的时候将标志置为false，在联网的时候调用重连机制
```javascript
// 联网的事件
window.addEventListener('online', () => {
   // ...
})
```