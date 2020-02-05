const formPopup = document.querySelector(".form-popup");
const addButton = document.querySelector(".add");
const closeButton = document.querySelector(".close");
const saveButton = document.querySelector(".save");
const table = document.querySelector("table");
const showBtn = document.querySelector(".show");

let bookName = document.getElementById("bookname");
let authorName = document.getElementById("authorname");
let numPages = document.getElementById("numberofpages");
let hasRead = document.getElementById("hasRead");

addButton.addEventListener('click', () =>{
    formPopup.style.display = "block";
    console.log("Adding Record...");
});

showBtn.addEventListener('click', () =>{

    var content = document.getElementById("content");
    if(content.style.display === "block"){
        content.style.display = "none";
    }
    else{
        content.style.display = "block";
        document.querySelector("tbody").innerHTML = "";
        retrieveData();
    }
});

function Book(title, author, numPages, hasRead){
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.hasRead = hasRead;
}

function isValid(){
    if(bookName.value === "" || authorName.value === "" || numPages.value === ""){
        return false;
    }
    else{
        return true;
    }
}
    
let libraryData = [];

saveButton.addEventListener('click', () => {
    let isDataValid = isValid();
    if(isDataValid === false){
        alert("Enter valid data");

    }
    else{    
        libraryData.push(
        {
            "title" : bookName.value,
            "author" : authorName.value,
            "pages" : numPages.value,
            "hasRead" : hasRead.checked == true ? "yes" : "no",
            "delete" : "",
        }); 
        bookName.value = "";
        authorName.value = "";
        numPages.value = "";
        hasRead.value = "";
        
        writeToDatabase(libraryData);
        document.querySelector("tbody").innerHTML = "";
        retrieveData();
        alert("Record Saved. Press show data to view data table");
    }
});

closeButton.addEventListener('click', () =>{
    formPopup.style.display = "none";
    libraryData = [];
});

//headers for table
var arrayHead = ["Book", "Author", "Pages", "Read", "Delete"];

function buildTable(){
    var table = document.createElement("table");
    table.className = "booksTable"
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var headRow = document.createElement("tr");

    arrayHead.forEach(function(el) {
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(el));
        headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function addRow(data, keys){

    var tbody = document.querySelector("tbody");
    var table = document.querySelector("table");
    var i = 1;

    data.forEach(function(el){
        var tr = document.createElement("tr");
        tr.setAttribute("class", "data-row"+i);
        for(var o in el){
            var td = document.createElement("td");

            if(o === "delete"){
                let delButton = document.createElement("button");
                delButton.setAttribute("value", "delete");
                delButton.setAttribute("class", "delete-data");
                delButton.setAttribute("onclick", "removeData(this)");
                delButton.setAttribute("onclick", "removeFromDB(this)");
                delButton.innerText = "Delete";
                td.appendChild(delButton);
            }
            else{
                td.appendChild(document.createTextNode(el[o]));
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        i++;
    });

    table.appendChild(tbody);

    for(var j = 1, k = 0; k < keys.length; k++, j++){   
        var tr = document.querySelector(".data-row"+j);
        tr.setAttribute("id", keys[k]);
    }
}

function removeData(r){
    var tbody = document.querySelector("tbody");

    var key = r.parentNode.parentNode.getAttribute("id");
    console.log("key :" , key);
    tbody.deleteRow(key.rowIndex);
}

function removeFromDB(r){
    var database = firebase.database();
    var booksRef = database.ref('books');

    var key = r.parentNode.parentNode.getAttribute("id");
    booksRef.child(key).remove().then(function(){
        console.log("Remove success");
    }).catch(function(error){
        console.log("Remove failed : ", error);
    });
    
    document.querySelector("tbody").innerHTML = "";
    retrieveData();
}

function writeToDatabase(libraryData){
    var database = firebase.database();
    var ref = database.ref('books');

    var data = {};

    for(var i = 0; i < libraryData.length; i++){
        data = {
            title: libraryData[i].title,
            author: libraryData[i].author,
            pages: libraryData[i].pages,
            hasRead: libraryData[i].hasRead,
        }    
    }

    ref.push(data);
}

function retrieveData(){
    var database = firebase.database();
    var ref = database.ref('books');

    ref.on('value', gotData, errData);
}

function gotData(data){
    var books = data.val();
    var keys = Object.keys(books);
    var retrievedLibraryData = [];
    for(var i = 0; i < keys.length; i++){
        var k = keys[i];
        var title = books[k].title;
        var author = books[k].author;
        var pages = books[k].pages;
        var hasRead = books[k].hasRead;

        retrievedLibraryData.push({
            "title" : title,
            "auhtor" : author,
            "pages" : pages,
            "hasRead" : hasRead,
            "delete" : "",
        })
        console.log(title, " : ",author, " : ",pages, " : " ,hasRead);
    }
    addRow(retrievedLibraryData, keys);
}

function errData(err){
    console.log('Error!');
    console.log(err)
}

window.onload = function(){
    document.getElementById("content").appendChild(buildTable(libraryData));  
    
    var firebaseConfig = {
        apiKey: "AIzaSyCWmTs2-msewpVxIqFhV_e1PcIoiXR7Zr8",
        authDomain: "library-21d4f.firebaseapp.com",
        databaseURL: "https://library-21d4f.firebaseio.com",
        projectId: "library-21d4f",
        storageBucket: "library-21d4f.appspot.com",
        messagingSenderId: "449117850650",
        appId: "1:449117850650:web:4670e155854ed351a515a3",
        measurementId: "G-T8NT4SC767"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      this.retrieveData();
}