## 「 如何优雅的使用VUE? 」不可不知的VUE实战技巧

本文会从以下三个方面，来进阶我们对`vue`的运用能力

- `组件` : **全局组件注册**
- `Render函数` : **拯救繁乱的template**
- `Vue权限控制` : **高精度全局权限控制**

------

### 1 -「全局组件注册」

> 组件是我们非常常用的东西，很多人使用组件都是通过一个一个文件去引用和注册。如果一个组件在整个项目里面的使用次数较多，每一次使用都需要引用并注册，就会显得特别麻烦

- 一般组件应用弊端
- 傻瓜式，太笨拙
- 繁琐，低效

```vue
<template>
  <div>
    <h1>I am HelloWorld</h1>
    <Child1></Child1>
  </div>
</template>

<script>
import Child1 from './child1.vue'   // 引入
export default {
  name: 'HelloWorld',
  data(){
    return{
    }
  },
  components:{   // 注册
    Child1
  },
  props: {
    msg: String
  },
  methods:{
  }
}
</script>

<style scoped lang="less">
</style>
```

当我们在项目需要重复多次使用该组件，会导致出现很多重复的引入和注册代码，既繁琐又不雅观。因此我们可以通过一个全局的`Js`文件来管理，将需要**多次使用**的组件进行全局注册

#### 创建全局`.js`文件管理全局组件

![img](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

```
// 1 - globalComponent.js

import Vue from 'vue' // 引入vue

// 处理首字母大写 abc => Abc
function changeStr(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/*
    require.context(arg1,arg2,arg3)
        arg1 - 读取文件的路径
        arg2 - 是否遍历文件的子目录
        arg3 - 匹配文件的正则
    关于这个Api的用法，建议小伙伴们去查阅一下，用途也比较广泛
*/
const requireComponent = require.context('.', false, /\.vue$/)
console.log('requireComponent.keys():',requireComponent.keys())  // 打印
requireComponent.keys().forEach(fileName => {
    const config = requireComponent(fileName)
    console.log('config:',config)  // 打印
    const componentName = changeStr(
        fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')   // ./child1.vue => child1
    )
    
    Vue.component(componentName, config.default || config) // 动态注册该目录下的所有.vue文件
})
// 2 - 将globalComponent.js引入main.js

import global from './components/globalComponent'
// 3 - 使用这类组件不再需要引入和注册，直接标签使用即可

<template>
  <div>
    <h1>I am HelloWorld</h1>
    <Child1></Child1>
  </div>
</template>
```

运行程序，我们看下是否能够正常显示并分析两句打印

![img](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

#### Extra：路由分区以及动态添加路由

> 假设我们有很多路由，每一个路由都通过傻瓜式的引入方式，会导致整个项目代码量增多，繁琐，更重要的一点是增加后期维护的难度。因此我们也可以通过上面类似的方式，对路由的引入和使用进行管理，实现分区引入路由，将不同功能下的路由进行区分，通过动态的方式进行引入，即方便快捷又增加可维护

##### 创建专门的路由`.js`文件管理所有的路由

```
总路由管理文件 - index.js

分区路由
    - index.routes.js
    - login.routes.js

在大型项目中，往往会有很多互不关联的模块，例如电商平台中的商城，个人信息，这种情况下就可以对路由进行分区
```

![img](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

```
// 分区路由文件写法

export default {
    path:'/index',
    name:'Index',
    component: () => import('../views/Index.vue'),  // 懒加载式引入，当跳转到时才进行引入chunk
    children: [...]
}
// 总路由管理文件 index.js 写法
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routerList = []  // 路由数组 - 存放所有路由
function importAll(routerArr){
    // 该函数用于将所有分区路由中的路由添加到路由数组
    routerArr.keys().forEach( key => {
        console.log(key)
        routerList.push(routerArr(key).default)
    })
}
importAll(require.context('.',true,/\.routes\.js/))

const routes = [
    ...routerList
]

const router = new VueRouter({
    routes
})

export default router
```

运行程序，我们看下是否能够正常显示并分析两句打印

![img](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

> 优化之后的代码，会更灵活，更具有观赏性，既便捷高效，又方便维护

------

### 2 -「拯救繁乱的template」

很多人在写组件的时候，会依赖脚手架中的``标签，其实`template`也存在一定的缺陷，例如：

- `template`里存在一值多判断
- 过多使用`template`会使代码冗余，杂乱

> `VUE`给我们提供了一个`render`函数，我们可以通过这个函数巧妙的解决`template`造成的问题

#### 实战 - 处理多个button

```
<template>
  <div>
    <h1>I am Home</h1>
    <!-- 假设按钮有多种类型,通过value来显示不同类型 -->
    <div v-if='value === 1'>
      <button>button1</button>
    </div>
    <div v-else-if='value === 2'>
      <button>button2</button>
    </div>
    <div v-else>
      <button>button3</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data(){
    return{
        value:1
    }
  },
  methods:{
  }
}
</script>

<style scoped lang="less">
</style>
```

上面这种写法，当出现多种类型的button，就会显得杂乱无章，当然，很多人会选择去封装一个button组件，那么这个组件的封装，又是一个技巧点，利用`VUE`的`render`函数，减少不必要的`template`，因此ru我们可以这样写

```js
// 创建一个button.vue文件 写法如下

<script>
export default {
    props:{
        type:{
            type:String,
            default:'normal'
        },
        text:{
            type:String,
            default:'button'
        }
    },
    render(h){
        /*
            h 类似于 createElement， 接受2个参数
            1 - 元素
            2 - 选项
         */
        return h('button',{
            // 相当于 v-bind:class
            class:{
                btn:true,
                'btn-success':this.type === 'success',
                'btn-danger':this.type === 'danger',
                'btn-warning':this.type === 'warning',
                'btn-normal':this.type === 'normal',
            },
            domProps:{
                innerText: this.text || '默认'
            },
            on:{
                click:this.handleClick
            }
        })
    },
    methods:{
        handleClick(){
            this.$emit('myClick')
        }
    }
}
</script>

<style scoped>
.btn{
    width: 100px;
    height:40px;
    line-height:40px;
    border:0px;
    border-radius:5px;
    color:#ffff;
}
.btn-success{
    background:#2ecc71;
}
.btn-danger{
    background:#e74c3c;
}
.btn-warning{
    background:#f39c12;
}
.btn-normal{
    background:#bdc3c7;
}
</style>
//  引入

<template>
  <div>
    <h1>I am Home</h1>
    <!-- 按钮根据value显示不同类型的button -->
    <Button type='success' text='button1' @myClick='...'></Button>
  </div>
</template>

<script>
import Button from './button.vue'
export default {
  name: 'Home',
  data(){
    return{
        value:1
    }
  },
  components:{
      Button
  },
  methods:{
  }
}
</script>

<style scoped lang="less">
</style>
```

上面这种写法，根据`value`来显示不同类型的`button`，我们只需要通过`value`去修改`type，text`等，就可以实现这一目的，而不需要去创建多个``，通过`v-if`去判断

> 优化之后的代码，避免了一值多判断的缺点，减少冗余，更加灵活， 这种方式较适合业务简单，使用次数多的组件

------

### 3 -「高精度全局权限处理」

> 权限的控制由前端处理的场景很多，例如根据后台返回内容，判断该人是否对此功能有权限，进而去修改元素`v-if / v-show`，这种情况下，当这个功能在多处地方出现，就会导致我们做很多很多不必要的重复代码，如果判断条件繁琐的情况，更加冗余，代码量也会增加很多。因此我们可以造一个小车轮，挂在全局上对权限进行处理

#### 实战 - 处理某按钮显示权限问题

这种场景出现几率极高，尤其是处理含有多种角色的项目，如果这一类型的权限判断有多次处理，每一次出现都经历判断的话，代码将会异常难看且冗余，因此我们可以通过全局权限判断来处理

```
/*
    在项目里新建一个common文件夹用于存放全局 .js 文件
    这种全局文件夹做法相当普遍，一般项目里都应该有这样一个文件夹来管理全局的东西
*/

// common/jurisdiction.js  用于存放与权限相关的全局函数/变量

export function checkJurisdiction(key) {
    // 权限数组
    let jurisdictionList = ['1', '2', '3', '5']
    let index = jurisdictionList.indexOf(key)
    console.log('index:',index)
    if (index > -1) {
        // 有权限
        return true
    } else {
        // 无权限
        return false
    }
}
// 将全局权限Js挂载到全局中
// main.js

import { checkJurisdiction } from './common/jurisdiction'

// 优雅操作 - VUE自定义指令
Vue.directive('permission',{
  inserted(el, binding){
    // inserted → 元素插入的时候
    
    let permission = binding.value // 获取到 v-permission的值

    if(permission){
      let hasPermission = checkJurisdiction(permission)
      if(!hasPermission){
        // 没有权限 移除Dom元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    }else{
      throw new Error('需要传key')
    }
  }
})
// 使用方式

<template>
  <div>
    <h1>I am Home</h1>
    <!-- 按钮根据value -->
    <div v-permission="'10'">
      <button>权限1</button>
    </div>
    <div v-permission="'5'">
      <button>权限2</button>
    </div>
  </div>
</template>

// 无需再通过value去判断，直接通过v-permission的值进行判断即可
```

运行程序，我们看下是否能够正常显示并分析打印

![img](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

可以看到 `v-permission = "'10'"`是没有权限且不显示，`v-permission = "'5'"`是具有权限且显示





