如果是自己配置过vue的webpack配置的小伙伴应该就知道，.vue文件是会被vue-loader处理的，而这里将.vue文件转为三个文件也正是vue-loader做的

vue-loader 将 .vue 文件编译到最终输出的 bundle.js 的过程中，其实调用了四个小的 loader。它们分别是：

- selector
- style-compiler
- template-compiler
- babel-loader

以上四个 loader ，除了 babel-loader 是外部的package，其他三个都存在于 vue-loader 的内部（lib/style-compiler 和 lib/template-compiler 和 lib/selector）。


selector主要做了分解vue文件的工作，将vue文件中的不同标签的内容提取出来
```javascript
import __vue_script__ from "!!babel-loader!../../lib/selector?type=script&index=0&bustCache!./basic.vue"
```
像这行代码中的selector，就是将vue文件中的script标签的内容提取出来，可以看到，在selector?后面，有个```type=script```，这个query就表示要提取的是script标签中的内容

而这个type还可以等于template和style，即表示vue文件的其他两个部分



https://nicholaslee119.github.io/2017/11/24/vueLoader%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90/