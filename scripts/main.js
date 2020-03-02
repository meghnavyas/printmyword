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

let db = adminportal.firestore();

// Field to hold the query limit
var queryLimit = 5;

// Field to hold the query to retrieve the first N documents
var first = db.collection("sub_items").orderBy('item_date', 'desc').limit(queryLimit);

/*--------------------------------------------------------------------------------------
                            Method to paginate the queries
---------------------------------------------------------------------------------------*/
function paginateQuery(query) {

    query.get().then(function (documentSnapshots) {

        // Get the last visible document
        var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        console.log("last", lastVisible);

        // Construct a new query starting at this document,
        // get the next N queries
        var next = db.collection('sub_items')
            .orderBy('item_date', 'desc')
            .startAfter(lastVisible)
            .limit(queryLimit);
    });

}


/*--------------------------------------------------------------------------------------
        Method to read data from Cloud Firestore documents and display in table
---------------------------------------------------------------------------------------*/
function readDocuments(query) {

    // var first = db.collection("sub_items").orderBy('item_date', 'desc').limit(5);

    query.get().then(

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


/*--------------------------------------------------------------------------------------
            View Submission File from Firebase Storage
---------------------------------------------------------------------------------------*/
function viewSubmission(loc) {

    // Field to hold the location of the file in Cloud Storage
    let location = loc;

    let imagesRef = storageRef.child(location);

    imagesRef.getDownloadURL().then((url) => {

        window.open(url, "_blank");
    });


}


/*--------------------------------------------------------------------------------------
                Method to add a new record to table for each submission
---------------------------------------------------------------------------------------*/
function addRecord(tableID, subItem) {
    // Get a reference to the table
    let tableRef = document.getElementById(tableID);

    // Insert a row at the end of the table
    let newRow = tableRef.insertRow(-1);

    // TITLE
    let cellTitle = newRow.insertCell(0);
    let newText = document.createTextNode(subItem.item_title);
    cellTitle.appendChild(newText);

    // Finding user details
    let ownerDetail = new Owner("", "", "");
    ownerDetail = findOwner(subItem.item_ownerUid);

    // AUTHOR Name
    let cellAuthor = newRow.insertCell(1);
    newText = document.createTextNode(ownerDetail.name);
    cellAuthor.appendChild(newText);

    // AUTHOR EMAIL
    let cellEmail = newRow.insertCell(2);
    newText = document.createTextNode(ownerDetail.email);
    cellEmail.appendChild(newText);

    // DATE OF SUBMISSION
    let cellSubDate = newRow.insertCell(3);
    let itemDate = subItem.item_date.toDate().toDateString();
    newText = document.createTextNode(itemDate);
    cellSubDate.appendChild(newText);

    // SUBMISSION FILE
    let cellSubFile = newRow.insertCell(4);
    newText = document.createTextNode("View");
    cellSubFile.appendChild(newText);
    cellSubFile.onclick = function () { viewSubmission(subItem.item_loc); }
    //cellSubFile.addEventListener('click', viewSubmission(subItem.item_loc), true);


    // STATUS cell
    let cellStatusCheckbox = newRow.insertCell(5);
    let button = document.createElement("input");
    button.type = "checkbox";
    button.classList.add("switch");
    cellStatusCheckbox.appendChild(button);

    // Empty cell to display STATUS in text
    let cellStatus = newRow.insertCell(6);
    newText = document.createTextNode(subItem.item_status);
    if (newText.data == "BOOKED")
        button.checked = true;
    cellStatus.appendChild(newText);

    button.onclick = function () { changeStatus(newText, subItem.item_loc); }

}


/*--------------------------------------------------------------------------------------
                    Method to change status of a Submission record
---------------------------------------------------------------------------------------*/
function changeStatus(text, item) {

    if (text.data == "NEW") {
        // Replace the status from "NEW" to "BOOKED"
        text.replaceData(0, 100, "BOOKED");

        // Get the corresponding document in database
        db.collection("sub_items").where("item_loc", "==", item).get().then((snapshot) => {

            // Get the document's auto-generated id
            const docRefId = snapshot.docs[0].id;
            console.log("doc : " + docRefId);

            // Create a reference to the obtained document
            var SubRef = db.collection("sub_items").doc(docRefId);

            // Update the status value
            return SubRef.update({
                item_status: "BOOKED"
            })
                .then(function () {
                    console.log("Document successfully updated!");
                })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });

        });
    }


    else if (text.data == "BOOKED") {
        text.replaceData(0, 10, "NEW");

        // Get the corresponding document in database
        db.collection("sub_items").where("item_loc", "==", item).get().then((snapshot) => {

            // Get the document's auto-generated id
            const docRefId = snapshot.docs[0].id;
            console.log("doc : " + docRefId);

            // Create a reference to the obtained document
            var SubRef = db.collection("sub_items").doc(docRefId);

            // Update the status value
            return SubRef.update({
                item_status: "NEW"
            })
                .then(function () {
                    console.log("Document successfully updated!");
                })
                .catch(function (error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });

        });

    }


}


/*--------------------------------------------------------------------------------------
                        Implementing pagination on the table
---------------------------------------------------------------------------------------*/
function loadNext() {

}


/*--------------------------------------------------------------------------------------
                            Method to implement Sign Out
---------------------------------------------------------------------------------------*/
function signOut() {
    adminportal.auth().signOut();
    console.log('signed out');

}

adminportal.auth().onAuthStateChanged(function (user) {
    // [END_EXCLUDE]
    if (user) {
        readDocuments(first);
    } else {
        window.location = "./pmw_login.html";
    }
});

