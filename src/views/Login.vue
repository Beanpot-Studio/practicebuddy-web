<template>
  <div>
    <section class="home-elements">
      <h1
        class="home-elements has-text-centered is-large title is-size-3 text-weight-bold"
      >Welcome to Practice Buddy</h1>
      <h3 class="home-elements has-text-centered subtitle is-size-4">
        Practice Buddy is the musical student's preferred app
        and the music teacher's best toolkit
      </h3>
      <h4
        class="home-elements has-text-centered is-size-5"
      >Practice Buddy includes the ability to login, save your preferences, time and record your practice sessions, and review your progress via lists of sessions. Once a goal is achieved, the app sends an email to the teacher, requesting feedback. The student can check the feedback section of the app to get comments and stickers from their music teacher. Teachers use the app to track their students' sessions.</h4>
    </section>
    <section class="hero">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="columns">
            <div class="card column is-shady">
              <h2 class="title has-text-centered">Login</h2>

              <a
                class="button is-info is-rounded is-medium is-fullwidth"
                @click="loginWithGoogle()"
              >
                <span class="icon">
                  <i class="fab fa-google"></i>
                </span>
                <span>Sign in with Google</span>
              </a>
              <br />
            </div>

            <!--<div class="card column is-shady">
              <h2 class="title has-text-centered">Teacher Login</h2>

              <a
                class="button is-primary is-rounded is-medium is-fullwidth"
                @click="loginWithGoogle('t')"
              >
                <span class="icon">
                  <i class="fab fa-google"></i>
                </span>
                <span>Sign in with Google</span>
              </a>
              <br />

              <a class="button is-link is-rounded is-medium is-fullwidth">
                <span class="icon">
                  <i class="fab fa-facebook"></i>
                </span>
                <span>Sign in with Facebook</span>
              </a>
            </div>-->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { firebase } from "@firebase/app";
import "@firebase/auth";

export default {
  name: "Home",
  props: {
    msg: String
  },
  methods: {
    loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(res => {
          // save user to db
          let uid = res.user.uid;
          let data = {};
          data = {
            name: res.user.displayName,
            email: res.user.email
          };

          firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .set(data);
        })
        .then(() => {
          this.$router.replace("home");
        })
        .catch(err => {
          // TODO:
          alert(err.message);
        });
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 5px;
  margin: 5px;
  padding: 10px;
}
.level {
  margin-bottom: 0px;
}
.home-elements {
  padding: 10px;
}
</style>

