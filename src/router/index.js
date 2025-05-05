import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/user',
    component: () => import('@/views/user/UserLayout.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/user/Subpage/UserHomeView.vue')
      },
      {
        path: 'serviceList',
        component: () => import('@/views/user/Subpage/AppointmentView.vue')
      },
      {
        path: 'serviceNursinghome',
        component: () => import('@/views/user/Subpage/NursinghomeView.vue')
      },
      {
        path: 'healthFiles',
        component: () => import('@/views/user/Subpage/HealthFilesView.vue')
      },
      {
        path: 'healthIndex',
        component: () => import('@/views/user/Subpage/HealthIndexView.vue')
      },
      {
        path: 'activityList',
        component: () => import('@/views/user/Subpage/ActivityView.vue')
      },
      {
        path: 'activityRegistration',
        component: () => import('@/views/user/Subpage/ActivityRegistrationView.vue')
      },
      {
        path: 'comment',
        component: () => import('@/views/user/Subpage/CommentView.vue')
      }
    ]
  },
  {
    path: '/manager',
    name: 'manager',
    component: () => import('@/views/sysadmin/ManagerView.vue'),
    children: [
      {
        path: 'homeView',
        component: () => import('@/views/sysadmin/Subpage/homeView.vue')
      },
      {
        path: 'UserManager',
        component: () => import('@/views/sysadmin/Subpage/UserManagerView.vue')
      },
      {
        path: 'LoginLogView',
        component: () => import('@/views/sysadmin/Subpage/LoginLogView.vue')
      },
      {
        path: 'NursinghomeView',
        component: () => import('@/views/sysadmin/Subpage/NursinghomeView.vue')
      },
      {
        path: 'ServiceView',
        component: () => import('@/views/sysadmin/Subpage/ServiceView.vue')
      },
      {
        path: 'AppointmentView',
        component: () => import('@/views/sysadmin/Subpage/AppointmentView.vue')
      },
      {
        path: 'NewsView',
        component: () => import('@/views/sysadmin/Subpage/NewsView.vue')
      },
      {
        path: 'ActivityView',
        component: () => import('@/views/sysadmin/Subpage/ActivityView.vue')
      },
      {
        path: 'ActivityRegistrationView',
        component: () => import('@/views/sysadmin/Subpage/ActivityRegistrationView.vue')
      },
      {
        path: 'AnnouncementView',
        component: () => import('@/views/sysadmin/Subpage/AnnouncementView.vue')
      },
      {
        path: 'IssuesView',
        component: () => import('@/views/sysadmin/Subpage/IssuesView.vue')
      },
      {
        path: 'CommentView',
        component: () => import('@/views/sysadmin/Subpage/CommentView.vue')
      },
      {
        path: 'HealthFilesView',
        component: () => import('@/views/sysadmin/Subpage/HealthFilesView.vue')
      },
      {
        path: 'HealthIndexView',
        component: () => import('@/views/sysadmin/Subpage/HealthIndexView.vue')
      },
      // NavBarStaff 子路由
      { path: 'homeViewNavBarStaff', component: () => import('@/views/staff/Subpage/homeView.vue') },
      { path: 'UserManagerNavBarStaff', component: () => import('@/views/staff/Subpage/UserManagerView.vue') },
      { path: 'LoginLogViewNavBarStaff', component: () => import('@/views/staff/Subpage/LoginLogView.vue') },
      { path: 'NursinghomeViewNavBarStaff', component: () => import('@/views/staff/Subpage/NursinghomeView.vue') },
      { path: 'ServiceViewNavBarStaff', component: () => import('@/views/staff/Subpage/ServiceView.vue') },
      { path: 'AppointmentViewNavBarStaff', component: () => import('@/views/staff/Subpage/AppointmentView.vue') },
      { path: 'NewsViewNavBarStaff', component: () => import('@/views/staff/Subpage/NewsView.vue') },
      { path: 'ActivityViewNavBarStaff', component: () => import('@/views/staff/Subpage/ActivityView.vue') },
      { path: 'ActivityRegistrationViewNavBarStaff', component: () => import('@/views/staff/Subpage/ActivityRegistrationView.vue') },
      { path: 'AnnouncementViewNavBarStaff', component: () => import('@/views/staff/Subpage/AnnouncementView.vue') },
      { path: 'IssuesViewNavBarStaff', component: () => import('@/views/staff/Subpage/IssuesView.vue') },
      { path: 'CommentViewNavBarStaff', component: () => import('@/views/staff/Subpage/CommentView.vue') },
      { path: 'HealthFilesViewNavBarStaff', component: () => import('@/views/staff/Subpage/HealthFilesView.vue') },
      { path: 'HealthIndexViewNavBarStaff', component: () => import('@/views/staff/Subpage/HealthIndexView.vue') },
      // NavBarComadmin 子路由
      { path: 'homeViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/homeView.vue') },
      { path: 'UserManagerNavBarComadmin', component: () => import('@/views/comadmin/Subpage/UserManagerView.vue') },
      { path: 'LoginLogViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/LoginLogView.vue') },
      { path: 'NursinghomeViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/NursinghomeView.vue') },
      { path: 'ServiceViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/ServiceView.vue') },
      { path: 'AppointmentViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/AppointmentView.vue') },
      { path: 'NewsViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/NewsView.vue') },
      { path: 'ActivityViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/ActivityView.vue') },
      { path: 'ActivityRegistrationViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/ActivityRegistrationView.vue') },
      { path: 'AnnouncementViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/AnnouncementView.vue') },
      { path: 'IssuesViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/IssuesView.vue') },
      { path: 'CommentViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/CommentView.vue') },
      { path: 'HealthFilesViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/HealthFilesView.vue') },
      { path: 'HealthIndexViewNavBarComadmin', component: () => import('@/views/comadmin/Subpage/HealthIndexView.vue') },
    ]
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('../views/MapPage.vue')
  },
  /* {
    path: '/index', // 修改为以 / 开头
    name: 'Index',
    component: Index,
    children: [
      {
          path: '/index/', // 子路由路径不需要再重复父路由的 /index，因为会自动拼接
          component: Dpksh
      },
      {
          path: 'Fw', // 子路由路径不需要再重复父路由的 /index，因为会自动拼接
          component: fw
      },
      {
          path: 'Yhqx', // 同理
          component: Yhqx
      },
      {
          path: 'Yhxx', // 同理
          component: Yhxx
      },
      {
          path: 'Ylyxx', // 同理
          component: Ylyxx
      },
      {
          path: 'Tz', // 同理
          component: Tz
      },
      {
          path: 'Xw', // 同理
          component: Xw
      },
      {
          path: 'Rz', // 同理
          component: Rz
      },
      {
          path: 'Gyhd', // 同理
          component: Gyhd
      },
      {
          path: 'Jkda', // 同理
          component: Jkda
      },
    ]
  } */
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
