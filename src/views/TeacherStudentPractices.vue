<template>
  <main class="column is-four-fifths main">
    <div :class="modalStickerClass">
      <div class="modal-background"></div>
      <div class="modal-content box">
        <p class="title is-4">Select a sticker for your student's practice</p>

        <span v-for="i in 40" :key="i" @click="awardSticker(i)">
          <img :src="require('../assets/stickers/sticker' + i + '.png')" />
        </span>
      </div>

      <button
        id="modal-close"
        class="modal-close is-large"
        aria-label="close"
        @click="closeStickerModal"
      ></button>
    </div>

    <div :class="modalFeedbackClass">
      <div class="modal-background"></div>
      <div class="modal-content box">
        <p class="title is-4">Write feedback for your student's practice</p>

        <div class="field">
          <div class="control">
            <input
              class="input is-large"
              type="text"
              v-model.trim="feedback"
              placeholder="My Feedback"
            />
          </div>
        </div>
        <button
          aria-label="submit"
          class="button is-info is-medium"
          @click="submitFeedback()"
        >Submit</button>
      </div>

      <button
        id="modal-close"
        class="modal-close is-large"
        aria-label="close"
        @click="closeFeedbackModal"
      ></button>
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
      <div class="columns is-multiline">
        <div v-for="practice in practices" :key="practice.id" class="practice-box">
          <div
            v-if="!practice.teacherarchive"
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
                    <img :src="require('../assets/stickers/sticker' + practice.sticker +'.png')" />
                  </div>
                  <div
                    v-else
                    class="has-text-white is-size-5 card-footer-item"
                    @click="openStickerModal(practice.id)"
                  >
                    <figure>
                      <i class="fas fa-trophy"></i>
                    </figure>
                  </div>
                </a>
                <div
                  class="has-text-white is-size-5 card-footer-item"
                  @click="openFeedbackModal(practice.id)"
                >
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
import { mapState, mapActions } from "vuex";

export default {
  name: "studentPractices",
  computed: {
    ...mapState(["user", "activeStudent", ["practices"]])
  },
  data() {
    return {
      stickerModalOpen: false,
      feedbackModalOpen: false,
      modalStickerClass: "modal",
      modalFeedbackClass: "modal",
      currentPractice: null,
      feedback: ""
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
    this.fetchPractices(this.activeStudent);
  },

  methods: {
    ...mapActions(["fetchPractices", "awardSticker"]),

    archive(practice) {
      this.$store.dispatch("archivePractice", {
        uid: this.activeStudent,
        teacher: true,
        practice: practice
      });
    },
    openStickerModal(id) {
      this.stickerModalOpen = !this.stickerModalOpen;
      if (this.stickerModalOpen) {
        this.modalStickerClass = "modal is-active";
        this.currentPractice = id;
      } else {
        this.modalStickerClass = "modal";
      }
    },
    openFeedbackModal(id) {
      this.feedbackModalOpen = !this.feedbackModalOpen;
      if (this.feedbackModalOpen) {
        this.modalFeedbackClass = "modal is-active";
        this.currentPractice = id;
      } else {
        this.modalFeedbackClass = "modal";
      }
    },
    awardSticker(id) {
      this.$store.dispatch("awardSticker", {
        uid: this.activeStudent,
        practiceId: this.currentPractice,
        sticker: id
      });
    },
    submitFeedback() {
      this.$store.dispatch("submitFeedback", {
        uid: this.activeStudent,
        practiceId: this.currentPractice,
        feedback: this.feedback
      });

      this.feedback = "";
      this.closeFeedbackModal();
    },
    closeStickerModal() {
      this.stickerModalOpen = !this.stickerModalOpen;
      this.modalStickerClass = "modal";
    },
    closeFeedbackModal() {
      this.feedbackModalOpen = !this.feedbackModalOpen;
      this.modalFeedbackClass = "modal";
    }
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