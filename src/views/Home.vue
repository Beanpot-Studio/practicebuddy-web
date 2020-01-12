<template web>
	<main class="column main">
		<div>
			<div class="box is-radiusless is-shadowless has-background-light">
				<div class="is-size-4 title">Welcome, {{ currentUser.displayName }}</div>
				<div v-if="announcement !== '' && status != 'teacher'" class="notification is-warning">
					<button class="delete"></button>
					{{ announcement }}
				</div>
				<div v-else>Your teacher is: {{ teacher.name }}</div>
			</div>
		</div>

		<div class="main-content" v-if="status == 'teacher'">
			<h1 class="title is-size-3">My Students</h1>

			<div class="columns">
				<router-link
					class="column is-one-third"
					v-for="student in students"
					:key="student.id"
					:to="{
						name: 'studentpractices',
						params: { id: student.id },
					}"
				>
					<div class="box has-background-info">
						<article class="media">
							<div class="media-left">
								<figure class="circle">
									<img :src="'./instruments/' + student.instrument + '.png'" alt="Image" />
								</figure>
							</div>
							<div>
								<div class="title has-text-white">{{ student.name }}</div>
							</div>
						</article>
					</div>
				</router-link>
			</div>
		</div>

		<div class="main-content" v-else>
			<h1 class="title is-size-3">My Practices</h1>

			<div class="columns">
				<div class="column is-one-third">
					<div class="box has-background-info">
						<article class="media">
							<div class="media-left">
								<figure class="circle has-background-white">
									<img src="/instruments/0.png" alt="Image" />
								</figure>
							</div>
							<div>
								<div class="heading has-text-white">Occurred: 01/02/2020</div>
								<div class="has-text-white is-size-5">50 Minutes</div>
								<div class="has-text-white is-size-5">Feedback: Very well done!</div>
								<div class="has-text-white is-size-5">
									<img src="../assets/stickers/sticker1.png" />
								</div>
								<div class="has-text-white is-size-5"><i class="fa fa-play"></i> Recording</div>
							</div>
						</article>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { mapState } from 'vuex';
export default {
	name: 'teacherlanding',
	computed: {
		...mapState(['students', 'status', 'announcement', 'teacher']),
	},
	data: () => ({
		currentUser: firebase.auth().currentUser,
	}),
	created() {
		this.init();
	},

	methods: {
		init() {
			this.fetchStudents(this.currentUser.uid);
			this.findTeacher(this.currentUser.uid);
		},
		fetchStudents(uid) {
			this.$store.dispatch('fetchStudents', uid);
		},
		findTeacher(id) {
			this.$store.dispatch('findTeacher', id);
		},
	},
};
</script>
