
## mixin问题
破坏了原有组件的封装  
命名冲突  
增加复杂性  


---
高阶组件实际上只是一个纯函数，它接收一个组件后返回一个组件


构建一个简单的高阶组件
```javascript
function hello (){
    console.log("hello i  love react ")
}


function hoc(fn){
    return ()=>{
          console.log("first");
            fn();
          console.log("end");
    }
}


hello = hoc(hello);

hello();
```

构建高阶组件，一般可以通过属性代理或者反向继承来实现


屬性代理
```javascript

import React,{Component} from 'react';

const MyContainer = (WraooedComponent) => 
    
    class extends Component {
        render(){
            return <WrappedComponent {...this.props} />
        }
    }

```

反向继承
```javascript
import React,{Component} from 'react';

class MyComponent extends Component{
    //...

}

export default MyContainer(MyComponent);
```