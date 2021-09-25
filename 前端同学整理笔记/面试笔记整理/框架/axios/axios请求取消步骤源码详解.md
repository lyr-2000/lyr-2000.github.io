请求取消，往往使用在当网络较慢，用户在等待当前请求时转而去点了其他请求，且这两个请求是会相互影响时，我们会将当前请求取消，axios提供了请求取消的接口，在[github](https://github.com/axios/axios#cancellation)上官方给出了两种实现请求取消的用法
```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```
```javascript
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    cancel = c;
  })
});

// cancel the request
cancel();
```
我们取第一个例子来解析每一步，首先第一步，将axios中的CancelToken赋值给一个变量CancelToken，我们看看axios中的CancelToken
```javascript
function CancelToken(executor) {
  // 检测传入的是否为函数
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  // 使用promise异步
  // 在后面调用方法时就会触发promise的resolve
  // 在xhr.js中调用abort方法取消请求
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // 已经发起过取消请求的情况下，会直接return
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
/**
 * 当请求已经被取消时，抛出Cancel对象
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * 返回一个包含新的CancelToken的对象，以及一个用来取消请求的方法
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  // 这里的token实际上就是新的CancelToken对象
  // cancel是用来取消请求的方法
  return {
    token: token,
    cancel: cancel
  };
};
```
这里还不太清楚内部的结构没关系，我们先往下走，这里先知道我们创建了一个CancelToken即可。
看看下一行代码
```javascript
const source = CancelToken.source();
```
这里调用了CancelToken的source方法，将返回的值赋值给source，从代码中的source方法
```javascript
/**
 * 返回一个包含新的CancelToken的对象，以及一个用来取消请求的方法
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  // 这里的token实际上就是新的CancelToken对象
  // cancel是用来取消请求的方法
  return {
    token: token,
    cancel: cancel
  };
};
```
我们可以明确看到，变量source是一个包含新的CancelToken和取消对应token的方法的对象。将executor作为new CancelToken的参数，当我们执行这里的方法c，即返回对象中的cancel时，就会触发下面一系列操作
```javascript
if (typeof executor !== 'function') {
  throw new TypeError('executor must be a function.');
}
```
进入CancelToken后，首先判断传入的是不是一个函数，不是的话会抛出错误，这里是一个函数，继续往下走，新建了一个Promise赋值给这个CancelToken对象的promise属性，将resolve赋值给resolvePromise使得我们可以在外部控制promise的状态
```javascript
var resolvePromise;
// 使用promise异步
// 在后面调用方法时就会触发promise的resolve
// 在xhr.js中调用abort方法取消请求
this.promise = new Promise(function promiseExecutor(resolve) {
  resolvePromise = resolve;
});
```
在这里，只要我们调用了resolvePromise方法，就等于将this.promise的状态变为resolve，接下来将this赋值给token，将一个cancel方法作为参数传给刚刚传给new CancelToken的参数的方法
```javascript
var token = this;
executor(function cancel(message) {
  // 已经发起过取消请求的情况下，会直接return
  // 在下一步我们就将请求时会出项错误的信息赋值给token.reason，说明已经发起过这个请求了
  if (token.reason) {
    return;
  }

  token.reason = new Cancel(message);
  resolvePromise(token.reason);
});
```
当token.reason存在时，即已经执行过这个取消请求的操作了，如果执行过，直接return，如果没执行过，我们将Cancel对象作为token.reason的值，然后将其作为参数执行resolvePromise方法，将promise变为resolve的状态。

---
Cancel对象实际上就是在请求被取消时会抛出来的错误信息，看看源代码
```javascript
'use strict';
/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
// 当请求已经被取消的时候再取消会抛出这个Cancel对象作为错误信息
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;
```

---
知道这些后，接下来通过一个请求，我们来将请求时取消请求的具体流程弄清楚
```javascript
axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});
```
在这段代码中，我们使用axios发起了一个get请求，然后将source.token即上面我们调用source方法创建的对象中新建的那个CancelToken传入当前请求的cancelToken属性中，这里我们看看[xhr.js](https://github.com/axios/axios/blob/master/lib/adapters/xhr.js)中的相关内容
```javascript
if (config.cancelToken) {
  // 对取消请求的操作
  // 当promise变为resolve时，执行then里的方法
  config.cancelToken.promise.then(function onCanceled(cancel) {
    // 如果请求已经没了，即请求已经结束
    // 那么直接返回
    if (!request) {
      return;
    }
    // 取消请求
    request.abort();
    reject(cancel);
    // 清除请求
    request = null;
  });
}
```
这里看到，当有cancelToken时，我们给其promise的then里添加相关的操作，而这个操作就是实际上取消请求的具体操作
当没有请求的时候，我们就直接return掉，如果有请求，我们就执行```request.abort()```来取消请求，将request置为null。
这些操作都在这个promise变为resolve时执行，那么什么时候变成resolve，上面也说过了，调用source返回的那个对象的cancel方法，传入请求被取消时的信息，所以最后一步
```javascript
source.cancel('Operation canceled by the user.');
```
这就是整个axios取消请求的具体过程