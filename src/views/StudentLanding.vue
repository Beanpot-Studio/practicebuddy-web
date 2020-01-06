<template web>
  <main class="column main">
    <div>
      <div class="box is-radiusless is-shadowless has-background-light">
        <div class="is-size-4 title">Welcome, {{currentUser.displayName}}</div>
        <div v-if="message !== ''" class="notification is-warning">
          <button class="delete"></button>
          {{ message }}
        </div>
      </div>
    </div>

    <div class="box is-radiusless">
      <h1 class="title is-size-3">Student Practices</h1>

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
                <div class="heading has-text-white">Occurred: 01/02/2020</div>
                <div class="has-text-white is-size-5">50 Minutes</div>
                <div class="has-text-white is-size-5">Feedback: Very well done!</div>
                <div class="has-text-white is-size-5">
                  <img src="../assets/stickers/sticker1.png" />
                </div>
                <div class="has-text-white is-size-5">
                  <i class="fa fa-play"></i> Recording
                </div>
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