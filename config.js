import * as firebase from 'firebase'


require("@firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyA7IQgstP73epznnatk08QwR6Uijw7ehUo",
    authDomain: "async-ball-429ec.firebaseapp.com",
    databaseURL: "https://async-ball-429ec-default-rtdb.firebaseio.com",
    projectId: "async-ball-429ec",
    storageBucket: "async-ball-429ec.appspot.com",
    messagingSenderId: "964556510233",
    appId: "1:964556510233:web:d896764d72d4f085c88688"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore()