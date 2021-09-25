# loader
loader是文件加载器，负责处理匹配好的文件，诸如编译，压缩等工作，loader会将各种语言处理转换为JavaScript，会把图像处理为data URL

一个loader其实就是一个Node.js模块

webpack 只能理解 JavaScript 和 JSON 文件。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中。

loader中的使用顺序和在module.rules中的顺序是**相反**的

```javascript
module: {
    rules: [
        // 配置样式的loader 
        {
            test: /\.less$/,
            use: [
                process.env.NODE_ENV !== 'production' ?
                'vue-style-loader' :
                MiniCssExtractPlugin.loader,
                "css-loader",
                "postcss-loader",
                "less-loader"
            ]
        }
    ]
}
```
比如这里对less文件使用loader的顺序就是less-loader，postcss-loader，css-loader

对于多个loader的情况，如上面，在处理的时候，第一个使用的loader会把源文件的内容拿来处理，而后一个会把前一个loader返回的内容拿来处理，最后一个会将其转换为JavaScript代码

# plugin
可以用来处理一些loader处理不了的内容，在webpack运行的生命周期中会有许多事件，plugin可以监听这些事件，在合适的时机通过webpakc提供的API改变输出结果

使用该plugin后，执行的顺序：

webpack启动后，在读取配置的过程中会执行new MyPlugin(options)初始化一个MyPlugin获取其实例
在初始化compiler对象后，就会通过compiler.plugin(事件名称，回调函数)监听到webpack广播出来的事件
并且可以通过compiler对象去操作webpack

# loader和plugin的区别
对于loader，它是一个转换器，将A文件进行编译形成B文件，这里操作的是文件，比如将A.scss转换为A.css，单纯的文件转换过程

plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务

简单来说两者作用的地方不同，loader是作用在打包文件上的，它只局限于转化文件这一个领域，而plugin是作用在webpack上的，功能比loader更为丰富

CommonChunkPlugin主要用于提取第三方库和公共模块，避免首屏加载的bundle文件，或者按需加载的bundle文件体积过大，导致加载时间过长，是一把优化的利器。而在多页面应用中，更是能够为每个页面间的应用程序共享代码创建bundle。

而从运行时机的角度上，loader运行在打包文件之前，对文件进行处理，而plugin则在整个编译周期里都起作用