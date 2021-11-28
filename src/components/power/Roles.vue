<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--添加角色-->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表-->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <!--权限插槽-->
          <template slot-scope="scope">
            <!--循环一级权限，一级菜单独占一行-->
            <el-row v-for="(first,index) in scope.row.children" :key="first.id" :class="['borderbottom',index ===0 ?'bordertop':'','verticalCenter']">
              <!-- 一级菜单列 -->
              <el-col :span="5">
                <el-tag closable @close="delRole(scope.row,first.id)">{{first.authName}}</el-tag>
                <!--向右的箭头-->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二、三级菜单列 -->
              <el-col :span="19">
                <!--循环二级菜单，二级菜单独占一行-->
                <el-row v-for="(second,i) in first.children" :key="second.id" :class="[ i===0 ?'':'bordertop','verticalCenter']">
                  <!-- 二级菜单 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="delRole(scope.row,second.id)">{{second.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级菜单，所有的三级菜单放在同一行 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(third,y) in second.children" :key="third.id" closable @close="delRole(scope.row,third.id)" >{{third.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="权限名称"></el-table-column>
        <el-table-column prop="roleDesc" label="权限名称"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="addRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加权限对话框-->
    <el-dialog title="添加角色权限" :visible.sync="addRightsDialog" width="30%">
      <el-tree :data="rights" :props="rightsTree" show-checkbox default-expand-all node-key="id" :default-checked-keys="defaultId" ref="TreeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRightsSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data(){
    return {
      /*保存角色列表数据*/
      roleList: [],
      /*角色权限对话框*/
      addRightsDialog: false,
      /*保存查询的所有权限*/
      rights:[],
      /*树形权限的配置*/
      rightsTree:{
        label:'authName',
        children:'children'
      },
      /*默认选中的权限id*/
      defaultId:[],
      /*选中的要添加的权限的key*/
      rightsKey:[],
      /*当前角色id*/
      roleId:''
    }
  },
  created () {
    /*组件创建时，立刻获取用户列表*/
    this.getRolesList()
  },
  methods:{
    /*获取角色列表*/
    async getRolesList(){
      const {data} = await this.$http({
        url:'roles',
        method:'get'
      })
      if(data.meta.status !== 200){
        this.$message.error('角色列表获取失败!')
      }
      this.roleList = data.data
    },
    /*角色权限删除*/
    async delRole(role,rightsid){
      const result = await this.$confirm('是否删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error=>{
        return error
      })
      if('confirm' !== result){
        this.$message.info('取消删除!')
      }
      const {data} = await this.$http({
        url:`roles/${role.id}/rights/${rightsid}`,
        method:'delete'
      })
      if(data.meta.status !== 200){
        this.$message.error('删除权限失败!')
      }
      /*删除成功，返回删除后的角色的权限对象，将新的权限对象赋值给 角色的 children*/
      role.children = data.data
      this.$message.success('删除成功')
    },

    /*添加权限弹窗*/
    async addRights(role){
      this.defaultId = []
      this.roleId = role.id
      const {data}= await this.$http({
        url:'rights/tree',
        method:'get'
      })
      if(data.meta.status !== 200){
        this.$message.error('获取权限列表失败!')
      }
      this.rights = data.data
      this.getid(role,this.defaultId)
      this.addRightsDialog = true
    },
    /*递归查找已有的权限id*/
    getid(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach( item => this.getid(item,arr))
    },
    /*提交新增的权限*/
    async addRightsSubmit(){
      const halfCheckedKeys = this.$refs.TreeRef.getHalfCheckedKeys()
      const checkedKeys = this.$refs.TreeRef.getCheckedKeys()
      const arr = [...halfCheckedKeys,...checkedKeys]
      const strId = arr.join(",")
      const {data} = await this.$http({
        url:`roles/${this.roleId}/rights`,
        method:'post',
        data: {rids:strId}
      })
      if(data.meta.status !== 200){
        this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.addRightsDialog = false
    }
  }
}
</script>

<style scoped>
  .el-tag{
    margin: 7px;
  }
  /*顶部边框线*/
  .bordertop{
    border-top: 1px solid #eee;
  }
  /*底部边框线*/
  .borderbottom{
    border-bottom: 1px solid #eee;
  }
  /*一二级权限居中显示*/
  .verticalCenter{
    display: flex;
    align-items: center;
  }
</style>
