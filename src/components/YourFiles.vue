<template>
  <div>
    <div class="border-b border-gray-300 py-4">
      <div class="flex justify-between w-2/3 m-auto">
        <img :src="image" />
        <button class="flex items-center">
          <img :src="imgExit" class="w-5 mr-2" />
          <span class="font-bold" v-on:click="logout">выйти</span>
        </button>
      </div>
    </div>
    <div class="m-auto w-2/3">
      <h2 class="text-left font-bold text-3xl">Ваши файлы</h2>
      <input
        type="file"
        class="file__button flex mt-5"
        id="file__button"
        ref="file"
        v-on:change="handleFileUpload"
      />
      <label class="file__label" for="file__button">Добавить</label>

      <div>
        <table class="mt-8 w-full">
          <tr class="text-left border-b border-gray-400">
            <th class="text-sm"></th>
            <th class="text-sm px-2">
              <button
                class="flex items-center text-left font-bold"
                v-on:click="sortByName"
              >
                Название
                <img :src="imgArrowDown" v-if="sortedByName" class="ml-2" />
                <img :src="imgArrowUp" v-else class="ml-2" />
              </button>
            </th>
            <th class="text-sm px-2">
              <button
                class="flex items-center text-left font-bold"
                v-on:click="sortByDate"
              >
                Дата изменения
                <img :src="imgArrowUp" v-if="sortedByDate" class="ml-2" />
                <img :src="imgArrowDown" v-else class="ml-2" />
              </button>
            </th>
            <th class="text-sm px-2">
              <button
                class="flex items-center text-left font-bold"
                v-on:click="sortBySize"
              >
                Размер
                <img :src="imgArrowUp" v-if="sortedBySize" class="ml-2" />
                <img :src="imgArrowDown" v-else class="ml-2" />
              </button>
            </th>
            <th class="text-sm w-1/6"></th>
          </tr>
          <tr>
            <td></td>
            <td>
              <div class="flex" v-if="selectedFiles.length > 0">
                <button
                  class="block bg-blue-200 text-sm font-bold text-blue-600 rounded py-3 px-6 m-auto my-4"
                  v-on:click="downloadAll"
                >
                  Скачать выбранные
                </button>
                <button
                  class="block bg-blue-200 text-sm font-bold text-blue-600 rounded py-3 px-6 m-auto my-4"
                  v-on:click="deleteAll"
                >
                  Удалить выбранные
                </button>
              </div>
            </td>
          </tr>

          <tr
            v-for="file in list"
            v-bind:key="file.id"
            class="text-left border-b border-gray-300"
            @mouseover="upHere = true"
          >
            <td class="px-5">
              <input
                class="checkbox"
                type="checkbox"
                v-bind:value="file.name"
                v-bind:id="file.name"
                v-model="selectedFiles"
              />
              <label v-bind:for="file.name"></label>
            </td>
            <td class="px-2">
              {{ file.name }}
            </td>
            <td class="px-2">{{ formatDate(file.editedAt) }}</td>
            <td class="px-2">{{ formatSize(file.size) }}</td>
            <td class="h-10">
              <div class="my-2" v-if="upHere">
                <button>
                  <img :src="imgEdit" class="ml-2" width="30px" />
                </button>
                <button v-on:click="downloadFile(file.name)">
                  <img :src="imgDownload" class="ml-2" width="30px" />
                </button>
                <button v-on:click="deleteFile(file.name)">
                  <img :src="imgDelete" class="ml-2" width="30px" />
                </button>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import image from "../img/skillspace.svg";
import imgExit from "../img/exit.svg";
import imgEdit from "../img/edit.svg";
import imgDownload from "../img/download.svg";
import imgDelete from "../img/delete.svg";
import imgArrowUp from "../img/arrow-up.svg";
import imgArrowDown from "../img/arrow-down.svg";

export default {
  name: "YourFiles",
  components: {},
  data() {
    return {
      list: [],
      selectedFiles: [],
      file: "",
      sortedByName: false,
      sortedByDate: false,
      sortedBySize: false,
      image,
      imgExit,
      imgEdit,
      imgDownload,
      imgDelete,
      imgArrowUp,
      imgArrowDown,
      upHere: true,
    };
  },
  methods: {
    fetchFiles: function () {
      let JWTToken = localStorage.getItem("authToken");
      axios
        .get("http://localhost:3000" + "/list", {
          headers: { "auth-token": `Bearer ${JWTToken}` },
        })
        .then((res) => {
          console.log("profile is:", res.data);
          this.list = res.data;
        })
        .catch((error) => console.log(error));
    },
    sortByName: function (event) {
      event.preventDefault();
      if (!this.sortedByName) {
        this.list.sort(function (a, b) {
          const nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        this.sortedByName = true;
      } else {
        this.list.sort((a, b) => {
          const nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
          if (nameB < nameA) return -1;
          if (nameB > nameA) return 1;
          return 0;
        });
        this.sortedByName = false;
      }
    },
    sortByDate: function (event) {
      event.preventDefault();
      if (!this.sortedByDate) {
        this.list.sort((a, b) => a.editedAt - b.editedAt);
        this.sortedByDate = true;
      } else {
        this.list.sort((a, b) => b.editedAt - a.editedAt);
        this.sortedByDate = false;
      }
    },
    sortBySize: function (event) {
      event.preventDefault();
      if (!this.sortedBySize) {
        this.list.sort((a, b) => a.size - b.size);
        this.sortedBySize = true;
      } else {
        this.list.sort((a, b) => b.size - a.size);
        this.sortedBySize = false;
      }
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.file.filename = this.$refs.file.files[0].name;
      console.log(this.file);
      let formData = new FormData();
      formData.append("file", this.file);
      let JWTToken = localStorage.getItem("authToken");
      axios
        .post("http://localhost:3000" + "/file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "auth-token": `Bearer ${JWTToken}`,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            // setTimeout(() => location.reload(), 2000);
          }
        });
    },
    downloadFile: function (name) {
      console.log(name);
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
            setTimeout(() => location.reload(), 2000);
          }
        })
        .catch((error) => console.log(error));
    },
    deleteFile: function (name) {
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
          if (res.status === 200) {
            setTimeout(() => location.reload(), 2000);
          }
        })
        .catch((error) => console.log(error));
    },
    downloadAll: function (event) {
      event.preventDefault();
      this.selectedFiles.forEach((file) => this.downloadFile(file));
    },
    deleteAll: function (event) {
      event.preventDefault();
      this.selectedFiles.forEach((file) => this.deleteFile(file));
    },
    formatSize: function (size) {
      const formattedSize = size / 1024;
      return formattedSize.toFixed(1) + " МБ";
    },
    formatDate: function (date) {
      const newDate = new Date(date);
      const day =
        newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
      const month =
        newDate.getMonth() + 1 < 10
          ? "0" + newDate.getMonth()
          : newDate.getMonth();
      const year = newDate.getFullYear();
      const time = newDate.getHours() + ":" + newDate.getMinutes();
      return day + "." + month + "." + year + ", " + time;
    },
    logout: function (event) {
      event.preventDefault();
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
          this.$router.replace("/");
        })
        .catch((error) => console.log(error));
    },
  },
  created() {
    this.fetchFiles();
  },
};
</script>