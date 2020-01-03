<template>
  <div id="app">
    <Nav />
    <router-view />
    <Footer />
  </div>
</template>
<script>
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default {
  components: { Nav, Footer }
};
</script>

<style scoped>
footer {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  z-index: 30;
  padding: 10px;
}
</style>