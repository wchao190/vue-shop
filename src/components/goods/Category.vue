<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--分类按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCategory">添加分类</el-button>
        </el-col>
      </el-row>
      <!--列表区域-->
      <tree-table ref="table" sum-text="sum" :show-index="props.showIndex" index-text="序号" :data="catgoryList" :columns="categroyCol"
        :border="props.border" :selection-type="props.selectionType" :expand-type="props.expandType">
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color: #55a532" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: red" v-if="scope.row.cat_deleted === true"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">默认按钮</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">危险按钮</el-button>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination @size-change="categroySizeChange" @current-change="cateCurrentChange" :current-page="query.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!--添加商品分类对话框-->
    <el-dialog title="添加商品分类" :visible.sync="showAddCategory" width="30%" @close="closeDialog">
      <el-form label-width="80px" :model="categoryDt" :rules="categoryRule" ref="addCategoryRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="categoryDt.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父类">
          <el-cascader v-model="categoryVal" :options="parentCategory"
                       :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children'}"
                       @change="cateChange" :clearable="props.isClear" change-on-select="props.showAllLevels">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategorySubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data(){
    return{
      /*保存获取到的商品分类数据*/
      catgoryList:[],
      /*查询商品分类条件*/
      query:{
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      /*商品分类总数*/
      total:0,
      props:{
        border:true,
        selectionType:false,
        expandType:false,
        showIndex:true,
        isClear:true,
        showAllLevels: true
      },
      /*列的配置*/
      categroyCol:[
        {label:'分类名称',prop:'cat_name'},
        /*自定义模板列*/
        {label:'是否有效',prop:'cat_deleted',type:'template',template:'isOk'},
        {label:'排序',prop:'cat_level',type:'template',template:'sort'},
        {label:'操作',type:'template',template:'opt'},
      ],
      /*是否显示添加商品分类对话框*/
      showAddCategory:false,
      /*保存新增分类的数据*/
      categoryDt:{
        cat_name:'',
        //默认是一级分类
        cat_level: 0,
        //一级分类的父类id是0
        cat_pid: 0
      },
      /*添加分类数据校验*/
      categoryRule:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      /*保存父级分类信息*/
      parentCategory:[],
      /*保存选中的父级分类的id*/
      categoryVal:[]
    }
  },
  created () {
    this.getCategoryList()
  },
  methods:{
    /*查询商品分类数据*/
    async getCategoryList(){
      const {data} = await this.$http({
        url:'categories',
        method:'get',
        params: this.query
      })
      if(data.meta.status !== 200){
        this.$message.error('获取商品分类信息失败!')
      }
      this.catgoryList = data.data.result
      this.total = data.data.total
    },
    /*监听分页条数变化*/
    categroySizeChange(newVal){
      this.query.pagesize = newVal
      this.getCategoryList()
    },
    /*监听页码变化*/
    cateCurrentChange(newSize){
      this.query.pagenum = newSize
      this.getCategoryList()
    },
    /*添加商品分类*/
    async addCategory(){
      const {data} = await this.$http({
        url:'categories',
        method:'get',
        params:{type:2}
      })
      if(data.meta.status !== 200){
        this.$message.error('获取父级分类信息失败!')
      }
      this.parentCategory = data.data
      this.showAddCategory =true
    },
    /*监听父级分类选择框*/
    cateChange(){
      /*如果 大于0，就不是一级菜单；等于0就是一级菜单*/
      if(this.categoryVal.length > 0){
        /*等级：一级是0，二级是1，三级是2；如果数组有两个值，新增的分类等级就是3，有一个值，新增的分类等级就是2*/
        this.categoryDt.cat_level = this.categoryVal.length
        /*数组中存放的就是父级，取最后一层等级*/
        this.categoryDt.cat_pid = this.categoryVal[this.categoryVal.length-1]
      }else{
        this.categoryDt.cat_level = 0
        this.categoryDt.cat_pid = 0
      }
    },
    /*提交新增分类数据*/
    addCategorySubmit(){
      console.log(this.categoryDt)
      this.$refs.addCategoryRef.validate(async val =>{
        if(!val){
          return
        }
        const {data} = await this.$http({
          url:'categories',
          method:'post',
          data: this.categoryDt
        })
        console.log(data)
        if(data.meta.status !== 201){
          return this.$message.error('新增分类失败!')
        }
        this.getCategoryList()
        this.showAddCategory=false
        this.$message.success('新增分类成功!')
      })
    },
    /*关闭对话框，重置表单*/
    closeDialog(){
      this.$refs.addCategoryRef.resetFields()
      this.categoryVal = []
      this.categoryDt.cat_level =0
      this.categoryDt.cat_pid =0
    }
  }
}
</script>

<style scoped>

</style>
