<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <!--搜索框区域-->
      <el-row :gutter="20">
        <!--用户搜索框-->
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear="queryAll" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
          </el-input>
        </el-col>
        <!--添加用户-->
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!--列表区域-->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <!--状态的渲染-->
        <el-table-column prop="mg_state" label="状态" width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="updateState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!--插槽形式自定义列的渲染-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改按钮，事件方法传入参数id-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editBtn(scope.row.id)"></el-button>
            <!--删除按钮-->
            <el-button type="warning" icon="el-icon-delete" size="mini" @click="delUser(scope.row.id)"></el-button>
            <!--分配角色按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--添加用户弹窗-->
      <el-dialog title="新增用户" :visible.sync="dialogVisible" width="30%" @close="resetForm">
        <!--内容区-->
        <el-form class="add_user" :model="addUserForm" :rules="addUserRule" ref="addUserRef" label-width="70px">
          <!--用户名-->
          <el-form-item prop="username" label="用户名">
            <el-input placeholder="请输入用户名" v-model="addUserForm.username"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password" label="密码">
            <el-input placeholder="请输入密码" v-model="addUserForm.password" type="password"></el-input>
          </el-form-item>
          <!--邮箱-->
          <el-form-item prop="email" label="邮箱">
            <el-input placeholder="请输入邮箱" v-model="addUserForm.email"></el-input>
          </el-form-item>
          <!--手机号-->
          <el-form-item prop="mobile" label="手机号">
            <el-input placeholder="请输入手机号" v-model.number="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addBtn">确 定</el-button>
        </span>
      </el-dialog>
      <!--编辑对话框区域-->
      <el-dialog title="编辑用户信息" :visible.sync="isShowEdit" width="30%" @close="resetEditForm">
        <el-form ref="eidtFormRef" :model="editForm" label-width="70px" :rules="editFormRule">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowEdit = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!--分配角色弹窗-->
    <el-dialog title="分配角色" :visible.sync="isShowRole" width="30%" @close="clearOption">
      <el-form ref="roleRef" :model="userInfo" label-width="100px">
        <el-form-item label="当前用户：">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色：">
          <el-input v-model="userInfo.role_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配角色：">
          <el-select v-model="value" placeholder="请选择角色">
            <el-option v-for="item in rolesList" :label="item.roleName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowRole = false">取 消</el-button>
        <el-button type="primary" @click="setRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data(){
    /*邮箱校验规则*/
    var checkEmail = (rule,val,callback)=>{
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if(regEmail.test(val)){
        return callback()
      }
      callback(new Error('请输入合法的邮箱!'))
    }
    /*手机号校验规则*/
    var checkMobile = (rule,val,callback)=>{
      const regMobile = /^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$/
      if(regMobile.test(val)){
        return callback()
      }
      callback(new Error('请输入合法的手机号!'))
    }
    return{
      /*用户列表查询条件*/
      queryInfo:{
        query: '',
        /*页码*/
        pagenum: 1,
        /*每页条数*/
        pagesize: 5
      },
      userList: [],
      total: 0,
      /*是否显示添加用户弹窗*/
      dialogVisible: false,
      /*是否显示修改用户信息弹窗*/
      isShowEdit: false,
      /*保存添加用户的数据*/
      addUserForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      /*添加用户校验*/
      addUserRule:{
        username:[
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
      /*保存编辑用户的数据*/
      editForm:{ },
      /*编辑校验规则*/
      editFormRule:{
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      /*是否显示分配角色弹窗*/
      isShowRole: false,
      /*当前用户信息*/
      userInfo:{},
      /*角色列表*/
      rolesList:[],
      /*选中的角色id*/
      value:''
    }
  },
  created () {
    /*组件创建时，调用方法去查询用户数据*/
    this.getUserList()
  },
  methods:{
    /*获取用户角色列表*/
    async getUserList(){
      const {data} = await this.$http({
        url: 'users',
        method: 'get',
        params: this.queryInfo
      })
      if(data.meta.status !== 200){
        this.$message.error("获取用户列表信息失败！")
      }
      this.userList = data.data.users,
        this.total = data.data.total
    },
    /*监听 pageSize 改变事件*/
    handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize,
        this.getUserList()
    },
    /*监听 页码值 改变事件*/
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage,
        this.getUserList()
    },
    /*监听用户状态*/
    async updateState(info){
      const {data} = await this.$http({
        url: `users/${info.id}/state/${info.mg_state}`,
        method: 'put'
      })
      if(data.meta.status !== 200){
          info.mg_state = !info.mg_state,
            /*点击开关修改状态时，如果数据库更新失败，再将状态还原*/
          this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    /*监听搜索框*/
    queryAll(){
      this.getUserList()
    },
    /*监听查询按钮*/
    queryUser(){
      this.getUserList()
    },
    /*添加用户*/
    addUser(){
      this.dialogVisible = true
    },
    /*监听对话框关闭*/
    resetForm(){
      this.$refs.addUserRef.resetFields()
    },
    /*监听提交按钮*/
    addBtn(){
      this.$refs.addUserRef.validate(async (result)=>{
        if(!result){
          return
        }
        const {data} = await this.$http({
          url:"users",
          method:"post",
          data:this.addUserForm
        })
        if(data.meta.status !==201){
          this.$message.error('新增用户失败!')
        }
        this.$message.success('新增用户成功!')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    /*监听编辑用户*/
    async editBtn(id){
      this.isShowEdit= true
      const {data} = await this.$http({
        url:'users/'+id,
        method:'get',
        data:this.editForm
      })
      if(data.meta.status !== 200){
        this.$message.error('获取用户信息失败!')
      }
      this.editForm = data.data
    },
    /*监听修改弹窗重置表单*/
    resetEditForm(){
      this.$refs.eidtFormRef.resetFields()
    },
    /*监听编辑提交*/
    editSubmit(){
      /*预验证*/
      this.$refs.eidtFormRef.validate(async (result)=>{
        if(!result){
          return
        }
        const {data} = await this.$http({
          url:'users/'+this.editForm.id,
          method:'put',
          data:{email:this.editForm.email,mobile:this.editForm.mobile}
        })
        if(data.meta.status !== 200){
          this.$message.error('修改用户信息失败!')
        }
        /*关闭对话框*/
        this.isShowEdit = false
        /*刷新列表*/
        this.getUserList()
        this.$message.success('修改用户信息成功!')
      })
    },
    /*监听删除用户*/
    async delUser(id){
      const resp = await this.$confirm('是否删除该用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error=>{
        return error
      })
      if( 'confirm' !== resp){
        this.$message.info('取消删除!')
      }
      const {data} = await this.$http({
        url:'users/'+id,
        method:'delete'
      })
      if(data.meta.status !== 200){
        this.$message.error('删除失败!')
      }
      this.getUserList()
      this.$message.success('删除成功!')
    },
    /*给用户分配角色*/
    async setRole(info){
      /*获取当前用户信息*/
      this.userInfo = info
      /*获取角色列表*/
      const {data} = await this.$http({
        url:'roles',
        method:'get'
      })
      if(data.meta.status !== 200){
        this.$message.error('获取角色列表失败!')
      }
      this.rolesList = data.data
      /*打开弹窗*/
      this.isShowRole = true
    },
    /*提交分配的角色*/
    async setRoleSubmit(){
      /*判断是否选中角色*/
      if(!this.value){
        return this.$message.error('角色不能为空!')
      }
      const {data} = await this.$http({
        url:`users/${this.userInfo.id}/role`,
        method:'put',
        data:{rid:this.value}
      })
      if(data.meta.status !== 200){
        this.$message.error('分配角色失败!')
      }
      this.getUserList()
      this.isShowRole =false
      this.$message.success('分配角色成功!')
    },
    /*清除对话框下拉选项缓存信息*/
    clearOption(){
      this.value=''
    }
  }
}
</script>

<style scoped>

</style>
