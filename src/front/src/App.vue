<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import store from './store'
  export default{
    name: 'App',
// mounted() {

//         store.dispatch('GetUserInfo').then(res => { // 拉取user_info
//           const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
//           store.dispatch('addRoute', { roles }).then(() => { // 根据roles权限生成可访问的路由表
//             router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
//             next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
//           })
//         }).catch((err) => {
//           store.dispatch('FedLogOut').then(() => {
//             Message.error(err || 'Verification failed, please login again')
//             next({ path: '/' })
//           })
//         })
//     }
  }
</script>
<style lang="scss">
.router-link-exact-active{
  li{
    padding-left: 20px; color: rgb(64, 158, 255) !important;
  }
}
</style>

