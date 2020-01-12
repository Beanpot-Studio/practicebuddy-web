import Vue from 'vue';
import Router from 'vue-router';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

import Login from '@/views/Login.vue';
import About from '@/views/About.vue';

import Home from '@/views/Home.vue';
import Settings from '@/views/Settings.vue';
import TeacherSearch from '@/views/TeacherSearch.vue';
import StudentPractices from '@/views/StudentPractices.vue';
import Practice from '@/views/Practice.vue';

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
			path: '/home',
			name: 'home',
			component: Home,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/teachersearch',
			name: 'teachersearch',
			component: TeacherSearch,
			meta: {
				requiresAuth: true,
			},
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
			path: '/practice',
			name: 'practice',
			component: Practice,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: '/studentpractices/:id',
			name: 'studentpractices',
			component: StudentPractices,
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
		next('home');
	} else {
		next();
	}
});

export default router;
