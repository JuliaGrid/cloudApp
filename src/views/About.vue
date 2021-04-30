<template>
  <div class="about">
    <YourFiles />
  </div>
</template>

<script>
// @ is an alias to /src

import YourFiles from "@/components/YourFiles.vue";

export default {
  name: "Home",
  components: {
    YourFiles,
  },
};
</script>