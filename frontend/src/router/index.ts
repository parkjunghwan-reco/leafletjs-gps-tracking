import {createRouter, createWebHashHistory, Router, RouteRecordRaw} from "vue-router";
import App from "../App.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "",
        name: "Main",
        component: App,
    },
];

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition): any {
        if (savedPosition) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(savedPosition);
                }, 500);
            });
        }
        return {
            top: 0,
            left: 0,
        };
    },
});
export default router;