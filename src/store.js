import Vue from 'vue';
import Vuex from 'vuex';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null,
		message: null,
		teacherId: null,
		teacherName: null,
		error: '',
		status: '',
		students: [],
	},
	mutations: {
		setUser: (state, user) => {
			state.user = user;
		},
		setMessage: (state, message) => {
			state.message = message;
		},
		throwError: (state, error) => {
			state.error = error;
		},
		setStudents: (state, students) => {
			state.students = students;
			//if students exist, this is a teacher
			if (state.students.length) {
				state.status = 'teacher';
			} else {
				state.status = 'student';
			}
		},
		clearAll: state => {
			state.students = [];
			state.status = '';
		},
		clearError: state => {
			state.error = '';
		},
		setTeacher: (state, teacher) => {
			state.teacherId = teacher.uid;
			state.teacherName = teacher.name;
		},
	},
	actions: {
		clearAll({ commit }) {
			commit('clearAll');
		},
		clearError({ commit }) {
			commit('clearError');
		},

		searchTeachers({ commit }, email) {
			commit('clearError');
			let teacher = {};
			firebase
				.firestore()
				.collection('users')
				.where('email', '==', email)
				.get()
				.then(function(querySnapshot) {
					if (querySnapshot.empty) {
						commit('throwError', "Sorry, I can't find that teacher");
					} else {
						querySnapshot.forEach(function(doc) {
							teacher.name = doc.data().name;
							teacher.uid = doc.id;
							commit('setTeacher', teacher);
						});
					}
				})
				.catch(function(error) {
					// eslint-disable-next-line no-console
					console.log('Error getting documents: ', error);
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
