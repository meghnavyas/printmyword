var fbconfig = {
    apiKey: 'AIzaSyCXFAAlH6cSyNK4PuFkvMw186PfeJPfzaI',
    authDomain: 'sip-app-f21cd.firebaseapp.com',
    projectId: 'sip-app-f21cd',
    databaseURL: "https://sip-app-f21cd.firebaseio.com",
    storageBucket: "sip-app-f21cd.appspot.com"

};
var adminportal;




if (!firebase.apps.length) {
    adminportal = firebase.initializeApp(fbconfig);
} else {
    adminportal = firebase.app();

}

export { adminportal };