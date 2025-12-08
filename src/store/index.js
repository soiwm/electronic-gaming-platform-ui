import { createStore } from 'vuex'

export default createStore({
  state: {
    // 侧边栏折叠状态
    sidebarCollapse: false
  },
  mutations: {
    // 切换侧边栏折叠状态
    TOGGLE_SIDEBAR(state) {
      state.sidebarCollapse = !state.sidebarCollapse
    }
  },
  actions: {
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    }
  },
  getters: {
    getSidebarCollapse: state => state.sidebarCollapse
  }
})