import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem, Input, Message,Container,Header,Aside,Main,
         Menu, Submenu,MenuItemGroup,MenuItem,Breadcrumb,BreadcrumbItem,Card,
        Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,Tag,Tree,
        Select,Option,Cascader}
from 'element-ui'
import { MessageBox } from 'element-ui';

Vue.use(Button)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
