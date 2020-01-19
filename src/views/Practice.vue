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
      <div v-if="message" class="notification is-warning">{{ message }}</div>
      <div v-else>
        <h2
          class="subtitle"
        >You have completed {{user.practicescompleted}} practices out of {{ user.practicesrequired }}</h2>
        <h3>You're working towards: {{user.reward}}</h3>
        <h3>You're scheduled to practice for {{user.practicelength}} minutes</h3>
        <div class="timer columns is-size-2">
          <h2 class="column has-text-link is-1 is-offset-4 has-text-centered">{{minutes}}</h2>
          <h2 class="column has-text-link is-2 has-text-centered">&nbsp;:&nbsp;</h2>
          <h2 class="column has-text-link is-1 has-text-centered">{{seconds}}</h2>
        </div>

        <h2>Record one minute of your practice session</h2>

        <div class="circle has-background-primary has-text-white icon is-large">
          <i class="fa fa-microphone"></i>
        </div>

        <div class="practiceButton">
          <button
            class="button is-full is-link is-rounded is-large"
            @click="startTimer()"
            :disabled="timerRunning"
          >{{timerRunning ? 'Stop Practicing' : 'Start Practicing'}}</button>
        </div>

        <div class="columns">
          <div class="column practiceButton">
            <button
              class="button is-full is-warning is-rounded is-medium"
              @click="pauseTimer()"
              :disabled="!timerRunning"
            >Pause Timer</button>
          </div>
          <div class="column practiceButton">
            <button
              :disabled="!timerRunning"
              class="button is-full is-danger is-rounded is-medium"
              @click="stopTimer()"
            >Stop Timer</button>
          </div>
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
    ...mapState(["user", "teacher"])
  },
  data: () => ({
    currentUser: firebase.auth().currentUser,
    message: "",
    practicescompleted: 0,
    myTimer: null,
    timerRunning: false,
    minutes: 0,
    seconds: 0,
    runningSeconds: 0
  }),
  created() {
    //console.log(this.user);
    if (this.user.instrument == undefined) {
      this.message =
        "Before starting, please set up  your preferences in the 'Settings' tab.";
    }
    //todo, get practicescompleted, and watch for changes on FE
    this.getPractices();
  },
  methods: {
    start() {
      if (this.user.practicelength != this.minutes) {
        if (this.timerRunning) {
          if (this.seconds < 2 && this.seconds >= 0) {
            ++this.seconds;
          } else {
            this.seconds = 0;
            ++this.minutes;
          }
        }
      } else {
        clearInterval(this.myTimer, 1000);
        this.timerRunning = false;
        this.minutes = 0;
        this.seconds = 0;
        //add one to practices completed
        this.practicescompleted++;
        //save practice session on completion, add to practices completed. Notify teacher if required
        this.$store.dispatch("savePractice", {
          uid: this.currentUser.uid
        });
      }
    },
    startTimer() {
      this.timerRunning = !this.timerRunning;
      this.myTimer = setInterval(this.start, 1000);
    },
    pauseTimer() {
      this.timerRunning = !this.timerRunning;
      clearInterval(this.myTimer, 1000);
    },
    stopTimer() {
      this.timerRunning = !this.timerRunning;
      clearInterval(this.myTimer, 1000);
      this.seconds = 0;
      this.minutes = 0;
    },
    getPractices() {
      //this.practicescompleted = this.user.practicescompleted;
      if (this.practicescompleted > this.user.practicesrequired) {
        //goal has been achieved
        this.practicescompleted == 0;
      }
    }
  }
};
</script>
<style scoped>
.practiceButton,
.circle,
.timer {
  margin: 15px;
}
</style>
