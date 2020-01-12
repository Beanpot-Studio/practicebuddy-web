<template>
	<div>
		<section class="hero is-success is-bold">
			<div class="hero-body">
				<div class="columns is-vcentered">
					<div class="column is-one-third is-offset-1 is-centered home-elements">
						<h1 class="title is-1 is-bold home-elements">
							Let's Play!
						</h1>
						<h2 class="subtitle is-3 home-elements">
							Practice Buddy is the musical student's preferred app and the music teacher's best toolkit
						</h2>

						<a class="home-elements button is-full is-link is-rounded is-large" @click="loginWithGoogle()">
							<span class="icon">
								<i class="fab fa-google"></i>
							</span>
							<span>Sign in with Google</span>
						</a>
					</div>

					<div class="column is-two-thirds is-centered">
						<Lottie
							className="animation"
							renderer="canvas"
							:loop="true"
							:autoplay="true"
							:animationData="guitarPlayer"
							@getLottieInstance="getLottieInstance"
						/>
					</div>
				</div>
			</div>
		</section>

		<section class="section has-background-white-ter">
			<div class="container">
				<div class="title-wrapper has-text-centered">
					<h2 class="title is-2">For Music Teachers and Their Students</h2>
					<div class="divider is-centered"></div>
				</div>

				<div class="content-wrapper">
					<div class="columns">
						<div class="column is-one-third">
							<div class="card has-text-centered">
								<p class="title is-4">
									Monitor
								</p>
								<Lottie
									className="animation"
									renderer="canvas"
									:loop="true"
									:autoplay="true"
									:animationData="trumpet"
									@getLottieInstance="getLottieInstance"
								/>

								<div class="card-text">
									<p>
										Practice Buddy includes the ability to login, save preferences, time and record
										practice sessions, and review progress via lists of sessions.
									</p>
								</div>
							</div>
						</div>
						<div class="column">
							<div class="card  has-text-centered">
								<p class="title is-4">Record Progress</p>

								<Lottie
									className="animation"
									renderer="canvas"
									:loop="true"
									:autoplay="true"
									:animationData="guitar"
									@getLottieInstance="getLottieInstance"
								/>

								<div class="card-text">
									<p>
										Once a goal is achieved, the app sends an email to the teacher, requesting
										feedback.
									</p>
								</div>
							</div>
						</div>
						<div class="column">
							<div class="card has-text-centered">
								<p class="title is-4">Get Feedback</p>
								<div class="card-icon">
									<Lottie
										className="animation"
										renderer="canvas"
										:loop="true"
										:autoplay="true"
										:animationData="violin"
										@getLottieInstance="getLottieInstance"
									/>
								</div>
								<div class="card-text">
									<p>
										The student can check the feedback section of the app to get comments and
										stickers from their music teacher. Teachers use the app to track their students'
										sessions.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script>
import { firebase } from '@firebase/app';
import '@firebase/auth';
import Lottie from 'vue-lottie-web';
import guitarPlayer from '@/assets/guitarplayer.json';
import guitar from '@/assets/guitar.json';
import violin from '@/assets/violin.json';
import trumpet from '@/assets/trumpet.json';

export default {
	components: { Lottie },

	name: 'Home',
	props: {
		msg: String,
	},
	data() {
		return {
			guitarPlayer,
			guitar,
			violin,
			trumpet,
			lottieInstance: '',
		};
	},
	methods: {
		loginWithGoogle() {
			const provider = new firebase.auth.GoogleAuthProvider();
			firebase
				.auth()
				.signInWithPopup(provider)
				.then(res => {
					// save user to db
					let uid = res.user.uid;
					let data = {};
					data = {
						name: res.user.displayName,
						email: res.user.email,
					};

					firebase
						.firestore()
						.collection('users')
						.doc(uid)
						.set(data, { merge: true });
				})
				.then(() => {
					this.$router.replace('home');
				})
				.catch(err => {
					// TODO:
					alert(err.message);
				});
		},
		getLottieInstance(lottieInstance) {
			this.lottieInstance = lottieInstance;
		},
		lottiePlay() {
			this.lottieInstance && this.lottieInstance.play();
		},
		lottieRePlay() {
			this.lottieInstance && this.lottieInstance.stop();
			setTimeout(() => {
				this.lottieInstance.play();
			});
		},
	},
};
</script>

<style scoped>
.card {
	border-radius: 5px;
	margin: 5px;
	padding: 10px;
	height: 100%;
}

.card-text,
.title {
	padding-top: 10px;
}
.content-wrapper {
	padding-bottom: 10px;
}
</style>
