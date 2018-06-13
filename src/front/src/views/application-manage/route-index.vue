<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.title')" v-model="serach">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list.data" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column
      v-for="(items,index) in list.header" 
      :key="index"
      :label=items.description
      sortable
      align="center">
        <template slot-scope="scope">
          <span>{{scope.row[items.id]}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='delete'" size="mini" type="error" @click="handleModifyStatus(scope.row,'delete')">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="clearDialog">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
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
    }
  },
  created() {
    this.getData()
  },
  methods: {
    tabChange(tab, event){
      this.tabName = tab.paneName
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
      getAllRoutes('meta').then(res =>{
        this.list.data = res.data
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
          "id": "config",
          "description": "参数",
          "type":"textarea",
          "config":{
            "row":5
          }
        },
      ]
      getAllRoutes('index','fields').then(res =>{
        this.list.data = res.data
        for(let i=0;i<this.list.data.length;i++){
          this.list.data[i].config = JSON.stringify(this.list.data[i].config)
        }
        this.listLoading = false
      })
      console.log(this.list)
    },
    getData() {
      this.listLoading = true
      getAllRoutes('index','fields').then(res =>{
        this.list.header = res.data
        getAllRoutes('index','data').then(res =>{
          this.list.data = res.data
          var jsonFields = this.toJSON();
          if(jsonFields.length>0){
            for(let i=0;i<this.list.data.length;i++){
                for(let j=0;j<jsonFields.length;j++){
                  this.list.data[i][jsonFields[j]] = JSON.stringify(this.list.data[i][jsonFields[j]])
                }
            }
          console.log(this.list)
          }
    
          this.listLoading = false
        })
      })
    },
    toJSON(){
      var result = []
      for(let i=0;i<this.list.header.length;i++){
        if(this.list.header[i].type =='json'){
          result.push( this.list.header[i].id)
        }
      }
      return result;
    },
    handleFilter() {
      let url = ''
      this.listLoading = true
      this.tabName=="0"?url = '/index/data?q=':url = '/index/fields?q='
      serachRoute(url,this.serach).then(res=>{
        this.list.data = res.data
        this.listLoading = false
      })
    },
    handleModifyStatus(row, status) {
      let url = ''
      this.tabName=="0"?url = '/index/data/':url = '/index/fields/'
      deleteRoute(url,row).then((res)=>{
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
        this.ifFunction(this.tabName)
      })
    },
    clearDialog(){
      Object.keys(this.temp).forEach(key=>{
      this.temp[key] = ''
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      let url = ''
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          console.log(this.temp,'JSON')
          var jsonFields = this.toJSON();
          if(this.tabName=='0'){
              for(let j=0;j<jsonFields.length;j++){
                 this.temp[jsonFields[j]] = JSON.parse(this.temp[jsonFields[j]])
              }
            // this.temp[this.toJSON()] = JSON.parse(this.temp[this.toJSON()])
          }else{
            this.temp.config = JSON.parse(this.temp.config)
          }
          this.tabName=="0"?url = '/index/data':url = '/index/fields'
          createRoute(url,this.temp).then((res) => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.ifFunction(this.tabName)
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('row',row)
      this.temp = Object.assign({}, row) // copy obj
      // console.log('提交前准备',this.temp)
      // this.temp.parameters = JSON.stringify(this.temp.parameters)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      let url = ''
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // console.log('提交',this.temp)
          this.tabName=="0"?url = '/index/data/':url = '/index/fields/'
          this.dialogFormVisible = false
           var jsonFields = this.toJSON();
          if(this.tabName=='0'){
              for(let j=0;j<jsonFields.length;j++){
                 this.temp[jsonFields[j]] = JSON.parse(this.temp[jsonFields[j]])
              }
          }else{
            this.temp.config = JSON.parse(this.temp.config)
          }
          updateRoute(url,this.temp).then((res) => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          
            this.ifFunction(this.tabName)
          })
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
  }
}
</script>
