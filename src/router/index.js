import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
    beforeEnter: (to, from, next) => {
      if (isAutentificated()) {
        next();
      } else {
        next("/");
      }
    },
  },
];

function isAutentificated() {
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    return true;
  } else {
    return false;
  }
}

const router = new VueRouter({
  routes,
});

export default router;
