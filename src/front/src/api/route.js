import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 创建路由
export function generateRoute() {
  return request({
    url: ''
  })
}

// 获取路由
export function getAllRoutes(url,data,page,limit) {
  return request({
    url: '/'+url+'/' + data + '?_page='+page+'&_limit='+(limit||'500')+'',
    method: 'get',
  }).then(res => {
    // console.log(res.data,'getAll')
    for(let i=0;i<res.data.length;i++){
      for( let s in res.data[i]){
        if(typeof res.data[i][s] !='string'){
          res.data[i][s] = JSON.stringify(res.data[i][s])
        }
      }
    }
    return res
  })
}
// 创建路由
export function createRoute(url,data) {
  // data.parameters = JSON.parse(data.parameters)
  return request({
    url: url,
    method: 'post',
    data: data
  })
}
// 修改路由
export function updateRoute(url,data) {
  // data.parameters = JSON.parse(data.parameters)
  return request({
    url: url + '/' + data.id,
    method: 'patch',
    data: data
  })
}
// 删除路由
export function deleteRoute(url,data) {
  return request({
    url: url + '/' + data.id,
    method: 'delete',
    data:data
  })
}
export function serachRoute(url,data) {
  return request({
    url: url + '?q=' + data,
    method: 'get',
  }).then(res => {
    // console.log(res.data,'getAll')
    for(let i=0;i<res.data.length;i++){
      for( let s in res.data[i]){
        if(typeof res.data[i][s] !='string'){
          res.data[i][s] = JSON.stringify(res.data[i][s])
        }
      }
    }
    return res
  })
}
