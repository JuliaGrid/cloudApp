import axios from "axios";

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
      axios
        .post("http://localhost:3000/login", {
          login: form.email,
          password: form.password,
        })
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("authToken", res.data);
            location.replace(window.location.origin + "/about");
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
          location.replace(window.location.origin);
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
