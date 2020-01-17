<template>
  <main class="column is-half main">
    <div class="box main-content">
      <h1 class="title is-size-3">Settings</h1>
      <h2 class="subtitle">Fill in these settings to customize your practices</h2>
      <div class="columns">
        <div class="column">
          <form @submit.prevent="submit">
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <input class="input" id="name" v-model="name" type="text" :placeholder="user.name" />
              </div>
            </div>

            <div class="field" v-if="teacher != null">
              <label class="label">Teacher Name</label>
              <div class="control">
                <input class="input" disabled :placeholder="teacher.name || ''" />
              </div>
            </div>

            <div v-else>
              <article class="message is-danger">
                <div class="message-body">
                  It looks like you don't have a teacher associated to your practices. If this is an
                  error, go to the 'My Teacher' page to search for your teacher.
                </div>
              </article>
            </div>

            <div class="field">
              <label class="label">Working Towards This Reward</label>
              <div class="control">
                <input
                  v-model.trim="$v.reward.$model"
                  :class="validClass"
                  value="reward"
                  type="text"
                  :placeholder="user.reward || 'A trip to the candy store!'"
                />
              </div>
              <div v-if="submitStatus == 'ERROR'">
                <p class="help is-danger">Field is required</p>
              </div>
            </div>

            <div class="field">
              <label class="label">Number of Practices Required to Receive This Reward</label>
              <div class="control">
                <input
                  class="input"
                  type="number"
                  :placeholder="user.practicesrequired || 5"
                  value="practicesrequired"
                  min="1"
                  max="5"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Practice Length in Minutes</label>
              <div class="control">
                <input
                  class="input"
                  type="number"
                  value="practicelength"
                  :placeholder="user.practicelength || 20"
                  min="1"
                  max="5"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Notify Your Teacher of Every Practice Submission</label>
              <div class="control">
                <input type="checkbox" v-model="notify" :value="user.notify" />
              </div>
            </div>

            <div class="field">
              <label class="label">Instrument</label>
              <div class="control">
                <div class="select">
                  <select v-model="myInstrument">
                    <option>none</option>
                    <option
                      v-for="instrument in instruments"
                      :key="instrument"
                      :value="instruments.indexOf(instrument)"
                    >{{ instrument }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button
                  type="submit"
                  :disabled="submitStatus === 'PENDING'"
                  class="button is-link"
                  @click="submit"
                >Save</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { firebase } from "@firebase/app";
import "@firebase/auth";
import { mapState } from "vuex";
import { required } from "vuelidate/lib/validators";

export default {
  name: "settings",
  computed: {
    ...mapState(["user", "teacher"])
  },
  validations: {
    name: {
      required
    },
    reward: {
      required
    },
    practicesrequired: {
      required
    },
    practicelength: {
      required
    },
    notify: {
      required
    }
  },
  created() {
    console.log(this.user.instrument);
    this.myInstrument = this.user.instrument;
  },
  data: () => ({
    currentUser: firebase.auth().currentUser,
    submitStatus: null,
    selected: false,
    validClass: "input",
    name: "",
    reward: "",
    practicesrequired: 0,
    practicelength: 0,
    notify: false,
    instrument: null,
    myInstrument: "none",
    instruments: [
      "acoustic guitar",
      "banjo",
      "cello",
      "clarinet",
      "elecric guitar",
      "flute",
      "french horn",
      "handbells",
      "harp",
      "mandolin",
      "music",
      "oboe",
      "organ",
      "percussion",
      "piano",
      "sax",
      "trombone",
      "trumpet",
      "violin",
      "voice",
      "xylophone"
    ]
  }),

  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR";
        this.validClass = "input is-danger";
      } else {
        this.submitStatus = "PENDING";
        this.validClass = "input";
        //this.$store.dispatch('searchTeachers', this.email);
        this.$store.dispatch("updateUser", {
          name: this.name,
          reward: this.reward,
          uid: this.user.id,
          practicesrequired: this.practicesrequired,
          instrument: this.myInstrument,
          practicelength: this.practicelength,
          notify: this.notify
        });
        setTimeout(() => {
          this.submitStatus = "OK";
          this.validClass = "input";
        }, 500);
      }
    }
  }
};
</script>
