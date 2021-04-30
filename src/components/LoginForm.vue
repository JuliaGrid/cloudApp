<template>
  <section>
    <div class="border-b border-gray-300 py-4">
      <img :src="image" class="m-auto" />
    </div>
    <div class="relative top-1/2">
      <h1 class="text-4xl font-bold">Облачное хранилище</h1>
      <p class="w-1/2 m-auto mt-9">
        Введите свою почту и пароль, чтобы начать работу в облачном хранилище
      </p>
      <form class="block m-auto mt-10">
        <input
          class="block bg-gray-200 rounded p-4 m-auto"
          type="name"
          size="40"
          placeholder="Введите вашу почту"
          v-model="form.email"
        />
        <p
          class="text-red-500"
          v-for="error in errors.login"
          v-bind:key="error.id"
        >
          {{ error }}
        </p>
        <input
          class="block bg-gray-200 rounded p-4 m-auto mt-4"
          type="password"
          size="40"
          placeholder="Введите ваш пароль"
          v-model="form.password"
        />
        <p
          class="text-red-500"
          v-for="error in errors.password"
          v-bind:key="error.id"
        >
          {{ error }}
        </p>

        <button
          class="block bg-blue-600 text-white rounded py-3 px-8 m-auto mt-10"
          v-on:click="signIn"
        >
          Войти
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import image from "../img/skillspace.svg";
import axios from "axios";
export default {
  name: "LoginForm",
  data() {
    return {
      mode: "signIn",
      form: {
        email: "",
        password: "",
      },
      errors: [],
      image,
    };
  },
  computed: {
    isSignInForm() {
      return this.mode === "signIn";
    },
  },
  methods: {
    signIn: function (event) {
      event.preventDefault();
      axios
        .post("http://localhost:3000/login", {
          login: this.form.email,
          password: this.form.password,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            localStorage.setItem("authToken", res.data);
            this.$router.push("/about");
          }
        })
        .catch((error) => {
          console.log(error.response);
          console.log(error.response.data);
          this.errors = error.response.data;
        });
    },
  },
};
</script>