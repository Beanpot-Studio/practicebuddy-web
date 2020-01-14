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
					<form @submit.prevent="submit">
						<div class="field">
							<label class="label">Teacher Email</label>

							<div class="control">
								<input
									v-model="email"
									:class="validClass"
									type="email"
									id="email"
									placeholder="My Teacher's Email Address"
									v-model.trim="$v.email.$model"
								/>
							</div>
							<div v-if="submitStatus == 'ERROR'">
								<p class="help is-danger">Field is required</p>
							</div>
						</div>

						<div class="field">
							<div class="control">
								<button
									type="submit"
									:disabled="submitStatus === 'PENDING'"
									class="button is-link"
									@click="submit"
								>
									Submit
								</button>
							</div>
						</div>
					</form>
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
					<button class="button is-danger">
						No, this isn't my teacher
					</button>
				</div>
			</div>
		</div>
	</main>
</template>
<script>
//import { firebase } from '@firebase/app';
//import '@firebase/auth';
//import '@firebase/firestore';
import { mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
	computed: {
		...mapState(['teacher', 'error', 'message', 'user']),
	},
	data() {
		return {
			claimed: false,
			validClass: 'input',
			email: '',
			submitStatus: null,
			//currentUser: firebase.auth().currentUser,
		};
	},
	validations: {
		email: {
			required,
		},
	},
	methods: {
		submit() {
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR';
				this.validClass = 'input is-danger';
			} else {
				// do your submit logic here
				this.submitStatus = 'PENDING';
				this.validClass = 'input';
				this.$store.dispatch('searchTeachers', this.email);
				setTimeout(() => {
					this.submitStatus = 'OK';
					this.validClass = 'input';
				}, 500);
			}
		},
		claimTeacher(id) {
			this.claimed = true;
			this.$store.dispatch('claimTeacher', {
				userId: this.user.uid,
				teacherId: id,
				name: this.user.name,
				instrument: this.user.instrument,
			});
		},
	},
};
</script>
