<template>
  <!--  主页-->
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width=" isCollapse ? `64px` :`200px`">
        <div class="toggle-button" @click="taggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened
                 :collapse="isCollapse" :collapse-transition="istransition" router :default-active="activePath">
          <!-- 一级菜单-->
          <el-submenu :index="`/`+item.path" v-for="item in menulist" :key="item.id">
            <!--一级菜单模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="icons[item.id]"></i>
              <!--菜单名-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="`/`+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="selected(`/`+subitem.path)">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--二级菜单名-->
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边区域 -->
      <el-main>

        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return {
        isCollapse: false,
        istransition:false,
        activePath:'',
        menulist: [],
        icons:{
          '125':'iconfont icon-users',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao'
        }
      }
    },
    created () {
        //生命周期函数，在组件创建完成的时候就去获取获取数据
        this.getMenuList(),
          /*在组件创建时，将sessionStorage中保存的index 的值赋值给变量*/
        this.activePath = window.sessionStorage.getItem('actived')
    },
    methods:{
      logout(){
        window.sessionStorage.clear()
        this.$router.push("/login")
      },
      async getMenuList(){
        const {data} = await this.$http.get('/menus')
        if(data.meta.status !== 200){
          this.$message.error(data.meta.msg)
        }
        //将值传递给 data()中的数据
        this.menulist = data.data
      },
      taggleCollapse(){
        this.isCollapse = !this.isCollapse;
      },
      /*二级菜单选中时，将path路径保存到 sessionStorage中，同时，将index的值赋值给变量*/
      selected(param){
        window.sessionStorage.setItem('actived',param)
        this.activePath = param
      }
    }
  }
</script>

<style scoped>
  .home-container{
    height: 100%;
  }
  /*头部布局*/
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    font-size: 20px;
  }
  /*系统名字与logo上下居中对齐*/
  .el-header>div{
    display: flex;
    align-items: center;
  }
  /*系统名字与logo间隔15px*/
  .el-header>div>span{
    margin-left: 15px;
  }
  /*左侧栏*/
  .el-aside{
    background-color: #333744;
  }
  /*将一级菜单图标与文字间隔10px*/
  .iconfont{
    margin-right: 10px;
  }
  /*将菜单区域右边框置为空*/
  .el-menu{
    border-right: none;
  }
  /*折叠与展开按钮*/
  .toggle-button{
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
  }
  /*右侧栏*/
  .el-main{
    background-color: #eaedf1;
  }
</style>
