# vue3_todolist

222

vue3.0已经正式发布了很长时间了，看了不少人对它的评价和讲解，借着这个demo来实践一下

首先是大家一直在说的组合式(Composition) API，简单来说，他就以函数式的方式去调用api，通过在setup钩子中，组合地使用，不像vue2.x那样把所有的api都一次性导入，减小的打包后的大小

![cul8N6.png](https://z3.ax1x.com/2021/04/03/cul8N6.png)

如果用vue2.x开发过比较复杂的项目的话就会明白，那个反复横跳的场景↓ 维护起来就有点棘手了

![culggg.png](https://z3.ax1x.com/2021/04/03/culggg.png)

而在vue3.x，使用响应式的数据只需要调用一下api

首先先来看看新的钩子 `setup`

+ `setup` : 在创建组件**之前**执行， 他有两个参数

  - `{Data} props` 

    用来读取当前实例的传入的参数`props`

  - `{SetupContext} context`

    用来读取当前实例的上下文，但在执行 `setup` 时， 组件实例尚未创建，因此只能访问以下的`property`

    + `attrs`
    + `slots`
    + `emit`

  ```js
  export default {
  	props: {
      	modelValue: String
    	},
  	setup(props, ctx) {
  		const handleInput = (e) => {
  			ctx.emit('update:modelValue', e.target.value)
  		}
  		return {
  			handleInput
  		}
  	}
  }
  ```

  在 `setup` 内部的this的行为和在其他选项中的this完全不同，所以当我们想使用其他实例方法时，应该使用`getCurrentInstance`，比如我们使用了轻提示组件，在挂载好组件后进行使用

  ```js
  setup() {
      const { proxy }  = getCurrentInstance()
      proxy.$toast('提示内容')
  }
  ```

  

+ `reactive` : 返回一个响应式对象

+ `ref` ： 与 `reactive` 类似，同样是响应式对象，`ref('')` 可以理解为 `reactive({value: ''})`,

  这也是为什么每次访问值的时候要加 `.value`（在模板中使用不需要）; 另外，vue3获取Dom实例也是通过 `ref` 来获取的

+ `readonly` : 获取一个对象 (响应式或纯对象) 或 `ref`并返回原始代理的只读代理

```vue
<template>
  <div>
    <div ref="el">div元素</div>
  </div>
</template>

import { ref, reactive } from 'vue'
export default {
    setup() {
    	const el = ref(null)  
    	onMounted(() => {
        	el.value.innerHTML = '内容被修改'
     	})

    	return { el }
    }
}
```

```js
import { ref, reactive } from 'vue'
export default {
    setup() {
      const el = ref(null)  
      const currentInput = ref('')
      let homeState = reactive({
        searchList: []
      }) 
      const handleEdit = () => {
        currentInput.value = 'Hello World'
      }
	  console.log('currentInput', currentInput)
      console.log('homeState', homeState)
      return {
        currentInput,
        homeState,
        handleEdit
      }
    }
}
```

![cKSrjg.png](https://z3.ax1x.com/2021/04/04/cKSrjg.png)

+ `toRef` : 可将某个对象中的某个值转化为响应式数据，第一个参数为接受的对象，第二个为对象中的属性名

  功能和ref很像，但它们的响应式不同

```js
import { ref, reactive } from 'vue'
export default {
    setup() {
        const state = { stateValue: 1 }   
        const state_to_ref = toRef(state, 'stateValue')
        const state_ref = ref(state.stateValue)
        function add1() {
          state_to_ref.value ++
          console.log('state_to_ref原始值：', state);
          console.log('state_to_ref响应式数据对象：', state_to_ref);
        }
        function add2() {
          state_ref.value ++
          console.log('state_ref原始值：', state);
          console.log('state_ref响应式数据对象：', state_ref);
        }

        return { 
          state_to_ref,
          state_ref,
          add1,
          add2
        }
    }
}
```

#### 	toRef:

![cK9jXD.png](https://z3.ax1x.com/2021/04/04/cK9jXD.png)

![cK9hXF.png](https://z3.ax1x.com/2021/04/04/cK9hXF.png)

#### 	ref:

![cKCPht.png](https://z3.ax1x.com/2021/04/04/cKCPht.png)

![cK9I0J.png](https://z3.ax1x.com/2021/04/04/cK9I0J.png)

​	触发 `toRef` 的数据改变的结果：原始值改变，视图没有发生变化，即`toRef` 是对传入数据的引用

​	触发 `ref` 的数据改变的结果：原始值没有改变，视图发生变化，即`ref` 是对传入数据的拷贝

+ `toRefs` : 和 `toRef` 一样的原理，但这个是将传入的对象里所有的属性的值都转化为响应式数据对象，参数就传入的对象

```js
setup() {
	const obj = {
		value1: '111',
		value2: '222'
	}
	const obj_to_refs = toRefs(obj)
	
	return {
		obj_to_refs
	}
}
```

+ `shallowReactive` : 顾名思义就是浅层的 `reactive`, 如果传入的对象层级不止一层，则只会对第一层做响应式处理, 可以用来优化性能
+ `shallowRef` : 一样的原理，浅层的 `ref`

```js
setup() {
	const state = { 
      value1: '111',
      stateObj1: {
        value2: '222',
        stateObj2: {
          value3: '333'
        }
      }
    }   
    const state_a = reactive(state)
    const state_s = shallowReactive(state)
    console.log('reactive', state_a)
    console.log('reactive', state_a.stateObj1)
    console.log('reactive', state_a.stateObj1.stateObj2)
    console.log('shallowReactive', state_s)
    console.log('shallowReactive', state_s.stateObj1)
    console.log('shallowReactive', state_s.stateObj1.stateObj2)
}
```

​	可以看到 `shallowReactive` 返回的对象只有第一层才有响应式

![cKPgMT.png](https://z3.ax1x.com/2021/04/04/cKPgMT.png)

+ `toRaw` : 返回一个响应式对象如 `reactive` 的原始对象，可以用来临时读取又不会引起响应式带来的数据变化
+ `markRaw` : 标记一个对象，使其永远不会转换为代理。返回对象本身

+ `computed` : 和vue2基本相同，可以使用具有 `get` 和 `set` 函数的对象来创建可写的 ref 对象

  ```js
  setup() {
  	const count = ref(1)
      const plusOne = computed({
        get: () => count.value + 1,
        set: val => {
          count.value = val - 1
        }
      })
      return { count, plusOne }
  }
  
  ```

+ `watch` : 对指定的响应式对象进行监听，可同时监听多个源

+ `watchEffect` : 在响应式地跟踪其依赖项时立即运行一个函数，也就是在实例初始化时收集了要跟踪的依赖项，并在更改依赖项时重新运行它，只能拿到更新后的值

```
setup() {
	const currentInput = ref('')
	const isSearch = ref(false)
	
	const stopWatch = watch(isSearch, (val) => {
    	if(val) currentInput.value = ''
    })
    const stopWatchEffect = watchEffect(() => {
    	if(isSearch.value) currentInput.value = ''
    })
    
    stopWatch()
    stopWatchEffect()
    
}
```

​	两者区别就在于，`watch` 默认是惰性的，且有指定的依赖项，而`watchEffect` 在一开始就会运行一个函数来收集依赖，两者都会返回一个停止函数，调用以停止监听

+ `v-model` : 变动较大，在vue2.x可以看作 `value` 和 `input` 的语法糖，到了vue3移除了`v-bind` 的 `.sync` 修饰符和组件的 `model` 选项，统一使用`v-model`，且现在可以同时对多个参数进行双向绑定

  + prop：`value` -> `modelValue`
  + event：`input` -> `update:modelValue`

  vue3的`v-model`还加入了自定义修饰符

  ```js
  //views
  <MyInput v-model.myModel="currentInput" v-model:isSearch="isSearch">
      
  //component
  <input @input="emitValue"></input>
  export default {
  	props: {
      	modelValue: String,
          isSearch: Boolean,
  		modelModifiers: {
  			default: () => ({})
  		}
      },
      setup(props, ctx) {
          const handleChange = () => {
  			ctx.emit('update:isSearch', !props.isSearch)
  		}
          return {
              handleInput,
              handleChange
          }
      },
      methods: {
  		emitValue(e) {
            let value = e.target.value
            if (this.modelModifiers.myModel) {
              value = value+1
            }
            this.$emit('update:modelValue', value)
          }
      }
  }
  ```

  

+ #### Store

  vue3 `Vuex` 的使用区别就是使用函数式的调用

  ```js
  import { useStore } from 'vuex'
  export default {
      setup() {
          const store = useStore()
          const storeState = store.state.obj
          store.commit('func')
      }
  }
  ```

+ ### Router

  同样是可以按需导入

  ```js
  import { createRouter, createWebHistory } from 'vue-router'
  import Home from '../views/Home.vue'
  
  const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
  
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
  })
  
  export default router
  ```



这些是较为常用的api，还有很多版本迁移后的变化还需项目实践的积累~

[vue3官方中文文档](https://vue3js.cn/docs/zh/api/)

