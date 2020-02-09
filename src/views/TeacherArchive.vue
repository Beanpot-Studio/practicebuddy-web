<template web>
	<main class="column main">
		<div class="main-content">
			<h1 class="title is-size-3">My Students' Archives</h1>

			<div class="columns">
				<router-link
					class="column is-one-third"
					v-for="student in students"
					:key="student.id"
					:to="{
						name: 'teacherstudentarchives',
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
	</main>
</template>

<script>
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { mapState, mapActions } from 'vuex';
export default {
	name: 'landing',
	computed: {
		...mapState([['students'], 'status', 'teacher', 'user']),
	},
	data: () => ({
		currentUser: firebase.auth().currentUser,
	}),
	created() {
		this.fetchUser(this.currentUser.uid)
			.then(this.fetchStudents(this.currentUser.uid))
	},
	methods: {
		...mapActions(['fetchUser', 'fetchStudents']),
		
		
	},
};
</script>
