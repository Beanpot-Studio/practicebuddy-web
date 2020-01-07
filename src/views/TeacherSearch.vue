<template>
  <main class="column is-half main">
    <div class="box main-content">
      <h1 class="title is-size-3">Find My Teacher</h1>

      {{teacherName}}
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
    </div>
  </main>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["teacherName"])
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