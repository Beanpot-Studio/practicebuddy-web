<template>
  <main class="column is-four-fifths main">
    <div class="box main-content">
      <h1 class="title is-size-3">My Archived Practices</h1>
      <h3 v-if="practices.length == 0">Your archived practice sessions will be displayed here</h3>

      <div class="columns is-multiline">
        <div v-for="practice in practices" :key="practice.id">
          <div
            v-if="practice.studentarchive"
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
  name: "teacherstudentarchives",
  computed: {
    ...mapState(["user", "activeStudent", ["practices"]])
  },
  data: () => ({
    currentUser: firebase.auth().currentUser
  }),
  created() {
    this.fetchPractices(this.currentUser);
  },
  methods: {
    ...mapActions(["fetchPractices"])
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