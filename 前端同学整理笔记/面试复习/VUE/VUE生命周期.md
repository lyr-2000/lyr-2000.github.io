## VUE生命周期

![Vue 实例生命周期](https://cn.vuejs.org/images/lifecycle.png)

创建阶段

1. beforeCreate
   - Vue实例刚刚创建出来
   - 此时没有初始化实例中的数据和方法，不能修改实例中的数据和方法
2. created
   - 最早能够访问Vue实例中的数据和方法
3. beforeMount
   - 开始编译模板，但还没渲染到页面上
4. mounted
   - Vue已经完成模板渲染，可以拿到界面上的内容
5. activated（keep-alive 缓存的组件激活时调用）可以结合v-if说

执行阶段

1. beforeUpdate
   - 在Vue实例中保存的数据被修改了
   - 只有数据修改才会触发beforeUpdate
   - 调用beforeUpdate的时候，数据已经更新了，但是界面还没有更新
2. updated
   - Vue实例中保存的数据被修改了，此时界面也同步修改了数据
   - 数据和界面都更新完毕后触发updated

销毁阶段

1. beforeDestroy（VUE3变成beforeUnmount）
   - 当组件即将被销毁的时候调用
   - 还可以访问到组件的数据和函数，但是改变实例是无法触发周期函数（update、beforeUpdated）
2. destroyed（VuE3变成unmounted）
   - 组件销毁后调用
   - 还可以访问到组件的数据和函数，但是改变实例是无法触发周期函数（update、beforeUpdated）
3. deactivated（keep-alive 缓存的组件停用时调用）
   - 缓存组件停用时不会触发beforeUpdate和updated