import { adminportal } from './init_firebase.js';


document.getElementById('pmw_login_btn').addEventListener('click', signIn, false);



adminportal.auth().onAuthStateChanged(function(user) {
    // [END_EXCLUDE]
    if (user) {

        window.location = "./index.html";

    } else {
        console.log("not logged in");
    }
});



function signIn() {

    {
        var email = document.getElementById('pmw_email').value;
        var password = document.getElementById('pmw_pass').value;
        if (email.length < 4) {
            alert('Please enter a valid email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a valid password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]

        adminportal.auth().signInWithEmailAndPassword(email, password).then(() => {
            window.location = "./index.html";
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);

            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }

}






/*
function initApp() {
    console.log('hello');


    // Listening for auth state changes.
    // [START authstatelistener]
    adminportal.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        document.getElementById('pmw_login_btn').disabled = true;
        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            console.log(user.uid);
            // [START_EXCLUDE]
            console.log(JSON.stringify(user, null, '  '));
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('pmw_login_btn').disabled = true;
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('pmw_login_btn').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('pmw_login_btn').addEventListener('click', signIn, false);

}
*/
/*


window.onload = function() {
    initApp();
};*/
/*
adminportal.auth().onAuthStateChanged(function(user) {
    // [START_EXCLUDE silent]
    // [END_EXCLUDE]
    if (user) {
        // User is signed in.
        var email = user.email;
        var uid = user.uid;
        console.log(uid);
        // [START_EXCLUDE]
    } else {



        adminportal.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);

        });


    }
});
*/