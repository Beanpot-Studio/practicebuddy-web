<template>
  <main class="column is-half main">
    <div class="box main-content has-text-centered">
      <h1 class="title is-size-3">Practice Time!</h1>
      <div v-if="notification !== ''">
        <article class="message is-success">
          <div class="message-body">
            {{ notification }}&nbsp;
            <button
              class="button is-link is-light is-small"
              @click="stopConfetti()"
            >Stop confetti!</button>
          </div>
        </article>
      </div>
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
        >You have completed {{ user.practicescompleted || 0 }} practices out of {{ user.practicesrequired }}</h2>
        <h3>You're working towards: {{ user.reward }}</h3>
        <h3>You're scheduled to practice for {{ user.practicelength }} minutes</h3>
        <div class="timer columns is-size-2">
          <h2 class="column has-text-link is-1 is-offset-4 has-text-centered">{{ minutes }}</h2>
          <h2 class="column has-text-link is-2 has-text-centered">&nbsp;:&nbsp;</h2>
          <h2 class="column has-text-link is-1 has-text-centered">{{ seconds }}</h2>
        </div>

        <div class="practiceButton">
          <button
            class="button is-full is-link is-rounded is-large"
            @click="startTimer()"
            :disabled="timerRunning"
          >{{ timerRunning ? 'Stop Practicing' : 'Start Practicing' }}</button>
        </div>

        <div class="box">
          <h2>
            Record up to three minutes of your practice session. You will be able to download this file and
            email it separately to your teacher.
          </h2>

          <audio-recorder :attempts="3" :time="3" :show-upload-button="false" />
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
import { mapState, mapActions } from "vuex";
import emailjs from "emailjs-com";

export default {
  name: "practice",
  computed: {
    ...mapState(["user", "teacher"])
  },
  data: () => ({
    currentUser: firebase.auth().currentUser,
    message: "",
    myTimer: null,
    timerRunning: false,
    minutes: 0,
    seconds: 0,
    runningSeconds: 0,
    notification: "",
    goalAchieved: false
  }),

  created() {
    if (this.user.instrument == undefined) {
      this.message =
        "Before starting, please set up  your preferences in the 'Settings' tab.";
    }
    this.getPractices();
  },

  methods: {
    ...mapActions(["fetchUser"]),
    start() {
      if (this.user.practicelength != this.minutes) {
        if (this.timerRunning) {
          if (this.seconds < 60 && this.seconds >= 0) {
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
        var pc;
        if (
          !this.user.practicescompleted ||
          this.user.practicescompleted >= this.user.practicesrequired
        ) {
          pc = 0;
        } else {
          pc = this.user.practicescompleted;
        }
        pc++;
        // eslint-disable-next-line no-console
        console.log(pc, this.user.practicescompleted);

        //save practice session on completion, add to practices completed. Notify teacher if required
        this.$store
          .dispatch("savePractice", {
            uid: this.currentUser.uid,
            practicescompleted: pc,
            name: this.user.name,
            instrument: this.user.instrument,
            practicesrequired: parseInt(this.user.practicesrequired),
            reward: this.user.reward,
            practicelength: parseInt(this.user.practicelength)
          })
          .then(() => {
            //goal has been achieved
            if (pc >= this.user.practicesrequired) {
              this.$confetti.start();
              this.notification = "Congratulations, you've completed a goal!";
              if (this.user.notify) {
                this.sendGoalEmail();
              }
            }
            if (this.user.notify) {
              this.sendEmail();
            }
          });
      }
    },

    sendEmail() {
      var templateParams = {
        from_name: this.currentUser.displayName,
        from_email: this.currentUser.email,
        to_name: this.teacher.name,
        goal: this.user.reward,
        to_email: this.teacher.email
      };
      emailjs
        .send(
          "mailgun",
          "template_j1zPcDDF",
          templateParams,
          "user_uSp9gTGALDwT2q5dw9Zq8"
        )
        .then(
          function(response) {
            console.log("SUCCESS!", response.status, response.text);
          },
          function(error) {
            console.log("FAILED...", error);
          }
        );
    },
    sendGoalEmail() {
      var templateParams = {
        from_name: this.currentUser.displayName,
        from_email: this.currentUser.email,
        to_name: this.teacher.name,
        goal: this.user.reward,
        to_email: this.teacher.email
      };
      emailjs
        .send(
          "mailgun",
          "pb_goal_email",
          templateParams,
          "user_uSp9gTGALDwT2q5dw9Zq8"
        )
        .then(
          function(response) {
            console.log("SUCCESS!", response.status, response.text);
          },
          function(error) {
            console.log("FAILED...", error);
          }
        );
    },
    stopConfetti() {
      this.$confetti.stop();
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
      if (this.user.practicescompleted == this.user.practicesrequired) {
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
.is-closed {
  height: 0px;
}
.is-open {
  height: 200px;
}
.ar {
  width: 100%;
  margin-top: 10px;
}
</style>
