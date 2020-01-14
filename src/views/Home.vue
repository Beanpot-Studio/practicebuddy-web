<template web>
	<main class="column main">
		<div>
			<div class="box is-radiusless is-shadowless has-background-light">
				<div class="is-size-4 title">Welcome, {{ currentUser.displayName }}</div>
				<div v-if="teacher == null" class="notification is-warning">
					It looks like you don't have a teacher associated to your practices. If this is incorrect, please
					add your teacher to your account in the My Teacher tab. If you are a teacher, when your students add
					you to their account you will start to see their practice information below and you will see
					different links in the side navigation.
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
import { mapState, mapActions } from 'vuex';
export default {
	name: 'landing',
	computed: {
		...mapState(['students', 'status', 'announcement', 'teacher', 'user']),
	},
	data: () => ({
		currentUser: firebase.auth().currentUser,
	}),
	created() {
		this.getUser(this.currentUser.uid)
			.then(this.findTeacher(this.currentUser.uid))
			.then(this.fetchStudents(this.currentUser.uid));
	},
	methods: {
		...mapActions(['getUser']),
		fetchStudents(uid) {
			this.$store.dispatch('fetchStudents', uid);
		},
		findTeacher(id) {
			this.$store.dispatch('findTeacher', id);
		},
	},
};
</script>
