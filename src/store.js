import Vue from 'vue';
import Vuex from 'vuex';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null,
		message: null,
		announcement: null,
		teacher: null,
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
		setAnnouncement: (state, announcement) => {
			state.announcement = announcement;
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
			//only on logout
			state.students = [];
			state.teacher = null;
			state.status = '';
		},
		clearTeacher: state => {
			state.teacher = null;
		},
		clearError: state => {
			state.error = '';
		},
		setTeacher: (state, teacher) => {
			state.teacher = teacher;
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
			let teacher = {};
			firebase
				.firestore()
				.collection('users')
				.doc(uid)
				.onSnapshot(function(doc) {
					if (typeof doc.data().teacherId == 'undefined') {
						commit(
							'setAnnouncement',
							"It looks like you don't have a teacher associated to your practices. If this is incorrect, please add your teacher to your account in the My Teacher tab."
						);
					} else {
						teacher.id = doc.data().teacherId;
						firebase
							.firestore()
							.collection('users')
							.doc(teacher.id)
							.onSnapshot(function(doc) {
								let teacher = {};
								teacher.id = doc.uid;
								teacher.name = doc.data().name;
								teacher.email = doc.data().email;
								commit('setTeacher', teacher);
								commit('setAnnouncement', '');
							});
					}
				});
		},
		//all user information from the users collection for currentUser
		getUser({ commit }, uid) {
			let user = [];
			firebase
				.firestore()
				.collection('users')
				.doc(uid)
				.onSnapshot(function(doc) {
					if (typeof doc.data().name !== 'undefined') {
						var record = {
							id: uid,
							name: doc.data().name,
							instrument: doc.data().instrument,
						};
						user.push(record);
					}
					commit('setUser', user);
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
		claimTeacher({ commit }, payload) {
			// eslint-disable-next-line no-console
			console.log(payload);
			var user = {
				instrument: payload.instrument || 'none',
				name: payload.name,
			};
			firebase
				.firestore()
				.collection('users')
				.doc(payload.userId)
				.set({ teacherId: payload.teacherId }, { merge: true })
				//now add this teacherId to the students collection for the teacher
				.then(function() {
					firebase
						.firestore()
						.collection('users')
						.doc(payload.teacherId)
						.collection('students')
						.doc(payload.userId)
						.set({ instrument: user.instrument, name: user.name }, { merge: true });
				})
				.then(function() {
					commit('setMessage', 'Your teacher has been set!');
				})
				.then(function() {
					//commit('clearTeacher');
				});
		},
	},
});
