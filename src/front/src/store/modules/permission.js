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
    GenerateRoutes({ commit }, data) {
      return getAllRoutes('index','meta').then(res => {
        let arr = res.data
        let obj = {}
        let index = null
        return getAllRoutes('index','data').then(res1=>{
          new Promise(resolve => {
            const { roles } = data
            let accessedRouters
            if (roles.indexOf('admin') >= 0) {
              accessedRouters = asyncRouterMap
              
              // import('@/views/' + file + '.vue')
              obj = { 
                path: getValue(arr, 'id'), 
                component: Layout, 
                name: getValue(arr, 'name'),
                meta: { 
                  title: getValue(arr, 'name').replace('/',''), 
                  icon: 'table' 
                },
                children:[
                  // { path: 'element', component: _import('application-manage/route-list'), name: 'route-list', meta: { title: 'routeList', icon: 'table' }},
                  { path: 'index', component: _import('application-manage/route-list'), name: 'route-index', meta: { title: 'routeIndex', icon: 'table' }},
                ]
              }
              accessedRouters.push(obj)
              index = getRoutes(accessedRouters,getValue(arr, 'id'))
              for(let i=0;i<res1.data.length;i++){
                accessedRouters[index].children.push(
                  { 
                    path: res1.data[i].id, 
                    component: _import('application-manage/route-list'), 
                    name: res1.data[i].id,
                    meta: { 
                      title: res1.data[i].name, 
                      icon: 'table' 
                    }
                  }
                )
              }
            } else {
              accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
            }
            console.log('GenerateRoutes',accessedRouters)
            commit('SET_ROUTERS', accessedRouters)
            resolve()
          })
        })
      })
      
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