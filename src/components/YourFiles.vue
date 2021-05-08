<template>
  <div>
    <div class="border-b border-gray-300 py-4 px-5">
      <div class="flex justify-between m-auto">
        <img :src="image" />
        <button class="flex items-center">
          <img :src="imgExit" class="w-5 mr-2" />
          <span class="font-bold" v-on:click="logout">выйти</span>
        </button>
      </div>
    </div>
    <div class="m-auto mx-5 mt-10 mb-5">
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
            v-for="file in allFiles"
            v-bind:key="file.id"
            class="text-left border-b border-gray-300"
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
              <div class="flex items-center">
                <img
                  :src="imgXls"
                  v-if="file.name.split('.')[1] === 'xls'"
                  class="mr-2"
                />
                <img
                  :src="imgDocx"
                  v-if="file.name.split('.')[1] === 'docx'"
                  class="mr-2"
                />
                <img
                  :src="imgPng"
                  v-if="file.name.split('.')[1] === 'png'"
                  class="mr-2"
                />
                <img
                  :src="imgMp4"
                  v-if="file.name.split('.')[1] === 'mp4'"
                  class="mr-2"
                />
                <p>{{ file.name }}</p>
              </div>
            </td>
            <td class="px-2">{{ formatDate(file.editedAt) }}</td>
            <td class="px-2">{{ formatSize(file.size) }}</td>
            <td class="h-10">
              <div class="my-2" v-if="upHere">
                <button v-on:click="changeFile(file.name)">
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
    <div
      v-if="isMessage"
      class="file__popUp absolute bottom-6 bg-black text-white text-left px-3 py-3"
    >
      {{ message1 }}
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
import imgXls from "../img/xls.svg";
import imgDocx from "../img/docx.svg";
import imgPng from "../img/png.svg";
import imgMp4 from "../img/mp4.svg";
import { mapGetters, mapActions } from "vuex";
import { formatDate, formatSize } from "../utils/format";

export default {
  name: "YourFiles",
  components: {},
  data() {
    return {
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
      imgXls,
      imgDocx,
      imgPng,
      imgMp4,
      upHere: true,
      formatDate,
      formatSize,
    };
  },
  computed: mapGetters(["allFiles", "message", "isMessage"]),
  methods: {
    ...mapActions([
      "fetchFiles",
      "changeFile",
      "uploadFile",
      "deleteFile",
      "downloadFile",
      "logout",
    ]),
    sortByName: function (event) {
      event.preventDefault();
      if (!this.sortedByName) {
        this.allFiles.sort(function (a, b) {
          const nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        this.sortedByName = true;
      } else {
        this.allFiles.sort((a, b) => {
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
        this.allFiles.sort((a, b) => a.editedAt - b.editedAt);
        this.sortedByDate = true;
      } else {
        this.allFiles.sort((a, b) => b.editedAt - a.editedAt);
        this.sortedByDate = false;
      }
    },
    sortBySize: function (event) {
      event.preventDefault();
      if (!this.sortedBySize) {
        this.allFiles.sort((a, b) => a.size - b.size);
        this.sortedBySize = true;
      } else {
        this.allFiles.sort((a, b) => b.size - a.size);
        this.sortedBySize = false;
      }
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.uploadFile(this.file);
    },
    downloadAll: function (event) {
      event.preventDefault();
      this.selectedFiles.forEach((file) => this.downloadFile(file));
    },
    deleteAll: function (event) {
      event.preventDefault();
      this.selectedFiles.forEach((file) => this.deleteFile(file));
    },
  },
  created() {
    this.fetchFiles();
  },
};
</script>