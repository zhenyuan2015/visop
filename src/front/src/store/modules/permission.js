import { asyncRouterMap, constantRouterMap } from '@/router'
import { getAllRoutes } from '@/api/route'
const _import = require('../../router/_import_' + process.env.NODE_ENV)
import Layout from '../../views/layout/Layout'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    ADD_ROUTER: (state, router) => {
      state.addRouters = state.addRouters.concat(router)
      state.routers = state.routers.concat(router)
    }
  },
  actions: {
    async GenerateRoutes({ commit }, data) {
      var res =  await getAllRoutes('index','meta')//获取meta配置里面的父路由信息
      let arr = res.data
      let obj = {}
      let index = null
      let index1 = null
      var res1= await getAllRoutes('index','data')//获取data 子路由信息
      const { roles } = data
      let accessedRouters
      if (roles.indexOf('admin') >= 0) {
        accessedRouters = asyncRouterMap
        obj = { 
          path: getValue(arr, 'id'), 
          component: Layout, 
          name: getValue(arr, 'name'),
          meta: { 
            title: getValue(arr, 'name').replace('/',''), 
            icon: 'table' 
          },
          children:[
            { 
              path: 'index', 
              component: _import('application-manage/route-list'), 
              name: getValue(arr, 'name'), 
              meta: { title: getValue(arr, 'name').replace('/',''), icon: 'table',showMenu:false }
            },
          ]
        }
        accessedRouters.push(obj)
        index = getRoutes(accessedRouters,getValue(arr, 'id'))
        for(let i=0;i<res1.data.length;i++){
          let res2 = await getAllRoutes(res1.data[i].id,'meta'),
              res3 = await getAllRoutes(res1.data[i].id,'data') //如果showMenu是true  遍历相应子路由的data内容注册到子路由, //遍历子路由内的meta
              child = null,
              children = []
              // index1 = getRoutes(accessedRouters[index].children,getParent(res1.data))
              let obj = { 
                path: res1.data[i].id, 
                name: res1.data[i].id,
                meta: { 
                  title: res1.data[i].name, 
                  icon: 'table',
                  showMenu:getShowMenu(res2.data, 'showMenu')
                },
                children:[]
              }
              console.log('showMenu',getShowMenu(res2.data, 'showMenu'))
              if(getShowMenu(res2.data, 'showMenu')){
                if(res3&&res3.data.length>0){
                  for(let i = 0;i<res3.data.length;i++){
                    child = {
                      path: res3.data[i].id, 
                      component: _import('application-manage/' + res3.data[i].templateRouter||'route-list'), 
                      name: res3.data[i].id,
                      meta: { 
                        title: res3.data[i].description, 
                        icon: 'table',
                      },
                    }
                    children.push(child)
                  }
                  obj.children = children
                }
              }
              // console.log(res3,'res3')
              // if(index1&&index1>=0){
          //   accessedRouters[index].children[index1].children.push(obj)
          // }else{
            accessedRouters[index].children.push(obj)
          // }
        }
      } else {
        accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
      }
      console.log('GenerateRoutes',accessedRouters)
      commit('SET_ROUTERS', accessedRouters)

    },
    addRoute({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission

function getValue(arr,key){
  var value = null;
  for(var i=0;i<arr.length;i++){
    if(arr[i].id == key){
      value = '/' + arr[i].value;
      break;
    }
  }
  return value;
}
function getShowMenu(arr,key){
  var value = null;
  for(var i=0;i<arr.length;i++){
    if(arr[i].id == key){
      value = arr[i].value;
      break;
    }
  }
  return value ==='true'
}
function getParent(arr){
  var value = null;
  for(var i=0;i<arr.length;i++){
    if(arr[i].parent){
      value = arr[i].parent;
      break;
    }
  }
  return value;
}
function getRoutes(arr,key){
  var index = null
  for(let i = 0;i<arr.length;i++){
    if(arr[i].path == key){
      index = i
      break;
    }
  }
  return index
}