<template>
  <section>
    <div class="border-b border-gray-300 py-4">
      <img :src="image" class="m-auto" />
    </div>
    <div class="relative top-1/2 mt-10 mb-5">
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
          class="block outline-none bg-blue-600 text-white rounded py-3 px-8 m-auto mt-10"
          v-on:click="signIn(form)"
        >
          Войти
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import image from "../img/skillspace.svg";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "LoginForm",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      image,
    };
  },
  computed: mapGetters(["errors"]),
  methods: mapActions(["signIn"]),
};
</script>