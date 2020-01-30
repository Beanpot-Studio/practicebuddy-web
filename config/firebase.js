// ~config/firebase.js
import * as Firebase from 'firebase/app';
import 'firebase/firestore';

function initFirebase() {
	Firebase.initializeApp({
		// Initialize Firebase
		apiKey: 'AIzaSyD1zfCdGei1OU9wphWTu8wNjarjwe-rRwQ',
		authDomain: 'practicebuddy-4d466.firebaseapp.com',
		databaseURL: 'https://practicebuddy-4d466.firebaseio.com',
		projectId: 'practicebuddy-4d466',
		storageBucket: 'practicebuddy-4d466.appspot.com',
		messagingSenderId: '858571045381',
		appId: '1:858571045381:web:67671429fee58cc0bb7a6c',
	});
	return new Promise((resolve, reject) => {
		Firebase.firestore()
			.enablePersistence()
			.then(resolve)
			.catch(err => {
				if (err.code === 'failed-precondition') {
					reject(err);
					// Multiple tabs open, persistence can only be
					// enabled in one tab at a a time.
				} else if (err.code === 'unimplemented') {
					reject(err);
					// The current browser does not support all of
					// the features required to enable persistence
				}
			});
	});
}

export { Firebase, initFirebase };
