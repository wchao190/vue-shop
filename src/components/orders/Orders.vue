<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图去-->
    <el-card>
      <!--搜索框-->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchInfo">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--订单列表区域-->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="120px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.pay_status === 1" size="mini">已付款</el-button>
            <el-button type="warning" v-else size="mini">未付款</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog">编辑地址</el-button>
          <el-button type="success" icon="el-icon-map-location" size="mini" @click="showProcess">查看物流</el-button>
        </el-table-column>
      </el-table>
      <!--底部分页-->
      <el-pagination @size-change="orderSizeChange" @current-change="orderCurrentChange"
        :current-page="query.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="query.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

      <!--修改地址弹窗-->
      <el-dialog title="修改收货地址" :visible.sync="isShow" width="50%" @close="closeAddr">
        <el-form ref="addrFormRef" :model="addressForm" label-width="100px" :rules="addrFormRule">
          <el-form-item label="省市区/县" prop="address">
            <el-cascader v-model="addressForm.address" :options="citydata" @change="handleChange" clearable
                         :props="{ expandTrigger: 'hover'}">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detail">
            <el-input v-model="addressForm.detail"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import citydata from './citydata'
export default {
  name: 'Orders',
  data(){
      return {
        citydata: citydata,
        searchInfo:'',
        /*订单列表查询条件*/
        query:{
          query:'',
          pagenum: 1,
          pagesize: 10
        },
        /*订单列表*/
        ordersList:[],
        /*订单总数*/
        total:0,
        /*是否显示修改地址弹窗*/
        isShow: false,
        /*保存修改的地址信息*/
        addressForm:{
          address:[],
          detail:''
        },
        /*地址表单校验规则*/
        addrFormRule:{
          address:[
            { required: true, message: '请选择省市区/县', trigger: 'blur' }
          ],
          detail: [
            { required: true, message: '请输入详细收货地址', trigger: 'blur' }
          ]
        },
        /*快递信息*/
        processInfo:[]
      }
  },
  created () {
      this.getOrderList()
  },
  methods:{
    /*订单列表数据获取*/
    async getOrderList(){
      const {data}= await this.$http({
        url:'orders',
        method:'get',
        params:this.query
      })
      console.log(data)
      if(data.meta.status !== 200){
        return this.$message.error('订单列表查询失败!')
      }
      this.ordersList = data.data.goods
      this.total = data.data.total
      this.$message.success('订单列表查询成功!')
    },
    /*监听分页条数变化*/
    orderSizeChange(newSize){
      this.query.pagesize = newSize
      this.getOrderList()
    },
    /*监听当前页码变化*/
    orderCurrentChange(newPageNum){
      this.query.pagenum = newPageNum
      this.getOrderList()
    },
    /*编辑地址*/
    showDialog(){
      this.isShow = true
    },
    /**/
    handleChange(val){
      console.log(val)
    },
    /*监听关闭对话框*/
    closeAddr(){
      this.$refs.addrFormRef.resetFields()
    },
    /*查询物流进度*/
    async showProcess(){
      const {data} = await this.$http({
        url:'/kuaidi/804909574412544580',
        method:'get'
      })
      if(data.meta.status !== 200){
        return this.$message.error('快递查询失败!')
      }
      this.processInfo = data.data
    }
  }
}
</script>

<style scoped>
  .el-cascader{
    width: 100%;
  }
</style>
