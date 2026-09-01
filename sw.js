importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAHF7mVM9Yv71cnqG-C1_P7MfEj1hc6_Bs",
  authDomain: "nestu-02.firebaseapp.com",
  databaseURL: "https://nestu-02-default-rtdb.firebaseio.com",
  projectId: "nestu-02",
  storageBucket: "nestu-02.firebasestorage.app",
  messagingSenderId: "440418278168",
  appId: "1:440418278168:web:15c519eb00200a33435c6d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const titulo = payload.notification.title || "Alerta NewEnergy";
    const opcoes = {
        body: payload.notification.body,
        icon: "./icon.png",
        vibrate: [200, 100, 200]
    };
    self.registration.showNotification(titulo, opcoes);
});
