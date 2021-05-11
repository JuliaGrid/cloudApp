import axios from "axios";

export default {
  state: {
    files: [],
    message: "",
    isMessage: false,
  },
  mutations: {
    updateFiles(state, files) {
      state.files = files;
    },
    updateMessage(state, message) {
      state.message = message;
    },
    updateIsMessage(state, boolean) {
      state.isMessage = boolean;
    },
  },
  actions: {
    fetchFiles: function(ctx) {
      let JWTToken = localStorage.getItem("authToken");
      axios
        .get("http://localhost:3000" + "/list", {
          headers: { "auth-token": `Bearer ${JWTToken}` },
        })
        .then((res) => {
          this.files = res.data;
          ctx.commit("updateFiles", res.data);
        })
        .catch((error) => console.log(error));
    },
    changeFile: function(ctx, name) {
      ctx.commit("updateMessage", "Переименование файла " + name);
      ctx.commit("updateIsMessage", true);
      let JWTToken = localStorage.getItem("authToken");
      axios
        .put(
          "http://localhost:3000" + "/file",
          { name: "Новое название файла" + "." + name.split(".")[1] },
          {
            headers: {
              "auth-token": `Bearer ${JWTToken}`,
            },
            params: {
              filename: name,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setTimeout(
              () =>
                ctx.commit(
                  "updateMessage",
                  "Файл " + name + " успешно переменован"
                ),
              2000
            );
          }
        })
        .catch(() =>
          ctx.commit("updateMessage", "Не удалось переименовать файл " + name)
        )
        .finally(() => {
          setTimeout(() => this.dispatch("fetchFiles"), 2000);
          setTimeout(() => ctx.commit("updateIsMessage", false), 5000);
        });
    },
    uploadFile(ctx, file) {
      ctx.commit("updateIsMessage", true);
      ctx.commit("updateMessage", "Загрузка файла " + file.name);
      let formData = new FormData();
      formData.append("file", file);
      let JWTToken = localStorage.getItem("authToken");
      axios
        .post(
          "http://localhost:3000" + `/file?filename=${file.name}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "auth-token": `Bearer ${JWTToken}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setTimeout(
              () =>
                ctx.commit(
                  "updateMessage",
                  "Файл " + file.name + " успешно загружен"
                ),
              2000
            );
          }
        })
        .catch(() =>
          ctx.commit("updateMessage", "Не удалось загрузить файл " + file.name)
        )
        .finally(() => {
          setTimeout(() => this.dispatch("fetchFiles"), 2000);
          setTimeout(() => ctx.commit("updateIsMessage", false), 5000);
        });
    },
    deleteFile: function(ctx, name) {
      ctx.commit("updateIsMessage", true);
      ctx.commit("updateMessage", "Удаление файла " + name);
      let JWTToken = localStorage.getItem("authToken");
      axios
        .delete("http://localhost:3000" + "/file", {
          headers: {
            "auth-token": `Bearer ${JWTToken}`,
          },
          params: {
            filename: name,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            setTimeout(
              () =>
                ctx.commit("updateMessage", "Файл " + name + " успешно удален"),
              2000
            );
          }
        })
        .catch(() =>
          ctx.commit("updateMessage", "Не удалось удалить файл " + name)
        )
        .finally(() => {
          setTimeout(() => this.dispatch("fetchFiles"), 2000);
          setTimeout(() => ctx.commit("updateIsMessage", false), 5000);
        });
    },
    downloadFile: function(ctx, name) {
      ctx.commit("updateIsMessage", true);
      ctx.commit("updateMessage", "Скачивание файла " + name);
      let JWTToken = localStorage.getItem("authToken");
      axios
        .get("http://localhost:3000" + "/file", {
          headers: {
            "auth-token": `Bearer ${JWTToken}`,
          },
          params: {
            filename: name,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = res.config.params.filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(
              () =>
                ctx.commit("updateMessage", "Файл " + name + " успешно скачан"),
              2000
            );
          }
        })
        .catch(() =>
          ctx.commit("updateMessage", "Не удалось скачать файл " + name)
        )
        .finally(() => {
          setTimeout(() => this.dispatch("fetchFiles"), 2000);
          setTimeout(() => ctx.commit("updateIsMessage", false), 5000);
        });
    },
  },
  getters: {
    allFiles(state) {
      return state.files;
    },
    message(state) {
      return state.message;
    },
    isMessage(state) {
      return state.isMessage;
    },
  },
};
