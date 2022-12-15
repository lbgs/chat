<template>
  <div class="home">
  </div>
</template>

<script>
export default {
  name: "Home",
  created() {
    this.$router.push("/chat");
  },
};
</script>
