import Mock from 'mockjs'

var list = [
    {
        method:'get',
        route:'test',
        authority:'10000',
        description:'描述',
        parameters:'参数',
        type:'method'
    },
    {
        method:'get1',
        route:'test1',
        authority:'100001',
        description:'描述1',
        parameters:'参数1',
        type:'route'
    },
    {
        method:'get2',
        route:'test2',
        authority:'100002',
        description:'描述2',
        parameters:'参数2',
        type:'authority'
    },
    {
        method:'get3',
        route:'test3',
        authority:'100003',
        description:'描述3',
        parameters:'参数3',
        type:'description'
    },
    {
        method:'get4',
        route:'test4',
        authority:'100004',
        description:'描述4',
        parameters:'参数4',
        type:'parameters'
    },
    
]

var list2 = {
    header: [
        {
            title:'访问方式',
            prop: 'method',
            type:'select',
        },
        {
            title:'路由名称',
            prop: 'route',
            type:'input'
        },
        {
            title:'权限码',
            prop: 'authority',
            type:'input'
        },
        {
            title:'描述',  
            prop: 'description',
            type:'input'
        },
        {
            title:'参数',
            prop: 'parameters',
            type:'textarea',
            row:5
        },
    ],
    data: list
}

export default {
    getAllRoutes: () => {
      return {
        result: list2
      }
    }
  }