<template web>
  <main class="column main">
    <div>
      <div class="box is-radiusless is-shadowless has-background-light">
        <div class="is-size-4 title">Welcome, {{currentUser.displayName}}</div>
      </div>
    </div>

    <div class="main-content">
      <h1 class="title is-size-3">Students</h1>

      <div class="columns">
        <div class="column is-one-third" v-for="student in students" :key="student.id">
          <div class="box has-background-info">
            <article class="media">
              <div class="media-left">
                <figure class="circle">
                  <img :src="'./instruments/'+student.instrument+'.png'" alt="Image" />
                </figure>
              </div>
              <div>
                <div class="title has-text-white">{{student.name}}</div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { firebase } from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import { mapState } from "vuex";
export default {
  name: "teacherlanding",
  computed: {
    ...mapState(["students"])
  },
  data: () => ({
    currentUser: firebase.auth().currentUser
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.fetchStudents(this.currentUser.uid);
    },
    fetchStudents(uid) {
      this.$store.dispatch("fetchStudents", uid);
    }
  }
};
</script>
