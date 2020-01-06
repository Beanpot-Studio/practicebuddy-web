import Vue from 'vue';
import Vuex from 'vuex';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null,
		message: null,
		status: null,
		students: [],
	},
	mutations: {
		setUser: (state, user) => {
			state.user = user;
		},
		setMessage: (state, message) => {
			state.message = message;
		},
		setStatus: (state, status) => {
			if (status) {
				state.status = 'teacher';
			} else {
				state.status = 'student';
			}
		},
		setStudents: (state, students) => {
			state.students = students;
		},
	},
	actions: {
		setStatus({ commit }, uid) {
			firebase
				.firestore()
				.collection('users')
				.doc(uid)
				.onSnapshot(function(doc) {
					if (typeof doc.data().type == 'undefined') {
						commit('setStatus', false);
					} else {
						commit('setStatus', true);
					}
				});
		},

		findTeacher({ commit }, uid) {
			firebase
				.firestore()
				.collection('users')
				.doc(uid)
				.onSnapshot(function(doc) {
					if (typeof doc.data().teacherId == 'undefined') {
						commit(
							'setMessage',
							"It looks like you don't have a teacher associated to your practices. If this is incorrect, please add your teacher to your account in the My Teacher tab."
						);
					} else {
						commit('setMessage', '');
					}
				});
		},
		fetchStudents({ commit }, uid) {
			let students = [];
			firebase
				.firestore()
				.collection('users')
				.doc(uid)
				.collection('students')
				.onSnapshot(function(querySnapshot) {
					querySnapshot.forEach(function(doc) {
						var record = {
							id: doc.id,
							name: doc.data().name,
							instrument: doc.data().instrument,
						};
						students.push(record);
					});
					commit('setStudents', students);
				});
		},
	},
});
