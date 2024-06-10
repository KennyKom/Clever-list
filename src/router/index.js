import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/Main.vue";
import SignInPage from "../pages/SignIn.vue";
import SignUpPage from "../pages/SignUp.vue";
import TaskByIdPage from "../pages/TaskById.vue";
import TaskCreationPage from "../pages/TaskCreation.vue";
import store from "@/store";

const routes = [
  {
    path: "/",
    component: MainPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/sign-in",
    component: SignInPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/sign-up",
    component: SignUpPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/tasks/:id",
    component: TaskByIdPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/tasks/create-new-task",
    component: TaskCreationPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userUid = store.state.userData.userUid;

  if (to.meta.requiresAuth) {
    !userUid ? next("/sign-in") : next();
  } else {
    userUid ? next("/") : next();
  }
});

export default router;
