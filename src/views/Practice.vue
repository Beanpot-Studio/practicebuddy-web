<template>
	<main class="column is-half main">
		<div class="box main-content has-text-centered">
			<h1 class="title is-size-3">Practice Time!</h1>

			<img v-if="user.instrument" :src="'./instruments/' + user.instrument + '.png'" alt="Image" />
			<img v-else :src="'./instruments/none.png'" alt="Image" />
			<div v-if="msg" class="notification is-warning">
				{{ msg }}
			</div>
			<div v-else>
				<h2 class="subtitle">You have completed X practices out of Y {{ user }}</h2>
			</div>
		</div>
	</main>
</template>
<script>
//import { firebase } from '@firebase/app';
//import '@firebase/auth';
import { mapState } from 'vuex';
export default {
	name: 'practice',
	computed: {
		...mapState(['user']),
	},
	data: () => ({
		//currentUser: firebase.auth().currentUser,
		msg: '',
	}),
	created() {
		//this.$store.dispatch('getUser', this.currentUser.uid);
		// eslint-disable-next-line no-console
		if (this.user.instrument == undefined) {
			this.msg = "Before starting, please set up  your preferences in the 'Settings' tab.";
		}
	},
	methods: {},
};
</script>
