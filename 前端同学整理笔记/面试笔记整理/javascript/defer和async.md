没有defer或者async，浏览器会立刻加载并执行脚本，“立即”指的是在渲染该script标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行。
<script async src="script.js"></script>
使用async。加载和渲染后续文档元素的过程将和script.js的加载与执行并行进行（异步）。
<script defer src="myscript.js"></script>
使用defer，加载后续文档元素的过程将和script.js的加载并行进行（异步），但是script.js的执行要在所有元素解析完成之后，DOMContentLoaded事件触发之前完成。


使用async标志的脚本文件一旦加载完成，会立即执行；而使用了defer标记的脚本文件，需要等到DOMContentLoaded事件之后执行。