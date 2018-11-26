<template>
  <div class="app-container calendar-list-container">
    <el-tabs :tab-position="tabPosition" @tab-click="tabChange" >
      <el-tab-pane :label="tab" v-for="tab in tabList" :key="tab.key"></el-tab-pane>
    </el-tabs>
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="serach">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate('create')" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list.data" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column
      v-for="(items,index) in list.header" 
      :key="index"
      :label=items.description
      sortable
      :show-overflow-tooltip="true"
      :formatter = "formatter"
      align="center">
        <template slot-scope="scope">
          <span v-if="indexOfData(scope.row[items.id])">{{scope.row[items.id]}}</span>
          <a v-else target="_blank" :href="scope.row[items.id]">{{scope.row[items.id]}}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="checkPermission(scope.row, '__visopexecute')" type="warning" size="mini" @click="handleExecute(scope.row,'execute')">{{$t('table.execute')}}</el-button>
          <el-button v-if="checkPermission(scope.row, '__visopedit')" type="primary" size="mini" @click="handleUpdate(scope.row,'updata')">{{$t('table.edit')}}</el-button>
          <el-button v-if="checkPermission(scope.row, '__visopcopy')" type="success" size="mini" @click="handleUpdate(scope.row,'copy')">{{$t('table.copy')}}</el-button>
          <el-button v-if="checkPermission(scope.row, '__visopdelete')" size="mini" type="danger" @click="handleModifyStatus(scope.$index,scope.row,'delete')">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10,20,30, 50]" layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="clearDialog">
      <el-form ref="dataForm" :model="temp" label-position="top" label-width="70px" style='width: 90%; margin:10px;height:100%'>
        <el-form-item :label="items.description" v-for="(items,index) in list.header" :key="index" :prop="items.id" >
          <el-input v-if="items.type=='input'" v-model="temp[items.id]"></el-input>
          <el-select v-else-if="items.type=='select'" class="filter-item" v-model="temp[items.id]" placeholder="请选择">
            <el-option v-for="item in  items.config" :key="item.key" :label="item" :value="item"></el-option>
          </el-select>
          <el-input v-else-if="items.type=='textarea' || items.type=='json'" type="textarea" :rows="items.config.row" v-model="temp[items.id]"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { getAllRoutes ,createRoute,updateRoute,deleteRoute,serachRoute } from '@/api/route'


export default {
  name: 'complexTable',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: {
        header:[],
        data:[]
      },
      listLoading: true,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      tabPosition: 'top',
      tabName:'0',
      tabList:['数据管理','字段管理','配置管理'],
      temp: {},
      serach:'',
      dialogFormVisible: false,
      dialogStatus: '',
      routes:this.$route.query.id,
      copy:null,
      url:'',
      page:1,
      limit:10,
      total:10
    }
  },
  created() {
    this.getData()
  },
  watch:{
    $route(){
      this.page = 1
      this.limit = 10
      this.routes = this.$route.query.id
      this.tabName=="0"?this.url = '/'+this.routes+'/data':this.tabName=="1"?this.url = '/'+this.routes+'/fields':this.url = '/'+this.routes+'/meta'
      this.ifFunction(this.tabName)
      console.log('router',this.routes)
    }
  },
  mounted(){
    this.routes = this.$route.query.id
    this.tabName=="0"?this.url = '/'+this.routes+'/data':this.tabName=="1"?this.url = '/'+this.routes+'/fields':this.url = '/'+this.routes+'/meta'
    console.log('router',this.routes)
  },
  methods: {
    checkPermission(row, action){
      // console.log("checkPermission,", row.id, action,row[action],row[action] == undefined)
      switch(action){
        case '__visopedit':
        case '__visopcopy':
        case '__visopdelete':
          if(row[action] == undefined || row[action] == true){
            return true;
          }else{
            return false;
          }
          break;
        case '__visopexecute':
          if(row[action]){
            return true;
          }else{
            return false;
          }
      }
      return true;
    },
    handleExecute(row){
        console.log('handleExecute')
          let datas = JSON.parse(JSON.stringify(row))
          for( let i in datas){
            datas[i] = this.doData(datas[i])
          }
          console.log(datas,'执行命令')
          datas.__doexecute = true;
          createRoute(this.url,datas).then((res) => {
            this.$notify({
              title: '成功',
              message: '执行完成',
              type: 'success',
              duration: 2000
            })
            // this.dialogFormVisible = false
            // if(this.routes=='index'){
            //   location.reload()
            // }else{
            //   this.ifFunction(this.tabName)
            // }
          })
    },
    indexOfData(e){
      if(e&&e.indexOf('http')<0){
        return true
      }else{
        return false
      }
    },
    handleSizeChange(val){
      console.log('1')
      this.limit = val
      this.ifFunction(this.tabName)
    },
    handleCurrentChange(val){
      console.log('2')
      this.page = val
      this.ifFunction(this.tabName)
    },
    tabChange(tab, event){
      this.tabName = tab.paneName
      this.page = 1
      this.limit = 10
      this.tabName=="0"?this.url = '/'+this.routes+'/data':this.tabName=="1"?this.url = '/'+this.routes+'/fields':this.url = '/'+this.routes+'/meta'
      this.ifFunction(this.tabName)
    },
    ifFunction(type){
      if(type=='0'){
        this.getData()
      }else if(type=='1'){
        this.getFields()
      }else{
        this.getMeta()
      }
    },
    getMeta(){
      this.listLoading = true
      this.list.header = [
        {
          "id": "id",
          "description": "id",
          "type":'input'
        },
        {
          "id": "description",
          "description": "描述",
          "type":'input'
        },
        {
          "id": "value",
          "description": "值",
          "type": "input",
        },
      ]
      getAllRoutes(this.routes,'meta',this.page,this.limit).then(res =>{
        this.list.data = res.data
        this.total = Number(res.headers['x-total-count'])
        this.listLoading = false
      })
    },
    getFields(){
      this.listLoading = true
      this.list.header = [
        {
          "id": "id",
          "description": "id",
          "type":'input'
        },
        {
          "id": "description",
          "description": "描述",
          "type":'input'
        },
        {
          "id": "type",
          "description": "类型",
          "type": "select",
          "config": {
            "0":"input",
            "1": "select",
            "2": "textarea",
            "3": "json",
          }
        },
        {
          "id": "show",
          "description": "类型",
          "type": "select",
          "config": {
            "0":"input",
            "1": "select",
            "2": "textarea",
            "3": "json",
          }
        },
        {
          "id": "config",
          "description": "参数",
          "type":"textarea",
          "config":{
            "row":5
          }
        },
      ]
      getAllRoutes(this.routes,'fields',this.page,this.limit).then(res =>{
        this.list.data = res.data
        this.total = Number(res.headers['x-total-count'])
        console.log(this.list.data,'Getdata')
        this.listLoading = false
      })
    },
    getData() {
      this.listLoading = true
      getAllRoutes(this.routes,'fields').then(res =>{
        this.list.header = res.data
        for(let i=0;i<this.list.header.length;i++){
          this.list.header[i].config = JSON.parse(this.list.header[i].config)
        }
        // for(let i=0;i<this.list.header.length;i++){
        //   for( let s in this.list.header[i]){
        //     if(typeof this.list.header[i][s] !='string'){
        //       this.list.header[i][s] = JSON.stringify(this.list.header[i][s])
        //     }
        //   }
        // }
        getAllRoutes(this.routes,'data',this.page,this.limit).then(res =>{
          this.list.data = res.data
          console.log(res)
          this.total = Number(res.headers['x-total-count'])
          // for(let i=0;i<this.list.data.length;i++){
          //   for( let s in this.list.data[i]){
          //     if(typeof this.list.data[i][s] !='string'){
          //       this.list.data[i][s] = JSON.stringify(this.list.data[i][s])
          //     }
          //   }
          // }
          this.listLoading = false
        })
      })
    },
    doData(str) {
      console.log('str',str)
      if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return obj;
            }

        } catch(e) {
            console.log('error：'+str+'!!!'+e);
        }
        try {
            var obj=Number(str);
            if(typeof obj == 'number' && obj ){
                return obj;
            }

        } catch(e) {
            console.log('error：'+str+'!!!'+e);
        }
        if(str == 'true' || str == 'false' ){
            return str == 'true';
        }
        return str 
      }
      console.log('It is not a string!')
    },
    handleFilter() {
      this.listLoading = true
      serachRoute(this.url,this.serach).then(res=>{
        this.list.data = res.data
        this.listLoading = false
      })
    },
    handleModifyStatus(index,row, status) {
      this.$confirm('确定要删除当前内容吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass:'confirm_box'
            }).then(() => {
              deleteRoute(this.url,row).then((res)=>{
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                row.status = status
                if(this.routes=='index'){
                  location.reload()
                }else{
                  this.ifFunction(this.tabName)
                }
              })
            }).catch(() => {
                // console.log('已取消删除操作。')
            });
    },
    clearDialog(){
      Object.keys(this.temp).forEach(key=>{
      this.temp[key] = ''
      })
    },
    handleCreate(type) {
      this.dialogStatus = type
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // var jsonFields = this.toJSON();
          // if(this.tabName=='0'){
          //     for(let j=0;j<jsonFields.length;j++){
          //       if(this.isJSON(this.temp[jsonFields[j]])){
          //         this.temp[jsonFields[j]] = JSON.parse(this.temp[jsonFields[j]])
          //       }else{
          //         this.$notify({
          //           title: '失败',
          //           message: '参数格式有误，请填写JSON格式',
          //           type: 'error',
          //           duration: 2000
          //         })
          //         return
          //       }
          //     }
          // }else if(this.tabName=='1'){
          //   if(this.isJSON(this.temp.config)){
          //     this.temp.config = JSON.parse(this.temp.config)
          //   }else{
          //     this.$notify({
          //       title: '失败',
          //       message: '参数格式有误，请填写JSON格式',
          //       type: 'error',
          //       duration: 2000
          //     })
          //     return
          //   } 
          // }
          let datas = JSON.parse(JSON.stringify(this.temp))
          for( let i in datas){
            datas[i] = this.doData(datas[i])
          }
          console.log(datas,'创建数据')
          createRoute(this.url,datas).then((res) => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            if(this.routes=='index'){
              location.reload()
            }else{
              this.ifFunction(this.tabName)
            }
          })
        }
      })
    },
    handleUpdate(row,type) {
      console.log('row',row)
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = type
      if(this.dialogStatus =='copy'){
          this.copy = JSON.parse(JSON.stringify(this.temp))
          this.temp.id+='_copy'
      }
      // console.log('提交前准备',this.temp)
      // this.temp.parameters = JSON.stringify(this.temp.parameters)
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // console.log('提交',this.temp)
          //  var jsonFields = this.toJSON();
          if(this.dialogStatus =='copy'){
            // if(this.tabName=='0'){
            //   for(let j=0;j<jsonFields.length;j++){
            //     if(this.isJSON(this.temp[jsonFields[j]])&&this.isJSON(this.copy[jsonFields[j]])){
            //       this.temp[jsonFields[j]] = JSON.parse(this.temp[jsonFields[j]])
            //       this.copy[jsonFields[j]] = JSON.parse(this.copy[jsonFields[j]])
            //     }else{
            //       this.$notify({
            //         title: '失败',
            //         message: '参数格式有误，请填写JSON格式',
            //         type: 'error',
            //         duration: 2000
            //       })
            //       return
            //     }
            //   }
            // }else{
            //   if(this.isJSON(this.temp.config)&&this.isJSON(this.copy.config)){
            //     this.temp.config = JSON.parse(this.temp.config)
            //     this.copy.config = JSON.parse(this.copy.config)
            //   }else{
            //     this.$notify({
            //       title: '失败',
            //       message: '参数格式有误，请填写JSON格式',
            //       type: 'error',
            //       duration: 2000
            //     })
            //     return
            //   }
            // }
            let datas = JSON.parse(JSON.stringify(this.temp))
            for( let i in datas){
              datas[i] = this.doData(datas[i])
            }
            for( let i in this.copy){
              this.copy[i] = this.doData(this.copy[i])
            }
            delete this.copy.__fromElement
            datas.__fromElement = this.copy
            createRoute(this.url,datas).then((res) => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              if(this.routes=='index'){
                location.reload()
              }else{
                this.ifFunction(this.tabName)
              }
            })
          }else{
            // if(this.tabName=='0'){
            //   for(let j=0;j<jsonFields.length;j++){
            //     if(this.isJSON(this.temp[jsonFields[j]])){
            //       this.temp[jsonFields[j]] = JSON.parse(this.temp[jsonFields[j]])
            //     }else{
            //       this.$notify({
            //         title: '失败',
            //         message: '参数格式有误，请填写JSON格式',
            //         type: 'error',
            //         duration: 2000
            //       })
            //       return
            //     }
            //   }
            // }else if(this.tabName=='1'){
            //   if(this.isJSON(this.temp.config)){
            //     this.temp.config = JSON.parse(this.temp.config)
            //   }else{
            //     this.$notify({
            //       title: '失败',
            //       message: '参数格式有误，请填写JSON格式',
            //       type: 'error',
            //       duration: 2000
            //     })
            //     return
            //   } 
            // }
            let datas = JSON.parse(JSON.stringify(this.temp))
            for( let i in datas){
              datas[i] = this.doData(datas[i])
            }
            updateRoute(this.url,datas).then((res) => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              if(this.routes=='index'){
                location.reload()
              }else{
                this.ifFunction(this.tabName)
              }

            })
          }
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    formatter(row, column, cellValue, index) {
      console.log("arguments",row,column,cellValue,index)
      // return cellValue+','+index
      return cellValue
    }
  }
}
</script>
