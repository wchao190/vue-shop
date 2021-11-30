<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--警告信息-->
      <el-alert title="只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
      <!--级联选择框-->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectGoodsKey" :options="goodsList"
                       :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children'}"
                       @change="goodsChange" :clearable="true">
          </el-cascader>
        </el-col>
      </el-row>

      <!--tab 标签页-->
      <el-tabs v-model="tabName" @tab-click="tabClick">
        <!--动态参数 页面-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" size="mini" @click="showDialog">添加动态参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--循环打印参数标签-->
                <el-tag v-for="(item,index) in scope.row.attr_vals" closable :key="index" @close="closeTag(index,scope.row)">{{item}}</el-tag>
                <!--动态标签-->
                <el-input class="input-new-tag" v-if="scope.row.isShow" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                   @keyup.enter.native="inputConfirm(scope.row)" @blur="inputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!--静态属性 页面-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" size="mini" @click="showDialog">添加静态属性</el-button>
          <!--动态参数表格-->
          <el-table :data="onlyData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--循环打印属性标签-->
                <el-tag v-for="(item,index) in scope.row.attr_vals" closable :key="index" @close="closeTag(index,scope.row)">{{item}}</el-tag>
                <!--动态编辑标签-->
                <el-input class="input-new-tag" v-if="scope.row.isShow" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                          @keyup.enter.native="inputConfirm(scope.row)" @blur="inputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!--添加动态参数/静态属性对话框-->
      <el-dialog :title="'添加'+titleText" :visible.sync="addParamsDialog" width="50%" @close="closeDialog">
        <el-form ref="addParamsRef" :model="addParamDt" label-width="120px" :rules="addParamRule">
          <el-form-item :label="titleText+'名称'" prop="attr_name">
            <el-input v-model="addParamDt.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParamsSubmit" >确 定</el-button>
        </span>
      </el-dialog>

      <!--编辑对话框-->
      <el-dialog :title="'编辑'+titleText" :visible.sync="editDialog" width="50%" @close="closeEditDialog">
        <el-form ref="editRef" :model="editDt" label-width="120px" :rules="editRule">
          <el-form-item :label="titleText+'名称'" prop="attr_name">
            <el-input v-model="editDt.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  name: "GoodsParams",
  computed:{
    /*控制按钮是否可用*/
    isDisabled(){
      /*如果选中的是三级分类，返回一个true*/
      if(this.selectGoodsKey.length !==3 ){
        return true
      }
      return false
    },
    /*获取分类Id*/
    categoryId(){
      /*如果选中的是三级分类，返回一个true*/
      if(this.selectGoodsKey.length ===3 ){
        return this.selectGoodsKey[2]
      }
      return null
    },
    /*对话框标题*/
    titleText(){
      if(this.tabName === 'many'){
        return '动态参数'
      }
      return '静态属性'
    }
  },
  data(){
    return {
      /*保存商品分类列表数据*/
      goodsList:[],
      /*级联选择框双向绑定的数据*/
      selectGoodsKey:[],
      /*页签名*/
      tabName:'many',
      /*保存查询到的参数*/
      paramsList:[],
      /*保存静态属性的数据*/
      onlyData:[],
      /*保存动态参数的数据*/
      manyData:[],
      /*控制添加参数对话框是否显示*/
      addParamsDialog: false,
      /*添加参数的表单数据*/
      addParamDt:{
        attr_name:''
      },
      /*添加参数表单规则*/
      addParamRule:{
        attr_name:[
          { required: true, message: "'请输入参数", trigger: 'blur' },
        ]
      },
      /*编辑对话框是否显示*/
      editDialog: false,
      /*保存编辑表单对象,attr_id,attr_name,attr_vals*/
      editDt:{},
      editRule:{
        attr_name:[
          { required: true, message: '请输入参数', trigger: 'blur' },
        ]
      }
    }
  },
  created(){
    this.getGoodsList()
  },
  methods:{
    /*获取商品分类数据列表*/
    async getGoodsList(){
      const {data} = await this.$http({
        url:'categories',
        method:'get'
      })
      if(data.meta.status !== 200){
        return this.$message.error('获取商品分类列表失败!')
      }
      this.goodsList = data.data
    },
    /*根据商品分类查询 动态参数\静态属性 列表*/
    async getData(){
      const {data} = await this.$http({
        url: `categories/${this.categoryId}/attributes`,
        method: 'get',
        params: {sel: this.tabName}
      })
      if(data.meta.status !== 200){
        return this.$message.error('获取参数列表失败')
      }
      /*获取 动态参数\静态属性 参数列表*/
      data.data.forEach( item =>{
        item.attr_vals = item.attr_vals ?item.attr_vals.split(" "):[]
        /*给参数项添加一个属性，控制动态编辑标签是否显示*/
        item.isShow = false
        /*给参数项添加一个属性，接收动态编辑标签输入的值*/
        item.inputValue = ''
      })
      /*根据页签不同，分别保存数据*/
      if(this.tabName === 'many'){
        this.manyData = data.data
      }
      if(this.tabName === 'only'){
        this.onlyData = data.data
      }
    },
    /*级联选择框监听事件*/
    goodsChange(){
      /*如果数组长度=3，就是三级分类，如果是*/
      if(this.selectGoodsKey.length !== 3){
        this.selectGoodsKey = []
        return
      }
      this.getData()
    },
    /*监听Tab页切换，不同的页面获取不同的数据*/
    tabClick(){
      this.getData()
    },
    /*监听关闭弹窗*/
    closeDialog(){
      this.$refs.addParamsRef.resetFields()
    },
    /*添加参数按钮*/
    showDialog(){
      this.addParamsDialog =true
    },
    /*提交 动态参数\静态属性*/
    addParamsSubmit(){
      this.$refs.addParamsRef.validate(async result =>{
        if(!result){
          return
        }
        const {data} = await this.$http({
          url:`categories/${this.categoryId}/attributes`,
          method:'post',
          data: {attr_name:this.addParamDt.attr_name, attr_sel:this.tabName}
        })
        if(data.meta.status !== 201){
          return this.$message.error('新增数据失败!')
        }
        this.getData()
        this.addParamsDialog = false
        this.$message.success('新增数据成功!')
      })
    },
    /*显示编辑对话框*/
    async showEditDialog(attrId){
      /*查询编辑对象的数据*/
      const {data} = await this.$http({
        url:`categories/${this.categoryId}/attributes/${attrId}`,
        method:'get',
        params:{attr_sel:this.tabName}
      })
      if(data.meta.status !== 200){
        return this.$message.error('获取编辑项数据失败!')
      }
      this.editDt = data.data
      this.editDialog = true
    },
    /*提交 动态参数/静态属性 编辑信息*/
    editSubmit(){
      this.$refs.editRef.validate(async result =>{
        if(!result){
          return
        }
        const {data} = await this.$http({
          url:`categories/${this.categoryId}/attributes/${this.editDt.attr_id}`,
          method:'put',
          data: {attr_name:this.editDt.attr_name, attr_sel:this.tabName,attr_vals:this.editDt.attr_vals}
        })
        /*如果不带上 attr_vals，修改之后，标签会丢失*/
        if(data.meta.status !== 200){
          return this.$message.error('修改数据失败!')
        }
        this.editDialog = false
        this.getData()
        this.$message.success('修改数据成功!')
      })
    },
    /*监听编辑对话框关闭*/
    closeEditDialog(){
      this.$refs.editRef.resetFields()
    },
    /*监听动态编辑标签*/
    async inputConfirm(row){
      if(row.inputValue.trim().length === 0){
        row.isShow = false
        row.inputValue=''
        return
      }
      /*将动态编辑标签输入的值，添加到参数标签组中*/
      row.attr_vals.push(row.inputValue.trim())
      row.isShow = false
      row.inputValue=''
      this.saveAttrVal(row)
    },
    /*提交动态编辑标签请求*/
    async saveAttrVal(row){
      /*提交api*/
      const {data} = await this.$http({
        url:`categories/${this.categoryId}/attributes/${row.attr_id}`,
        method:'put',
        data:{attr_sel: this.tabName, attr_vals: row.attr_vals.join(" "), attr_name: row.attr_name}
      })
      console.log("动态编辑标签{}",data)
      if(data.meta.status !== 200){
        return this.$message.error('添加参数属性失败!')
      }
      this.$message.success('添加参数属性成功!')
    },
    /*动态编辑标签获取焦点*/
    showInput(row){
      row.isShow = true
      this.$nextTick( _ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    /*删除参数的属性标签*/
    closeTag(i,row){
      /*splice 是响应式编程，是在原数组操作*/
      row.attr_vals.splice(i,1)
      this.saveAttrVal(row)
    }
  },
}
</script>

<style scoped>
  .el-row{
    margin: 15px 0;
  }
  .el-tag{
    margin: 5px;
  }
  .input-new-tag{
    width: 80px;
  }
</style>
