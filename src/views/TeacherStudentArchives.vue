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
        <div v-for="practice in archives" :key="practice.id">
          <div class="column">
            <div
              :class="practice.practiceinfo.goalachieved ? 'box has-background-danger' : 'box has-background-info'"
            >
              <article class="media">
                <div class="media-left">
                  <figure class="circle has-background-white">
                    <img
                      :src="'../../instruments/' + practice.practiceinfo.instrument + '.png'"
                      alt="Image"
                    />
                  </figure>
                </div>

                <div>
                  <div
                    class="heading has-text-white"
                  >{{ practice.updated | moment('MMMM Do YYYY, h:mm:ss a') }}</div>
                  <div
                    v-if="practice.practiceinfo.reward && practice.practiceinfo.reward !== ''"
                    class="has-text-white"
                  >
                    <p class="is-size-5">{{practice.practiceinfo.name}}</p>
                    <p>
                      Practice {{ practice.practiceinfo.practicescompleted }} out of
                      {{ practice.practiceinfo.practicesrequired }}
                    </p>
                    <p>Working Towards: {{ practice.practiceinfo.reward }}</p>
                  </div>
                  <div
                    class="has-text-white is-size-4"
                  >{{ practice.practiceinfo.practicelength }} minutes</div>
                  <div
                    v-if="practice.feedback"
                    class="has-text-white is-size-5"
                  >Teacher feedback: {{ practice.practiceinfo.feedback }}</div>
                  <div v-if="practice.practiceinfo.sticker" class="has-text-white is-size-5">
                    <img src="../assets/stickers/sticker1.png" />
                  </div>
                  <div v-if="practice.practiceinfo.recording" class="has-text-white is-size-5">
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
import { mapState } from "vuex";
export default {
  name: "teacherstudentarchives",
  computed: {
    ...mapState(["user", "activeStudent", "archives"])
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
    this.init();
  },
  methods: {
    async init() {
      await this.$store.dispatch("fetchArchives", {
        activeStudent: this.activeStudent,
        teacher: true
      });
    }
  }
};
</script>
