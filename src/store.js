import Vue from 'vue';
import Vuex from 'vuex';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null,
		activeStudent: null,
		practices: [],
		archives: [],
		message: null,
		teacher: null,
		error: '',
		status: '',
		students: [],
	},
	plugins: [createPersistedState()],
	mutations: {
		setUser: (state, user) => {
			state.user = user;
		},
		setActiveStudent: (state, id) => {
			state.activeStudent = id;
		},
		setPractices: (state, practices) => {
			state.practices = practices;
		},
		setArchives: (state, archives) => {
			state.archives = archives;
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
		//all user information from the users collection for currentUser
		getUser({ commit }, uid) {
			let user = [];
			firebase
				.firestore()
				.collection('users')
				.doc(uid)
				.onSnapshot(function(doc) {
					if (typeof doc.data().name !== 'undefined') {
						user.id = doc.id;
						user.name = doc.data().name;
						user.instrument = doc.data().instrument;
						user.reward = doc.data().reward;
						user.practicelength = doc.data().practicelength;
						user.practicesrequired = doc.data().practicesrequired;
						user.practicescompleted = doc.data().practicescompleted;
						user.notify = doc.data().notify;
						commit('setUser', user);
					}
				});
		},

		fetchPractices({ commit }, payload) {
			let practices = [];
			firebase
				.firestore()
				.collection('users')
				.doc(payload.activeStudent)
				.collection('practices')
				.orderBy('updated')
				.onSnapshot(function(querySnapshot) {
					querySnapshot.forEach(function(doc) {
						//filter teachers' archives if in teacher view
						if (payload.teacher) {
							if (!doc.data().teacherarchive) {
								var record = {
									id: doc.id,
									name: doc.data().name,
									instrument: doc.data().instrument,
									updated: doc.data().updated.toDate(),
									reward: doc.data().reward,
									practicescompleted: doc.data().practicescompleted,
									practicesrequired: doc.data().practicesrequired,
									feedback: doc.data().feedback,
									sticker: doc.data().sticker,
									practicelength: doc.data().practicelength,
									goalachieved: doc.data().goalachieved,
								};
								practices.push(record);
							}
						}
						//else filter student archives from student view
						else {
							if (!doc.data().studentarchive) {
								var record = {
									id: doc.id,
									name: doc.data().name,
									instrument: doc.data().instrument,
									updated: doc.data().updated.toDate(),
									reward: doc.data().reward,
									practicescompleted: doc.data().practicescompleted,
									practicesrequired: doc.data().practicesrequired,
									feedback: doc.data().feedback,
									sticker: doc.data().sticker,
									practicelength: doc.data().practicelength,
									goalachieved: doc.data().goalachieved,
								};
								practices.push(record);
							}
						}
					});
					commit('setPractices', practices);
				});
		},

		fetchArchives({ commit }, payload) {
			let archives = [];
			firebase
				.firestore()
				.collection('users')
				.doc(payload.activeStudent)
				.collection('practices')
				.orderBy('updated')
				.onSnapshot(function(querySnapshot) {
					querySnapshot.forEach(function(doc) {
						if (!payload.teacher) {
							if (doc.data().studentarchive) {
								var record = {
									id: doc.id,
									updated: doc.data().updated.toDate(),
									practiceinfo: doc.data(),
								};
								archives.push(record);
							}
						} else {
							if (doc.data().teacherarchive) {
								var record = {
									id: doc.id,
									updated: doc.data().updated.toDate(),
									practiceinfo: doc.data(),
								};
								archives.push(record);
							}
						}
						commit('setArchives', archives);
					});
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
					.then(function() {
						//commit('setArchives', payload.practice);
					});
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
					.then(function() {
						//commit('setArchives', payload.practice);
					});
			}
		},
		awardSticker({ commit }, payload) {
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
				.then(function() {
					//commit('setArchives', payload.practice);
				});
		},
		savePractice({ commit }, payload) {
			// eslint-disable-next-line no-console
			console.log(payload);

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
				.then(function() {
					//commit('setUser', payload);
					//this.getUser(payload.uid);
					//todo - query users
				});
		},
	},
});
