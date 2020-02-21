<template>
	<main class="column is-half main">
		<div class="box main-content has-text-centered">
			<h1 class="title is-size-3">Practice Time!</h1>
			<div v-if="notification !== ''">
				<article class="message is-success">
					<div class="message-body">
						{{ notification }}&nbsp;
						<button class="button is-link is-light is-small" @click="stopConfetti()">Stop confetti!</button>
					</div>
				</article>
			</div>
			<img
				class="circle has-background-white-ter"
				v-if="user.instrument"
				:src="'./instruments/' + user.instrument + '.png'"
				alt="Image"
			/>
			<img class="circle has-background-white-ter" v-else :src="'./instruments/none.png'" alt="Image" />
			<div v-if="message" class="notification is-warning">{{ message }}</div>
			<div v-else>
				<h2 class="subtitle">
					You have completed {{ user.practicescompleted }} practices out of {{ user.practicesrequired }}
				</h2>
				<h3>You're working towards: {{ user.reward }}</h3>
				<h3>You're scheduled to practice for {{ user.practicelength }} minutes</h3>
				<div class="timer columns is-size-2">
					<h2 class="column has-text-link is-1 is-offset-4 has-text-centered">{{ minutes }}</h2>
					<h2 class="column has-text-link is-2 has-text-centered">&nbsp;:&nbsp;</h2>
					<h2 class="column has-text-link is-1 has-text-centered">{{ seconds }}</h2>
				</div>

				<div class="practiceButton">
					<button
						class="button is-full is-link is-rounded is-large"
						@click="startTimer()"
						:disabled="timerRunning"
					>
						{{ timerRunning ? 'Stop Practicing' : 'Start Practicing' }}
					</button>
				</div>

				<h2>Record one minute of your practice session.</h2>

				<!--<div class="circle has-background-primary has-text-white icon is-large" @click="startRecording()">
					<i class="fa fa-microphone"></i>
				</div>-->
				<audio-recorder
					upload-url="https://console.cloud.google.com/storage/browser/practicebuddy-bucket"
					:attempts="3"
					:time="1"
					:before-recording="callback"
					:pause-recording="callback"
					:after-recording="callback"
					:select-record="callback"
					:before-upload="callback"
					:successful-upload="callback"
					:failed-upload="callback"
				/>

				<div class="columns">
					<div class="column practiceButton">
						<button
							class="button is-full is-warning is-rounded is-medium"
							@click="pauseTimer()"
							:disabled="!timerRunning"
						>
							Pause Timer
						</button>
					</div>
					<div class="column practiceButton">
						<button
							:disabled="!timerRunning"
							class="button is-full is-danger is-rounded is-medium"
							@click="stopTimer()"
						>
							Stop Timer
						</button>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>
<script>
//import * as fb from 'firebase';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { mapState, mapActions } from 'vuex';

export default {
	name: 'practice',
	computed: {
		...mapState(['user', 'teacher']),
	},
	data: () => ({
		currentUser: firebase.auth().currentUser,
		message: '',
		practicescompleted: 0,
		myTimer: null,
		timerRunning: false,
		minutes: 0,
		seconds: 0,
		runningSeconds: 0,
		notification: '',
		goalAchieved: false,
	}),
	async mounted() {
		// eslint-disable-next-line no-console
		//console.log(fb);
		//const storageRef = firebase.app().storage('gs://practicebuddy-4d466.appspot.com');
		// eslint-disable-next-line no-console
		//console.log(storageRef);
	},
	created() {
		if (this.user.instrument == undefined) {
			this.message = "Before starting, please set up  your preferences in the 'Settings' tab.";
		}
		this.getPractices();
	},

	methods: {
		...mapActions(['fetchUser']),
		start() {
			if (this.user.practicelength != this.minutes) {
				if (this.timerRunning) {
					if (this.seconds < 2 && this.seconds >= 0) {
						++this.seconds;
					} else {
						this.seconds = 0;
						++this.minutes;
					}
				}
			} else {
				clearInterval(this.myTimer, 1000);
				this.timerRunning = false;
				this.minutes = 0;
				this.seconds = 0;
				this.practicescompleted++;

				//save practice session on completion, add to practices completed. Notify teacher if required
				this.$store
					.dispatch('savePractice', {
						uid: this.currentUser.uid,
						practicescompleted: parseInt(this.practicescompleted),
						name: this.user.name,
						instrument: this.user.instrument,
						practicesrequired: parseInt(this.user.practicesrequired),
						reward: this.user.reward,
						practicelength: parseInt(this.user.practicelength),
					})
					.then(() => {
						//goal has been achieved
						if (this.practicescompleted == this.user.practicesrequired) {
							this.$confetti.start();
							this.notification = "Congratulations, you've completed a goal!";
							this.practicescompleted = 0;
						}
					});
			}
		},
		callback(data) {
			//email this over
			/*var name = +new Date() + '-' + data.name;
			var storageRef = firebase.storage().ref();
			storageRef
				.child(name)
				.put(data)
				.then(snapshot => snapshot.ref.getDownloadURL())
				.then(url => {
					// eslint-disable-next-line no-console
					console.log(url);
				})
				// eslint-disable-next-line no-console
				.catch(console.error);
*/
			/*const ref = storage().ref();
			const file = data;
			const name = (+new Date()) + '-' + file.name;
			const metadata = {
			contentType: file.type
			};
			const task = ref.child(name).put(file, metadata);
			task
			.then(snapshot => snapshot.ref.getDownloadURL())
			.then((url) => {
				console.log(url);

			})
			.catch(console.error);*/
		},
		stopConfetti() {
			this.$confetti.stop();
		},

		startTimer() {
			this.timerRunning = !this.timerRunning;
			this.myTimer = setInterval(this.start, 1000);
		},
		pauseTimer() {
			this.timerRunning = !this.timerRunning;
			clearInterval(this.myTimer, 1000);
		},
		stopTimer() {
			this.timerRunning = !this.timerRunning;
			clearInterval(this.myTimer, 1000);
			this.seconds = 0;
			this.minutes = 0;
		},
		getPractices() {
			if (this.user.practicescompleted == this.user.practicesrequired) {
				//goal has been achieved
				this.practicescompleted == 0;
			}
		},
	},
};
</script>
<style scoped>
.practiceButton,
.circle,
.timer {
	margin: 15px;
}
.is-closed {
	height: 0px;
}
.is-open {
	height: 200px;
}
.ar {
	width: 100%;
	margin-top: 10px;
}
</style>
