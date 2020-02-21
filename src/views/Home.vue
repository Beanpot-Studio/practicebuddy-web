<template web>
  <main class="column is-four-fifths main">
    <div class="box is-radiusless is-shadowless has-background-light">
      <div class="is-size-4 title">Welcome, {{ currentUser.displayName }}</div>
      <div class="notification is-warning" v-if="teacher == null">
        Welcome! It looks like there is no teacher associated to your practices. If this is incorrect, please
        add your teacher to your account in the My Teacher tab.
        If you are a teacher, when your students add
        you to their account you will start to see their practice information below and you will see
        different links in the side navigation.
      </div>
      <div v-else>Your teacher is: {{ teacher.name }}</div>
    </div>

    <div class="box main-content" v-if="students.length>0">
      <h1 class="title is-size-3">My Students</h1>

      <div class="columns is-multiline">
        <router-link
          v-for="student in students"
          :key="student.id"
          :to="{
						name: 'teacherstudentpractices',
						params: { id: student.id },
					}"
        >
          <div class="box has-background-info">
            <div class="card">
              <div class="card-content">
                <div class="content">
                  <article class="media">
                    <div class="media-left">
                      <figure class="circle">
                        <img :src="'./instruments/' + student.instrument + '.png'" alt="Image" />
                      </figure>
                    </div>
                    <div>
                      <div class="title has-text-white">{{ student.name }}</div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <!--what a student sees-->
    <div class="box main-content" v-else>
      <h1 class="title is-size-3">My Practices</h1>
      <h3 v-if="practices.length == 0">Your practice sessions will be displayed here</h3>

      <div class="columns is-multiline">
        <div v-for="practice in practices" :key="practice.id">
          <div
            v-if="!practice.studentarchive"
            :class="practice.goalachieved ? 'box has-background-danger' : 'box has-background-info'"
          >
            <div class="card">
              <div class="card-content">
                <div class="content">
                  <article class="media">
                    <div class="media-left">
                      <figure class="circle has-background-white">
                        <img :src="'../../instruments/' + practice.instrument + '.png'" alt="Image" />
                      </figure>
                    </div>

                    <div>
                      <div
                        class="heading has-text-white"
                      >{{ practice.updated.seconds | moment('MMMM Do YYYY, h:mm:ss a') }}</div>
                      <div v-if="practice.reward && practice.reward !== ''" class="has-text-white">
                        <p>
                          Practice {{ practice.practicescompleted }} out of
                          {{ practice.practicesrequired }}
                        </p>
                        <p>Working Towards: {{ practice.reward }}</p>
                      </div>
                      <div class="has-text-white is-size-4">{{ practice.practicelength }} minutes</div>
                      <div
                        v-if="practice.feedback"
                        class="has-text-white is-size-5"
                      >Teacher feedback: {{ practice.feedback }}</div>
                    </div>
                  </article>
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item">
                  <div v-if="practice.sticker" class="has-text-white is-size-5">
                    <img
                      :src="
												require('../assets/stickers/sticker' +
													practice.sticker +
													'.png')
											"
                    />
                  </div>
                  <div v-else class="has-text-white is-size-5 card-footer-item">
                    <figure>
                      <i class="fas fa-trophy"></i>
                    </figure>
                  </div>
                </a>
                <div class="has-text-white is-size-5 card-footer-item">
                  <figure>
                    <i class="fas fa-pen"></i>
                  </figure>
                </div>
                <div class="has-text-white is-size-5 card-footer-item" @click="archive(practice)">
                  <figure>
                    <i class="fas fa-archive"></i>
                  </figure>
                </div>
              </footer>
            </div>
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
export default {
  name: "landing",
  computed: {
    ...mapState([["students"], "teacher", "user", ["practices"]])
  },
  data: () => ({
    currentUser: firebase.auth().currentUser
  }),

  methods: {
    ...mapActions(["fetchUser", "fetchStudents", "fetchPractices"]),
    findTeacher(uid) {
      this.$store.dispatch("findTeacher", uid);
    },
    archive(practice) {
      this.$store.dispatch("archivePractice", {
        uid: this.currentUser.uid,
        practice: practice
      });
    }
  },

  created() {
    this.fetchUser(this.currentUser.uid)
      .then(this.findTeacher(this.currentUser.uid))
      .then(this.fetchStudents(this.currentUser.uid))
      .then(this.fetchPractices(this.currentUser.uid));
  }
};
</script>
<style scoped>
.box {
  margin: 5px;
}
.card {
  background-color: transparent;
  box-shadow: none;
}
.card-content {
  padding: 1px;
}
.card-footer-item:not(:last-child) {
  border: none;
}
</style>