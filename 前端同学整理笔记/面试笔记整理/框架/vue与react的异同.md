# 异

## 模板 与 JSX
在vue里面，默认情况下我们采用的是一种与html非常类似的形式来进行代码的编写，可以看到下面的vue的单文件组件的结构
```html
<template>
    <div class="example">{{msg}}</div>
</template>

<script>
export default {
    data(){
        return{
            msg:"hello world"
        }
    }
}
</script>

<style>
.example{
    color:red;
}
</style>

<custom-label>自定义标签</custom-label>
```
相对于纯粹的html文件来说，vue文件似乎只是多了一些属性如v-if、v-for等这些

react的话推荐使用jsx去进行一个代码的编写，在写的时候，会觉得js代码和xml代码混合在一起，所以在学的时候，就写法上来看会我个人觉得vue更容易去在初学的时候就看懂代码，当然这只是我个人的意见，也可能是我先学的vue习惯了这种写法

## 逻辑复用
React和Vue都是组件化的开发，那么在进行组件化开发的时候，我们就会遇到有一些组件具有一些重复的逻辑，而这些重复的逻辑，如果我们直接为这些组件重复书写这些逻辑代码的话，不仅会造成冗余，而且后面在对逻辑进行修改的时候，也会比较麻烦。

出于解决这个问题的目的，在一开始的时候，React和Vue都采用了mixin混入来对一些组件注入重复的逻辑处理代码。

但是mixin混入造成了一些问题

首先是命名冲突问题，要进行逻辑的注入，我们需要去创建一个mixin来存储这些逻辑，在使用时去进行调用，而要让组件都能获取到这个mixin，意味着这个mixin存放的位置，必须是这些组件都能访问到的，那么甚至需要放到全局，这就导致了一个命名冲突。

其次，它破坏了原有组件的封装性，我们要注入一个mixin的时候，必须进入这个组件，修改组件里面的逻辑，才能去实现mixin注入，因此这么做也会破坏其封装性。


在React中，改用了高阶组件来对逻辑复用进行了处理。
> 高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

react的高阶组件示例
```javascript
// 此函数接收一个组件...
function withSubscription(WrappedComponent, selectData) {
  // ...并返回另一个组件...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ...负责订阅相关的操作...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... 并使用新数据渲染被包装的组件!
      // 请注意，我们可能还会传递其他属性
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

那么Vue为什么不使用HOC呢，我们首先要明白的是，高阶组件，其本身就是一个函数，它接受一个组件，返回一个组件，而在React中，组件就是一个函数，所以我们可以很容易地去实现一个高阶组件。但是Vue组件并不只是一个单纯的函数，除了我们自己传入的options，还有模板，需要vue在编译时生成相应的组件实例，所以我们很难（不是不行）去做到


因此，现在Vue和React在逻辑复用上，也存在了区别。

Vue使用mixin，而React使用了HOC(高阶组件)

## 子组件渲染
Vue与React在子组件渲染的区别在于，渲染优化方面Vue本身已经做了，而React需要我们去手动处理。

在React中，在一般情况下，当组件的状态（state）发生变化的时候，会以该组件为根，更新其下的所有子组件，这实际上是受生命周期中的[shouldComponentUpdate](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)方法的影响
> 根据 shouldComponentUpdate() 的返回值，判断 React 组件的输出是否受当前 state 或 props 更改的影响。默认行为是 state 每次发生变化组件都会重新渲染。

因此默认情况下，state发生变化时组件都会重新渲染，因为 React.Component 并未实现 shouldComponentUpdate()，所以为了实现组件渲染的优化，可以使用[React.PureComponent](https://zh-hans.reactjs.org/docs/react-api.html#reactpurecomponent)，React.PureComponent 中以浅层对比 prop 和 state 的方式来实现了该函数

当然，当我们使用函数组件的时候，可以使用[React.memo](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo)
> React.memo 为高阶组件。它与 React.PureComponent 非常相似，但只适用于函数组件，而不适用 class 组件。  
> React.memo 仅检查 props 变更。如果函数组件被 React.memo 包裹，且其实现中拥有 useState 或 useContext 的 Hook，当 context 发生变化时，它仍会重新渲染。

而对于Vue来说，组件的依赖是由其自动追踪的，其本身可以精确得知哪个组件发生了变化，然后去渲染对应的组件，在Vue2.x中，给子组件传入的slot包含动态数据时改变动态数据时会影响父子组件，但这个问题在Vue3.0里面通过将slot做为函数传入避开了这种影响。

简单来说，Vue通过本身的处理，解决了这部分优化问题，让开发者能更好地关注产品功能本身，但是将优化封装好也让我们难以去改变里面的代码，减少了一些灵活性，当然，其本身的处理已经够好的了，我们一般无需去做多余的处理。

## 数据绑定
Vue的数据绑定，是**双向绑定**，想必面试前端岗位的时候如果你和面试官说你用的是Vue，这个问题会被经常问到（我自己也试着实现了Vue的双向绑定，[传送门](https://blog.csdn.net/zemprogram/article/details/104109171)），甚至会被要求手写，反正我在面百度的时候就被要求手写了。

说回正题，Vue的双向绑定，指的是data中的属性和DOM中的内容保持一致，当其中一个发生改变的时候，另一个也会随之改变。

Vue的双向绑定是通过给DOM绑定事件，当DOM上由于表单操作或者ajax发起的请求等导致数据发生变化的时候，就会通过事件去改变data上的数据，从而实现视图改变数据，而数据改变视图，则是通过将Object.defineProperty来设置值对应的set和get，在每个使用到data上数据的地方，创建一个Watcher来监听数据改变，设置视图更新update方法，放到这个数据对应的依赖收集类Dep中，使得当我们对数据进行更新的时候，通过Dep收集类通知所有的Watcher修改相关视图的内容，顺便一提，在Vue3中出于性能考虑改用了[proxy代理](https://blog.csdn.net/zemprogram/article/details/86555501?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522158832996319724843304010%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=158832996319724843304010&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_v2~rank_v25-2)来实现，总之，通过这种方式达成数据影响视图的目的，由此实现了双向绑定。

而在React中，数据绑定的方式是直接将view层和model层（state）绑定，由于在React中，all is js，所以在写view层时直接使用model层的数据，而当model的数据发生改变时，直接重新渲染组件及其组件的子组件，当然，我们上面提到了，子组件渲染是可以优化的，我们可以通过一些优化手段，来跳过某些子组件的重渲染。

# 个人观点

Vue给我的感觉，有一种，它默默地做了很多事情的感觉，使用Vue的开发者，特别是初学者，很多使用了模板语法，我个人感觉它较为直观，对于开发者来说，因为很多优化都由Vue框架本身完成了，所以使用Vue时我们不需要去做太多的事情，但是相对的，Vue少了React的灵活性，React使用JSX语法，在写的时候，虽然React本身没有给我们带来很多性能优化，但我们都能通过自己的处理，去达到很多Vue本身能做到的性能优化，就好像HOC，因为Vue本身把很多东西，包括创建组件实例的一些细节，都放在编译时进行，所以使用Vue我们无法直观地去实现一个HOC，而React可以。