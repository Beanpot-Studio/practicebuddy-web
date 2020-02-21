<template>
	<main class="column is-half main">
		<div class="box main-content">
			<h1 class="title is-size-3">Settings</h1>
			<h2 class="subtitle">Fill in these settings to customize your practices</h2>
			<div class="columns">
				<div class="column">
					<div v-if="message !== ''">
						<article class="message is-success">
							<div class="message-body">{{ message }}</div>
						</article>
					</div>

					<form @submit.prevent="submit">
						<div class="field">
							<label class="label">Name</label>
							<div class="control">
								<input v-model.trim="$v.myName.$model" :class="validClass" type="text" />
							</div>
							<div v-if="submitStatus == 'ERROR'">
								<p class="help is-danger">Field is required</p>
							</div>
						</div>

						<div class="field" v-if="teacher != null">
							<label class="label">Teacher Name</label>
							<div class="control">
								<input class="input" disabled :placeholder="teacher.name || ''" />
							</div>
						</div>

						<div v-else>
							<article class="message is-danger">
								<div class="message-body">
									It looks like you don't have a teacher associated to your practices. If this is an
									error, go to the 'My Teacher' page to search for your teacher.
								</div>
							</article>
						</div>

						<div class="field">
							<label class="label">Working Towards This Reward</label>
							<div class="control">
								<input
									v-model.trim="$v.myReward.$model"
									:class="validClass"
									type="text"
									:placeholder="myReward"
								/>
							</div>
							<div v-if="submitStatus == 'ERROR'">
								<p class="help is-danger">Field is required</p>
							</div>
						</div>

						<div class="field">
							<label class="label">Number of Practices Required to Receive This Reward</label>
							<div class="control">
								<input
									class="input"
									v-model.trim="$v.myPracticesRequired.$model"
									type="number"
									:placeholder="myPracticesRequired"
								/>
								<div v-if="submitStatus == 'ERROR'">
									<p class="help is-danger">Field is required</p>
								</div>
							</div>
						</div>

						<div class="field">
							<label class="label">Practice Length in Minutes</label>
							<div class="control">
								<input
									class="input"
									type="number"
									v-model.trim="$v.myPracticeLength.$model"
									:placeholder="myPracticeLength"
									min="1"
									max="5"
								/>
							</div>
						</div>

						<div class="field">
							<label class="label">Notify Your Teacher of Every Practice Submission</label>
							<div class="control">
								<input type="checkbox" v-model="myNotify" :value="user.notify" />
							</div>
						</div>

						<div class="field">
							<label class="label">Instrument</label>
							<div class="control">
								<div class="select">
									<select v-model="myInstrument">
										<option>none</option>
										<option
											v-for="instrument in instruments"
											:key="instrument"
											:value="instruments.indexOf(instrument)"
											>{{ instrument }}</option
										>
									</select>
								</div>
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
									Save
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</main>
</template>
<script>
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';

export default {
	name: 'settings',
	computed: {
		...mapState(['user', 'teacher']),
	},
	validations: {
		myName: {
			required,
		},
		myReward: {
			required,
		},
		myPracticesRequired: {
			required,
		},
		myPracticeLength: {
			required,
		},
	},
	created() {
		this.myInstrument = this.user.instrument;
		this.myName = this.user.name;
		this.myReward = this.user.reward;
		this.myPracticesRequired = this.user.practicesrequired;
		this.myPracticeLength = this.user.practicelength;
		this.myNotify = this.user.notify;
	},
	data: () => ({
		currentUser: firebase.auth().currentUser,
		message: '',
		submitStatus: null,
		validClass: 'input',
		instrument: null,
		myName: null,
		myInstrument: 'none',
		myReward: 'A trip to the candy store!',
		myPracticesRequired: null,
		myPracticeLength: null,
		instruments: [
			'acoustic guitar',
			'banjo',
			'cello',
			'clarinet',
			'elecric guitar',
			'flute',
			'french horn',
			'handbells',
			'harp',
			'mandolin',
			'music',
			'oboe',
			'organ',
			'percussion',
			'piano',
			'sax',
			'trombone',
			'trumpet',
			'violin',
			'voice',
			'xylophone',
		],
	}),

	methods: {
		submit() {
			this.$v.$touch();
			// eslint-disable-next-line no-console
			console.log(this.myName);
			if (this.myName == '') {
				this.submitStatus = 'ERROR';
				this.validClass = 'input is-danger';
			} else {
				this.submitStatus = 'PENDING';
				this.validClass = 'input';
				this.$store.dispatch('updateUser', {
					name: this.myName,
					reward: this.myReward,
					uid: this.currentUser.uid,
					practicesrequired: parseInt(this.myPracticesRequired),
					instrument: this.myInstrument,
					practicelength: parseInt(this.myPracticeLength),
					notify: this.myNotify,
				});
				setTimeout(() => {
					this.submitStatus = 'OK';
					this.validClass = 'input';
					this.message = 'Your settings have been saved!';
				}, 500);
			}
		},
	},
};
</script>
