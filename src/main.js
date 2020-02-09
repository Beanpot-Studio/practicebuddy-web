import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { firebase } from '@firebase/app';
import '@firebase/auth';
Vue.config.productionTip = false;
import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);
import VueConfetti from 'vue-confetti';
Vue.use(VueConfetti);
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
Vue.use(VueMoment, {
	moment,
});

let app = '';

// Initialize Firebase
firebase.initializeApp({
	apiKey: 'AIzaSyD1zfCdGei1OU9wphWTu8wNjarjwe-rRwQ',
	authDomain: 'practicebuddy-4d466.firebaseapp.com',
	databaseURL: 'https://practicebuddy-4d466.firebaseio.com',
	projectId: 'practicebuddy-4d466',
	storageBucket: 'practicebuddy-4d466.appspot.com',
	messagingSenderId: '858571045381',
	appId: '1:858571045381:web:67671429fee58cc0bb7a6c',
});

firebase.auth().onAuthStateChanged(user => {
	//fetch all information about user
	if (user !== null) {
		//store.dispatch('fetchUser', user.uid);
	}
	if (!app) {
		app = new Vue({
			store,
			router,
			render: h => h(App),
		}).$mount('#app');
	}
});
