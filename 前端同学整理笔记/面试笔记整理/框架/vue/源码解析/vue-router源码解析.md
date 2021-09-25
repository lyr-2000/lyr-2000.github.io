https://www.jianshu.com/p/60da87d4ec92

# Vue.use(VueRouter) install
在我们使用
```javascript
Vue.use(VueRouter)
```
时，Vue.use会将VueRouter当作插件，触发VueRouter中的install方法


判断是否已经安装Vue-router
```javascript
if (install.installed && _Vue === Vue) return
install.installed = true

_Vue = Vue
```

混入beforeCreate和destroyed
```javascript
Vue.mixin({
  beforeCreate () {
    // 判断是否有router 
    if (isDef(this.$options.router)) {
      this._routerRoot = this
      this._router = this.$options.router
      this._router.init(this)
      // 添加响应式的_route
      Vue.util.defineReactive(this, '_route', this._router.history.current)
    } else {
      this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
    }
    registerInstance(this, this)
  },
  destroyed () {
    registerInstance(this)
  }
})
```
VueRouter安装的核心是通过 mixin，向应用的所有组件混入 beforeCreate 和 destroyed钩子函数。在beforeCreate钩子函数中，定义了私有属性_routerRoot 和 _router。

_routerRoot: 将Vue实例赋值给_routerRoot，相当于把Vue跟实例挂载到每个组件的_routerRoot的属性上，通过 $parent._routerRoot 的方式，让所有组件都能拥有_routerRoot始终指向根Vue实例。
_router：通过 this.$options.router方式，让每个vue组件都能拿到VueRouter实例

通过下面的代码，将$router和$route绑定到Vue的原型上，来使得每个组件都可以访问到相同的$router和$route
```javascript
Object.defineProperty(Vue.prototype, '$router', {
  get () { return this._routerRoot._router }
})

Object.defineProperty(Vue.prototype, '$route', {
  get () { return this._routerRoot._route }
})
```

注册组件
```javascript
Vue.component('RouterView', View)
Vue.component('RouterLink', Link)
```


在这里混入时，使用了init方法
```javascript
init (app: any /* Vue component instance */) {
    // vueRouter可能会实例化多次 apps用于存放多个vueRouter实例
    this.apps.push(app)

    // 保证VueRouter只初始化一次，如果初始化了就终止后续逻辑
    if (this.app) {
      return
    }

    // 将vue实例挂载到vueRouter上，router挂载到Vue实例上，哈 给大佬递猫
    this.app = app

    // history是vueRouter维护的全局变量，很重要
    const history = this.history

    // 针对不同路由模式做不同的处理 transitionTo是history的核心方法，后面再细看
    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }

    // 路由全局监听，维护当前的route
    // 因为_route在install执行时定义为响应式属性，
    // 当route变更时_route更新，后面的视图更新渲染就是依赖于_route
    history.listen(route => {
      this.apps.forEach((app) => {
        app._route = route
      })
    })
  }
```

# new一个VueRouter对象
## constructor
---
```javascript
constructor (options: RouterOptions = {}) {
  this.app = null
  this.apps = []
  this.options = options
  this.beforeHooks = []
  this.resolveHooks = []
  this.afterHooks = []
  // 创建match匹配函数
  this.matcher = createMatcher(options.routes || [], this)

  // 取mode，默认为hash
  let mode = options.mode || 'hash'
  this.fallback =
    mode === 'history' && !supportsPushState && options.fallback !== false
  if (this.fallback) {
    mode = 'hash'
  }
  if (!inBrowser) {
    mode = 'abstract'
  }
  this.mode = mode

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base)
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback)
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base)
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, `invalid mode: ${mode}`)
      }
  }
}
``` 

里面的创建了match匹配函数
```javascript
this.matcher = createMatcher(options.routes || [], this)
```
## createMatcher
---
该方法根据传入的 routes 配置生成对应的路由 map，然后直接返回了 match 匹配函数  
src/create-matcher.js
```javascript
export function createMatcher (
  routes: Array<RouteConfig>, //用户传入的路由配置
  router: VueRouter // new VueRouter创建的实例
): Matcher {
  // 创建路由map
  const { pathList, pathMap, nameMap } = createRouteMap(routes)

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap)
  }

  function match ( // 匹配函数
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {
      // ...
  }

  //...
  
  return {
    match,
    addRoutes
  }
}
```
这里创建路由map时，获取到三个值
- pathList：路由路径数组，存储所有的path
- pathMap：路由路径与路由记录的映射表，表示一个path到RouteRecord的映射关系
- nameMap：路由名称与路由记录的映射表，表示name到RouteRecord的映射关系

## createRouteMap
---
create-route-map.js
```javascript
/**
 * 
 * @param {*} routes 用户路由配置
 * @param {*} oldPathList 老pathList
 * @param {*} oldPathMap 老pathMap
 * @param {*} oldNameMap 老nameMap
 */
export function createRouteMap (
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>
): {
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>
} {
  // pathList被用于控制路由匹配优先级
  const pathList: Array<string> = oldPathList || []
  // 路径路由映射表
  const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
  // 路由名称路由映射表
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)

  // 对每条路由添加路由记录
  routes.forEach(route => {
    addRouteRecord(pathList, pathMap, nameMap, route)
  })

  // 确保通配符路由总是在最后
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  ...

  return {
    pathList,
    pathMap,
    nameMap
  }
}
```

addRouteRecord添加路由记录
```javascript
function addRouteRecord (
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {

  //...
  // 先创建一条路由记录
    const pathToRegexpOptions: PathToRegexpOptions =
    route.pathToRegexpOptions || {}
  const normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict) // 对路由做标准化处理，判断parent是否存在，如果存在就拼接到当前路由前面，同时将路由里的//变成/

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive
  }

  const record: RouteRecord = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name,
    parent,
    matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props:
      route.props == null
        ? {}
        : route.components
          ? route.props
          : { default: route.props }
  }

  // 如果该路由记录 嵌套路由的话 就循环遍历解析嵌套路由
  if (route.children) {
    // ...
    // 通过递归的方式来深度遍历，并把当前的record作为parent传入
    route.children.forEach(child => {
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`) // cleanPath将//变成/
        : undefined
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }

  // 如果有多个相同的路径，只有第一个起作用，后面的会被忽略
  // 对解析好的路由进行记录，为pathList、pathMap添加一条记录
  // 此时pathMap中对应路由记录的path已经映射到它对应的record记录了
  if (!pathMap[record.path]) {
    pathList.push(record.path)
    pathMap[record.path] = record
  }
  // 对别名做处理
  if (route.alias !== undefined) { // 如果别名有定义
  const aliases = Array.isArray(route.alias) ? route.alias : [route.alias] // 将别名设置为数组
  for (let i = 0; i < aliases.length; ++i) { // 对别名数组依次做处理
    const alias = aliases[i]
    if (process.env.NODE_ENV !== 'production' && alias === path) {
      warn(
        false,
        `Found an alias with the same value as the path: "${path}". You have to remove that alias. It will be ignored in development.`
      )
      // skip in dev to make it work
      continue
    }

    const aliasRoute = {
      path: alias,
      children: route.children
    }
    addRouteRecord( // 为别名路由添加和当前路由相同的别名
      pathList,
      pathMap,
      nameMap,
      aliasRoute,
      parent,
      record.path || '/' // matchAs
    )
  }
}
}
```

回到createMatcher中，我们在createMatcher中，除了调用外，还返回了addRoutes和match方法

addRoutes其实就是一个添加路由的方法，直接调用了createRouteMap方法，传入要添加的路由，同时使用当前的pathList, pathMap, nameMap
```javascript
function addRoutes (routes) {
  createRouteMap(routes, pathList, pathMap, nameMap)
}
```
而match方法就比较复杂了

match 方法接收路径、当前路由、重定向，主要是根据传入的raw 和 currentRoute处理，返回的是 _createRoute()

```javascript
/**
  * 
  * @param {*} raw 是RawLocation类型 是个url字符串或者RawLocation对象
  * @param {*} currentRoute 当前的route
  * @param {*} redirectedFrom 重定向 （不是重要，可忽略）
  */
function match (
  raw: RawLocation,
  currentRoute?: Route,
  redirectedFrom?: Location
): Route {
    // location 是一个对象类似于
    // {"_normalized":true,"path":"/","query":{},"hash":""}
    const location = normalizeLocation(raw, currentRoute, false, router)
    const { name } = location

    // 如果有路由名称 就进行nameMap映射 
    // 获取到路由记录 处理路由params 返回一个_createRoute处理的东西
    if (name) {
      const record = nameMap[name]
      if (process.env.NODE_ENV !== 'production') {
        warn(record, `Route with name '${name}' does not exist`)
      }
      if (!record) return _createRoute(null, location) // 没有对应的记录时，传入null
      const paramNames = record.regex.keys
        .filter(key => !key.optional)
        .map(key => key.name)

      if (typeof location.params !== 'object') {
        location.params = {}
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (const key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key]
          }
        }
      }

      location.path = fillParams(record.path, location.params, `named route "${name}"`)
      return _createRoute(record, location, redirectedFrom)
    
    // 如果路由配置了 path，到pathList和PathMap里匹配到路由记录 
    // 如果符合matchRoute 就返回_createRoute处理的东西
    } else if (location.path) {
      location.params = {}
      for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        const record = pathMap[path]
        if (matchRoute(record.regex, location.path, location.params)) {
          return _createRoute(record, location, redirectedFrom)
        }
      }
    }
    // 通过_createRoute返回一个东西
    return _createRoute(null, location)
}
```

```javascript
function _createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: Location
): Route {
  if (record && record.redirect) { // 如果有重定向redirect，则调用redirect处理
    return redirect(record, redirectedFrom || location)
  }
  if (record && record.matchAs) { // 如果有matchAs，则调用别名方法
    return alias(record, location, record.matchAs)
  }
  return createRoute(record, location, redirectedFrom, router)
}
```

通过调用route.js中的createRoute方法，以传入的location构建路由对象
```javascript
/**
 * 
 * @param {*} record 一般为null
 * @param {*} location 路由对象
 * @param {*} redirectedFrom 重定向
 * @param {*} router vueRouter实例
 */
export function createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {
  const stringifyQuery = router && router.options.stringifyQuery

  let query: any = location.query || {}
  try {
    query = clone(query)
  } catch (e) {}

  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  // 冻结route 一旦创建不可改变
  return Object.freeze(route)
}
```

### Object.freeze
根据MDN中给出的解释
> Object.freeze() 方法可以冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改。

这样通过createRoute创建出来的Route对象，只能被访问，而不能被修改

基本聊完new VueRouter中的createMatcher，后面的内容是判断mode，根据mode去调用不同的方法，mode就是我们要采用的模式，一般为hash或history
```javascript
  constructor (options: RouterOptions = {}) {
    // ...

    let mode = options.mode || 'hash' // 如果没有传入mode就默认使用hash
    this.fallback =
      mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }
```

创建的实例对应的类，定义了对应的路由操作方法，push，replace，go等


那么VueRouter的实例化基本说完了，接下来回到install中，在之前的install中，我们使用了Vue.mixin将一些处理混入了

在beforeCreate中我们调用了router的init方法，在 init方法里针对不同的路由模式最后都调用了 history.transitionTo，进行路由初始化匹配。包括 history.push 、history.replace的底层都是调用了它。它就是路由切换的方法，很重要。它的实现在 src/history/base.js
```javascript
transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
) {
    // 调用 match方法得到匹配的 route对象
    const route = this.router.match(location, this.current)
    
    // 过渡处理
    this.confirmTransition(
        route,
        () => {
            // 更新当前的 route 对象
            this.updateRoute(route)
            onComplete && onComplete(route)
            
            // 更新url地址 hash模式更新hash值 history模式通过pushState/replaceState来更新
            this.ensureURL()
    
            // fire ready cbs once
            if (!this.ready) {
                this.ready = true
                this.readyCbs.forEach(cb => {
                cb(route)
                })
            }
        },
        err => {
            if (onAbort) {
                onAbort(err)
            }
            if (err && !this.ready) {
                this.ready = true
                this.readyErrorCbs.forEach(cb => {
                cb(err)
                })
            }
        }
    )
}
```
transitionTo 可以接收三个参数 location、onComplete、onAbort，分别是目标路径、路经切换成功的回调、路径切换失败的回调。transitionTo 函数主要做了两件事：首先根据目标路径 location 和当前的路由对象通过 this.router.match方法去匹配到目标 route 对象


然后执行 confirmTransition方法进行真正的路由切换
```javascript
confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
    const current = this.current
    const abort = err => {
      // ...
      onAbort && onAbort(err)
    }
    
    // 如果当前路由和之前路由相同 确认url 直接return
    if (
      isSameRoute(route, current) &&
      route.matched.length === current.matched.length
    ) {
      this.ensureURL()
      return abort(new NavigationDuplicated(route))
    }

    // 通过异步队列来交叉对比当前路由的路由记录和现在的这个路由的路由记录 
    // 为了能准确得到父子路由更新的情况下可以确切的知道 哪些组件需要更新 哪些不需要更新
    const { updated, deactivated, activated } = resolveQueue(
      this.current.matched,
      route.matched
    )

    // 在异步队列中执行响应的勾子函数
    // 通过 queue 这个数组保存相应的路由钩子函数
    const queue: Array<?NavigationGuard> = [].concat(
      // leave 的勾子
      extractLeaveGuards(deactivated),
      // 全局的 before 的勾子
      this.router.beforeHooks,
      // in-component update hooks
      extractUpdateHooks(updated),
      // 将要更新的路由的 beforeEnter勾子
      activated.map(m => m.beforeEnter),
      // 异步组件
      resolveAsyncComponents(activated)
    )

    this.pending = route

    // 队列执行的iterator函数 
    const iterator = (hook: NavigationGuard, next) => {
      if (this.pending !== route) {
        return abort()
      }
      try {
        hook(route, current, (to: any) => {
          if (to === false || isError(to)) {
            // next(false) -> abort navigation, ensure current URL
            this.ensureURL(true)
            abort(to)
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort()
            if (typeof to === 'object' && to.replace) {
              this.replace(to)
            } else {
              this.push(to)
            }
          } else {
            // confirm transition and pass on the value
            // 如果有导航钩子，就需要调用next()，否则回调不执行，导航将无法继续
            next(to)
          }
        })
      } catch (e) {
        abort(e)
      }
    }

    // runQueue 执行队列 以一种递归回调的方式来启动异步函数队列的执行
    runQueue(queue, iterator, () => {
      const postEnterCbs = []
      const isValid = () => this.current === route

      // 组件内的钩子
      const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
      const queue = enterGuards.concat(this.router.resolveHooks)
      // 在上次的队列执行完成后再执行组件内的钩子
      // 因为需要等异步组件以及是否OK的情况下才能执行
      runQueue(queue, iterator, () => {
        // 确保期间还是当前路由
        if (this.pending !== route) {
          return abort()
        }
        this.pending = null
        onComplete(route)
        if (this.router.app) {
          this.router.app.$nextTick(() => {
            postEnterCbs.forEach(cb => {
              cb()
            })
          })
        }
      })
    })
}
```
resolveQueue函数接收两个参数：当前路由的 matched 和目标路由的 matched，matched 是个数组。通过遍历对比两遍的路由记录数组，当有一个路由记录不一样的时候就记录这个位置，并终止遍历。对于 next 从0到i和current都是一样的，从i口开始不同，next 从i之后为 activated部分，current从i之后为 deactivated部分，相同部分为 updated，由 resolveQueue 处理之后就能得到路由变更需要更改的部分。紧接着就可以根据路由的变更执行一系列的钩子函数。
