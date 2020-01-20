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
		<!--what a student sees-->
		<div class="main-content" v-else>
			<h1 class="title is-size-3">My Practices</h1>

			<div class="columns is-multiline">
				<div v-for="practice in practices" :key="practice.id">
					<div class="column">
						<div class="box has-background-info">
							<article class="media">
								<div class="media-left">
									<figure class="circle has-background-white">
										<img :src="'./instruments/' + practice.instrument + '.png'" alt="Image" />
									</figure>
								</div>

								<div>
									<div class="heading has-text-white">
										Occurred: {{ practice.updated | moment('MMMM Do YYYY, h:mm:ss a') }}
									</div>
									<div
										v-if="practice.reward && practice.reward !== ''"
										class="heading has-text-white"
									>
										Practice {{ practice.practicescompleted }} out of
										{{ practice.practicesrequired }}; working Towards: {{ practice.reward }}
									</div>
									<div class="has-text-white is-size-5">{{ practice.practicelength }}</div>
									<div v-if="practice.feedback" class="has-text-white is-size-5">
										{{ practice.feedback }}
									</div>
									<div v-if="practice.sticker" class="has-text-white is-size-5">
										<img src="../assets/stickers/sticker1.png" />
									</div>
									<div v-if="practice.recording" class="has-text-white is-size-5">
										<i class="fa fa-play"></i> Recording
									</div>
								</div>
								<div
									class="button media-right has-text-link has-background-light is-2"
									@click="archive(practice.id)"
								>
									<figure><i class="fas fa-archive "></i></figure>
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
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { mapState, mapActions } from 'vuex';
export default {
	name: 'landing',
	computed: {
		...mapState(['students', 'status', 'teacher', 'user', 'practices']),
	},
	data: () => ({
		currentUser: firebase.auth().currentUser,
	}),
	created() {
		this.getUser(this.currentUser.uid)
			.then(this.findTeacher(this.currentUser.uid))
			.then(this.fetchStudents(this.currentUser.uid))
			.then(this.fetchPractices(this.currentUser.uid));
	},
	methods: {
		...mapActions(['getUser']),
		fetchStudents(uid) {
			this.$store.dispatch('fetchStudents', uid);
		},
		fetchPractices(uid) {
			this.$store.dispatch('fetchPractices', uid);
		},
		findTeacher(uid) {
			this.$store.dispatch('findTeacher', uid);
		},
		archive(id) {
			this.$store.dispatch('archivePractice', { uid: this.currentUser.uid, id: id });
		},
	},
};
</script>
