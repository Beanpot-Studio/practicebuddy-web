<template web>
  <nav class="navbar has-background-link" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="./">
        <img src="@/assets/lyre.png" width="30" height="30" />
      </a>
      <span class="navbar-item is-size-3 has-text-white">Practice Buddy</span>
      <a
        id="example-burger"
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="example-menu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="example-menu" class="navbar-menu">
      <div class="navbar-end">
        <router-link class="navbar-item has-text-white" :to="'about'">About</router-link>
        <div v-if="status != ''" class="navbar-item">
          <div class="buttons" @click="logout">
            <a class="button is-danger">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script web>
import { firebase } from "@firebase/app";
import "@firebase/auth";
import { mapState } from "vuex";

export default {
  name: "my-navbar",
  computed: {
    ...mapState(["status"])
  },

  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.dispatch("clearAll");
        })
        .then(() => {
          this.$router.replace("login");
        });
    }
  },
  mounted: function() {
    var burger = document.getElementById("example-burger");
    var menu = document.getElementById("example-menu");
    burger.addEventListener("click", function() {
      burger.classList.toggle("is-active");
      menu.classList.toggle("is-active");
    });
  }
};
</script>

<style>
.main-content {
  margin-top: 30px;
}
.circle {
  width: 100px;
  border-radius: 50px;
  background-color: white;
}
.wrapper {
  flex: 1;
}
</style>