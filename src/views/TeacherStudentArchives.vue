<template>
  <main class="column is-half main">
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
      <h2 class="subtitle">Archived Practices</h2>
      <div class="columns is-multiline">
        <div v-for="practice in practices" :key="practice.id">
          <div class="column">
            <div v-if="practice.teacherarchive"
              :class="practice.goalachieved ? 'box has-background-danger' : 'box has-background-info'"
            >
              <article class="media">
                <div class="media-left">
                  <figure class="circle has-background-white">
                    <img
                      :src="'../../instruments/' + practice.instrument + '.png'"
                      alt="Image"
                    />
                  </figure>
                </div>

                <div>
                  <div
                    class="heading has-text-white"
                  >{{ practice.updated.seconds | moment('MMMM Do YYYY, h:mm:ss a') }}</div>
                  <div
                    v-if="practice.reward && practice.reward !== ''"
                    class="has-text-white"
                  >
                    <p class="is-size-5">{{practice.name}}</p>
                    <p>
                      Practice {{ practice.practicescompleted }} out of
                      {{ practice.practicesrequired }}
                    </p>
                    <p>Working Towards: {{ practice.reward }}</p>
                  </div>
                  <div
                    class="has-text-white is-size-4"
                  >{{ practice.practicelength }} minutes</div>
                  <div
                    v-if="practice.feedback"
                    class="has-text-white is-size-5"
                  >Teacher feedback: {{ practice.feedback }}</div>
                  <div v-if="practice.sticker" class="has-text-white is-size-5">
										<img
											:src="
												require('../assets/stickers/sticker' +
													practice.sticker +
													'.png')
											"
										/>
									</div>
                  <div v-if="practice.recording" class="has-text-white is-size-5">
                    <i class="fa fa-play"></i> Recording
                  </div>
                </div>
              </article>
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
    ...mapState(["user", "activeStudent", ['practices']])
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
    ...mapActions(['fetchPractices']),
  }
};
</script>
