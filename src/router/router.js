import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login = ()=>import('components/Login')
const Home = ()=>import('components/Home')
const Welcome =()=>import('components/Welcome')
const Users = ()=>import('components/user/Users')
const Rights = ()=>import('components/power/Rights')
const Roles = ()=>import('components/power/Roles')
const Category =()=>import('components/goods/Category')
const GoodsParams = ()=>import('components/goods/GoodsParams')
const GoodsList = ()=>import('components/goods/GoodsList')
const AddGoods= ()=>import('components/goods/AddGoods')
const Orders = ()=>import('components/orders/Orders')
const Report =()=>import('components/report/Report')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children:[
      {path: '/home',redirect: 'welcome'},
      /*欢迎页*/
      {path: 'welcome',component: Welcome},
      /*用户列表*/
      {path: '/users',component: Users},
      /*权限列表*/
      {path: '/rights',component: Rights},
      /*角色列表*/
      {path:'/roles',component: Roles},
      /*商品分类*/
      {path:'/categories',component:Category},
      /*分类参数*/
      {path:'/params',component:GoodsParams},
      /*商品列表*/
      {path: '/goods',component: GoodsList},
      /*添加商品*/
      {path:'/goods/add',component:AddGoods },
      /*订单列表*/
      {path: '/orders',component: Orders},
      /*数据报表*/
      {path: '/reports',component: Report}
    ]
  }
]

const router = new VueRouter({
  routes
})

//添加路由导航守卫
router.beforeEach((to,from,next)=>{
  //如果目的路径是 /login 则放行;
  if(to.path === '/login'){
    return next()
  }
  //如果 token为空，跳转到登录页面
  const  tk = window.sessionStorage.getItem("token")
  if(!tk){
    return next('/login')
  }
  //其他放行
  next()
})

export default router
