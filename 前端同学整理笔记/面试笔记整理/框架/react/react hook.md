Hook是React16.8的新增特性，让我们能在不使用class的情况下使用state和其他的React属性

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。Hook不能在class中使用。

React提供了一些内置的Hook，也允许我们去自定义Hook，useState就是其中的一个内置Hook

（有关内置Hook API，请移步https://zh-hans.reactjs.org/docs/hooks-reference.html）
## useState
```javascript
import React, { useState } from 'react';

function ExampleWithManyStates() {
  // 声明多个 state 变量！
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

我们在平时使用组件的时候，如果需要添加一些状态，可以在class中通过this.state去初始化state状态，而在function中没有自己的this，所以在之前，我们不得不转换为class去设置state

但现在，我们可以通过useState Hook来分配和读取this.state

实际上，useState会等价于class里面的一些写法，我们看看下面两段代码
```javascript
// 使用useState
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

// 使用class
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

在使用useState Hook的时候，我们首先需要将其import到当前文件中
```javascript
import React, { useState } from 'react';
```
然后，我们就可以在函数中使用它
```javascript
function Example(){
    // 声明一个叫 “count” 的 state 变量
    const [count, setCount] = useState(0);
}
```

这里的count，为我们要放到this.state中的属性，而setCount是对count值的设置

在我们调用useState的时候，会创建一个“state变量”，而这个变量，与class中this.state中的属性是一样的，在函数执行完毕之后，这些“state变量”不会被回收

useState只接受一个参数，即初始化时候的值

useState可以被调用多次，调用多次就相当于在class中，给this.state赋值的那个对象传入了多个属性
```javascript
import React, { useState } from 'react';

function Example(){
    const [a, setA] = useState(0);
    const [b,setB] = useState(0);
}
// 等同于
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a:0,
      b:0
    };
  }
}
```

而useState的返回值，为当前state和更新state的函数，所以我们采用
```javascript
const [a, setA] = useState(0);
```
来对其进行获取

而如果我们使用了useState的话，比起class，在获取state的时候会更加方便  
同样要获取state上的count，两种写法如下
```javascript
// 使用useState
<p>You clicked {count} times</p>
// 使用class
<p>You clicked {this.state.count} times</p>
```
同样的，在更新的时候也会更为方便  
* 使用useState
```jsx
<button onClick={() => setCount(count + 1)}>
    Click me
</button>
```
* 使用class
```jsx
<button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
</button>
```


## Effect Hook
在看Effect Hook如何使用和有什么功能之前，我们先说说出现的原因

在之前的class组件中，存在很多操作，需要我们去在组件挂载和更新时做相同的操作，此时我们不得不写两份相同的代码

比如下面官方文档里面的代码
```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```
在这段代码中，我们不得不在componentDidMount和componentDidUpdate中写入重复的代码，而实际上，这种情况相当常见，但我们却不得不去犯这个错误

而此时，当我们用到useEffect的时候，完全可以摒弃这个错误
```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
同样的，使用useEffect也需要import，使用useEffect，会使得在函数执行完毕后，React依然保存着传入useEffect的函数参数，当DOM发生更新的时候会去调用这个函数，所以在componentDidMount和componentDidUpdate这两个生命周期都会去触发这个函数

> 与 componentDidMount 或 componentDidUpdate 不同，使用 useEffect 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，effect 不需要同步地执行。在个别情况下（例如测量布局），有单独的 useLayoutEffect Hook 供你使用，其 API 与 useEffect 相同。

而就如在class中我们有componentWillUnmount来对应清除componentDidMount的一些订阅，我们在使用useEffect也有对应的清除方法

我们可以先看看class的示例
```javascript
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```
这里通过在componentDidMount声明周期中去做订阅，然后在componentWillUnmount清除这个订阅，而在useEffect，我们通过返回函数来达到清除的目的

示例如下
```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```
这里useEffect return出去的，就是清除时的操作。React会在组件卸载的时候执行清除操作。而且这个清除操作，在每次更新组件的时候都会被触发一次。

除了上面提到的，使用useEffect可以用来解决我们需要重复写逻辑相同的代码之外的问题，使用useEffect还可以让我们将关注点分离，针对每一个“订阅”使用一个useEffect，这样子可以做到分离相关逻辑

就像下面的class例子，两个逻辑（计数器和订阅）被耦合在同一个声明周期方法里面
```javascript
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```
而使用了useEffect让我们可以解决这些问题
```javascript
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```


## useContext
```javascript
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```
## useReducer
```javascript
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

## react hook使用规则
### 只能在React的函数组件里使用Hook
要注意的是，不要在普通函数里面去使用Hook，我们可以
* 在React的函数组件里使用Hook
* 在自定义的Hook里使用Hook

### 只能在函数最外层调用Hook，不要在循环、条件判断和子函数里面调用Hook
这里只能在函数最外层调用Hook，并不是说Hook不能在循环、条件和子函数里面调用，而是如果不在最外层调用Hook的话，可能会引起一些问题

这与React在多次渲染时怎么判断使用的是同一个Hook有关

在上面我们已经提到了，我们可以同时使用多个useState，但有没有发现一个问题，我们使用useState时，使用的是同一个函数，React是怎么一一对应的呢

答案是按调用的顺序，React默认Hook每次渲染的调用顺序都是一样的，像下面这段官网的代码
```javascript
// ------------
// 首次渲染
// ------------
useState('Mary')           // 1. 使用 'Mary' 初始化变量名为 name 的 state
useEffect(persistForm)     // 2. 添加 effect 以保存 form 操作
useState('Poppins')        // 3. 使用 'Poppins' 初始化变量名为 surname 的 state
useEffect(updateTitle)     // 4. 添加 effect 以更新标题

// -------------
// 二次渲染
// -------------
useState('Mary')           // 1. 读取变量名为 name 的 state（参数被忽略）
useEffect(persistForm)     // 2. 替换保存 form 的 effect
useState('Poppins')        // 3. 读取变量名为 surname 的 state（参数被忽略）
useEffect(updateTitle)     // 4. 替换更新标题的 effect

// ...
```
而我们要保证调用顺序一样，自然就不可以去用到条件语句，包括循环语句，一旦循环条件的判断是受其他因素影响的，在多次渲染时会不一样，那一样会导致顺序的不同

如果我们将代码放到条件语句中，如下
```javascript
// 🔴 在条件语句中使用 Hook 违反第一条规则
if (name !== '') {
    useEffect(function persistForm() {
        localStorage.setItem('formData', name);
    });
}
```
如果一开始判断条件为true，后来变成false，就会变成下面这样
```javascript
useState('Mary')           // 1. 读取变量名为 name 的 state（参数被忽略）
// useEffect(persistForm)  // 🔴 此 Hook 被忽略！
useState('Poppins')        // 🔴 2 （之前为 3）。读取变量名为 surname 的 state 失败
useEffect(updateTitle)     // 🔴 3 （之前为 4）。替换更新标题的 effect 失败
```
React不知道这里第二个useState的Hook应该返回什么。因为它以为还和上次渲染一样，应该对应persistForm的useEffect，因此导致了后面所有的Hook的错误

## 自定义Hook
通过自定义Hook，我们可以将一些相同的逻辑添加到一个自定义Hook中，而这个自定义Hook实际上就是一个函数

看看下面的代码
```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  // ---------------------------------------------------------------------
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ---------------------------------------------------------------------

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}


function FriendListItem(props) {
  // ---------------------------------------------------------------------
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ---------------------------------------------------------------------

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```
可以看到，在这两个组件里面，Hook的逻辑是完全相同的，自定义Hook就可以让我们将这部分逻辑“封装”起来

自定义Hook本身其实就是一个函数，我们可以在Hook中使用其他Hook，但要注意的是，我们在使用自定义Hook的时候，里面使用到的Hook，也要放在自定义Hook的最外层

与函数组件不同的是，我们可以决定自定义Hook要传入的参数是什么，要返回什么，也就是说，它是一个正常的函数，但是需要以use开头，我们对上面的代码，通过使用自定义Hook，在不同的组件中共享Hook的逻辑

我们将上面的注释间的内容放到下面这个自定义Hook中
```javascript
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```
接着，改变上面的两个函数组件
```javascript
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}

function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```
这两个函数组件的功能和上面一模一样

要注意的是，在两个函数组件中使用同一个自定义Hook，并不会共享里面的state，我们可以看下面这两个函数组件，使用了同一个自定义Hook
```javascript
function useTest(){
    const [count,setCount] = useState(1) 
    return [count,setCount]
}

function Test1(){
    const [count,setCount] = useTest()
    return(
        <div>
        <span>{count}</span>
        <button onClick={()=>{setCount(count+1)}}>btn1</button>
        </div>
    )
}
function Test2(){
    const [count,setCount] = useTest()
    return(
        <div>
        <span>{count}</span>
        <button onClick={()=>{setCount(count+1)}}>btn2</button>
        </div>
    )
}
```
这里点击btn1的时候，Test2组件里面的count并不会发生改变