import Vue from 'vue';
import Vuex from 'vuex';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: null,
		message: null,
	},
	mutations: {
		setUser: (state, user) => {
			state.user = user;
		},
		setMessage: (state, message) => {
			state.message = message;
		},
	},
	actions: {
		findTeacher({ commit }, uid) {
			firebase
				.firestore()
				.collection('users')
				.doc(uid)
				.onSnapshot(function(doc) {
					// eslint-disable-next-line no-console
					console.log(doc.data().teacherId);
					if (typeof doc.data().teacherId == 'undefined') {
						commit('setMessage', 'oops');
					} else {
						commit('setMessage', "there's a teacher");
					}
				});
		},
	},
});
