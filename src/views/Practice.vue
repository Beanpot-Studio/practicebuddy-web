<template>
  <main class="column is-half main">
    <div class="box main-content has-text-centered">
      <h1 class="title is-size-3">Practice Time!</h1>

      <img
        class="circle has-background-white-ter"
        v-if="user.instrument"
        :src="'./instruments/' + user.instrument + '.png'"
        alt="Image"
      />
      <img
        class="circle has-background-white-ter"
        v-else
        :src="'./instruments/none.png'"
        alt="Image"
      />
      <div v-if="msg" class="notification is-warning">{{ msg }}</div>
      <div v-else>
        <h2
          class="subtitle"
        >You have completed {{user.practicescompleted || 0}} practices out of {{ user.practicesrequired }}</h2>
        <h3>You're working towards: {{user.reward}}</h3>
        <h3>You're scheduled to practice for {{user.practicelength}} minutes</h3>
        <div class="timer columns is-size-2">
          <h2 class="column has-text-link is-1 is-offset-4 has-text-centered">0</h2>
          <h2 class="column has-text-link is-2 has-text-centered">&nbsp;:&nbsp;</h2>
          <h2 class="column has-text-link is-1 has-text-centered">0</h2>
        </div>

        <h2>Record one minute of your practice session</h2>

        <div class="circle has-background-primary has-text-white icon is-large">
          <i class="fa fa-microphone"></i>
        </div>

        <div class="practiceButton">
          <a
            class="button is-full is-link is-rounded is-large"
            @click="startPracticing()"
          >Start Practicing</a>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { firebase } from "@firebase/app";
import "@firebase/auth";
import { mapState } from "vuex";

export default {
  name: "practice",
  computed: {
    ...mapState(["user"])
  },
  data: () => ({
    currentUser: firebase.auth().currentUser,
    msg: ""
  }),
  created() {
    if (this.user.instrument == undefined) {
      this.msg =
        "Before starting, please set up  your preferences in the 'Settings' tab.";
    }
  },
  methods: {}
};
</script>
<style scoped>
.practiceButton,
.circle,
.timer {
  margin: 15px;
}
</style>
