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
export function login(data) {
  return request({
    url: '/login/data',
    method: 'get'
  }).then(res=>{
    console.log('res',res)
    for(let i=0;i<res.data.length;i++){
      if(res.data[i].user==data.username){
        return res.data[i].password ==data.password
        break;
      }
    }
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

