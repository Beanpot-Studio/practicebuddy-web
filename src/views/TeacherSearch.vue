<template>
  <main class="column is-half main">
    <div class="box main-content">
      <h1 class="title is-size-3">Find My Teacher</h1>
      <div v-if="error != ''">
        <article class="message is-danger">
          <div class="message-body">{{error}}</div>
        </article>
      </div>
      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Teacher Email</label>
            <div class="control">
              <input
                v-model="email"
                class="input"
                type="email"
                id="email"
                required
                placeholder="My Teacher's Email Address"
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-link" @click="submit">Submit</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="teacherName != null">
        <article class="message is-success">
          <div class="message-body">
            I found someone with that email address! Is
            <b>{{teacherName}}</b> your teacher?
          </div>
        </article>
        <div class="buttons">
          <button class="button is-success">Yes, associate me with this teacher</button>
          <button class="button is-danger">No, this isn't my teacher</button>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["teacherName", "error"])
  },
  data: () => ({
    valid: true,
    email: "",
    emailRules: [v => !!v || "Email is required"]
  }),
  created() {},
  methods: {
    submit() {
      this.$store.dispatch("searchTeachers", this.email);
    }
  }
};
</script>