## VUE3.0

1. 性能上的优化
   - diff算法
     - 新增静态标记
     - 对于没有进行数据绑定的节点不进行重复渲染
   - 静态提升
     - vue2中无论元素是否参与更新，每次都会重新创建，然后渲染
     - vue3中对于不更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用
   - 事件监听器缓存
     - 默认情况下事件监听会被动态绑定，每次都会去追踪它的变化
     - 但是是同一个函数，所以可以缓存起来复用
2. 体积上的优化
   - 