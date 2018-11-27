<template>
    <el-form ref="dataForm" :model="temp" label-position="top" label-width="70px" style='width: 90%; margin:10px;height:100%'>
        <el-form-item :label="items.description" v-for="(items,index) in list" :key="index" :prop="items.id" >
            <el-input v-if="items.type=='input'" v-model="temp[items.id]"></el-input>
            <el-select v-else-if="items.type=='select'" class="filter-item" v-model="temp[items.id]" placeholder="请选择">
            <el-option v-for="item in  items.config" :key="item.key" :label="item" :value="item"></el-option>
            </el-select>
            <el-input v-else-if="items.type=='textarea' || items.type=='json'" type="textarea" :rows="items.config.row" v-model="temp[items.id]"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="updateData">保存</el-button>
            <el-button>取消</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import { getAllRoutes ,createRoute,updateRoute,deleteRoute,serachRoute } from '@/api/route'
export default {
    data(){
        return {
            temp:{},
            list:[]
        }
    },
    mounted() {
        getAllRoutes(this.$route.query.id,'fields').then(res =>{
            this.list = res.data
            console.log(this.list)
            for(let i=0;i<this.list.length;i++){
                this.list[i].config = JSON.parse(this.list[i].config)
            }
        })
        getAllRoutes(this.$route.query.id,'data').then(res =>{
            this.temp = res.data[0]
            console.log(this.temp)
        })
    },
    methods: {
        updateData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    // let datas = JSON.parse(JSON.stringify(this.temp))
                    // for( let i in datas){
                    //     datas[i] = this.doData(datas[i])
                    // }
                    updateRoute('/' + this.$route.query.id + '/data'
                    ,this.temp).then((res) => {
                        this.$notify({
                            title: '成功',
                            message: '更新成功',
                            type: 'success',
                            duration: 2000
                        })
                    })
                }
            })
        },
    }
}
</script>
<style lang="scss">

</style>


