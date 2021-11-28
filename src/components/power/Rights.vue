<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图，展示搜索框、列表项、翻页-->
    <el-card class="rights-card" >
      <!--列表数据-->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="info" v-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data(){
    return {
      rightsList:[]
    }
  },
  created () {
    this.getRightsList()
  },
  methods:{
    async getRightsList(){
      const {data} = await this.$http({
        url: 'rights/list',
        method: 'get'
      })
      if(data.meta.status !== 200){
        this.$message.error('获取权限列表失败!')
      }
      this.rightsList = data.data
    }
  }
}
</script>

<style scoped>

</style>
