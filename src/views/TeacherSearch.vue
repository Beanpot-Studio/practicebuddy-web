<template>
	<main class="column is-half main">
		<div class="box main-content">
			<h1 class="title is-size-3">Find My Teacher</h1>
			<div v-if="error != ''">
				<article class="message is-danger">
					<div class="message-body">{{ error }}</div>
				</article>
			</div>
			<div v-if="message !== null">
				<article class="message is-success">
					<div class="message-body">{{ message }}</div>
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

			<div v-if="teacher != null && !claimed">
				<article class="message is-success">
					<div class="message-body">
						I found someone with that email address! Is
						<b>{{ teacher.name }}</b> your teacher?
					</div>
				</article>
				<div class="buttons">
					<button class="button is-success" @click="claimTeacher(teacher.uid)">
						Yes, associate me with this teacher
					</button>
					<button class="button is-danger">No, this isn't my teacher</button>
				</div>
			</div>
		</div>
	</main>
</template>
<script>
import { firebase } from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';
import { mapState } from 'vuex';

export default {
	computed: {
		...mapState(['teacher', 'error', 'message', 'user']),
	},
	data: () => ({
		claimed: false,
		valid: true,
		email: '',
		emailRules: [v => !!v || 'Email is required'],
		currentUser: firebase.auth().currentUser,
	}),

	methods: {
		submit() {
			this.$store.dispatch('searchTeachers', this.email);
		},
		claimTeacher(id) {
			// eslint-disable-next-line no-console
			this.claimed = true;
			this.$store.dispatch('claimTeacher', {
				userId: this.currentUser.uid,
				teacherId: id,
				name: this.user[0].name,
				instrument: this.user[0].instrument,
			});
		},
	},
};
</script>
