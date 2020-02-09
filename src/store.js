import Vue from 'vue';
import Vuex from 'vuex';
import { firebase } from '@firebase/app';
import { vuexfireMutations, firestoreAction } from 'vuexfire';
import '@firebase/firestore';
import '@firebase/auth';
//import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null,
		activeStudent: null,
		practices: [],
		message: null,
		teacher: null,
		error: '',
		//status: '',
		students: [],
	},
	//plugins: [createPersistedState()],
	mutations: {
		...vuexfireMutations,
		/*setUser: (state, user) => {
			state.user = user;
		},*/
		setActiveStudent: (state, id) => {
			state.activeStudent = id;
		},
		
		setMessage: (state, message) => {
			state.message = message;
		},
		throwError: (state, error) => {
			state.error = error;
		},
		/*: (state, students) => {
			state.students = students;
			//if students exist, this is a teacher
			if (state.students.length) {
				state.status = 'teacher';
			} else {
				state.status = 'student';
			}
		},*/
		clearAll: state => {
			//only on logout
			state.students = [];
			state.teacher = null;
			state.user = null;
			//state.status = '';
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

		//bindings to collections
		
		fetchUser: firestoreAction(({ bindFirestoreRef }, payload) => {
			console.log(payload)
			bindFirestoreRef('user', firebase
			.firestore().collection('users')
			.doc(payload))
		}),

		fetchPractices: firestoreAction(({ bindFirestoreRef }, payload) => {
			bindFirestoreRef('practices', firebase
			.firestore().collection('users')
			.doc(payload)
			.collection('practices')
			.orderBy('updated'))
		}),

		fetchStudents: firestoreAction(({ bindFirestoreRef }, payload) => {
			bindFirestoreRef('students', firebase
			.firestore().collection('users')
			.doc(payload)
			.collection('students'))
		}),

		//database changes
	
		awardSticker: firestoreAction(({ state }, payload) => {
			firebase
				.firestore()
				.collection('users')
				.doc(payload.uid)
				.collection('practices')
				.doc(payload.practiceId)
				.set(
					{
						sticker: payload.sticker,
					},
					{ merge: true }
				)
		}),

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
					if (typeof doc.data().teacherId !== 'undefined') {
						teacher.id = doc.data().teacherId;
						firebase
							.firestore()
							.collection('users')
							.doc(teacher.id)
							.onSnapshot(function(doc) {
								let teacher = {};
								teacher.id = doc.id;
								teacher.name = doc.data().name;
								teacher.email = doc.data().email;
								commit('setTeacher', teacher);
								//commit('setAnnouncement', '');
							});
					}
				});
		},
		

		/*fetchStudents({ commit }, uid) {
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
		},*/
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
		updateUser({ commit }, payload) {
			// eslint-disable-next-line no-console
			console.log(payload);
			firebase
				.firestore()
				.collection('users')
				.doc(payload.uid)
				.set(
					{
						name: payload.name,
						reward: payload.reward,
						practicesrequired: payload.practicesrequired,
						instrument: payload.instrument,
						practicelength: payload.practicelength,
						updated: firebase.firestore.Timestamp.fromDate(new Date()),
						notify: payload.notify,
					},
					{ merge: true }
				)
				.then(function() {
					commit('setUser', payload);
				});
		},
		archivePractice({ commit }, payload) {
			if (payload.teacher) {
				firebase
					.firestore()
					.collection('users')
					.doc(payload.uid)
					.collection('practices')
					.doc(payload.practice.id)
					.set(
						{
							teacherarchive: true,
						},
						{ merge: true }
					)
					
			} else {
				firebase
					.firestore()
					.collection('users')
					.doc(payload.uid)
					.collection('practices')
					.doc(payload.practice.id)
					.set(
						{
							studentarchive: true,
						},
						{ merge: true }
					)
					
			}
		},
		
		savePractice(payload) {
			//update users
			firebase
				.firestore()
				.collection('users')
				.doc(payload.uid)
				.set(
					{
						practicescompleted: payload.practicescompleted,
					},
					{ merge: true }
				)
				.then(function() {
					let goalachieved = false;
					if (payload.practicescompleted == payload.practicesrequired) {
						goalachieved = true;
					}
					//add a practice to the users collection
					firebase
						.firestore()
						.collection('users')
						.doc(payload.uid)
						.collection('practices')
						.doc()
						.set({
							instrument: payload.instrument,
							name: payload.name,
							practicelength: payload.practicelength,
							reward: payload.reward,
							practicescompleted: payload.practicescompleted,
							practicesrequired: payload.practicesrequired,
							goalachieved: goalachieved,
							updated: firebase.firestore.Timestamp.fromDate(new Date()),
						});
				})

		},
	},
});
