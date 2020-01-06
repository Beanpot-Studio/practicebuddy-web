<template web>
  <div>
    <div>
      <div class="box is-radiusless is-shadowless has-background-light">
        <div class="is-size-4 title">Welcome, {{currentUser.displayName}}</div>
        <div v-if="message !== ''" class="notification is-warning">
          <button class="delete"></button>
          {{ message }}
        </div>
      </div>
    </div>

    <div class="wrapper">
      <div class="columns">
        <aside class="column is-2 aside">
          <nav class="menu">
            <ul class="menu-list">
              <li>
                <a class>
                  <i class="fa fa-cog"></i> Settings
                </a>
              </li>

              <li>
                <a class>
                  <i class="fa fa-user"></i> My Teacher
                </a>
              </li>

              <li>
                <router-link class="navbar-item" :to="''">
                  <i class="fas fa-users"></i> My Practices
                </router-link>
              </li>
              <li>
                <router-link class="navbar-item" :to="''">
                  <i class="fas fa-graduation-cap"></i> My Feedback
                </router-link>
              </li>
              <li>
                <router-link class="navbar-item" :to="''">
                  <i class="fas fa-archive"></i> My Practice Archive
                </router-link>
              </li>
            </ul>
          </nav>
        </aside>

        <main class="column main">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <div class="title has-text-info">Student Dashboard</div>
              </div>
            </div>
          </div>

          <div class="columns is-multiline">
            <div class="column is-one-third">
              <div class="box has-background-info">
                <article class="media">
                  <div class="media-left">
                    <figure class="circle">
                      <img src="../assets/instruments/0.png" alt="Image" />
                    </figure>
                  </div>
                  <div>
                    <div class="heading has-text-white">date</div>
                    <div class="title has-text-white">Student Name</div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import { mapState } from "vuex";

export default {
  name: "studentlanding",
  computed: {
    ...mapState(["message"])
  },
  data: () => ({
    currentUser: firebase.auth().currentUser
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.findTeacher(this.currentUser.uid);
    },
    findTeacher(id) {
      this.$store.dispatch("findTeacher", id);
    }
  }
};
</script>
<style scoped>
.wrapper {
  flex: 1;
  margin: 10px;
}

.circle {
  width: 100px;
  border-radius: 50px;
  background-color: white;
}
</style>