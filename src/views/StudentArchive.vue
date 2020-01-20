<template
	><div class="main-content">
		<h1 class="title is-size-3">My Practice Archive</h1>

		<div class="columns is-multiline">
			<div v-for="archive in archives" :key="archive.id">
				<div class="column">
					<div class="box has-background-info">
						<article class="media">
							<div class="media-left">
								<figure class="circle has-background-white">
									<img :src="'./instruments/' + archive.instrument + '.png'" alt="Image" />
								</figure>
							</div>
							<div>
								<div class="heading has-text-white">
									Occurred: {{ archive.updated | moment('MMMM Do YYYY, h:mm:ss a') }}
								</div>
								<!--<div class="has-text-white is-size-5">{{ practice.practicelength }}</div>-->
								<!--<div class="has-text-white is-size-5">{{ practice.feedback }}</div>
								<div class="has-text-white is-size-5">
									<img src="../assets/stickers/sticker1.png" />
								</div>
								<div class="has-text-white is-size-5"><i class="fa fa-play"></i> Recording</div>-->
							</div>
						</article>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { mapState, mapActions } from 'vuex';
export default {
	name: 'landing',
	computed: {
		...mapState(['user', 'archives']),
	},
	data: () => ({
		currentUser: firebase.auth().currentUser,
	}),
	created() {
		this.getUser(this.currentUser.uid).then(this.fetchArchives(this.currentUser.uid));
	},
	methods: {
		...mapActions(['getUser']),
		fetchArchives(uid) {
			this.$store.dispatch('fetchArchives', uid);
		},
	},
};
</script>
