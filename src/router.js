import Vue from 'vue';
import Router from 'vue-router';
import { firebase } from '@firebase/app';
import '@firebase/auth';

import TeacherLanding from '@/views/TeacherLanding.vue';
import Login from '@/views/Login.vue';
import About from '@/views/About.vue';
import Settings from '@/views/Settings.vue';

Vue.use(Router);

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '*',
			redirect: '/login',
		},
		{
			path: '/',
			redirect: '/login',
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
		},
		{
			path: '/about',
			name: 'about',
			component: About,
		},
		{
			path: '/settings',
			name: 'settings',
			component: Settings,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/teacherlanding',
			name: 'teacherlanding',
			component: TeacherLanding,
			meta: {
				requiresAuth: true,
			},
		},
	],
});

router.beforeEach((to, from, next) => {
	const currentUser = firebase.auth().currentUser;
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	if (requiresAuth && !currentUser) {
		next('login');
	} else if (!requiresAuth && currentUser) {
		//differentiate for students vs. teacher landing
		next('teacherlanding');
	} else {
		next();
	}
});

export default router;
