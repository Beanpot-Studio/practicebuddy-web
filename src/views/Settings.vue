<template>
	<main class="column is-half main">
		<div class="box main-content">
			<h1 class="title is-size-3">Settings</h1>
			<h2 class="subtitle">Fill in these settings to customize your practices</h2>
			<div class="columns">
				<div class="column">
					<div class="field">
						<label class="label">Name</label>
						<div class="control">
							<input class="input" type="text" :placeholder="user.name" />
						</div>
					</div>

					<div class="field">
						<label class="label">Teacher Name</label>
						<div class="control">
							<input class="input" disabled type="email" :value="teacher.name" />
						</div>
					</div>

					<div class="field">
						<label class="label">Working Towards This Reward</label>
						<div class="control">
							<input class="input" type="text" :placeholder="user.reward" />
						</div>
					</div>

					<div class="field">
						<label class="label">Practices Required to Receive This Reward</label>
						<div class="control">
							<input class="input" type="number" :placeholder="user.practicesrequired" min="1" max="5" />
						</div>
					</div>

					<div class="field">
						<label class="label">Practices Completed</label>
						<div class="control">
							<input class="input" type="number" :placeholder="user.practicescompleted" min="1" max="5" />
						</div>
					</div>

					<div class="field">
						<label class="label">Practice Length in Minutes</label>
						<div class="control">
							<input class="input" type="number" :placeholder="user.practicelength" min="1" max="5" />
						</div>
					</div>

					<div class="field">
						<label class="label">Notify Your Teacher of Every Practice Submission</label>
						<div class="control">
							<input type="radio" name="notify" value="yes" /> Yes<br />
							<input type="radio" name="notify" value="no" /> No<br />
						</div>
					</div>

					<div class="field">
						<label class="label">Instrument</label>
						<div class="control">
							<div class="select">
								<select>
									<option v-for="instrument in instruments" :key="instrument" :value="instrument">{{
										instrument
									}}</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>
<script>
//import { firebase } from '@firebase/app';
//import '@firebase/auth';
import { mapState } from 'vuex';
export default {
	name: 'settings',
	computed: {
		...mapState(['user', 'teacher']),
	},

	data: () => ({
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

	created() {
		this.$store.dispatch('findTeacher', this.user.id);
	},
	methods: {},
};
</script>
