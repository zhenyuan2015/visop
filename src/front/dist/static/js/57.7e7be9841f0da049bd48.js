webpackJsonp([57],{"zG/p":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("woOf"),s=i.n(a),o=i("mvHQ"),n=i.n(o),l=i("fZjL"),r=i.n(l),c=i("pFYg"),d=i.n(c),u=(i("viA7"),i("cAgV")),h=(i("0xDb"),i("KamI")),p={name:"complexTable",directives:{waves:u.a},data:function(){return{tableKey:0,list:{header:[],data:[]},listLoading:!0,textMap:{update:"Edit",create:"Create"},tabPosition:"top",tabName:"0",tabList:["数据管理","字段管理","配置管理"],temp:{},serach:"",dialogFormVisible:!1,dialogStatus:"",routes:this.$route.query.id,copy:null,url:"",page:1,limit:10,total:10}},created:function(){this.getData()},watch:{$route:function(){this.routes=this.$route.query.id,"0"==this.tabName?this.url="/"+this.routes+"/data":"1"==this.tabName?this.url="/"+this.routes+"/fields":this.url="/"+this.routes+"/meta",this.ifFunction(this.tabName),console.log("router",this.routes)}},mounted:function(){this.routes=this.$route.query.id,"0"==this.tabName?this.url="/"+this.routes+"/data":"1"==this.tabName?this.url="/"+this.routes+"/fields":this.url="/"+this.routes+"/meta",console.log("router",this.routes)},methods:{handleSizeChange:function(t){console.log("1"),this.limit=t,this.ifFunction(this.tabName)},handleCurrentChange:function(t){console.log("2"),this.page=t,this.ifFunction(this.tabName)},tabChange:function(t,e){this.tabName=t.paneName,this.page=1,this.limit=10,"0"==this.tabName?this.url="/"+this.routes+"/data":"1"==this.tabName?this.url="/"+this.routes+"/fields":this.url="/"+this.routes+"/meta",this.ifFunction(this.tabName)},ifFunction:function(t){"0"==t?this.getData():"1"==t?this.getFields():this.getMeta()},getMeta:function(){var t=this;this.listLoading=!0,this.list.header=[{id:"id",description:"id",type:"input"},{id:"description",description:"描述",type:"input"},{id:"value",description:"值",type:"input"}],Object(h.c)(this.routes,"meta",this.page,this.limit).then(function(e){t.list.data=e.data,t.total=Number(e.headers["x-total-count"]),t.listLoading=!1})},getFields:function(){var t=this;this.listLoading=!0,this.list.header=[{id:"id",description:"id",type:"input"},{id:"description",description:"描述",type:"input"},{id:"type",description:"类型",type:"select",config:{0:"input",1:"select",2:"textarea",3:"json"}},{id:"config",description:"参数",type:"textarea",config:{row:5}}],Object(h.c)(this.routes,"fields",this.page,this.limit).then(function(e){t.list.data=e.data,t.total=Number(e.headers["x-total-count"]),console.log(t.list.data,"Getdata"),t.listLoading=!1})},getData:function(){var t=this;this.listLoading=!0,Object(h.c)(this.routes,"fields").then(function(e){t.list.header=e.data;for(var i=0;i<t.list.header.length;i++)t.list.header[i].config=JSON.parse(t.list.header[i].config);Object(h.c)(t.routes,"data",t.page,t.limit).then(function(e){t.list.data=e.data,console.log(e),t.total=Number(e.headers["x-total-count"]),t.listLoading=!1})})},doData:function(t){if(console.log("str",t),"string"==typeof t){try{if("object"==(void 0===(e=JSON.parse(t))?"undefined":d()(e))&&e)return e}catch(e){console.log("error："+t+"!!!"+e)}try{var e;if("number"==typeof(e=Number(t))&&e)return e}catch(e){console.log("error："+t+"!!!"+e)}return"true"==t||"false"==t?"true"==t:t}console.log("It is not a string!")},handleFilter:function(){var t=this;this.listLoading=!0,Object(h.d)(this.url,this.serach).then(function(e){t.list.data=e.data,t.listLoading=!1})},handleModifyStatus:function(t,e){var i=this;Object(h.b)(this.url,t).then(function(a){i.$message({message:"操作成功",type:"success"}),t.status=e,"index"==i.routes?location.reload():i.ifFunction(i.tabName)})},clearDialog:function(){var t=this;r()(this.temp).forEach(function(e){t.temp[e]=""})},handleCreate:function(t){this.dialogStatus=t,this.dialogFormVisible=!0},createData:function(){var t=this;this.$refs.dataForm.validate(function(e){if(e){var i=JSON.parse(n()(t.temp));for(var a in i)i[a]=t.doData(i[a]);console.log(i,"创建数据"),Object(h.a)(t.url,i).then(function(e){t.$notify({title:"成功",message:"创建成功",type:"success",duration:2e3}),t.dialogFormVisible=!1,"index"==t.routes?location.reload():t.ifFunction(t.tabName)})}})},handleUpdate:function(t,e){console.log("row",t),this.temp=s()({},t),this.dialogStatus=e,"copy"==this.dialogStatus&&(this.copy=JSON.parse(n()(this.temp)),this.temp.id+="_copy"),this.dialogFormVisible=!0},updateData:function(){var t=this;this.$refs.dataForm.validate(function(e){if(e)if("copy"==t.dialogStatus){var i=JSON.parse(n()(t.temp));for(var a in i)i[a]=t.doData(i[a]);for(var s in t.copy)t.copy[s]=t.doData(t.copy[s]);delete t.copy.__fromElement,i.__fromElement=t.copy,Object(h.a)(t.url,i).then(function(e){t.$notify({title:"成功",message:"创建成功",type:"success",duration:2e3}),t.dialogFormVisible=!1,"index"==t.routes?location.reload():t.ifFunction(t.tabName)})}else{var o=JSON.parse(n()(t.temp));for(var l in o)o[l]=t.doData(o[l]);Object(h.e)(t.url,o).then(function(e){t.$notify({title:"成功",message:"更新成功",type:"success",duration:2e3}),t.dialogFormVisible=!1,"index"==t.routes?location.reload():t.ifFunction(t.tabName)})}})},handleDelete:function(t){this.$notify({title:"成功",message:"删除成功",type:"success",duration:2e3});var e=this.list.indexOf(t);this.list.splice(e,1)}}},f={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-container calendar-list-container"},[i("el-tabs",{attrs:{"tab-position":t.tabPosition},on:{"tab-click":t.tabChange}},t._l(t.tabList,function(t){return i("el-tab-pane",{key:t.key,attrs:{label:t}})})),t._v(" "),i("div",{staticClass:"filter-container"},[i("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:t.$t("table.title")},nativeOn:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key))return null;t.handleFilter(e)}},model:{value:t.serach,callback:function(e){t.serach=e},expression:"serach"}}),t._v(" "),i("el-button",{directives:[{name:"waves",rawName:"v-waves"}],staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:t.handleFilter}},[t._v(t._s(t.$t("table.search")))]),t._v(" "),i("el-button",{staticClass:"filter-item",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",icon:"el-icon-edit"},on:{click:function(e){t.handleCreate("create")}}},[t._v(t._s(t.$t("table.add")))])],1),t._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],key:t.tableKey,staticStyle:{width:"100%"},attrs:{data:t.list.data,"element-loading-text":"给我一点时间",border:"",fit:"","highlight-current-row":""}},[t._l(t.list.header,function(e,a){return i("el-table-column",{key:a,attrs:{label:e.description,sortable:"",align:"center"},scopedSlots:t._u([{key:"default",fn:function(a){return[i("span",[t._v(t._s(a.row[e.id]))])]}}])})}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:t.$t("table.actions"),width:"230","class-name":"small-padding fixed-width"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(i){t.handleUpdate(e.row,"updata")}}},[t._v(t._s(t.$t("table.edit")))]),t._v(" "),i("el-button",{attrs:{type:"success",size:"mini"},on:{click:function(i){t.handleUpdate(e.row,"copy")}}},[t._v(t._s(t.$t("table.copy")))]),t._v(" "),"delete"!=e.row.status?i("el-button",{attrs:{size:"mini",type:"error"},on:{click:function(i){t.handleModifyStatus(e.row,"delete")}}},[t._v(t._s(t.$t("table.delete"))+"\n        ")]):t._e()]}}])})],2),t._v(" "),i("div",{staticClass:"pagination-container"},[i("el-pagination",{attrs:{background:"","current-page":t.page,"page-sizes":[10,20,30,50],layout:"total, sizes, prev, pager, next",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1),t._v(" "),i("el-dialog",{attrs:{title:t.textMap[t.dialogStatus],visible:t.dialogFormVisible},on:{"update:visible":function(e){t.dialogFormVisible=e},close:t.clearDialog}},[i("el-form",{ref:"dataForm",staticStyle:{width:"400px","margin-left":"50px"},attrs:{model:t.temp,"label-position":"left","label-width":"70px"}},t._l(t.list.header,function(e,a){return i("el-form-item",{key:a,attrs:{label:e.description,prop:e.id}},["input"==e.type?i("el-input",{model:{value:t.temp[e.id],callback:function(i){t.$set(t.temp,e.id,i)},expression:"temp[items.id]"}}):"select"==e.type?i("el-select",{staticClass:"filter-item",attrs:{placeholder:"请选择"},model:{value:t.temp[e.id],callback:function(i){t.$set(t.temp,e.id,i)},expression:"temp[items.id]"}},t._l(e.config,function(t){return i("el-option",{key:t.key,attrs:{label:t,value:t}})})):"textarea"==e.type||"json"==e.type?i("el-input",{attrs:{type:"textarea",rows:e.config.row},model:{value:t.temp[e.id],callback:function(i){t.$set(t.temp,e.id,i)},expression:"temp[items.id]"}}):t._e()],1)})),t._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.dialogFormVisible=!1}}},[t._v(t._s(t.$t("table.cancel")))]),t._v(" "),"create"==t.dialogStatus?i("el-button",{attrs:{type:"primary"},on:{click:t.createData}},[t._v(t._s(t.$t("table.confirm")))]):i("el-button",{attrs:{type:"primary"},on:{click:t.updateData}},[t._v(t._s(t.$t("table.confirm")))])],1)],1)],1)},staticRenderFns:[]},m=i("VU/8")(p,f,!1,null,null,null);e.default=m.exports}});