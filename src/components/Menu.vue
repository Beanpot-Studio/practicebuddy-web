<template>
  <aside v-if="this.user != null" class="column is-2 aside">
    
    <nav v-if="practices.length" class="menu">
      <ul class="menu-list">
        <li>
          <router-link class="navbar-item" :to="'/home'">
            <i class="fas fa-headphones"></i> My Practices
          </router-link>
        </li>

        <li>
          <router-link class="navbar-item" :to="'/practice'">
            <i class="fas fa-music"></i> Practice
          </router-link>
        </li>

        <li>
          <router-link class="navbar-item" :to="'/settings'">
            <i class="fa fa-cog"></i> Settings
          </router-link>
        </li>

        <li>
          <router-link class="navbar-item" :to="'/teachersearch'">
            <i class="fa fa-user"></i> My Teacher
          </router-link>
        </li>

        <!--<li>
          <router-link class="navbar-item" :to="''">
            <i class="fas fa-graduation-cap"></i> My Feedback
          </router-link>
        </li>-->
        <li>
          <router-link class="navbar-item" :to="'/studentarchive'">
            <i class="fas fa-archive"></i> My Practice Archive
          </router-link>
        </li>
      </ul>
    </nav>
    <nav v-else>
      <ul class="menu-list">
        <li>
          <router-link class="navbar-item" :to="'/home'">
            <i class="fas fa-users"></i> My Students' Practices
          </router-link>
        </li>
        <li>
          <router-link class="navbar-item" :to="'/teacherarchive'">
            <i class="fas fa-archive"></i> My Students' Archive
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { firebase } from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState(['user', ['practices']])
  },
  data: () => ({
    currentUser: firebase.auth().currentUser,
  }),
  methods: {
    ...mapActions(['fetchUser','fetchPractices'])
  }
  
  
};
</script>
