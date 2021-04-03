<template>
  <div class="home">
    <div class="search_bar">
      <MyInput v-model.trim="currentInput" v-model:isSearch="isSearch" @search="handleSearch" @add="handleAdd"></MyInput>
    </div>
    <van-tabs v-model:active="activeTab" animated>
      <van-tab title="未完成">
        <van-cell-group class="todoList">
          <van-swipe-cell v-for="item in showList" :key="item.id">
            <van-cell :title="item.name" :value="item.date">
              <template #icon>
                <van-icon name="circle" class="finish_icon" @click="handleFinish(item.id)"/>
              </template>
            </van-cell>
            <template #right>
              <van-button square type="danger" text="删除" @click="handleDelete(item.id)"/>
            </template>
          </van-swipe-cell>
        </van-cell-group>
      </van-tab>
      <van-tab title="已完成">
        <van-cell-group class="todoList">
          <van-swipe-cell v-for="item in showList" :key="item.id">
            <van-cell :title="item.name" :value="item.date">
              <template #icon>
                <van-icon name="success" class="finish_icon"/>
              </template>
            </van-cell>
            <template #right>
              <van-button square type="danger" text="删除" @click="handleDelete(item.id)"/>
            </template>
          </van-swipe-cell>
        </van-cell-group>
      </van-tab>
    </van-tabs>
    
  </div>
</template>

<script>
import MyInput from '@/components/Common/input'
import { computed, getCurrentInstance, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'Home',
  components: {
    MyInput
  },
  setup() {
    const currentInput = ref('')
    const activeTab = ref(0)
    const store = useStore()

    const { proxy }  = getCurrentInstance() //在setup中获取全局的上下文

    const isSearch = ref(false)
    const handleAdd = () => {
      !currentInput.value && proxy.$toast('内容不能为空')
      store.commit('SetTodoList', { id: new Date().getTime(), name: currentInput.value, isFinish: false, date: proxy.$Tool.timeFormat(new Date(), 'YYYY-MM-DD') })
      console.log({ id: new Date().getTime(), name: currentInput.value, isFinish: false, date: proxy.$Tool.timeFormat(new Date(), 'YYYY-MM-DD') })
      currentInput.value = ''
    }
    const handleFinish = (id) => {
      store.commit('HandleDo', id)
    }
    const handleDelete = async (id) => {
      await store.dispatch('delTodo', id)
      proxy.$toast('删除成功')
    }
    let homeState = reactive({
      searchList: []  //搜索结果列表
    }) 
    const handleSearch = () => {
      console.log('search')
      homeState.searchList = activeTab.value === 0 ?
        store.getters.undoList.filter(item => item.name.indexOf(currentInput.value) !== -1) :
        store.getters.finishList.filter(item => item.name.indexOf(currentInput.value) !== -1)
    }

    watch(activeTab, () => {
      isSearch.value && handleSearch()
    })
    watch(isSearch, () => {
      currentInput.value = ''
    })

    //计算属性代替2.x的过滤器
    const computeTime = (timeStr) => {
      return proxy.$Tool.timeFormat(new Date(), 'YYYY-MM-DD') === timeStr ? '今天' : timeStr 
    }

    let showList = computed(() => {
      if(isSearch.value) {
        return homeState.searchList.map(item => {
           return {
            ...item,
            date: computeTime(item.date)
          }
        })
      }else if(activeTab.value === 0) {
        return store.getters.undoList.map(item => {
          return {
            ...item,
            date: computeTime(item.date)
          }
        })
      }else {
        return store.getters.finishList.map(item => {
          return {
            ...item,
            date: computeTime(item.date)
          }
        })
      }
    })
    
    return {
      currentInput,
      handleAdd,
      isSearch,
      handleFinish,
      handleDelete,
      handleSearch,
      homeState,
      showList,
      activeTab
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  .search_bar {
    margin: 24px;
  }
  .todoList {
    margin: 40px 24px;
    &:deep(.van-cell) {
      background-color: transparent;
      padding: 28px 32px;
      font-size: 28px;
      position: relative;
      color: #333;
      line-height: 40px;
      padding-left: 58px;
      .finish_icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 32px;
        color: #888;
      }
    }
    &:deep(.van-cell__value) {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    &:deep(.van-cell__title) {
      max-width: 540px;
      flex: none;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
    }
  }
  &:deep(.van-tabs__nav) {
    // border-radius: 24px;
    margin: 0 24px;
    background-color: transparent;
    // padding-bottom: ;
    // box-sizing: border-box;
    
  }
  &:deep(.van-tab) {
    border-radius: 24px;
    background-color: #fff;
    margin: 0 10px;
  }
  &:deep(.van-cell-group){
    border-radius: 24px;
  }
}
</style>
