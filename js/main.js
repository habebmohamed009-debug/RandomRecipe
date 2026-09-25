var contactName=document.getElementById("contactFullName");
var contactPhone=document.getElementById("contactPhoneNum");
var contactMail=document.getElementById("contactEmail");
var contactAddress=document.getElementById("contactAddress");
var contactGroup=document.getElementById("contactGroup");
var contactNotes=document.getElementById("contactNotes");
var favouriteContact=document.getElementById("favouriteContact");
var emergencyContact=document.getElementById("emergencyContact");
var noFavContacts=document.getElementById("noFavourites")
var noEmergencyContacts=document.getElementById("noEmergencyContacts")
var searchInput = document.getElementById("searchContact");
var noContacts=document.getElementById("noContacts")
var saveAndUpdateBtn=document.getElementById("saveBtn")
var currentIndx=null;
var regex={
    contactFullName:{
        regexValue:/^[a-zA-Z]+([\s][a-zA-Z]+)+$/,
        isValid:false
    },
    contactPhoneNum:{
        regexValue:/^01[0125]\d{8}$/,
        isValid:false
    },
    contactEmail:{
        regexValue:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        isValid:false
    }
}

var contactList=[];
if(localStorage.getItem("contactList")!=null){
    contactList=JSON.parse(localStorage.getItem("contactList"))
    displayContacts(contactList)
}
function addContact(){
    var contact={
        contactName:contactName.value,
        phone:contactPhone.value,
        mail:contactMail.value,
        address:contactAddress.value,
        group:contactGroup.value,
        notes:contactNotes.value,
        favouriteContact:favouriteContact.checked,
        emergencyContact:emergencyContact.checked
    }
    contactList.push(contact);
        Swal.fire({
            title: " Added",
            icon: "success",
            html: `
                Contact has been added successfully
            `
            });
    localStorage.setItem("contactList",JSON.stringify(contactList))
    displayContacts(contactList);
    noContacts.classList.add("d-none")
    calTotal()

    
}

function displayContacts(list){
    var temp1=` `
    var temp2=``
    var temp3=``
    for(let i=0 ; i<list.length;i++){
        var startLetters = "";
        var contactsNames = list[i].contactName.split(" ");
        for (var j = 0; j < contactsNames.length; j++) {
            startLetters += contactsNames[j][0];
        }
        temp1+=`
            <div class="col-12 col-lg-6">
                <div class="inner contact h-100  border rounded-4 bg-white overflow-hidden d-flex flex-column justify-content-between ">
                    <div class="head p-3">
                        <div class="d-flex nameAndNum gap-3">
                            <div  class=" position-relative bg-info p-3 rounded-3 ">
                                <span class="text-uppercase">${startLetters}</span>
                                        <i class="${list[i].favouriteContact?'':'d-none'} fa-solid fa-star position-absolute rounded-circle border border-3 border-white d-flex justify-content-center align-items-center " style="color: #ffffff;"></i>
                                        <i class="${list[i].emergencyContact?'':'d-none'} fa-solid fa-heart-pulse  position-absolute rounded-circle border border-3 border-white d-flex justify-content-center align-items-center " style="color:#fff ;"></i>
                            </div>
                            <div class="">
                                <h5 class="h6 fw-bold">${list[i].contactName}</h5>
                                <span class="d-flex "><i class="fa-solid fa-phone icon d-flex justify-content-center align-items-center  rounded-2  me-2"></i> <span class="text-secondary h6">${list[i].phone}</span></span>
                            </div>
                        </div>
                        ${list[i].mail?`

                        <p class="email d-flex align-items-center mt-2"><i class="fa-solid fa-envelope fa-sm me-2 icon d-flex justify-content-center align-items-center rounded-2"></i> <span class="text-secondary fw-semibold fa-sm">${list[i].mail}</span></p>
                        `:`<br/>`}
                        ${list[i].address ? `
                            <p class="location d-flex align-items-center mt-2">
                                <i class="fa-solid fa-location-dot fa-sm me-2 icon d-flex justify-content-center align-items-center rounded-2"></i>
                                <span class="text-secondary fw-semibold fa-sm">${list[i].address}</span>
                            </p>
                        ` : `<br/>`}
                        <div class="badges">
                            ${list[i].group && list[i].group !== "Select a group" ? `
                                <span class="group text-capitalize fa-xs fw-semibold py-1 px-2 rounded-2">${list[i].group}</span>
                            ` : ``}
                            ${list[i].emergencyContact == true ? `
                                <span class="emergency fa-xs fw-semibold py-1 px-2 rounded-2">
                                    <i class="fa-solid fa-heart-pulse text-capitalize "></i> Emergency
                                </span>
                            ` : ``}
                        </div>
                    </div>
                    <div class="footer  d-flex justify-content-between p-3">
                        <div class="contact d-flex gap-2">
                            <button type="button "   class="call border-0 gap-2 rounded-2"><a href="tel:${list[i].phone}" class="text-decoration-none  border-0 gap-2 rounded-2"><i class="fa-solid fa-phone icon d-flex justify-content-center align-items-center  rounded-2  "></i></a></button>
                            ${list[i].mail?`
                            <a href="mailto:${list[i].mail}" class="text-decoration-none border-0 gap-2 rounded-2 mail px-2 py-1" title="Send Email" ><i class="fa-solid fa-envelope fa-sm  icon d-flex justify-content-center align-items-center rounded-2"></i></a>
                        `:`<br/>`}
                            
                        </div>
                        <div class="actions d-flex gap-2">
                            <button type="button" onclick="addTofav(${i})" class="border-0 rounded-2 "><i class="${list[i].favouriteContact ? 'fa-solid text-warning' : 'fa-regular'} fa-star" ></i></button>
                            <button type="button" onclick="addToEmergency(${i})" class="border-0 rounded-2 "><i class=" ${list[i].emergencyContact? 'fa-solid fa-heart-pulse text-danger':'fa-regular fa-heart '}"></i></button>
                            <button onclick="getContactToUpdate(${i})" data-bs-toggle="modal" data-bs-target="#staticBackdrop" type="button" class="border-0 rounded-2 "><i class="fa-solid fa-pen"></i></button>
                            <button onclick="deleteContact(${i})"    type="button" class="border-0 rounded-2 "><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div> 
        `;
        if(list[i].favouriteContact  ==true){
        temp2+=`
        <div class="col-6 col-md-12">
            <div class="inner mb-2 d-flex justify-content-between align-items-center  p-2 rounded-3">
                <div class="text d-flex gap-2 align-items-center ">
                    <span  class="neck-name text-white fw-semibold p-3 rounded-3 d-flex justify-content-center align-items-center text-uppercase"> ${startLetters} </span>
                    <div class="">
                        <span class="fw-bold fa-sm "><small>${list[i].contactName}</small></span>
                        <p class=" fw-semibold fa-sm text-secondary mt-2"><small>${list[i].phone}</small></p>
                    </div>
                </div>
                <i class="fa-solid fa-phone icon d-flex justify-content-center align-items-center rounded-2"></i>
            </div>
        </div> 
        `
        } ;
        if(list[i].emergencyContact==true){
                temp3+=`
                    <div class="col-6 col-md-12">
                        <div class="inner mb-2 d-flex justify-content-between align-items-center  p-2 rounded-3">
                            <div class="text d-flex gap-2 align-items-center ">
                                <span  class="neck-name text-white fw-semibold p-3 rounded-3 d-flex justify-content-center align-items-center text-uppercase"> ${startLetters} </span>
                                <div class="">
                                    <span class="fw-bold fa-sm "><small>${list[i].contactName}</small></span>
                                    <p class=" fw-semibold fa-sm text-secondary mt-2"><small>${list[i].phone}</small></p>
                                </div>
                            </div>
                            <i class="fa-solid fa-phone icon d-flex justify-content-center align-items-center rounded-2"></i>
                        </div>
                    </div> 
                `
        }
    }
    document.getElementById("myContact").innerHTML=temp1;
    document.getElementById("myFavouriteContact").innerHTML=temp2
    document.getElementById("myEmergencyContacts").innerHTML=temp3
    
    if (list.length != 0) {
        noContacts.classList.add("d-none");
    } else {
        noContacts.classList.remove("d-none");
    }

    if (temp2 !== "") {
        noFavContacts.classList.add("d-none");
    } else {
        noFavContacts.classList.remove("d-none");
    }
    if (temp3 !== "") {
        noEmergencyContacts.classList.add("d-none");
    } else {
        noEmergencyContacts.classList.remove("d-none");
    }

    calTotal()
    calcFavContacts()
    calcEmergencyContacts()
}

function deleteContact(indx){
    Swal.fire({
        title: "Delete Contact?",
        text: "Are you sure you want to delete s s? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed){
            contactList.splice(indx,1)
            localStorage.setItem("contactList",JSON.stringify(contactList));
            displayContacts(contactList);
        Swal.fire({
            title: "Deleted!",
            text: "Your contact has been deleted.",
            icon: "success"
            });
        }
    });
}   
function getContactToUpdate(index){
    currentIndx=index
    contactName.value=contactList[index].contactName
    contactPhone.value=contactList[index].phone
    contactMail.value=contactList[index].mail
    contactAddress.value=contactList[index].address
    contactGroup.value=contactList[index].group
    contactNotes.value=contactList[index].notes
    favouriteContact.checked=contactList[index].favouriteContact
    emergencyContact.checked=contactList[index].emergencyContact
    regex.contactFullName.isValid = true;
    regex.contactPhoneNum.isValid = true;
    regex.contactEmail.isValid = true;
    contactName.classList.add("is-valid");
    contactPhone.classList.add("is-valid");
    contactMail.classList.add("is-valid");
    }

function updateContact(){
    contactList[currentIndx].contactName= contactName.value
    contactList[currentIndx].phone=contactPhone.value
    contactList[currentIndx].mail=contactMail.value
    contactList[currentIndx].address=contactAddress.value
    contactList[currentIndx].group=contactGroup.value
    contactList[currentIndx].notes=contactNotes.value
    contactList[currentIndx].favouriteContact=favouriteContact.checked
    contactList[currentIndx].emergencyContact=emergencyContact.checked
    localStorage.setItem("contactList",JSON.stringify(contactList))
    displayContacts(contactList)
    currentIndx=null;
        Swal.fire({
            title: " Updated",
            icon: "success",
            html: `
                Contact has been updated successfully
            `
            });
    }

function addProductOrUpdateContact() {
    
    if (regex.contactFullName.isValid == false) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Name',
            text: 'Please enter a name for the contact!',
        });
        return;
    }
    
        if (preventDublicate ()==true){
        Swal.fire({
            icon: 'warning', 
            title: 'Duplicate Phone Number',
            text: `A contact with this phone number already exists`,
            confirmButtonColor: '#d33' 
        });
        return;
    }

    if (regex.contactPhoneNum.isValid == false) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Phone',
            text: 'Please enter a phone number!',
        });
        return; 
    }
    
    if (currentIndx == null) {
        addContact()
    } else {
        updateContact()
    }
    clearForm();
    document.querySelector('.btn-close').click();
}

function clearForm(){
    contactName.value=null
    contactPhone.value=null
    contactMail.value=null
    contactAddress.value=null
    contactGroup.value=null
    contactNotes.value=null
    favouriteContact.checked = false;
    emergencyContact.checked = false;
    contactName.classList.remove("is-valid", "is-invalid");
    contactPhone.classList.remove("is-valid", "is-invalid");
    contactMail.classList.remove("is-valid", "is-invalid");
    regex.contactFullName.isValid = false;
    regex.contactPhoneNum.isValid = false;
    regex.contactEmail.isValid = false;

}

function calTotal(){
let total =0
    for(let i=0;i<contactList.length;i++){
        total++    
    }
    console.log(total)
    document.getElementById("totalContacts").innerHTML=total
}
function calcFavContacts(){
    let favContactsNum=0
    for(let i=0;i<contactList.length;i++){
        if(contactList[i].favouriteContact==true){
            favContactsNum++
        }
    }
    document.getElementById("favContactsNum").innerHTML=favContactsNum
}
function addTofav(index){
    if(contactList[index].favouriteContact==false){
        contactList[index].favouriteContact=true

    }else
    {
        contactList[index].favouriteContact=false
    }
    localStorage.setItem("contactList",JSON.stringify(contactList))
    displayContacts(contactList)
}
function calcEmergencyContacts(){
    let emergencyContactsNum=0
    for(let i=0;i<contactList.length;i++){
        if(contactList[i].emergencyContact==true){
            emergencyContactsNum++
        }
    }
    document.getElementById("emergencyContactsNum").innerHTML=emergencyContactsNum
}
function addToEmergency(index){
    if(contactList[index].emergencyContact==true){
        contactList[index].emergencyContact=false
    }else
    {
        contactList[index].emergencyContact=true
    }
    localStorage.setItem("contactList",JSON.stringify(contactList))
    displayContacts(contactList)
}
function searchContact(){
    
    let searchedContacts=[]
    for(let i=0;i<contactList.length;i++){
        if(contactList[i].contactName.toLowerCase().includes(searchInput.value.toLowerCase())
        ||contactList[i].phone.startsWith(searchInput.value)
        ||contactList[i].mail.toLowerCase().startsWith(searchInput.value.toLowerCase())){
            searchedContacts.push(contactList[i])
        }
    }
    displayContacts(searchedContacts)
}
function validateInputs(item){
    if(regex[item.id].regexValue.test(item.value)==true){
        item.classList.remove("is-invalid")
        item.classList.add("is-valid")
        item.nextElementSibling.classList.add("d-none")
        regex[item.id].isValid=true;
    }
    else{
        item.classList.add("is-invalid")
        item.classList.remove("is-valid")
        item.nextElementSibling.classList.remove("d-none")
        regex[item.id].isValid=false;
    }

}
function preventDublicate (){
        for(let i=0;i<contactList.length;i++){
            if( contactList[i].phone==contactPhone.value){
                if(currentIndx==null||currentIndx!=i){
                    return true
                }
            }
        }
        return false
    }
