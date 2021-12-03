<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--搜索区域、添加按钮区域-->
      <el-row :gutter="20">
        <!--搜索框-->
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="query.query" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!--添加按钮-->
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!--列表区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="100px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete"size="mini" @click="removeGoods(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页导航区-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="query.pagenum" :page-sizes="[10, 20, 30, 40]"
        :page-size="query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "GoodsList",
  data(){
    return {
      /*查询商品列表数据条件*/
      query:{
        query:'',
        pagenum: 1,
        pagesize: 10
      },
      /*保存商品列表数据*/
      goodsList: [],
      /*商品总条数*/
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },

  methods:{
    /*查询商品列表数据*/
    async getGoodsList(){
      const {data} = await this.$http({
        url:'goods',
        method:'get',
        params: this.query
      })
      if(data.meta.status !== 200){
        return this.$message.error('查询数据失败!')
      }
      this.goodsList = data.data.goods
      this.total = data.data.total
      this.$message.success('查询数据成功!')
      console.log(data)
    },
    /*监听分页条数变化*/
    handleSizeChange(val){
      this.query.pagesize =val
      this.getGoodsList()
    },
    /*监听页码变化*/
    handleCurrentChange(val){
      this.query.pagenum = val
      this.getGoodsList()
    },
    /*删除商品*/
    async removeGoods(id){
      const result = await this.$confirm('确认删除该商品?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).catch(error =>{
                    return error
                  })
      console.log(result)
      if(result !== 'confirm'){
        return this.$message.info('已经取消删除!')
      }
      const {data} = await this.$http({
        url:`goods/${id}`,
        method:'delete'
      })
      console.log(data)
      if(data.meta.status !== 200){
        return this.$message.error('删除失败!')
      }
      this.getGoodsList()
      this.$message.success('删除成功!')
    },
    /*添加商品*/
    addGoods(){
      this.$router.push("/goods/add")
    }
  }
}
</script>

<style scoped>

</style>
