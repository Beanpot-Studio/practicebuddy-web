<template>
  <main class="column is-four-fifths main">
    <div class="box main-content">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <router-link to="/home">My Students</router-link>
          </li>
          <li class="is-active">
            <a href="#" aria-current="page">Archived Practices</a>
          </li>
        </ul>
      </nav>
      <h1 class="title is-size-3">Practices</h1>
      <div class="columns is-multiline">
        <div v-for="practice in practices" :key="practice.id">
          <div
            v-if="practice.teacherarchive"
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
                    </div>
                  </article>
                  <div
                    v-if="practice.feedback"
                    class="has-text-white is-size-5"
                  >Teacher feedback: {{ practice.feedback }}</div>
                </div>
              </div>

              <div v-if="practice.sticker" class="has-text-centered">
                <figure class="image is-64x64 is-inline-block">
                  <img
                    :src="
												require('../assets/stickers/sticker' +
													practice.sticker +
													'.png')
											"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "teacherstudentarchives",
  computed: {
    ...mapState(["user", "activeStudent", ["practices"]])
  },
  watch: {
    "$route.params.id": {
      handler(id) {
        this.$store.commit("setActiveStudent", id);
      },
      immediate: true
    }
  },
  created() {
    this.fetchPractices(this.activeStudent);
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