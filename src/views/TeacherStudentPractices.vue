<template>
  <main class="column main">
    <div :class="modalClass">
      <div class="modal-background"></div>
      <div class="modal-content box">
        <p class="title is-4">Select a sticker for your student's practice</p>

        <span v-for="i in 40" :key="i" @click="awardSticker(i)">
          <img :src="require('../assets/stickers/sticker' + i + '.png')" />
        </span>
      </div>

      <button id="modal-close" class="modal-close is-large" aria-label="close" @click="closeModal"></button>
    </div>

    <div class="box main-content">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <router-link to="/home">My Students</router-link>
          </li>
          <li class="is-active">
            <a href="#" aria-current="page">Practices</a>
          </li>
        </ul>
      </nav>
      <h1 class="title is-size-3">Practices</h1>
      <h2 class="subtitle">Unarchived Practices</h2>
      <div class="columns is-multiline">
        <div v-for="practice in practices" :key="practice.id">
          <div class="column">
            <div
              :class="practice.goalachieved ? 'box has-background-danger' : 'box has-background-info'"
            >
              <article class="media">
                <div class="media-left">
                  <figure class="circle has-background-white">
                    <img :src="'../../instruments/' + practice.instrument + '.png'" alt="Image" />
                  </figure>
                </div>

                <div>
                  <div
                    class="heading has-text-white"
                  >{{ practice.updated | moment('MMMM Do YYYY, h:mm:ss a') }}</div>
                  <div v-if="practice.reward && practice.reward !== ''" class="has-text-white">
                    <p class="is-size-5">{{ practice.name }}</p>
                    <p>
                      Practice {{ practice.practicescompleted }} out of
                      {{ practice.practicesrequired }}
                      : Working Towards: {{ practice.reward }}
                    </p>
                  </div>
                  <div class="has-text-white is-size-4">{{ practice.practicelength }} minutes</div>
                  <div
                    v-if="practice.feedback"
                    class="has-text-white is-size-5"
                  >Teacher feedback: {{ practice.feedback }}</div>
                  <div v-if="practice.sticker" class="has-text-white is-size-5">
                    <img :src="require('../assets/stickers/sticker' + practice.sticker + '.png')" />
                  </div>
                  <div v-if="practice.recording" class="has-text-white is-size-5">
                    <i class="fa fa-play"></i> Recording
                  </div>

                  <div class="buttons are-medium">
                    <button class="button has-text-link" @click="archive(practice)">
                      <i class="fas fa-archive"></i>&nbsp;Archive Practice
                    </button>
                    <button class="button has-text-link" @click="openModal(practice.id)">
                      <i class="fas fa-trophy"></i>&nbsp;Award a Sticker
                    </button>
                    <button class="button has-text-link" @click="giveFeedback(practice)">
                      <i class="fas fa-pen"></i>&nbsp;Write Feedback
                    </button>
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
  name: "studentPractices",
  computed: {
    ...mapState(["user", "activeStudent", "practices"])
  },
  data() {
    return {
      modalOpen: false,
      modalClass: "modal",
      currentPractice: null
    };
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
      await this.$store.dispatch("fetchPractices", {
        activeStudent: this.activeStudent,
        teacher: true
      });
    },
    archive(practice) {
      this.$store.dispatch("archivePractice", {
        uid: this.activeStudent,
        teacher: true,
        practice: practice
      });
    },
    openModal(id) {
      this.modalOpen = !this.modalOpen;
      if (this.modalOpen) {
        this.modalClass = "modal is-active";
        this.currentPractice = id;
      } else {
        this.modalClass = "modal";
      }
    },
    awardSticker(id) {
      this.$store.dispatch("awardSticker", {
        uid: this.activeStudent,
        practiceId: this.currentPractice,
        sticker: id
      });
    },
    closeModal() {
      this.modalOpen = !this.modalOpen;
      this.modalClass = "modal";
    }
  }
};
</script>
