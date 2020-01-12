<template>
	<aside v-if="status != ''" class="column is-2 aside">
		<nav v-if="status == 'student'" class="menu">
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

				<li>
					<router-link class="navbar-item" :to="''">
						<i class="fas fa-graduation-cap"></i> My Feedback
					</router-link>
				</li>
				<li>
					<router-link class="navbar-item" :to="''">
						<i class="fas fa-archive"></i> My Practice Archive
					</router-link>
				</li>
			</ul>
		</nav>
		<nav v-if="status == 'teacher'">
			<ul class="menu-list">
				<li>
					<router-link class="navbar-item" :to="'/home'">
						<i class="fas fa-users"></i> My Students' Practices
					</router-link>
				</li>
				<li>
					<router-link class="navbar-item" :to="''">
						<i class="fas fa-archive"></i> My Students' Archive
					</router-link>
				</li>
			</ul>
		</nav>
	</aside>
</template>

<script>
import { firebase } from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState(['status']),
	},
	data: () => ({
		currentUser: firebase.auth().currentUser,
	}),
	created() {
		this.init();
	},
	methods: {
		init() {
			if (this.currentUser !== null) {
				this.fetchStudents(this.currentUser.uid);
			}
		},
		fetchStudents(id) {
			this.$store.dispatch('fetchStudents', id);
		},
	},
};
</script>
