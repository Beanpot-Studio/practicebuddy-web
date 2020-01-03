<template web>
  <div>
    <div>
      <div class="box is-radiusless is-shadowless has-background-light">
        <div class="is-size-4">Welcome, Student {{ user.displayName }}</div>
      </div>
    </div>

    <div class="wrapper">
      <div class="columns">
        <aside class="column is-2 aside">
          <nav class="menu">
            <ul class="menu-list">
              <li>
                <a class>
                  <i class="fa fa-cog"></i> Settings
                </a>
              </li>

              <li>
                <router-link class="navbar-item" :to="''">
                  <i class="fas fa-users"></i> My Practices
                </router-link>
              </li>
              <li>
                <router-link class="navbar-item" :to="''">
                  <i class="fas fa-graduation-cap"></i> My Feedback
                </router-link>
              </li>
            </ul>
          </nav>
        </aside>

        <main class="column main">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <div class="title has-text-info">Student Dashboard</div>
              </div>
            </div>
          </div>

          <div class="columns is-multiline">
            <div class="column is-one-third">
              <div class="box has-background-info">
                <article class="media">
                  <div class="media-left">
                    <figure class="circle">
                      <img src="../assets/instruments/0.png" alt="Image" />
                    </figure>
                  </div>
                  <div>
                    <div class="heading has-text-white">date</div>
                    <div class="title has-text-white">Student Name</div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";

export default {
  name: "teacherlanding",

  data: function() {
    return {
      user: firebase.auth().currentUser
    };
  },
  created() {
    //var user = firebase.auth().currentUser;
    /*firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("students")
      .onSnapshot(function(querySnapshot) {
        var students = [];
        querySnapshot.forEach(function(doc) {
          students.push(doc.data().name);
        });
        // eslint-disable-next-line no-console
        console.log("students ", students.join(", "));
      });*/
  }
};
</script>
<style scoped>
.wrapper {
  flex: 1;
  margin: 10px;
}

.circle {
  width: 100px;
  border-radius: 50px;
  background-color: white;
}
</style>