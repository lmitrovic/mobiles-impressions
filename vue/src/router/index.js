import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Mobile from "@/views/Mobile";
import NewMobile from "@/views/NewMobile";
import Comments from "@/views/Comments";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import EditComment from "../views/EditComment.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/edit',
    name: 'newMobile',
    component: NewMobile
  },
  {
    path: '/comments',
    name: 'comments',
    component: Comments
  },
  {
    path: '/mobile/:id',
    name: 'mobile',
    component: Mobile
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUp
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/editComment/:id",
    name: "EditComment",
    component: EditComment
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
