const routers = [
    {
        path: '/',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/list',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/list.vue'], resolve)
    },
    {
        path: '/create',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/create.vue'], resolve)
    },
    {
        path: '/app-3d',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/app-3d.vue'], resolve)
    }
];
export default routers;