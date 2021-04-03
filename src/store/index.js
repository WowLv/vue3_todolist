import { createStore } from 'vuex'
import Storage from '@/utils/Storage'

export default createStore({
  state: {
    todoList: []
  },
  getters: {
    undoList: state => {
      let todoList = state.todoList.length ? state.todoList : Storage.GetStorage('todoList', 'local') || []
      return todoList.filter(item => !item.isFinish)
    },
    finishList: state => {
      let todoList = state.todoList.length ? state.todoList : Storage.GetStorage('todoList', 'local') || []
      return todoList.filter(item => item.isFinish)
    }
  },
  mutations: {
    SetTodoList(state, data) {
      if(data.name) {
        let todoList = state.todoList.length ? state.todoList : Storage.GetStorage('todoList', 'local') || []
        todoList.push(data)
        state.todoList = todoList
        Storage.SetStorage('todoList', todoList, 'local')
      }
    },
    DelTodo(state, id) {
      let todoList = state.todoList.length ? state.todoList : Storage.GetStorage('todoList', 'local') || []
      todoList.forEach((item, index) => {
        if(item.id === id) {
          todoList.splice(index, index+1)
        }
      })
      console.log(todoList)
      state.todoList = todoList
      Storage.SetStorage('todoList', todoList, 'local')
    },
    HandleDo(state, id) {
      let todoList = state.todoList.length ? state.todoList : Storage.GetStorage('todoList', 'local') || []
      state.todoList = todoList.map(item => {
        if(item.id === id) {
          return Object.assign(item, { isFinish: true })
        }
        return item
      })
      Storage.SetStorage('todoList', state.todoList, 'local')
    }
  },
  actions: {
    async delTodo({ commit }, id) {
      await commit('DelTodo', id)
    }
  },
  modules: {
  }
})
