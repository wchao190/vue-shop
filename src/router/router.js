import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login = ()=>import('components/Login')
const Home = ()=>import('components/Home')
const Welcome =()=>import('components/Welcome')
const Users = ()=>import('components/user/Users')

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
      {path: 'welcome',component: Welcome},
      {path: '/users',component: Users}
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
