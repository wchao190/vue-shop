<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--警告信息-->
      <el-alert title="添加商品" type="info" :closable="false" show-icon center></el-alert>
      <!--步骤条-->
      <el-steps :space="200" finish-status="success" align-center :active="index - 0">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--各Tab面板的表单-->
      <el-form :model="addForm" label-position="top" ref="addFormRef" :rules="addFormRule" label-width="100px">
        <!--Tab 标签栏-->
        <el-tabs :tab-position="'left'" v-model="index" :before-leave="beforeLeaveTab" @tab-click="tabChange">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_cat" label="商品分类">
              <el-cascader v-model="addForm.goods_cat" :options="categoryList"
                           :props="{ expandTrigger: 'hover',label:'cat_name', value:'cat_id',children:'children'}"
                           @change="handleChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--复选框组-->
            <el-form-item v-for="item in categoryParamsList" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="name" v-for="(name,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in goodsPrototype" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals" clearable></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload/" :headers="headerObj"
              :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods">提交</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!--图片预览窗口-->
      <el-dialog title="图片预览" :visible.sync="showImageDialog" width="30%">
        <img :src="imgPath" alt="" style="width: 100%">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: "AddGoods",
  data(){
    return{
      index:'0',
      /*商品分类列表*/
      categoryList:[],
      /*商品参数列表*/
      categoryParamsList:[],
      /*添加商品表单数据*/
      addForm:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        /*分类id*/
        goods_cat:[],
        /*商品图片对象*/
        pics:[],
        /*富文本*/
        goods_introduce:'',
        /*商品参数，动态参数、静态属性*/
        attrs:[]
      },
      /*添加商品表单校验规则*/
      addFormRule:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number:[
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat:[
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      /*商品属性*/
      goodsPrototype:[],
      /*上传图片请求头*/
      headerObj:{
        Authorization: window.sessionStorage.getItem('token')
      },
      /*图片预览path*/
      imgPath:'',
      /*图片预览窗口是否显示*/
      showImageDialog: false
    }
  },
  created () {
    /*商品分类列表*/
    this.getCategoryList()
  },
  computed:{
    /*分类id*/
    categoryId(){
      if(this.addForm.goods_cat.length !== 3){
        return null
      }
      return this.addForm.goods_cat[this.addForm.goods_cat.length-1]
    }
  },
  methods:{
    /*查询商品分类列表*/
    async getCategoryList(){
      const {data} = await this.$http({
        url:'categories',
        method:'get'
      })
      if(data.meta.status !== 200){
        return this.$message.error('获取商品分类列表失败!')
      }
      this.categoryList = data.data
    },
    /*监听商品分类级联选择框变化*/
    handleChange(){
      if(this.addForm.goods_cat.length !== 3){
        this.addForm.goods_cat=[]
      }
    },
    /*Tab切换判断*/
    beforeLeaveTab(toTab,fromTab) {
      if(fromTab === '0' && this.addForm.goods_cat.length !==3 && this.addForm.goods_weight <0
        && this.addForm.goods_number <0 && this.addForm.goods_price <0 && this.addForm.goods_name.trim().length <0){
        this.$message.error('参数为空!')
        return false
      }
    },
    /*Tab 切换时发起请求获取数据*/
    async tabChange(){
      /*获取商品参数列表*/
      if( this.index === '1'){
        const {data} = await this.$http({
          url:`categories/${this.categoryId}/attributes`,
          method:'get',
          params: {sel:'many'}
        })
        if(data.meta.status !== 200){
          return this.$message.error('获取分类列表失败!')
        }
        console.log("商品参数=>{}",data)
        /*商品参数是一个数组, 参数的属性是attr_vals, 是一个字符串, 有多个值, 将其转成数组, 并重新赋值给这个参数项*/
        data.data.forEach(item =>{
          item.attr_vals = item.attr_vals.length ===0 ? [] : item.attr_vals.split(' ')
        })
        this.categoryParamsList = data.data
      /*获取商品属性*/
      }else if(this.index === '2'){
        const {data} = await this.$http({
          url:`categories/${this.categoryId}/attributes`,
          method:'get',
          params: {sel:'only'}
        })
        if(data.meta.status !== 200){
          return this.$message.error('获取商品属性失败!')
        }
        console.log("商品属性=>{}",data)
        /*商品属性就是一个数组，不需要转换*/
        this.goodsPrototype = data.data
      }
    },
    /*图片预览*/
    handlePreview(file){
      console.log(file)
      const imgage = file.response.data.url
      this.imgPath = imgage
      this.showImageDialog = true
    },
    /*处理删除图片*/
    handleRemove(file){
      const val = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex( item =>{
          item.pic === val
        })
      this.addForm.pics.splice(i,1)
    },
    /*图片上传成功后的操作*/
    handleSuccess(resp){
      if(resp.meta.status !== 200){
        return this.$message.error('上传图片失败!')
      }
      const info = { pic: resp.data.tmp_path}
      this.addForm.pics.push(info)
    },
    /*添加商品*/
    addGoods(){
      this.$refs.addFormRef.validate(async  result =>{
        if(!result){
          return this.$message.error('必填项不能为空!')
        }
        /*业务逻辑处理*/
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        /*将商品参数转成对象存到 attrs属性中*/
        this.categoryParamsList.forEach( item =>{
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(',')}
          this.addForm.attrs.push(newInfo)
        })
        /*将商品属性转成对象存到 attrs属性中*/
        this.goodsPrototype.forEach( item =>{
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
          this.addForm.attrs.push(newInfo)
        })
        /*将原form对象的属性赋值给拷贝的form*/
        form.attrs = this.addForm.attrs
        /*发起添加商品请求*/
        const {data} = await this.$http({
          url:'goods',
          method:'post',
          data:form
        })
        if (data.meta.status !== 201){
          this.$message.error('添加商品失败!')
        }
        this.$router.push('/goods')
        this.$message.success('添加商品成功!')
      })
    }
  }
}
</script>
<style scoped>
  .el-steps{
    margin: 15px 0;
  }
  .el-checkbox{
    margin: 0 5px 0 0 !important;
  }
  .el-button{
    margin-top: 15px;
  }
</style>
