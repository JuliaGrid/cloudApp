import axios from "axios";
import router from "../router/index";

export default {
  state: {
    errors: [],
  },
  mutations: {
    updateErrors(state, errors) {
      state.errors = errors;
    },
  },
  actions: {
    signIn: function(ctx, form) {
      event.preventDefault();
      axios
        .post("http://localhost:3000/login", {
          login: form.email,
          password: form.password,
        })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("authToken", res.data);
            console.log("log");
            router.push("/about");
          }
        })
        .catch((error) => {
          ctx.commit("updateErrors", error.response.data);
        });
    },
    logout: function() {
      let JWTToken = localStorage.getItem("authToken");
      axios
        .post(
          "http://localhost:3000" + "/logout",
          {},
          {
            headers: { "auth-token": `Bearer ${JWTToken}` },
          }
        )
        .then(() => {
          localStorage.removeItem("authToken");
          router.replace("/");
        })
        .catch((error) => console.log(error));
    },
  },
  getters: {
    errors(state) {
      return state.errors;
    },
  },
};
