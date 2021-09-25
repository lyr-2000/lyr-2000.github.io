在严格模式下，将vuex中state的数据放到v-model上，会有一定的麻烦
```html
<input v-model="obj.mes">
```
假设这里的obj是计算属性中的一个对象，那么在用户输入的时候，会尝试去修改这个对象的属性值，在严格模式中，因为不是在mutation中修改的，所以会抛出一个错误

要解决这个问题，可以通过监听这个input的输入，在值发生修改时，将相应的新值传递到mutation中，在mutation中对state中的这个值进行修改