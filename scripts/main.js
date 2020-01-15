import { adminportal } from './init_firebase.js';

var arrayOfOwners = [];
document.getElementById('pmw_log_out').addEventListener('click', signOut, false);

//OWNER CLASS
class Owner {
    constructor(name, id, email) {
        this.name = name;
        this.id = id;
        this.email = email;
    }

    get ownerName() { return this.name; }
    get ownerId() { return this.id; }
    get ownerEmail() { return this.email; }
    set ownerName(name) { this.name = name; }
    set ownerId(id) { this.id = id; }
    set ownerEmail(email) { this.email = email; }
}


function findOwner(id) {
    console.log(arrayOfOwners.length);
    for (let i = 0; i < arrayOfOwners.length; i++) {
        let curId = arrayOfOwners[i].id;
        if (curId == id) {
            return arrayOfOwners[i];
        }
    }

}


//FIREBASE PART
let fbstorage = adminportal.storage();
let storageRef = fbstorage.ref();



function loadAsset() {
    let db = adminportal.firestore();

    db.collection("sub_items").orderBy('item_date', 'desc').get().then(

        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var item = doc.data();


                let flag = false;

                let id_search = item.item_ownerUid;

                for (let i = 0; i < arrayOfOwners.length; i++) {
                    let curId = arrayOfOwners[i].id;
                    if (curId == id_search) {
                        flag = true;
                        break;
                    }
                }

                if (flag == false) {
                    db.collection('sip_app_users').where('user_Uid', '==', item.item_ownerUid).limit(1).get().then((snapshot) => {

                        let d = snapshot.docs[0];
                        let item2 = d.data();
                        arrayOfOwners.push(new Owner(item2.fname, item.item_ownerUid, item2.user_email));
                        console.log(arrayOfOwners[arrayOfOwners.length - 1]);

                    }).then(() => {
                        addRecord('sub', item);
                    });

                } else { addRecord('sub', item); }

            })
        });
}




function viewSubmission() {

    let location = this.firstChild.data;

    let imagesRef = storageRef.child(location);

    imagesRef.getDownloadURL().then((url) => {

        window.open(url, "_blank");
    });


}



function addRecord(tableID, subItem) {
    // Get a reference to the table
    let tableRef = document.getElementById(tableID);

    // Insert a row at the end of the table
    let newRow = tableRef.insertRow(-1);

    let cellTitle = newRow.insertCell(0);
    let newText = document.createTextNode(subItem.item_title);
    cellTitle.appendChild(newText);

    let cellAuthor = newRow.insertCell(1);
    let ownerDetail = new Owner("", "", "");
    ownerDetail = findOwner(subItem.item_ownerUid);
    newText = document.createTextNode(ownerDetail.email);
    cellAuthor.appendChild(newText);

    let cellSubDate = newRow.insertCell(2);
    let itemDate = subItem.item_date.toDate().toDateString();
    newText = document.createTextNode(itemDate);
    cellSubDate.appendChild(newText);

    let cellSubFile = newRow.insertCell(3);
    newText = document.createTextNode(subItem.item_loc);
    cellSubFile.appendChild(newText);
    cellSubFile.addEventListener('click', viewSubmission, true);

}




function signOut() {
    adminportal.auth().signOut();
    console.log('signed out');

}

adminportal.auth().onAuthStateChanged(function(user) {
    // [END_EXCLUDE]
    if (user) {
        loadAsset();
    } else {
        window.location = "./pmw_login.html";
    }
});



/*
var firebaseConfig = {
    apiKey: "AIzaSyCXFAAlH6cSyNK4PuFkvMw186PfeJPfzaI",
    authDomain: "sip-app-f21cd.firebaseapp.com",
    databaseURL: "https://sip-app-f21cd.firebaseio.com",
    projectId: "sip-app-f21cd",
    storageBucket: "sip-app-f21cd.appspot.com",
    messagingSenderId: "327923839614",
    appId: "1:327923839614:web:a499c6fa10a67b3b065e2f",
    measurementId: "G-28BM793EPZ"
};
*/