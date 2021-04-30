<template>
  <tr class="text-left border-b border-gray-300" @mouseover="upHere = true">
    <td class="px-5">{{ file.name }}</td>
    <td class="px-5">{{ file.editedAt }}</td>
    <td class="px-5">{{ file.size }}</td>
    <td class="h-10">
      <div v-if="upHere">
        <button><img :src="imgEdit" class="ml-2" width="30px" /></button>
        <button v-on:click="downloadFile">
          <img :src="imgDownload" class="ml-2" width="30px" />
        </button>
        <button v-on:click="deleteFile">
          <img :src="imgDelete" class="ml-2" width="30px" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
import imgEdit from "../img/edit.svg";
import imgDownload from "../img/download.svg";
import imgDelete from "../img/delete.svg";
import axios from "axios";

export default {
  name: "YourFileItem",
  props: ["file"],
  data() {
    return {
      imgEdit,
      imgDownload,
      imgDelete,
      upHere: true,
    };
  },
  methods: {
    downloadFile: function (event) {
      console.log(this.file.name);
      event.preventDefault();
      let JWTToken = localStorage.getItem("authToken");
      axios
        .get("http://localhost:3000" + "/file", {
          headers: {
            "auth-token": `Bearer ${JWTToken}`,
          },
          params: {
            filename: this.file.name,
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => console.log(error));
    },
    deleteFile: function (event) {
      event.preventDefault();
      let JWTToken = localStorage.getItem("authToken");
      axios
        .delete("http://localhost:3000" + "/file", {
          headers: {
            "auth-token": `Bearer ${JWTToken}`,
          },
          params: {
            filename: this.file.name,
          },
        })
        .then(() => {
          location.reload();
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>