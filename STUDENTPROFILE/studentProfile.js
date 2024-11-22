const firebaseConfig = {
    apiKey: "AIzaSyAV7L0ZetJ0PzfExRLm71hrr9NBa_UHKbY",
    authDomain: "arck-co-little-trackie.firebaseapp.com",
    projectId: "arck-co-little-trackie",
    storageBucket: "arck-co-little-trackie.appspot.com",
    messagingSenderId: "786902861892",
    appId: "1:786902861892:web:5a7e98db05c43f6e7cd411"
};
firebase.initializeApp(firebaseConfig);

// Reference to the Firestore database
const db = firebase.firestore();
const studentFormDB = db.collection("Students");
const gradesDB = db.collection("Grades");
const classroomFormDB = db.collection("Classrooms");

// Global variable for storing the current student ID
let currentStudentId = null;

function showContent (contentId) {
    // Hide
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.style.display = 'none');

    // Show
    const selectedContent = document.getElementById(contentId);
    selectedContent.style.display = 'block';


    const navLinks = document.querySelectorAll('.mininavbar ul li a');

    // Add event listener to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevent default link behavior
            event.preventDefault();
                
            // Remove active class and reset font weight for all links
            navLinks.forEach(link => {
                link.classList.remove('active');
                
            });

            // Add active class to the clicked link and set it to bold
            this.classList.add('active');
            element.style.fontWeight = 'bold'; 
        });
    });
}

showContent('grossMotorDevelopment');

function toggleRows(button) {
    // Find the table row that contains the clicked button
    const currentRow = button.closest('.table-row');
    const icon = button.querySelector('.icon'); // Find the icon element inside the button

    // Find the corresponding dropdown rows that follow the current row
    let nextRow = currentRow.nextElementSibling;
    let isExpanded = nextRow.style.display === 'grid';

    // Toggle the display of the dropdown rows until a non-dropdown row is found
    while (nextRow && nextRow.classList.contains('dropdown-row')) {
        nextRow.style.display = isExpanded ? 'none' : 'grid';
        nextRow = nextRow.nextElementSibling; // Move to the next row
    }

    // Change the icon based on the dropdown's visibility
    icon.textContent = isExpanded ? "►" : "▼";
}

    // Function to validate input
    function validateInput(inputField) {
        const allowedValues = ["A", "P", "B", "E", "NI"]; // Allowed inputs
        const value = inputField.value.toUpperCase(); // Convert to uppercase

        // Allow valid single or multi-character inputs
        if (!allowedValues.some(validValue => value === validValue.slice(0, value.length))) {
            inputField.value = ""; // Clear the field if invalid
        } else if (allowedValues.includes(value)) {
            inputField.value = value; // Accept valid input
        }
    }

function displayStudentProfile(studentId) {
    console.log("Displaying Student ID:", studentId);

    const container = document.getElementById('studentProfile');
    if (!container) {
        console.error("Container for student profile not found.");
        return; 
    }

    // Fetch the student data from Firestore
    studentFormDB.doc(studentId).get()
    .then((doc) => {
        if (!doc.exists) {
            container.innerHTML = '<p>Student not found.</p>';
            return;
        }

        const data = doc.data();

        // Set the current student ID for saving grades
        currentStudentId = studentId; 

        // Set the student's full name in the respective element
        document.getElementById('studentFullName').innerText = `${data.sFirstName} ${data.sLastName}`;
        console.log("student Data:", data);

        // Determine the profile picture based on gender
        let profilePicture = '/assets/defaultProfile.png'; // default image if gender is not found
        if (data.sGender === 'male') {
            profilePicture = '/assets/boy.png'; // set male profile image
        } else if (data.sGender === 'female') {
            profilePicture = '/assets/girl.png'; // set female profile image
        }

        // Select the image element with class "profilePicture" and update its source
        const profileImgElement = document.querySelector('.profilePicture');
        profileImgElement.src = profilePicture;

        // Display the student profile information
        container.innerHTML = `
            <div class="student-profile">
                <div class="profile-row">
                    <div class="profile-column">
                        <img src="/assets/IDNumber.png" style="width: 45px; height: 30px; vertical-align: middle; margin-bottom: 2px;">
                        <strong>${data.sIDNumber}</strong> 
                    </div>
                    <div class="profile-column">
                        <img src="/assets/Birthday.png" style="width: 35px; height: 25px; vertical-align: middle; margin-bottom: 5px;  margin-left: 25px;">
                        <strong style="margin-left: 5px;">${data.sDateOfBirth}</strong>
                    </div>
                </div>
                <div class="profile-row">
                    <div class="profile-column">
                        <img src="/assets/Age.png" style="width: 40px; height: 30px; vertical-align: middle; margin-bottom: 1px; margin-left: 1px;">
                        <strong style="margin-left: 4px;">${data.sAge} years old</strong> 
                    </div>
                    <div class="profile-column">
                        <img src="/assets/Gender.png" style="width: 22px; height: 25px; vertical-align: middle; margin-bottom: 5px; margin-left: 30px;">
                        <strong style="margin-left: 13px;">${data.sGender}</strong> 
                    </div>
                </div>
                <div class="profile-row">
                    <div class="profile-column">
                        <img src="/assets/Parent.png" style="width: 30px; height: 25px; vertical-align: middle; margin-bottom: 5px; margin-left: 6px;">
                        <strong style="margin-left: 9px;">${data.sParentOrGuardian}</strong> 
                    </div>
                    <div class="profile-column">
                        <img src="/assets/phone.png" style="width: 22px; height: 22px; vertical-align: middle; margin-bottom: 5px; margin-left: 30px;">
                        <strong style="margin-left: 13px;">${data.sPhoneNumber}</strong> 
                    </div>
                </div>
                <div class="profile-email">
                    <img src="/assets/Email.png" style="width: 22px; height: 25px; vertical-align: middle; margin-bottom: 5px; margin-left: 9px;">
                    <strong style="margin-left: 13px;">${data.sEmail}</strong> 
                </div>
                <div class="profile-email">
                    <img src="/assets/Address.png" style="width: 22px; height: 25px; vertical-align: middle; margin-bottom: 5px; margin-left: 9px;">
                    <strong style="margin-left: 13px;">${data.sAddress}</strong> 
                </div>
            </div>
        `;

        // Fetch the classroom details to get the section and schedule
        return fetchClassroomDetails(data.classroomId); // Return the promise to wait for it
    })
    .then((classroomData) => {
        if (classroomData) {
            // Update the section and schedule in the student profile
            document.getElementById('studentSection').innerText = classroomData.sectionName || 'N/A';
            document.getElementById('studentSchedule').innerText = classroomData.schedule || 'N/A';

            // Select the left container
            const leftContainer = document.querySelector('.left-container');
            const domainHeader = document.querySelector('.domain-header');
            const sRa = document.querySelector('.sra');
            const dropd = document.querySelector('.dropdown-btn');
            const dropd1 = document.querySelector('.dropdown-btn1');
            const dropd2 = document.querySelector('.dropdown-btn2');
            const dropd3 = document.querySelector('.dropdown-btn3');
            const dropd4 = document.querySelector('.dropdown-btn4');
            const dropd5 = document.querySelector('.dropdown-btn5');
            const dropd6 = document.querySelector('.dropdown-btn6');
            const dropd7 = document.querySelector('.dropdown-btn7');
            const dropd8 = document.querySelector('.dropdown-btn8');
            const dropd9 = document.querySelector('.dropdown-btn9');
            const dropd10 = document.querySelector('.dropdown-btn10');
            const dropd11 = document.querySelector('.dropdown-btn11');
            const dropd12 = document.querySelector('.dropdown-btn12');
            const dropd13 = document.querySelector('.dropdown-btn13');
            const dropd14 = document.querySelector('.dropdown-btn14');
            const dropd15 = document.querySelector('.dropdown-btn15');
            const dropd16 = document.querySelector('.dropdown-btn16');
            const dropd17 = document.querySelector('.dropdown-btn17');
            const dropd18 = document.querySelector('.dropdown-btn18');
            const dropd19 = document.querySelector('.dropdown-btn19');
            const dropd20 = document.querySelector('.dropdown-btn20');
            const dropd21 = document.querySelector('.dropdown-btn21');
            const dropd22 = document.querySelector('.dropdown-btn22');
            const dropd23 = document.querySelector('.dropdown-btn23');
            const dropd24 = document.querySelector('.dropdown-btn24');
            const dropd25 = document.querySelector('.dropdown-btn25');
            const dropd26 = document.querySelector('.dropdown-btn26');
            const dropd27 = document.querySelector('.dropdown-btn27');
            const dropd28 = document.querySelector('.dropdown-btn28');
            const dropd29 = document.querySelector('.dropdown-btn29');
            const dropd30 = document.querySelector('.dropdown-btn30');
            const dropd31 = document.querySelector('.dropdown-btn31');
            const dropd32 = document.querySelector('.dropdown-btn32');
            const dropd33 = document.querySelector('.dropdown-btn33');
            const dropd34 = document.querySelector('.dropdown-btn34');
            const dropd35 = document.querySelector('.dropdown-btn35');
            const dropd36 = document.querySelector('.dropdown-btn36');
            const dropd37 = document.querySelector('.dropdown-btn37');
            const dropd38 = document.querySelector('.dropdown-btn38');
            const dropd39 = document.querySelector('.dropdown-btn39');
            const dropd40 = document.querySelector('.dropdown-btn40');
            const dropd41 = document.querySelector('.dropdown-btn41');
            const dropd42 = document.querySelector('.dropdown-btn42');
            const dropd43 = document.querySelector('.dropdown-btn43');
            const dropd44 = document.querySelector('.dropdown-btn44');
            const dropd45 = document.querySelector('.dropdown-btn45');
            const dropd46 = document.querySelector('.dropdown-btn46');
            const dropd47 = document.querySelector('.dropdown-btn47');
            const dropd48 = document.querySelector('.dropdown-btn48');
            const dropd49 = document.querySelector('.dropdown-btn49');
            const dropd50 = document.querySelector('.dropdown-btn50');
            const dropd51 = document.querySelector('.dropdown-btn51');
            const dropd52 = document.querySelector('.dropdown-btn52');
            const dropd53 = document.querySelector('.dropdown-btn53');
            const dropd54 = document.querySelector('.dropdown-btn54');
            const dropd55 = document.querySelector('.dropdown-btn55');
            const dropd56 = document.querySelector('.dropdown-btn56');
            const dropd57 = document.querySelector('.dropdown-btn57');
            const dropd58 = document.querySelector('.dropdown-btn58');
            const dropd59 = document.querySelector('.dropdown-btn59');
            const dropd60 = document.querySelector('.dropdown-btn60');


            const mCode = document.querySelector('.markingCode');
            const mCodeIcon = document.querySelector('.marking-code-icon');
            const mCodeIconP = document.querySelector('.marking-code-icon-p');
            const mCodeIconB = document.querySelector('.marking-code-icon-b');
            const mCodeIconE = document.querySelector('.marking-code-icon-e');
            const mCodeIconN = document.querySelector('.marking-code-icon-n');
            const mCodeRight = document.querySelector('.marking-code-right');
            const mCodeRightP = document.querySelector('.marking-code-right-p');
            const mCodeRightB = document.querySelector('.marking-code-right-b');
            const mCodeRightE = document.querySelector('.marking-code-right-e');
            const mCodeRightN = document.querySelector('.marking-code-right-n');
            const saveButton = document.getElementById('saveGrades')
            const saveButton1 = document.getElementById('saveGrades1')
            const saveButton2 = document.getElementById('saveGrades2')
            const saveButton3 = document.getElementById('saveGrades3')
            const saveButton4 = document.getElementById('saveGrades4')
            const saveButton5 = document.getElementById('saveGrades5')
            const saveButton6 = document.getElementById('saveGrades6')
            console.log("Classroom PreSchool Value:", classroomData.preSchool);

            // Remove any existing preschool classes
            leftContainer.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            domainHeader.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            sRa.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCode.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCodeIcon.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCodeIconP.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCodeIconB.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCodeIconE.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCodeIconN.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCodeRight.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCodeRightP.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCodeRightB.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCodeRightE.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            mCodeRightN.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            saveButton.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            saveButton1.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            saveButton2.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            saveButton3.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            saveButton4.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            saveButton5.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            saveButton6.classList.remove('nursery1', 'nursery2', 'kinder', 'default');

            dropd.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd1.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd2.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd3.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd4.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd5.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd6.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd7.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd8.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd9.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd10.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd11.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd12.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd13.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd14.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd15.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd16.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd17.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd18.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd19.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd20.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd21.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd22.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd23.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd24.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd25.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd26.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd27.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd28.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd29.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd30.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd31.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd32.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd33.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd34.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd35.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd36.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd37.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd38.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd39.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd40.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd41.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd42.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd43.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd44.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd45.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd46.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd47.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd48.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd49.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd50.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd51.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd52.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd53.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd54.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd55.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd56.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd57.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd58.classList.remove('nursery1', 'nursery2', 'kinder', 'default');
            dropd59.classList.remove('nursery1', 'nursery2', 'kinder', 'default');


            // Add class based on the preSchool value
            if (classroomData.preSchool === 'Nursery 1') {
                leftContainer.classList.add('nursery1');
                domainHeader.classList.add('nursery1');
                dropd.classList.add('nursery1');
                dropd1.classList.add('nursery1');
                dropd2.classList.add('nursery1');
                dropd3.classList.add('nursery1');
                dropd4.classList.add('nursery1');
                dropd5.classList.add('nursery1');
                dropd6.classList.add('nursery1');
                dropd7.classList.add('nursery1');
                dropd8.classList.add('nursery1');
                dropd9.classList.add('nursery1');
                dropd10.classList.add('nursery1');
                dropd11.classList.add('nursery1');
                dropd12.classList.add('nursery1');
                dropd13.classList.add('nursery1');
                dropd14.classList.add('nursery1');
                dropd15.classList.add('nursery1');
                dropd16.classList.add('nursery1');
                dropd17.classList.add('nursery1');
                dropd18.classList.add('nursery1');
                dropd19.classList.add('nursery1');
                dropd20.classList.add('nursery1');
                dropd21.classList.add('nursery1');
                dropd22.classList.add('nursery1');
                dropd23.classList.add('nursery1');
                dropd24.classList.add('nursery1');
                dropd25.classList.add('nursery1');
                dropd26.classList.add('nursery1');
                dropd27.classList.add('nursery1');
                dropd28.classList.add('nursery1');
                dropd29.classList.add('nursery1');
                dropd30.classList.add('nursery1');
                dropd31.classList.add('nursery1');
                dropd32.classList.add('nursery1');
                dropd33.classList.add('nursery1');
                dropd34.classList.add('nursery1');
                dropd35.classList.add('nursery1');
                dropd36.classList.add('nursery1');
                dropd37.classList.add('nursery1');
                dropd38.classList.add('nursery1');
                dropd39.classList.add('nursery1');
                dropd40.classList.add('nursery1');
                dropd41.classList.add('nursery1');
                dropd42.classList.add('nursery1');
                dropd43.classList.add('nursery1');
                dropd44.classList.add('nursery1');
                dropd45.classList.add('nursery1');
                dropd46.classList.add('nursery1');
                dropd47.classList.add('nursery1');
                dropd48.classList.add('nursery1');
                dropd49.classList.add('nursery1');
                dropd50.classList.add('nursery1');
                dropd51.classList.add('nursery1');
                dropd52.classList.add('nursery1');
                dropd53.classList.add('nursery1');
                dropd54.classList.add('nursery1');
                dropd55.classList.add('nursery1');
                dropd56.classList.add('nursery1');
                dropd57.classList.add('nursery1');
                dropd58.classList.add('nursery1');
                dropd59.classList.add('nursery1');


                sRa.classList.add('nursery1');
                mCode.classList.add('nursery1');
                mCodeIcon.classList.add('nursery1');
                mCodeIconP.classList.add('nursery1');
                mCodeIconB.classList.add('nursery1');
                mCodeIconE.classList.add('nursery1');
                mCodeIconN.classList.add('nursery1');
                mCodeRight.classList.add('nursery1');
                mCodeRightP.classList.add('nursery1');
                mCodeRightB.classList.add('nursery1');
                mCodeRightE.classList.add('nursery1');
                mCodeRightN.classList.add('nursery1');
                saveButton.classList.add('nursery1');
                saveButton1.classList.add('nursery1');
                saveButton2.classList.add('nursery1');
                saveButton3.classList.add('nursery1');
                saveButton4.classList.add('nursery1');
                saveButton5.classList.add('nursery1');
                saveButton6.classList.add('nursery1');

            } else if (classroomData.preSchool === 'Nursery 2') {
                leftContainer.classList.add('nursery2');
                domainHeader.classList.add('nursery2');
                sRa.classList.add('nursery2');
                dropd.classList.add('nursery2');
                dropd1.classList.add('nursery2');
                dropd2.classList.add('nursery2');
                dropd3.classList.add('nursery2');
                dropd4.classList.add('nursery2');
                dropd5.classList.add('nursery2');
                dropd6.classList.add('nursery2');
                dropd7.classList.add('nursery2');
                dropd8.classList.add('nursery2');
                dropd9.classList.add('nursery2');
                dropd10.classList.add('nursery2');
                dropd11.classList.add('nursery2');
                dropd12.classList.add('nursery2');
                dropd13.classList.add('nursery2');
                dropd14.classList.add('nursery2');
                dropd15.classList.add('nursery2');
                dropd16.classList.add('nursery2');
                dropd17.classList.add('nursery2');
                dropd18.classList.add('nursery2');
                dropd19.classList.add('nursery2');
                dropd20.classList.add('nursery2');
                dropd21.classList.add('nursery2');
                dropd22.classList.add('nursery2');
                dropd23.classList.add('nursery2');
                dropd24.classList.add('nursery2');
                dropd25.classList.add('nursery2');
                dropd26.classList.add('nursery2');
                dropd27.classList.add('nursery2');
                dropd28.classList.add('nursery2');
                dropd29.classList.add('nursery2');
                dropd30.classList.add('nursery2');
                dropd31.classList.add('nursery2');
                dropd32.classList.add('nursery2');
                dropd33.classList.add('nursery2');
                dropd34.classList.add('nursery2');
                dropd35.classList.add('nursery2');
                dropd36.classList.add('nursery2');
                dropd37.classList.add('nursery2');
                dropd38.classList.add('nursery2');
                dropd39.classList.add('nursery2');
                dropd40.classList.add('nursery2');
                dropd41.classList.add('nursery2');
                dropd42.classList.add('nursery2');
                dropd43.classList.add('nursery2');
                dropd44.classList.add('nursery2');
                dropd45.classList.add('nursery2');
                dropd46.classList.add('nursery2');
                dropd47.classList.add('nursery2');
                dropd48.classList.add('nursery2');
                dropd49.classList.add('nursery2');
                dropd50.classList.add('nursery2');
                dropd51.classList.add('nursery2');
                dropd52.classList.add('nursery2');
                dropd53.classList.add('nursery2');
                dropd54.classList.add('nursery2');
                dropd55.classList.add('nursery2');
                dropd56.classList.add('nursery2');
                dropd57.classList.add('nursery2');
                dropd58.classList.add('nursery2');
                dropd59.classList.add('nursery2');


                mCode.classList.add('nursery2');
                mCodeIcon.classList.add('nursery2');
                mCodeIconP.classList.add('nursery2');
                mCodeIconB.classList.add('nursery2');
                mCodeIconE.classList.add('nursery2');
                mCodeIconN.classList.add('nursery2');
                mCodeRight.classList.add('nursery2');
                mCodeRightP.classList.add('nursery2');
                mCodeRightB.classList.add('nursery2');
                mCodeRightE.classList.add('nursery2');
                mCodeRightN.classList.add('nursery2');
                saveButton.classList.add('nursery2');
                saveButton1.classList.add('nursery2');
                saveButton2.classList.add('nursery2');
                saveButton3.classList.add('nursery2');
                saveButton4.classList.add('nursery2');
                saveButton5.classList.add('nursery2');
                saveButton6.classList.add('nursery2');

            } else if (classroomData.preSchool === 'Kinder') {
                leftContainer.classList.add('kinder');
                domainHeader.classList.add('kinder');
                sRa.classList.add('kinder');
                dropd.classList.add('kinder');
                dropd1.classList.add('kinder');
                dropd2.classList.add('kinder');
                dropd3.classList.add('kinder');
                dropd4.classList.add('kinder');
                dropd5.classList.add('kinder');
                dropd6.classList.add('kinder');
                dropd7.classList.add('kinder');
                dropd8.classList.add('kinder');
                dropd9.classList.add('kinder');
                dropd10.classList.add('kinder');
                dropd11.classList.add('kinder');
                dropd12.classList.add('kinder');
                dropd13.classList.add('kinder');
                dropd14.classList.add('kinder');
                dropd15.classList.add('kinder');
                dropd16.classList.add('kinder');
                dropd17.classList.add('kinder');
                dropd18.classList.add('kinder');
                dropd19.classList.add('kinder');
                dropd20.classList.add('kinder');
                dropd21.classList.add('kinder');
                dropd22.classList.add('kinder');
                dropd23.classList.add('kinder');
                dropd24.classList.add('kinder');
                dropd25.classList.add('kinder');
                dropd26.classList.add('kinder');
                dropd27.classList.add('kinder');
                dropd28.classList.add('kinder');
                dropd29.classList.add('kinder');
                dropd30.classList.add('kinder');
                dropd31.classList.add('kinder');
                dropd32.classList.add('kinder');
                dropd33.classList.add('kinder');
                dropd34.classList.add('kinder');
                dropd35.classList.add('kinder');
                dropd36.classList.add('kinder');
                dropd37.classList.add('kinder');
                dropd38.classList.add('kinder');
                dropd39.classList.add('kinder');
                dropd40.classList.add('kinder');
                dropd41.classList.add('kinder');
                dropd42.classList.add('kinder');
                dropd43.classList.add('kinder');
                dropd44.classList.add('kinder');
                dropd45.classList.add('kinder');
                dropd46.classList.add('kinder');
                dropd47.classList.add('kinder');
                dropd48.classList.add('kinder');
                dropd49.classList.add('kinder');
                dropd50.classList.add('kinder');
                dropd51.classList.add('kinder');
                dropd52.classList.add('kinder');
                dropd53.classList.add('kinder');
                dropd54.classList.add('kinder');
                dropd55.classList.add('kinder');
                dropd56.classList.add('kinder');
                dropd57.classList.add('kinder');
                dropd58.classList.add('kinder');
                dropd59.classList.add('kinder');
                

                mCode.classList.add('kinder');
                mCodeIcon.classList.add('kinder');
                mCodeIconP.classList.add('kinder');
                mCodeIconB.classList.add('kinder');
                mCodeIconE.classList.add('kinder');
                mCodeIconN.classList.add('kinder');
                mCodeRight.classList.add('kinder');
                mCodeRightP.classList.add('kinder');
                mCodeRightB.classList.add('kinder');
                mCodeRightE.classList.add('kinder');
                mCodeRightN.classList.add('kinder');
                saveButton.classList.add('kinder');
                saveButton1.classList.add('kinder');
                saveButton2.classList.add('kinder');
                saveButton3.classList.add('kinder');
                saveButton4.classList.add('kinder');
                saveButton5.classList.add('kinder');
                saveButton6.classList.add('kinder');

            } else {
                leftContainer.classList.add('default'); // Default or no color
                domainHeader.classList.add('default');
                sRa.classList.add('default');
                dropd.classList.add('default');
                dropd1.classList.add('default');
                dropd2.classList.add('default');
                dropd3.classList.add('default');
                dropd4.classList.add('default');
                dropd5.classList.add('default');
                dropd6.classList.add('default');
                dropd7.classList.add('default');
                dropd8.classList.add('default');
                dropd9.classList.add('default');
                dropd10.classList.add('default');
                dropd11.classList.add('default');
                dropd12.classList.add('default');
                dropd13.classList.add('default');
                dropd14.classList.add('default');
                dropd15.classList.add('default');
                dropd16.classList.add('default');
                dropd17.classList.add('default');
                dropd18.classList.add('default');
                dropd19.classList.add('default');
                dropd20.classList.add('default');
                dropd21.classList.add('default');
                dropd22.classList.add('default');
                dropd23.classList.add('default');
                dropd24.classList.add('default');
                dropd25.classList.add('default');
                dropd26.classList.add('default');
                dropd27.classList.add('default');
                dropd28.classList.add('default');
                dropd29.classList.add('default');
                dropd30.classList.add('default');
                dropd31.classList.add('default');
                dropd32.classList.add('default');
                dropd33.classList.add('default');
                dropd34.classList.add('default');
                dropd35.classList.add('default');
                dropd36.classList.add('default');
                dropd37.classList.add('default');
                dropd38.classList.add('default');
                dropd39.classList.add('default');
                dropd40.classList.add('default');
                dropd41.classList.add('default');
                dropd42.classList.add('default');
                dropd43.classList.add('default');
                dropd44.classList.add('default');
                dropd45.classList.add('default');
                dropd46.classList.add('default');
                dropd47.classList.add('default');
                dropd48.classList.add('default');
                dropd49.classList.add('default');
                dropd50.classList.add('default');
                dropd51.classList.add('default');
                dropd52.classList.add('default');
                dropd53.classList.add('default');
                dropd54.classList.add('default');
                dropd55.classList.add('default');
                dropd56.classList.add('default');
                dropd57.classList.add('default');
                dropd58.classList.add('default');
                dropd59.classList.add('default');


                mCode.classList.add('default');
                mCodeIcon.classList.add('default');
                mCodeIconP.classList.add('default');
                mCodeIconB.classList.add('default');
                mCodeIconE.classList.add('default');
                mCodeIconN.classList.add('default');
                mCodeRight.classList.add('default');
                mCodeRightP.classList.add('default');
                mCodeRightB.classList.add('default');
                mCodeRightE.classList.add('default');
                mCodeRightN.classList.add('default');
                saveButton.classList.add('default');
                saveButton1.classList.add('default');
                saveButton2.classList.add('default');
                saveButton3.classList.add('default');
                saveButton4.classList.add('default');
                saveButton5.classList.add('default');
                saveButton6.classList.add('default');
            }
        }
        
        // Fetch and display grades for the selected student
        fetchAndDisplayGrades(currentStudentId);
    })
    .catch((error) => {
        console.error("Error retrieving student profile: ", error);
    });
}


// Function to fetch classroom details and return data
function fetchClassroomDetails(classroomId) {
    return classroomFormDB.doc(classroomId).get()
        .then((doc) => {
            if (doc.exists) {
                return doc.data(); // Return the classroom data
            } else {
                console.error("Classroom not found.");
                return null; // Return null if not found
            }
        })
        .catch((error) => {
            console.error("Error retrieving classroom details: ", error);
            return null; // Return null on error
        });
}



// Function to fetch and display grades for the selected student
function fetchAndDisplayGrades(studentId) {
    gradesDB.doc(studentId).get()
        .then((doc) => {
            if (doc.exists) {
                const grades = doc.data();

                // Gross Motor Development | Walks with coordinated altering arm movements
                document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd1").value = grades.Walks_with_coordinated_altering_arm_movements_gmd1 || '';
                document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd2").value = grades.Walks_with_coordinated_altering_arm_movements_gmd2 || '';
                document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd3").value = grades.Walks_with_coordinated_altering_arm_movements_gmd3 || '';
                document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd4").value = grades.Walks_with_coordinated_altering_arm_movements_gmd4 || '';
                document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd1").value = grades.Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd1 || '';
                document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd2").value = grades.Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd2 || '';
                document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd3").value = grades.Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd3 || '';
                document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd4").value = grades.Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd4 || '';
                document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd1").value = grades.QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd1 || '';
                document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd2").value = grades.QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd2 || '';
                document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd3").value = grades.QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd3 || '';
                document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd4").value = grades.QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd4 || '';
                document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd1").value = grades.TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd1 || '';
                document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd2").value = grades.TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd2 || '';
                document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd3").value = grades.TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd3 || '';
                document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd4").value = grades.TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd4 || '';

                // Gross Motor Development | Jumps forward at least 2 times without falling
                document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd1").value = grades.Jumps_forward_at_least_2_times_without_falling_gmd1 || '';
                document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd2").value = grades.Jumps_forward_at_least_2_times_without_falling_gmd2 || '';
                document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd3").value = grades.Jumps_forward_at_least_2_times_without_falling_gmd3 || '';
                document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd4").value = grades.Jumps_forward_at_least_2_times_without_falling_gmd4 || '';
                document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd1").value = grades.Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd1 || '';
                document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd2").value = grades.Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd2 || '';
                document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd3").value = grades.Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd3 || '';
                document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd4").value = grades.Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd4 || '';
                document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd1").value = grades.QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd1 || '';
                document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd2").value = grades.QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd2 || '';
                document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd3").value = grades.QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd3 || '';
                document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd4").value = grades.QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd4 || '';
                document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd1").value = grades.TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd1 || '';
                document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd2").value = grades.TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd2 || '';
                document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd3").value = grades.TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd3 || '';
                document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd4").value = grades.TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd4 || '';

                // Gross Motor Development | Runs with coordinated alternating arm movements
                document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd1").value = grades.Runs_with_coordinated_alternating_arm_movements_gmd1 || '';
                document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd2").value = grades.Runs_with_coordinated_alternating_arm_movements_gmd2 || '';
                document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd3").value = grades.Runs_with_coordinated_alternating_arm_movements_gmd3 || '';
                document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd4").value = grades.Runs_with_coordinated_alternating_arm_movements_gmd4 || '';
                document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd1").value = grades.Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd1 || '';
                document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd2").value = grades.Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd2 || '';
                document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd3").value = grades.Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd3 || '';
                document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd4").value = grades.Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd4 || '';
                document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd1").value = grades.QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd1 || '';
                document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd2").value = grades.QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd2 || '';
                document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd3").value = grades.QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd3 || '';
                document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd4").value = grades.QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd4 || '';
                document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd1").value = grades.TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd1 || '';
                document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd2").value = grades.TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd2 || '';
                document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd3").value = grades.TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd3 || '';
                document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd4").value = grades.TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd4 || '';

                // Gross Motor Development | Moves body parts as directed
                document.getElementById("Moves_body_parts_as_directed_gmd1").value = grades.Moves_body_parts_as_directed_gmd1 || '';
                document.getElementById("Moves_body_parts_as_directed_gmd2").value = grades.Moves_body_parts_as_directed_gmd2 || '';
                document.getElementById("Moves_body_parts_as_directed_gmd3").value = grades.Moves_body_parts_as_directed_gmd3 || '';
                document.getElementById("Moves_body_parts_as_directed_gmd4").value = grades.Moves_body_parts_as_directed_gmd4 || '';
                document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd1").value = grades.Pretest_Moves_body_parts_as_directed_addrowgmd1 || '';
                document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd2").value = grades.Pretest_Moves_body_parts_as_directed_addrowgmd2 || '';
                document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd3").value = grades.Pretest_Moves_body_parts_as_directed_addrowgmd3 || '';
                document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd4").value = grades.Pretest_Moves_body_parts_as_directed_addrowgmd4 || '';
                document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd1").value = grades.QuarterlyExams_Moves_body_parts_as_directed_addrowgmd1 || '';
                document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd2").value = grades.QuarterlyExams_Moves_body_parts_as_directed_addrowgmd2 || '';
                document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd3").value = grades.QuarterlyExams_Moves_body_parts_as_directed_addrowgmd3 || '';
                document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd4").value = grades.QuarterlyExams_Moves_body_parts_as_directed_addrowgmd4 || '';
                document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd1").value = grades.TeachersObservation_Moves_body_parts_as_directed_addrowgmd1 || '';
                document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd2").value = grades.TeachersObservation_Moves_body_parts_as_directed_addrowgmd2 || '';
                document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd3").value = grades.TeachersObservation_Moves_body_parts_as_directed_addrowgmd3 || '';
                document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd4").value = grades.TeachersObservation_Moves_body_parts_as_directed_addrowgmd4 || '';

                // Gross Motor Development | Throws ball with both hands from a distance
                document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd1").value = grades.Throws_ball_with_both_hands_from_a_distance_gmd1 || '';
                document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd2").value = grades.Throws_ball_with_both_hands_from_a_distance_gmd2 || '';
                document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd3").value = grades.Throws_ball_with_both_hands_from_a_distance_gmd3 || '';
                document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd4").value = grades.Throws_ball_with_both_hands_from_a_distance_gmd4 || '';
                document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd1").value = grades.Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd1 || '';
                document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd2").value = grades.Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd2 || '';
                document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd3").value = grades.Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd3 || '';
                document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd4").value = grades.Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd4 || '';
                document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd1").value = grades.QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd1 || '';
                document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd2").value = grades.QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd2 || '';
                document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd3").value = grades.QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd3 || '';
                document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd4").value = grades.QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd4 || '';
                document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd1").value = grades.TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd1 || '';
                document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd2").value = grades.TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd2 || '';
                document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd3").value = grades.TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd3 || '';
                document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd4").value = grades.TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd4 || '';

                // Fine Motor Development | Uses construction toys to build simple objects
                document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd1").value = grades.Uses_construction_toys_to_build_simple_objects_fmd1 || '';
                document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd2").value = grades.Uses_construction_toys_to_build_simple_objects_fmd2 || '';
                document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd3").value = grades.Uses_construction_toys_to_build_simple_objects_fmd3 || '';
                document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd4").value = grades.Uses_construction_toys_to_build_simple_objects_fmd4 || '';
                document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd1").value = grades.Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd1 || '';
                document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd2").value = grades.Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd2 || '';
                document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd3").value = grades.Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd3 || '';
                document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd4").value = grades.Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd4 || '';
                document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd1").value = grades.QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd1 || '';
                document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd2").value = grades.QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd2 || '';
                document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd3").value = grades.QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd3 || '';
                document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd4").value = grades.QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd4 || '';
                document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd1").value = grades.TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd1 || '';
                document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd2").value = grades.TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd2 || '';
                document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd3").value = grades.TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd3 || '';
                document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd4").value = grades.TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd4 || '';

                // Fine Motor Development | Exhibits adequate hand movements such as
                document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd1").value = grades.Exhibits_adequate_hand_movements_such_as_fmd1 || '';
                document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd2").value = grades.Exhibits_adequate_hand_movements_such_as_fmd2 || '';
                document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd3").value = grades.Exhibits_adequate_hand_movements_such_as_fmd3 || '';
                document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd4").value = grades.Exhibits_adequate_hand_movements_such_as_fmd4 || '';
                document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd1").value = grades.Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd1 || '';
                document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd2").value = grades.Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd2 || '';
                document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd3").value = grades.Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd3 || '';
                document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd4").value = grades.Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd4 || '';
                document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd1").value = grades.Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd1 || '';
                document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd2").value = grades.Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd2 || '';
                document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd3").value = grades.Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd3 || '';
                document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd4").value = grades.Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd4 || '';
                document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd1").value = grades.TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd1 || '';
                document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd2").value = grades.TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd2 || '';
                document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd3").value = grades.TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd3 || '';
                document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd4").value = grades.TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd4 || '';

                // Fine Motor Development | Holds pencils/crayons
                document.getElementById("Holds_pencils_crayons_fmd1").value = grades.Holds_pencils_crayons_fmd1 || '';
                document.getElementById("Holds_pencils_crayons_fmd2").value = grades.Holds_pencils_crayons_fmd2 || '';
                document.getElementById("Holds_pencils_crayons_fmd3").value = grades.Holds_pencils_crayons_fmd3 || '';
                document.getElementById("Holds_pencils_crayons_fmd4").value = grades.Holds_pencils_crayons_fmd4 || '';
                document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd1").value = grades.Pretest_Holds_pencils_crayons_addrowfmd1 || '';
                document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd2").value = grades.Pretest_Holds_pencils_crayons_addrowfmd2 || '';
                document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd3").value = grades.Pretest_Holds_pencils_crayons_addrowfmd3 || '';
                document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd4").value = grades.Pretest_Holds_pencils_crayons_addrowfmd4 || '';
                document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd1").value = grades.QuarterlyExams_Holds_pencils_crayons_addrowfmd1 || '';
                document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd2").value = grades.QuarterlyExams_Holds_pencils_crayons_addrowfmd2 || '';
                document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd3").value = grades.QuarterlyExams_Holds_pencils_crayons_addrowfmd3 || '';
                document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd4").value = grades.QuarterlyExams_Holds_pencils_crayons_addrowfmd4 || '';
                document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd1").value = grades.TeachersObservation_Holds_pencils_crayons_addrowfmd1 || '';
                document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd2").value = grades.TeachersObservation_Holds_pencils_crayons_addrowfmd2 || '';
                document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd3").value = grades.TeachersObservation_Holds_pencils_crayons_addrowfmd3 || '';
                document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd4").value = grades.TeachersObservation_Holds_pencils_crayons_addrowfmd4 || '';

                // Fine Motor Development | Colors pictures
                document.getElementById("Colors_pictures_fmd1").value = grades.Colors_pictures_fmd1 || '';
                document.getElementById("Colors_pictures_fmd2").value = grades.Colors_pictures_fmd2 || '';
                document.getElementById("Colors_pictures_fmd3").value = grades.Colors_pictures_fmd3 || '';
                document.getElementById("Colors_pictures_fmd4").value = grades.Colors_pictures_fmd4 || '';
                document.getElementById("Pretest_Colors_pictures_addrowfmd1").value = grades.Pretest_Colors_pictures_addrowfmd1 || '';
                document.getElementById("Pretest_Colors_pictures_addrowfmd2").value = grades.Pretest_Colors_pictures_addrowfmd2 || '';
                document.getElementById("Pretest_Colors_pictures_addrowfmd3").value = grades.Pretest_Colors_pictures_addrowfmd3 || '';
                document.getElementById("Pretest_Colors_pictures_addrowfmd4").value = grades.Pretest_Colors_pictures_addrowfmd4 || '';
                document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd1").value = grades.QuarterlyExams_Colors_pictures_addrowfmd1 || '';
                document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd2").value = grades.QuarterlyExams_Colors_pictures_addrowfmd2 || '';
                document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd3").value = grades.QuarterlyExams_Colors_pictures_addrowfmd3 || '';
                document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd4").value = grades.QuarterlyExams_Colors_pictures_addrowfmd4 || '';
                document.getElementById("TeachersObservation_Colors_pictures_addrowfmd1").value = grades.TeachersObservation_Colors_pictures_addrowfmd1 || '';
                document.getElementById("TeachersObservation_Colors_pictures_addrowfmd2").value = grades.TeachersObservation_Colors_pictures_addrowfmd2 || '';
                document.getElementById("TeachersObservation_Colors_pictures_addrowfmd3").value = grades.TeachersObservation_Colors_pictures_addrowfmd3 || '';
                document.getElementById("TeachersObservation_Colors_pictures_addrowfmd4").value = grades.TeachersObservation_Colors_pictures_addrowfmd4 || '';

                // Fine Motor Development | Traces broken lines and connects dot-to-dot
                document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd1").value = grades.Traces_broken_lines_and_connects_dot_to_dot_fmd1 || '';
                document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd2").value = grades.Traces_broken_lines_and_connects_dot_to_dot_fmd2 || '';
                document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd3").value = grades.Traces_broken_lines_and_connects_dot_to_dot_fmd3 || '';
                document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd4").value = grades.Traces_broken_lines_and_connects_dot_to_dot_fmd4 || '';
                document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1").value = grades.Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1 || '';
                document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2").value = grades.Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2 || '';
                document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3").value = grades.Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3 || '';
                document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4").value = grades.Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4 || '';
                document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1").value = grades.QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1 || '';
                document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2").value = grades.QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2 || '';
                document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3").value = grades.QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3 || '';
                document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4").value = grades.QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4 || '';
                document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1").value = grades.TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1 || '';
                document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2").value = grades.TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2 || '';
                document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3").value = grades.TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3 || '';
                document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4").value = grades.TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4 || '';

                // Fine Motor Development | Draws shapes and simple pictures
                document.getElementById("Draws_shapes_and_simple_pictures_fmd1").value = grades.Draws_shapes_and_simple_pictures_fmd1 || '';
                document.getElementById("Draws_shapes_and_simple_pictures_fmd2").value = grades.Draws_shapes_and_simple_pictures_fmd2 || '';
                document.getElementById("Draws_shapes_and_simple_pictures_fmd3").value = grades.Draws_shapes_and_simple_pictures_fmd3 || '';
                document.getElementById("Draws_shapes_and_simple_pictures_fmd4").value = grades.Draws_shapes_and_simple_pictures_fmd4 || '';
                document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd1").value = grades.Pretest_Draws_shapes_and_simple_pictures_addrowfmd1 || '';
                document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd2").value = grades.Pretest_Draws_shapes_and_simple_pictures_addrowfmd2 || '';
                document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd3").value = grades.Pretest_Draws_shapes_and_simple_pictures_addrowfmd3 || '';
                document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd4").value = grades.Pretest_Draws_shapes_and_simple_pictures_addrowfmd4 || '';
                document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd1").value = grades.QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd1 || '';
                document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd2").value = grades.QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd2 || '';
                document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd3").value = grades.QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd3 || '';
                document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd4").value = grades.QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd4 || '';
                document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd1").value = grades.TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd1 || '';
                document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd2").value = grades.TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd2 || '';
                document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd3").value = grades.TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd3 || '';
                document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd4").value = grades.TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd4 || '';   

                // Fine Motor Development | Writes uppercase letters with model
                document.getElementById("Writes_uppercase_letters_with_model_fmd1").value = grades.Writes_uppercase_letters_with_model_fmd1 || '';
                document.getElementById("Writes_uppercase_letters_with_model_fmd2").value = grades.Writes_uppercase_letters_with_model_fmd2 || '';
                document.getElementById("Writes_uppercase_letters_with_model_fmd3").value = grades.Writes_uppercase_letters_with_model_fmd3 || '';
                document.getElementById("Writes_uppercase_letters_with_model_fmd4").value = grades.Writes_uppercase_letters_with_model_fmd4 || '';
                document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd1").value = grades.Pretest_Writes_uppercase_letters_with_model_addrowfmd1 || '';
                document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd2").value = grades.Pretest_Writes_uppercase_letters_with_model_addrowfmd2 || '';
                document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd3").value = grades.Pretest_Writes_uppercase_letters_with_model_addrowfmd3 || '';
                document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd4").value = grades.Pretest_Writes_uppercase_letters_with_model_addrowfmd4 || '';
                document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd1").value = grades.QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd1 || '';
                document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd2").value = grades.QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd2 || '';
                document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd3").value = grades.QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd3 || '';
                document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd4").value = grades.QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd4 || '';
                document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd1").value = grades.TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd1 || '';
                document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd2").value = grades.TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd2 || '';
                document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd3").value = grades.TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd3 || '';
                document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd4").value = grades.TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd4 || '';   

                // Fine Motor Development | Writes lowercase letters with model
                document.getElementById("Writes_lowercase_letters_with_model_fmd1").value = grades.Writes_lowercase_letters_with_model_fmd1 || '';
                document.getElementById("Writes_lowercase_letters_with_model_fmd2").value = grades.Writes_lowercase_letters_with_model_fmd2 || '';
                document.getElementById("Writes_lowercase_letters_with_model_fmd3").value = grades.Writes_lowercase_letters_with_model_fmd3 || '';
                document.getElementById("Writes_lowercase_letters_with_model_fmd4").value = grades.Writes_lowercase_letters_with_model_fmd4 || '';
                document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd1").value = grades.Pretest_Writes_lowercase_letters_with_model_addrowfmd1 || '';
                document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd2").value = grades.Pretest_Writes_lowercase_letters_with_model_addrowfmd2 || '';
                document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd3").value = grades.Pretest_Writes_lowercase_letters_with_model_addrowfmd3 || '';
                document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd4").value = grades.Pretest_Writes_lowercase_letters_with_model_addrowfmd4 || '';
                document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd1").value = grades.QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd1 || '';
                document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd2").value = grades.QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd2 || '';
                document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd3").value = grades.QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd3 || '';
                document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd4").value = grades.QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd4 || '';
                document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd1").value = grades.TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd1 || '';
                document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd2").value = grades.TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd2 || '';
                document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd3").value = grades.TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd3 || '';
                document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd4").value = grades.TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd4 || '';   

                // Fine Motor Development | Writes nickname without model
                document.getElementById("Writes_nickname_without_model_fmd1").value = grades.Writes_nickname_without_model_fmd1 || '';
                document.getElementById("Writes_nickname_without_model_fmd2").value = grades.Writes_nickname_without_model_fmd2 || '';
                document.getElementById("Writes_nickname_without_model_fmd3").value = grades.Writes_nickname_without_model_fmd3 || '';
                document.getElementById("Writes_nickname_without_model_fmd4").value = grades.Writes_nickname_without_model_fmd4 || '';
                document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd1").value = grades.Pretest_Writes_nickname_without_model_addrowfmd1 || '';
                document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd2").value = grades.Pretest_Writes_nickname_without_model_addrowfmd2 || '';
                document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd3").value = grades.Pretest_Writes_nickname_without_model_addrowfmd3 || '';
                document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd4").value = grades.Pretest_Writes_nickname_without_model_addrowfmd4 || '';
                document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd1").value = grades.QuarterlyExams_Writes_nickname_without_model_addrowfmd1 || '';
                document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd2").value = grades.QuarterlyExams_Writes_nickname_without_model_addrowfmd2 || '';
                document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd3").value = grades.QuarterlyExams_Writes_nickname_without_model_addrowfmd3 || '';
                document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd4").value = grades.QuarterlyExams_Writes_nickname_without_model_addrowfmd4 || '';
                document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd1").value = grades.TeachersObservation_Writes_nickname_without_model_addrowfmd1 || '';
                document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd2").value = grades.TeachersObservation_Writes_nickname_without_model_addrowfmd2 || '';
                document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd3").value = grades.TeachersObservation_Writes_nickname_without_model_addrowfmd3 || '';
                document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd4").value = grades.TeachersObservation_Writes_nickname_without_model_addrowfmd4 || '';   

                // Fine Motor Development | Writes complete name with model
                document.getElementById("Writes_complete_name_with_model_fmd1").value = grades.Writes_complete_name_with_model_fmd1 || '';
                document.getElementById("Writes_complete_name_with_model_fmd2").value = grades.Writes_complete_name_with_model_fmd2 || '';
                document.getElementById("Writes_complete_name_with_model_fmd3").value = grades.Writes_complete_name_with_model_fmd3 || '';
                document.getElementById("Writes_complete_name_with_model_fmd4").value = grades.Writes_complete_name_with_model_fmd4 || '';
                document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd1").value = grades.Pretest_Writes_complete_name_with_model_addrowfmd1 || '';
                document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd2").value = grades.Pretest_Writes_complete_name_with_model_addrowfmd2 || '';
                document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd3").value = grades.Pretest_Writes_complete_name_with_model_addrowfmd3 || '';
                document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd4").value = grades.Pretest_Writes_complete_name_with_model_addrowfmd4 || '';
                document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd1").value = grades.QuarterlyExams_Writes_complete_name_with_model_addrowfmd1 || '';
                document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd2").value = grades.QuarterlyExams_Writes_complete_name_with_model_addrowfmd2 || '';
                document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd3").value = grades.QuarterlyExams_Writes_complete_name_with_model_addrowfmd3 || '';
                document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd4").value = grades.QuarterlyExams_Writes_complete_name_with_model_addrowfmd4 || '';
                document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd1").value = grades.TeachersObservation_Writes_complete_name_with_model_addrowfmd1 || '';
                document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd2").value = grades.TeachersObservation_Writes_complete_name_with_model_addrowfmd2 || '';
                document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd3").value = grades.TeachersObservation_Writes_complete_name_with_model_addrowfmd3 || '';
                document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd4").value = grades.TeachersObservation_Writes_complete_name_with_model_addrowfmd4 || ''; 
                
                // Receptive/Expressive Language | Speaks clearly and audibly
                document.getElementById("Speaks_clearly_and_audibly_rel1").value = grades.Speaks_clearly_and_audibly_rel1 || '';
                document.getElementById("Speaks_clearly_and_audibly_rel2").value = grades.Speaks_clearly_and_audibly_rel2 || '';
                document.getElementById("Speaks_clearly_and_audibly_rel3").value = grades.Speaks_clearly_and_audibly_rel3 || '';
                document.getElementById("Speaks_clearly_and_audibly_rel4").value = grades.Speaks_clearly_and_audibly_rel4 || '';
                document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel1").value = grades.Pretest_Speaks_clearly_and_audibly_addrowrel1 || '';
                document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel2").value = grades.Pretest_Speaks_clearly_and_audibly_addrowrel2 || '';
                document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel3").value = grades.Pretest_Speaks_clearly_and_audibly_addrowrel3 || '';
                document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel4").value = grades.Pretest_Speaks_clearly_and_audibly_addrowrel4 || '';
                document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel1").value = grades.QuarterlyExams_Speaks_clearly_and_audibly_addrowrel1 || '';
                document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel2").value = grades.QuarterlyExams_Speaks_clearly_and_audibly_addrowrel2 || '';
                document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel3").value = grades.QuarterlyExams_Speaks_clearly_and_audibly_addrowrel3 || '';
                document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel4").value = grades.QuarterlyExams_Speaks_clearly_and_audibly_addrowrel4 || '';
                document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel1").value = grades.TeachersObservation_Speaks_clearly_and_audibly_addrowrel1 || '';
                document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel2").value = grades.TeachersObservation_Speaks_clearly_and_audibly_addrowrel2 || '';
                document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel3").value = grades.TeachersObservation_Speaks_clearly_and_audibly_addrowrel3 || '';
                document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel4").value = grades.TeachersObservation_Speaks_clearly_and_audibly_addrowrel4 || '';  

                // Receptive/Expressive Language | Gives name
                document.getElementById("Gives_name_rel1").value = grades.Gives_name_rel1 || '';
                document.getElementById("Gives_name_rel2").value = grades.Gives_name_rel2 || '';
                document.getElementById("Gives_name_rel3").value = grades.Gives_name_rel3 || '';
                document.getElementById("Gives_name_rel4").value = grades.Gives_name_rel4 || '';
                document.getElementById("Pretest_Gives_name_addrowrel1").value = grades.Pretest_Gives_name_addrowrel1 || '';
                document.getElementById("Pretest_Gives_name_addrowrel2").value = grades.Pretest_Gives_name_addrowrel2 || '';
                document.getElementById("Pretest_Gives_name_addrowrel3").value = grades.Pretest_Gives_name_addrowrel3 || '';
                document.getElementById("Pretest_Gives_name_addrowrel4").value = grades.Pretest_Gives_name_addrowrel4 || '';
                document.getElementById("QuarterlyExams_Gives_name_addrowrel1").value = grades.QuarterlyExams_Gives_name_addrowrel1 || '';
                document.getElementById("QuarterlyExams_Gives_name_addrowrel2").value = grades.QuarterlyExams_Gives_name_addrowrel2 || '';
                document.getElementById("QuarterlyExams_Gives_name_addrowrel3").value = grades.QuarterlyExams_Gives_name_addrowrel3 || '';
                document.getElementById("QuarterlyExams_Gives_name_addrowrel4").value = grades.QuarterlyExams_Gives_name_addrowrel4 || '';
                document.getElementById("TeachersObservation_Gives_name_addrowrel1").value = grades.TeachersObservation_Gives_name_addrowrel1 || '';
                document.getElementById("TeachersObservation_Gives_name_addrowrel2").value = grades.TeachersObservation_Gives_name_addrowrel2 || '';
                document.getElementById("TeachersObservation_Gives_name_addrowrel3").value = grades.TeachersObservation_Gives_name_addrowrel3 || '';
                document.getElementById("TeachersObservation_Gives_name_addrowrel4").value = grades.TeachersObservation_Gives_name_addrowrel4 || '';  

                // Receptive/Expressive Language | Sings songs taught in class
                document.getElementById("Sings_songs_taught_in_class_rel1").value = grades.Sings_songs_taught_in_class_rel1 || '';
                document.getElementById("Sings_songs_taught_in_class_rel2").value = grades.Sings_songs_taught_in_class_rel2 || '';
                document.getElementById("Sings_songs_taught_in_class_rel3").value = grades.Sings_songs_taught_in_class_rel3 || '';
                document.getElementById("Sings_songs_taught_in_class_rel4").value = grades.Sings_songs_taught_in_class_rel4 || '';
                document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel1").value = grades.Pretest_Sings_songs_taught_in_class_addrowrel1 || '';
                document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel2").value = grades.Pretest_Sings_songs_taught_in_class_addrowrel2 || '';
                document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel3").value = grades.Pretest_Sings_songs_taught_in_class_addrowrel3 || '';
                document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel4").value = grades.Pretest_Sings_songs_taught_in_class_addrowrel4 || '';
                document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel1").value = grades.QuarterlyExams_Sings_songs_taught_in_class_addrowrel1 || '';
                document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel2").value = grades.QuarterlyExams_Sings_songs_taught_in_class_addrowrel2 || '';
                document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel3").value = grades.QuarterlyExams_Sings_songs_taught_in_class_addrowrel3 || '';
                document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel4").value = grades.QuarterlyExams_Sings_songs_taught_in_class_addrowrel4 || '';
                document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel1").value = grades.TeachersObservation_Sings_songs_taught_in_class_addrowrel1 || '';
                document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel2").value = grades.TeachersObservation_Sings_songs_taught_in_class_addrowrel2 || '';
                document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel3").value = grades.TeachersObservation_Sings_songs_taught_in_class_addrowrel3 || '';
                document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel4").value = grades.TeachersObservation_Sings_songs_taught_in_class_addrowrel4 || '';  

                // Receptive/Expressive Language | Talks to others
                document.getElementById("Talks_to_others_rel1").value = grades.Talks_to_others_rel1 || '';
                document.getElementById("Talks_to_others_rel2").value = grades.Talks_to_others_rel2 || '';
                document.getElementById("Talks_to_others_rel3").value = grades.Talks_to_others_rel3 || '';
                document.getElementById("Talks_to_others_rel4").value = grades.Talks_to_others_rel4 || '';
                document.getElementById("Pretest_Talks_to_others_addrowrel1").value = grades.Pretest_Talks_to_others_addrowrel1 || '';
                document.getElementById("Pretest_Talks_to_others_addrowrel2").value = grades.Pretest_Talks_to_others_addrowrel2 || '';
                document.getElementById("Pretest_Talks_to_others_addrowrel3").value = grades.Pretest_Talks_to_others_addrowrel3 || '';
                document.getElementById("Pretest_Talks_to_others_addrowrel4").value = grades.Pretest_Talks_to_others_addrowrel4 || '';
                document.getElementById("QuarterlyExams_Talks_to_others_addrowrel1").value = grades.QuarterlyExams_Talks_to_others_addrowrel1 || '';
                document.getElementById("QuarterlyExams_Talks_to_others_addrowrel2").value = grades.QuarterlyExams_Talks_to_others_addrowrel2 || '';
                document.getElementById("QuarterlyExams_Talks_to_others_addrowrel3").value = grades.QuarterlyExams_Talks_to_others_addrowrel3 || '';
                document.getElementById("QuarterlyExams_Talks_to_others_addrowrel4").value = grades.QuarterlyExams_Talks_to_others_addrowrel4 || '';
                document.getElementById("TeachersObservation_Talks_to_others_addrowrel1").value = grades.TeachersObservation_Talks_to_others_addrowrel1 || '';
                document.getElementById("TeachersObservation_Talks_to_others_addrowrel2").value = grades.TeachersObservation_Talks_to_others_addrowrel2 || '';
                document.getElementById("TeachersObservation_Talks_to_others_addrowrel3").value = grades.TeachersObservation_Talks_to_others_addrowrel3 || '';
                document.getElementById("TeachersObservation_Talks_to_others_addrowrel4").value = grades.TeachersObservation_Talks_to_others_addrowrel4 || '';  

                // Receptive/Expressive Language | Answers simple questions
                document.getElementById("Answers_simple_questions_rel1").value = grades.Answers_simple_questions_rel1 || '';
                document.getElementById("Answers_simple_questions_rel2").value = grades.Answers_simple_questions_rel2 || '';
                document.getElementById("Answers_simple_questions_rel3").value = grades.Answers_simple_questions_rel3 || '';
                document.getElementById("Answers_simple_questions_rel4").value = grades.Answers_simple_questions_rel4 || '';
                document.getElementById("Pretest_Answers_simple_questions_addrowrel1").value = grades.Pretest_Answers_simple_questions_addrowrel1 || '';
                document.getElementById("Pretest_Answers_simple_questions_addrowrel2").value = grades.Pretest_Answers_simple_questions_addrowrel2 || '';
                document.getElementById("Pretest_Answers_simple_questions_addrowrel3").value = grades.Pretest_Answers_simple_questions_addrowrel3 || '';
                document.getElementById("Pretest_Answers_simple_questions_addrowrel4").value = grades.Pretest_Answers_simple_questions_addrowrel4 || '';
                document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel1").value = grades.QuarterlyExams_Answers_simple_questions_addrowrel1 || '';
                document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel2").value = grades.QuarterlyExams_Answers_simple_questions_addrowrel2 || '';
                document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel3").value = grades.QuarterlyExams_Answers_simple_questions_addrowrel3 || '';
                document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel4").value = grades.QuarterlyExams_Answers_simple_questions_addrowrel4 || '';
                document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel1").value = grades.TeachersObservation_Answers_simple_questions_addrowrel1 || '';
                document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel2").value = grades.TeachersObservation_Answers_simple_questions_addrowrel2 || '';
                document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel3").value = grades.TeachersObservation_Answers_simple_questions_addrowrel3 || '';
                document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel4").value = grades.TeachersObservation_Answers_simple_questions_addrowrel4 || '';  

                // Receptive/Expressive Language | Retells simple events that happened at home or in school
                document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel1").value = grades.Retells_simple_events_that_happened_at_home_or_in_school_rel1 || '';
                document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel2").value = grades.Retells_simple_events_that_happened_at_home_or_in_school_rel2 || '';
                document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel3").value = grades.Retells_simple_events_that_happened_at_home_or_in_school_rel3 || '';
                document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel4").value = grades.Retells_simple_events_that_happened_at_home_or_in_school_rel4 || '';
                document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1").value = grades.Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1 || '';
                document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2").value = grades.Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2 || '';
                document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3").value = grades.Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3 || '';
                document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4").value = grades.Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4 || '';
                document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1").value = grades.QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1 || '';
                document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2").value = grades.QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2 || '';
                document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3").value = grades.QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3 || '';
                document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4").value = grades.QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4 || '';
                document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1").value = grades.TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1 || '';
                document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2").value = grades.TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2 || '';
                document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3").value = grades.TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3 || '';
                document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4").value = grades.TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4 || '';  

                // Pre-Academic Development | Names familiar objects
                document.getElementById("Names_familiar_objects_pad1").value = grades.Names_familiar_objects_pad1 || '';
                document.getElementById("Names_familiar_objects_pad2").value = grades.Names_familiar_objects_pad2 || '';
                document.getElementById("Names_familiar_objects_pad3").value = grades.Names_familiar_objects_pad3 || '';
                document.getElementById("Names_familiar_objects_pad4").value = grades.Names_familiar_objects_pad4 || '';
                document.getElementById("Pretest_Names_familiar_objects_addrowpad1").value = grades.Pretest_Names_familiar_objects_addrowpad1 || '';
                document.getElementById("Pretest_Names_familiar_objects_addrowpad2").value = grades.Pretest_Names_familiar_objects_addrowpad2 || '';
                document.getElementById("Pretest_Names_familiar_objects_addrowpad3").value = grades.Pretest_Names_familiar_objects_addrowpad3 || '';
                document.getElementById("Pretest_Names_familiar_objects_addrowpad4").value = grades.Pretest_Names_familiar_objects_addrowpad4 || '';
                document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad1").value = grades.QuarterlyExams_Names_familiar_objects_addrowpad1 || '';
                document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad2").value = grades.QuarterlyExams_Names_familiar_objects_addrowpad2 || '';
                document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad3").value = grades.QuarterlyExams_Names_familiar_objects_addrowpad3 || '';
                document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad4").value = grades.QuarterlyExams_Names_familiar_objects_addrowpad4 || '';
                document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad1").value = grades.TeachersObservation_Names_familiar_objects_addrowpad1 || '';
                document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad2").value = grades.TeachersObservation_Names_familiar_objects_addrowpad2 || '';
                document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad3").value = grades.TeachersObservation_Names_familiar_objects_addrowpad3 || '';
                document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad4").value = grades.TeachersObservation_Names_familiar_objects_addrowpad4 || ''; 
                
                // Pre-Academic Development | Identifies own possessions
                document.getElementById("Identifies_own_possessions_pad1").value = grades.Identifies_own_possessions_pad1 || '';
                document.getElementById("Identifies_own_possessions_pad2").value = grades.Identifies_own_possessions_pad2 || '';
                document.getElementById("Identifies_own_possessions_pad3").value = grades.Identifies_own_possessions_pad3 || '';
                document.getElementById("Identifies_own_possessions_pad4").value = grades.Identifies_own_possessions_pad4 || '';
                document.getElementById("Pretest_Identifies_own_possessions_addrowpad1").value = grades.Pretest_Identifies_own_possessions_addrowpad1 || '';
                document.getElementById("Pretest_Identifies_own_possessions_addrowpad2").value = grades.Pretest_Identifies_own_possessions_addrowpad2 || '';
                document.getElementById("Pretest_Identifies_own_possessions_addrowpad3").value = grades.Pretest_Identifies_own_possessions_addrowpad3 || '';
                document.getElementById("Pretest_Identifies_own_possessions_addrowpad4").value = grades.Pretest_Identifies_own_possessions_addrowpad4 || '';
                document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad1").value = grades.QuarterlyExams_Identifies_own_possessions_addrowpad1 || '';
                document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad2").value = grades.QuarterlyExams_Identifies_own_possessions_addrowpad2 || '';
                document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad3").value = grades.QuarterlyExams_Identifies_own_possessions_addrowpad3 || '';
                document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad4").value = grades.QuarterlyExams_Identifies_own_possessions_addrowpad4 || '';
                document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad1").value = grades.TeachersObservation_Identifies_own_possessions_addrowpad1 || '';
                document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad2").value = grades.TeachersObservation_Identifies_own_possessions_addrowpad2 || '';
                document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad3").value = grades.TeachersObservation_Identifies_own_possessions_addrowpad3 || '';
                document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad4").value = grades.TeachersObservation_Identifies_own_possessions_addrowpad4 || ''; 

                // Pre-Academic Development | Identifies colors
                document.getElementById("Identifies_colors_pad1").value = grades.Identifies_colors_pad1 || '';
                document.getElementById("Identifies_colors_pad2").value = grades.Identifies_colors_pad2 || '';
                document.getElementById("Identifies_colors_pad3").value = grades.Identifies_colors_pad3 || '';
                document.getElementById("Identifies_colors_pad4").value = grades.Identifies_colors_pad4 || '';
                document.getElementById("Pretest_Identifies_colors_addrowpad1").value = grades.Pretest_Identifies_colors_addrowpad1 || '';
                document.getElementById("Pretest_Identifies_colors_addrowpad2").value = grades.Pretest_Identifies_colors_addrowpad2 || '';
                document.getElementById("Pretest_Identifies_colors_addrowpad3").value = grades.Pretest_Identifies_colors_addrowpad3 || '';
                document.getElementById("Pretest_Identifies_colors_addrowpad4").value = grades.Pretest_Identifies_colors_addrowpad4 || '';
                document.getElementById("QuarterlyExams_Identifies_colors_addrowpad1").value = grades.QuarterlyExams_Identifies_colors_addrowpad1 || '';
                document.getElementById("QuarterlyExams_Identifies_colors_addrowpad2").value = grades.QuarterlyExams_Identifies_colors_addrowpad2 || '';
                document.getElementById("QuarterlyExams_Identifies_colors_addrowpad3").value = grades.QuarterlyExams_Identifies_colors_addrowpad3 || '';
                document.getElementById("QuarterlyExams_Identifies_colors_addrowpad4").value = grades.QuarterlyExams_Identifies_colors_addrowpad4 || '';
                document.getElementById("TeachersObservation_Identifies_colors_addrowpad1").value = grades.TeachersObservation_Identifies_colors_addrowpad1 || '';
                document.getElementById("TeachersObservation_Identifies_colors_addrowpad2").value = grades.TeachersObservation_Identifies_colors_addrowpad2 || '';
                document.getElementById("TeachersObservation_Identifies_colors_addrowpad3").value = grades.TeachersObservation_Identifies_colors_addrowpad3 || '';
                document.getElementById("TeachersObservation_Identifies_colors_addrowpad4").value = grades.TeachersObservation_Identifies_colors_addrowpad4 || ''; 

                // Pre-Academic Development | Names basic shapes
                document.getElementById("Names_basic_shapes_pad1").value = grades.Names_basic_shapes_pad1 || '';
                document.getElementById("Names_basic_shapes_pad2").value = grades.Names_basic_shapes_pad2 || '';
                document.getElementById("Names_basic_shapes_pad3").value = grades.Names_basic_shapes_pad3 || '';
                document.getElementById("Names_basic_shapes_pad4").value = grades.Names_basic_shapes_pad4 || '';
                document.getElementById("Pretest_Names_basic_shapes_addrowpad1").value = grades.Pretest_Names_basic_shapes_addrowpad1 || '';
                document.getElementById("Pretest_Names_basic_shapes_addrowpad2").value = grades.Pretest_Names_basic_shapes_addrowpad2 || '';
                document.getElementById("Pretest_Names_basic_shapes_addrowpad3").value = grades.Pretest_Names_basic_shapes_addrowpad3 || '';
                document.getElementById("Pretest_Names_basic_shapes_addrowpad4").value = grades.Pretest_Names_basic_shapes_addrowpad4 || '';
                document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad1").value = grades.QuarterlyExams_Names_basic_shapes_addrowpad1 || '';
                document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad2").value = grades.QuarterlyExams_Names_basic_shapes_addrowpad2 || '';
                document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad3").value = grades.QuarterlyExams_Names_basic_shapes_addrowpad3 || '';
                document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad4").value = grades.QuarterlyExams_Names_basic_shapes_addrowpad4 || '';
                document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad1").value = grades.TeachersObservation_Names_basic_shapes_addrowpad1 || '';
                document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad2").value = grades.TeachersObservation_Names_basic_shapes_addrowpad2 || '';
                document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad3").value = grades.TeachersObservation_Names_basic_shapes_addrowpad3 || '';
                document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad4").value = grades.TeachersObservation_Names_basic_shapes_addrowpad4 || ''; 

                // Pre-Academic Development | Names objects as same and different
                document.getElementById("Names_objects_as_same_and_different_pad1").value = grades.Names_objects_as_same_and_different_pad1 || '';
                document.getElementById("Names_objects_as_same_and_different_pad2").value = grades.Names_objects_as_same_and_different_pad2 || '';
                document.getElementById("Names_objects_as_same_and_different_pad3").value = grades.Names_objects_as_same_and_different_pad3 || '';
                document.getElementById("Names_objects_as_same_and_different_pad4").value = grades.Names_objects_as_same_and_different_pad4 || '';
                document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad1").value = grades.Pretest_Names_objects_as_same_and_different_addrowpad1 || '';
                document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad2").value = grades.Pretest_Names_objects_as_same_and_different_addrowpad2 || '';
                document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad3").value = grades.Pretest_Names_objects_as_same_and_different_addrowpad3 || '';
                document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad4").value = grades.Pretest_Names_objects_as_same_and_different_addrowpad4 || '';
                document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad1").value = grades.QuarterlyExams_Names_objects_as_same_and_different_addrowpad1 || '';
                document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad2").value = grades.QuarterlyExams_Names_objects_as_same_and_different_addrowpad2 || '';
                document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad3").value = grades.QuarterlyExams_Names_objects_as_same_and_different_addrowpad3 || '';
                document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad4").value = grades.QuarterlyExams_Names_objects_as_same_and_different_addrowpad4 || '';
                document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad1").value = grades.TeachersObservation_Names_objects_as_same_and_different_addrowpad1 || '';
                document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad2").value = grades.TeachersObservation_Names_objects_as_same_and_different_addrowpad2 || '';
                document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad3").value = grades.TeachersObservation_Names_objects_as_same_and_different_addrowpad3 || '';
                document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad4").value = grades.TeachersObservation_Names_objects_as_same_and_different_addrowpad4 || ''; 

                // Pre-Academic Development | Identifies left hand and right hand
                document.getElementById("Identifies_left_hand_and_right_hand_pad1").value = grades.Identifies_left_hand_and_right_hand_pad1 || '';
                document.getElementById("Identifies_left_hand_and_right_hand_pad2").value = grades.Identifies_left_hand_and_right_hand_pad2 || '';
                document.getElementById("Identifies_left_hand_and_right_hand_pad3").value = grades.Identifies_left_hand_and_right_hand_pad3 || '';
                document.getElementById("Identifies_left_hand_and_right_hand_pad4").value = grades.Identifies_left_hand_and_right_hand_pad4 || '';
                document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad1").value = grades.Pretest_Identifies_left_hand_and_right_hand_addrowpad1 || '';
                document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad2").value = grades.Pretest_Identifies_left_hand_and_right_hand_addrowpad2 || '';
                document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad3").value = grades.Pretest_Identifies_left_hand_and_right_hand_addrowpad3 || '';
                document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad4").value = grades.Pretest_Identifies_left_hand_and_right_hand_addrowpad4 || '';
                document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad1").value = grades.QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad1 || '';
                document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad2").value = grades.QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad2 || '';
                document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad3").value = grades.QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad3 || '';
                document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad4").value = grades.QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad4 || '';
                document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad1").value = grades.TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad1 || '';
                document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad2").value = grades.TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad2 || '';
                document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad3").value = grades.TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad3 || '';
                document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad4").value = grades.TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad4 || ''; 

                // Pre-Academic Development | Recognizes name in print
                document.getElementById("Recognizes_name_in_print_pad1").value = grades.Recognizes_name_in_print_pad1 || '';
                document.getElementById("Recognizes_name_in_print_pad2").value = grades.Recognizes_name_in_print_pad2 || '';
                document.getElementById("Recognizes_name_in_print_pad3").value = grades.Recognizes_name_in_print_pad3 || '';
                document.getElementById("Recognizes_name_in_print_pad4").value = grades.Recognizes_name_in_print_pad4 || '';
                document.getElementById("Pretest_Recognizes_name_in_print_addrowpad1").value = grades.Pretest_Recognizes_name_in_print_addrowpad1 || '';
                document.getElementById("Pretest_Recognizes_name_in_print_addrowpad2").value = grades.Pretest_Recognizes_name_in_print_addrowpad2 || '';
                document.getElementById("Pretest_Recognizes_name_in_print_addrowpad3").value = grades.Pretest_Recognizes_name_in_print_addrowpad3 || '';
                document.getElementById("Pretest_Recognizes_name_in_print_addrowpad4").value = grades.Pretest_Recognizes_name_in_print_addrowpad4 || '';
                document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad1").value = grades.QuarterlyExams_Recognizes_name_in_print_addrowpad1 || '';
                document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad2").value = grades.QuarterlyExams_Recognizes_name_in_print_addrowpad2 || '';
                document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad3").value = grades.QuarterlyExams_Recognizes_name_in_print_addrowpad3 || '';
                document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad4").value = grades.QuarterlyExams_Recognizes_name_in_print_addrowpad4 || '';
                document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad1").value = grades.TeachersObservation_Recognizes_name_in_print_addrowpad1 || '';
                document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad2").value = grades.TeachersObservation_Recognizes_name_in_print_addrowpad2 || '';
                document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad3").value = grades.TeachersObservation_Recognizes_name_in_print_addrowpad3 || '';
                document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad4").value = grades.TeachersObservation_Recognizes_name_in_print_addrowpad4 || ''; 
    
                // Pre-Academic Development | Sees objects in relation to others in terms of spatial positions
                document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad1").value = grades.Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad1 || '';
                document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad2").value = grades.Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad2 || '';
                document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad3").value = grades.Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad3 || '';
                document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad4").value = grades.Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad4 || '';
                document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1").value = grades.Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1 || '';
                document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2").value = grades.Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2 || '';
                document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3").value = grades.Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3 || '';
                document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4").value = grades.Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4 || '';
                document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1").value = grades.QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1 || '';
                document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2").value = grades.QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2 || '';
                document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3").value = grades.QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3 || '';
                document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4").value = grades.QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4 || '';
                document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1").value = grades.TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1 || '';
                document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2").value = grades.TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2 || '';
                document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3").value = grades.TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3 || '';
                document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4").value = grades.TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4 || ''; 

                // Pre-Academic Development | Identifies missing parts of objects
                document.getElementById("Identifies_missing_parts_of_objects_pad1").value = grades.Identifies_missing_parts_of_objects_pad1 || '';
                document.getElementById("Identifies_missing_parts_of_objects_pad2").value = grades.Identifies_missing_parts_of_objects_pad2 || '';
                document.getElementById("Identifies_missing_parts_of_objects_pad3").value = grades.Identifies_missing_parts_of_objects_pad3 || '';
                document.getElementById("Identifies_missing_parts_of_objects_pad4").value = grades.Identifies_missing_parts_of_objects_pad4 || '';
                document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad1").value = grades.Pretest_Identifies_missing_parts_of_objects_addrowpad1 || '';
                document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad2").value = grades.Pretest_Identifies_missing_parts_of_objects_addrowpad2 || '';
                document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad3").value = grades.Pretest_Identifies_missing_parts_of_objects_addrowpad3 || '';
                document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad4").value = grades.Pretest_Identifies_missing_parts_of_objects_addrowpad4 || '';
                document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad1").value = grades.QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad1 || '';
                document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad2").value = grades.QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad2 || '';
                document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad3").value = grades.QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad3 || '';
                document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad4").value = grades.QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad4 || '';
                document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad1").value = grades.TeachersObservation_Identifies_missing_parts_of_objects_addrowpad1 || '';
                document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad2").value = grades.TeachersObservation_Identifies_missing_parts_of_objects_addrowpad2 || '';
                document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad3").value = grades.TeachersObservation_Identifies_missing_parts_of_objects_addrowpad3 || '';
                document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad4").value = grades.TeachersObservation_Identifies_missing_parts_of_objects_addrowpad4 || ''; 

                // Pre-Academic Development | Tells what is missing when one object is removed from a group of three
                document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad1").value = grades.Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad1 || '';
                document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad2").value = grades.Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad2 || '';
                document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad3").value = grades.Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad3 || '';
                document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad4").value = grades.Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad4 || '';
                document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1").value = grades.Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1 || '';
                document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2").value = grades.Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2 || '';
                document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3").value = grades.Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3 || '';
                document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4").value = grades.Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4 || '';
                document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1").value = grades.QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1 || '';
                document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2").value = grades.QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2 || '';
                document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3").value = grades.QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3 || '';
                document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4").value = grades.QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4 || '';
                document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1").value = grades.TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1 || '';
                document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2").value = grades.TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2 || '';
                document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3").value = grades.TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3 || '';
                document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4").value = grades.TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4 || ''; 

                // Logical Mathematical Development | Describes objects according to size, length, weight, and quantity
                document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd1").value = grades.Describes_objects_according_to_size_length_weight_and_quantity_lmd1 || '';
                document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd2").value = grades.Describes_objects_according_to_size_length_weight_and_quantity_lmd2 || '';
                document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd3").value = grades.Describes_objects_according_to_size_length_weight_and_quantity_lmd3 || '';
                document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd4").value = grades.Describes_objects_according_to_size_length_weight_and_quantity_lmd4 || '';
                document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1").value = grades.Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1 || '';
                document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2").value = grades.Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2 || '';
                document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3").value = grades.Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3 || '';
                document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4").value = grades.Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1").value = grades.QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2").value = grades.QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3").value = grades.QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4").value = grades.QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1").value = grades.TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2").value = grades.TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3").value = grades.TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4").value = grades.TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4 || ''; 

                // Logical Mathematical Development | Classifies objects according to size, color, and shape
                document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd1").value = grades.Classifies_objects_according_to_size_color_and_shape_lmd1 || '';
                document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd2").value = grades.Classifies_objects_according_to_size_color_and_shape_lmd2 || '';
                document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd3").value = grades.Classifies_objects_according_to_size_color_and_shape_lmd3 || '';
                document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd4").value = grades.Classifies_objects_according_to_size_color_and_shape_lmd4 || '';
                document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd1").value = grades.Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd1 || '';
                document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd2").value = grades.Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd2 || '';
                document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd3").value = grades.Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd3 || '';
                document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd4").value = grades.Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd1").value = grades.QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd2").value = grades.QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd3").value = grades.QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd4").value = grades.QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd1").value = grades.TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd2").value = grades.TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd3").value = grades.TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd4").value = grades.TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd4 || ''; 

                // Logical Mathematical Development | Compares sets
                document.getElementById("Compares_sets_lmd1").value = grades.Compares_sets_lmd1 || '';
                document.getElementById("Compares_sets_lmd2").value = grades.Compares_sets_lmd2 || '';
                document.getElementById("Compares_sets_lmd3").value = grades.Compares_sets_lmd3 || '';
                document.getElementById("Compares_sets_lmd4").value = grades.Compares_sets_lmd4 || '';
                document.getElementById("Pretest_Compares_sets_addrowlmd1").value = grades.Pretest_Compares_sets_addrowlmd1 || '';
                document.getElementById("Pretest_Compares_sets_addrowlmd2").value = grades.Pretest_Compares_sets_addrowlmd2 || '';
                document.getElementById("Pretest_Compares_sets_addrowlmd3").value = grades.Pretest_Compares_sets_addrowlmd3 || '';
                document.getElementById("Pretest_Compares_sets_addrowlmd4").value = grades.Pretest_Compares_sets_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Compares_sets_addrowlmd1").value = grades.QuarterlyExams_Compares_sets_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Compares_sets_addrowlmd2").value = grades.QuarterlyExams_Compares_sets_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Compares_sets_addrowlmd3").value = grades.QuarterlyExams_Compares_sets_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Compares_sets_addrowlmd4").value = grades.QuarterlyExams_Compares_sets_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Compares_sets_addrowlmd1").value = grades.TeachersObservation_Compares_sets_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Compares_sets_addrowlmd2").value = grades.TeachersObservation_Compares_sets_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Compares_sets_addrowlmd3").value = grades.TeachersObservation_Compares_sets_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Compares_sets_addrowlmd4").value = grades.TeachersObservation_Compares_sets_addrowlmd4 || ''; 

                // Logical Mathematical Development | Identifies what comes next in a pattern
                document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd1").value = grades.Identifies_what_comes_next_in_a_pattern_lmd1 || '';
                document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd2").value = grades.Identifies_what_comes_next_in_a_pattern_lmd2 || '';
                document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd3").value = grades.Identifies_what_comes_next_in_a_pattern_lmd3 || '';
                document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd4").value = grades.Identifies_what_comes_next_in_a_pattern_lmd4 || '';
                document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd1").value = grades.Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd1 || '';
                document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd2").value = grades.Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd2 || '';
                document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd3").value = grades.Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd3 || '';
                document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd4").value = grades.Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd1").value = grades.QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd2").value = grades.QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd3").value = grades.QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd4").value = grades.QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd1").value = grades.TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd2").value = grades.TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd3").value = grades.TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd4").value = grades.TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd4 || ''; 

                // Logical Mathematical Development | Knows one-to-one correspondence
                document.getElementById("Knows_one_to_one_correspondence_lmd1").value = grades.Knows_one_to_one_correspondence_lmd1 || '';
                document.getElementById("Knows_one_to_one_correspondence_lmd2").value = grades.Knows_one_to_one_correspondence_lmd2 || '';
                document.getElementById("Knows_one_to_one_correspondence_lmd3").value = grades.Knows_one_to_one_correspondence_lmd3 || '';
                document.getElementById("Knows_one_to_one_correspondence_lmd4").value = grades.Knows_one_to_one_correspondence_lmd4 || '';
                document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd1").value = grades.Pretest_Knows_one_to_one_correspondence_addrowlmd1 || '';
                document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd2").value = grades.Pretest_Knows_one_to_one_correspondence_addrowlmd2 || '';
                document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd3").value = grades.Pretest_Knows_one_to_one_correspondence_addrowlmd3 || '';
                document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd4").value = grades.Pretest_Knows_one_to_one_correspondence_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd1").value = grades.QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd2").value = grades.QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd3").value = grades.QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd4").value = grades.QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd1").value = grades.TeachersObservation_Knows_one_to_one_correspondence_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd2").value = grades.TeachersObservation_Knows_one_to_one_correspondence_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd3").value = grades.TeachersObservation_Knows_one_to_one_correspondence_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd4").value = grades.TeachersObservation_Knows_one_to_one_correspondence_addrowlmd4 || ''; 

                // Logical Mathematical Development | Rote counts up to 100
                document.getElementById("Rote_counts_up_to_100_lmd1").value = grades.Rote_counts_up_to_100_lmd1 || '';
                document.getElementById("Rote_counts_up_to_100_lmd2").value = grades.Rote_counts_up_to_100_lmd2 || '';
                document.getElementById("Rote_counts_up_to_100_lmd3").value = grades.Rote_counts_up_to_100_lmd3 || '';
                document.getElementById("Rote_counts_up_to_100_lmd4").value = grades.Rote_counts_up_to_100_lmd4 || '';
                document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd1").value = grades.Pretest_Rote_counts_up_to_100_addrowlmd1 || '';
                document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd2").value = grades.Pretest_Rote_counts_up_to_100_addrowlmd2 || '';
                document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd3").value = grades.Pretest_Rote_counts_up_to_100_addrowlmd3 || '';
                document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd4").value = grades.Pretest_Rote_counts_up_to_100_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd1").value = grades.QuarterlyExams_Rote_counts_up_to_100_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd2").value = grades.QuarterlyExams_Rote_counts_up_to_100_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd3").value = grades.QuarterlyExams_Rote_counts_up_to_100_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd4").value = grades.QuarterlyExams_Rote_counts_up_to_100_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd1").value = grades.TeachersObservation_Rote_counts_up_to_100_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd2").value = grades.TeachersObservation_Rote_counts_up_to_100_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd3").value = grades.TeachersObservation_Rote_counts_up_to_100_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd4").value = grades.TeachersObservation_Rote_counts_up_to_100_addrowlmd4 || ''; 

                // Logical Mathematical Development | Identifies numerals 0 to 50
                document.getElementById("Identifies_numerals_0_to_50_lmd1").value = grades.Identifies_numerals_0_to_50_lmd1 || '';
                document.getElementById("Identifies_numerals_0_to_50_lmd2").value = grades.Identifies_numerals_0_to_50_lmd2 || '';
                document.getElementById("Identifies_numerals_0_to_50_lmd3").value = grades.Identifies_numerals_0_to_50_lmd3 || '';
                document.getElementById("Identifies_numerals_0_to_50_lmd4").value = grades.Identifies_numerals_0_to_50_lmd4 || '';
                document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd1").value = grades.Pretest_Identifies_numerals_0_to_50_addrowlmd1 || '';
                document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd2").value = grades.Pretest_Identifies_numerals_0_to_50_addrowlmd2 || '';
                document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd3").value = grades.Pretest_Identifies_numerals_0_to_50_addrowlmd3 || '';
                document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd4").value = grades.Pretest_Identifies_numerals_0_to_50_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd1").value = grades.QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd2").value = grades.QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd3").value = grades.QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd4").value = grades.QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd1").value = grades.TeachersObservation_Identifies_numerals_0_to_50_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd2").value = grades.TeachersObservation_Identifies_numerals_0_to_50_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd3").value = grades.TeachersObservation_Identifies_numerals_0_to_50_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd4").value = grades.TeachersObservation_Identifies_numerals_0_to_50_addrowlmd4 || ''; 

                // Logical Mathematical Development | Writes numerals 0 to 20
                document.getElementById("Writes_numerals_0_to_20_lmd1").value = grades.Writes_numerals_0_to_20_lmd1 || '';
                document.getElementById("Writes_numerals_0_to_20_lmd2").value = grades.Writes_numerals_0_to_20_lmd2 || '';
                document.getElementById("Writes_numerals_0_to_20_lmd3").value = grades.Writes_numerals_0_to_20_lmd3 || '';
                document.getElementById("Writes_numerals_0_to_20_lmd4").value = grades.Writes_numerals_0_to_20_lmd4 || '';
                document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd1").value = grades.Pretest_Writes_numerals_0_to_20_addrowlmd1 || '';
                document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd2").value = grades.Pretest_Writes_numerals_0_to_20_addrowlmd2 || '';
                document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd3").value = grades.Pretest_Writes_numerals_0_to_20_addrowlmd3 || '';
                document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd4").value = grades.Pretest_Writes_numerals_0_to_20_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd1").value = grades.QuarterlyExams_Writes_numerals_0_to_20_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd2").value = grades.QuarterlyExams_Writes_numerals_0_to_20_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd3").value = grades.QuarterlyExams_Writes_numerals_0_to_20_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd4").value = grades.QuarterlyExams_Writes_numerals_0_to_20_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd1").value = grades.TeachersObservation_Writes_numerals_0_to_20_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd2").value = grades.TeachersObservation_Writes_numerals_0_to_20_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd3").value = grades.TeachersObservation_Writes_numerals_0_to_20_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd4").value = grades.TeachersObservation_Writes_numerals_0_to_20_addrowlmd4 || ''; 

                // Logical Mathematical Development | Puts numerals in proper sequence 
                document.getElementById("Puts_numerals_in_proper_sequence_lmd1").value = grades.Puts_numerals_in_proper_sequence_lmd1 || '';
                document.getElementById("Puts_numerals_in_proper_sequence_lmd2").value = grades.Puts_numerals_in_proper_sequence_lmd2 || '';
                document.getElementById("Puts_numerals_in_proper_sequence_lmd3").value = grades.Puts_numerals_in_proper_sequence_lmd3 || '';
                document.getElementById("Puts_numerals_in_proper_sequence_lmd4").value = grades.Puts_numerals_in_proper_sequence_lmd4 || '';
                document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd1").value = grades.Pretest_Puts_numerals_in_proper_sequence_addrowlmd1 || '';
                document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd2").value = grades.Pretest_Puts_numerals_in_proper_sequence_addrowlmd2 || '';
                document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd3").value = grades.Pretest_Puts_numerals_in_proper_sequence_addrowlmd3 || '';
                document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd4").value = grades.Pretest_Puts_numerals_in_proper_sequence_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd1").value = grades.QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd2").value = grades.QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd3").value = grades.QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd4").value = grades.QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd1").value = grades.TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd2").value = grades.TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd3").value = grades.TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd4").value = grades.TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd4 || ''; 

                // Logical Mathematical Development | Names position of objects 
                document.getElementById("Names_position_of_objects_lmd1").value = grades.Names_position_of_objects_lmd1 || '';
                document.getElementById("Names_position_of_objects_lmd2").value = grades.Names_position_of_objects_lmd2 || '';
                document.getElementById("Names_position_of_objects_lmd3").value = grades.Names_position_of_objects_lmd3 || '';
                document.getElementById("Names_position_of_objects_lmd4").value = grades.Names_position_of_objects_lmd4 || '';
                document.getElementById("Pretest_Names_position_of_objects_addrowlmd1").value = grades.Pretest_Names_position_of_objects_addrowlmd1 || '';
                document.getElementById("Pretest_Names_position_of_objects_addrowlmd2").value = grades.Pretest_Names_position_of_objects_addrowlmd2 || '';
                document.getElementById("Pretest_Names_position_of_objects_addrowlmd3").value = grades.Pretest_Names_position_of_objects_addrowlmd3 || '';
                document.getElementById("Pretest_Names_position_of_objects_addrowlmd4").value = grades.Pretest_Names_position_of_objects_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd1").value = grades.QuarterlyExams_Names_position_of_objects_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd2").value = grades.QuarterlyExams_Names_position_of_objects_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd3").value = grades.QuarterlyExams_Names_position_of_objects_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd4").value = grades.QuarterlyExams_Names_position_of_objects_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd1").value = grades.TeachersObservation_Names_position_of_objects_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd2").value = grades.TeachersObservation_Names_position_of_objects_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd3").value = grades.TeachersObservation_Names_position_of_objects_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd4").value = grades.TeachersObservation_Names_position_of_objects_addrowlmd4 || ''; 

                // Logical Mathematical Development | Performs simple addition with sum not greater than 10 using objects and picture stories 
                document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd1").value = grades.Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd1 || '';
                document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd2").value = grades.Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd2 || '';
                document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd3").value = grades.Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd3 || '';
                document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd4").value = grades.Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd4 || '';
                document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1").value = grades.Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1 || '';
                document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2").value = grades.Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2 || '';
                document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3").value = grades.Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3 || '';
                document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4").value = grades.Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1").value = grades.QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2").value = grades.QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3").value = grades.QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4").value = grades.QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1").value = grades.TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2").value = grades.TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3").value = grades.TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4").value = grades.TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4 || ''; 

                // Logical Mathematical Development | Performs simple subtraction of numbers between 0 to 10 using objects and picture stories 
                document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd1").value = grades.Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd1 || '';
                document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd2").value = grades.Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd2 || '';
                document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd3").value = grades.Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd3 || '';
                document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd4").value = grades.Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd4 || '';
                document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1").value = grades.Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1 || '';
                document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2").value = grades.Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2 || '';
                document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3").value = grades.Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3 || '';
                document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4").value = grades.Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1").value = grades.QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2").value = grades.QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3").value = grades.QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4").value = grades.QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1").value = grades.TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2").value = grades.TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3").value = grades.TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4").value = grades.TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4 || ''; 

                // Logical Mathematical Development | Tells time by hour and half hour
                document.getElementById("Tells_time_by_hour_and_half_hour_lmd1").value = grades.Tells_time_by_hour_and_half_hour_lmd1 || '';
                document.getElementById("Tells_time_by_hour_and_half_hour_lmd2").value = grades.Tells_time_by_hour_and_half_hour_lmd2 || '';
                document.getElementById("Tells_time_by_hour_and_half_hour_lmd3").value = grades.Tells_time_by_hour_and_half_hour_lmd3 || '';
                document.getElementById("Tells_time_by_hour_and_half_hour_lmd4").value = grades.Tells_time_by_hour_and_half_hour_lmd4 || '';
                document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd1").value = grades.Pretest_Tells_time_by_hour_and_half_hour_addrowlmd1 || '';
                document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd2").value = grades.Pretest_Tells_time_by_hour_and_half_hour_addrowlmd2 || '';
                document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd3").value = grades.Pretest_Tells_time_by_hour_and_half_hour_addrowlmd3 || '';
                document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd4").value = grades.Pretest_Tells_time_by_hour_and_half_hour_addrowlmd4 || '';
                document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd1").value = grades.QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd1 || '';
                document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd2").value = grades.QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd2 || '';
                document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd3").value = grades.QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd3 || '';
                document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd4").value = grades.QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd4 || '';
                document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd1").value = grades.TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd1 || '';
                document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd2").value = grades.TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd2 || '';
                document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd3").value = grades.TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd3 || '';
                document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd4").value = grades.TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd4 || ''; 

                // Reading Readiness | Names uppercase letters
                document.getElementById("Names_uppercase_letters_rr1").value = grades.Names_uppercase_letters_rr1 || '';
                document.getElementById("Names_uppercase_letters_rr2").value = grades.Names_uppercase_letters_rr2 || '';
                document.getElementById("Names_uppercase_letters_rr3").value = grades.Names_uppercase_letters_rr3 || '';
                document.getElementById("Names_uppercase_letters_rr4").value = grades.Names_uppercase_letters_rr4 || '';
                document.getElementById("Pretest_Names_uppercase_letters_addrowrr1").value = grades.Pretest_Names_uppercase_letters_addrowrr1 || '';
                document.getElementById("Pretest_Names_uppercase_letters_addrowrr2").value = grades.Pretest_Names_uppercase_letters_addrowrr2 || '';
                document.getElementById("Pretest_Names_uppercase_letters_addrowrr3").value = grades.Pretest_Names_uppercase_letters_addrowrr3 || '';
                document.getElementById("Pretest_Names_uppercase_letters_addrowrr4").value = grades.Pretest_Names_uppercase_letters_addrowrr4 || '';
                document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr1").value = grades.QuarterlyExams_Names_uppercase_letters_addrowrr1 || '';
                document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr2").value = grades.QuarterlyExams_Names_uppercase_letters_addrowrr2 || '';
                document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr3").value = grades.QuarterlyExams_Names_uppercase_letters_addrowrr3 || '';
                document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr4").value = grades.QuarterlyExams_Names_uppercase_letters_addrowrr4 || '';
                document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr1").value = grades.TeachersObservation_Names_uppercase_letters_addrowrr1 || '';
                document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr2").value = grades.TeachersObservation_Names_uppercase_letters_addrowrr2 || '';
                document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr3").value = grades.TeachersObservation_Names_uppercase_letters_addrowrr3 || '';
                document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr4").value = grades.TeachersObservation_Names_uppercase_letters_addrowrr4 || ''; 

                // Reading Readiness | Names lowercase letters
                document.getElementById("Names_lowercase_letters_rr1").value = grades.Names_lowercase_letters_rr1 || '';
                document.getElementById("Names_lowercase_letters_rr2").value = grades.Names_lowercase_letters_rr2 || '';
                document.getElementById("Names_lowercase_letters_rr3").value = grades.Names_lowercase_letters_rr3 || '';
                document.getElementById("Names_lowercase_letters_rr4").value = grades.Names_lowercase_letters_rr4 || '';
                document.getElementById("Pretest_Names_lowercase_letters_addrowrr1").value = grades.Pretest_Names_lowercase_letters_addrowrr1 || '';
                document.getElementById("Pretest_Names_lowercase_letters_addrowrr2").value = grades.Pretest_Names_lowercase_letters_addrowrr2 || '';
                document.getElementById("Pretest_Names_lowercase_letters_addrowrr3").value = grades.Pretest_Names_lowercase_letters_addrowrr3 || '';
                document.getElementById("Pretest_Names_lowercase_letters_addrowrr4").value = grades.Pretest_Names_lowercase_letters_addrowrr4 || '';
                document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr1").value = grades.QuarterlyExams_Names_lowercase_letters_addrowrr1 || '';
                document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr2").value = grades.QuarterlyExams_Names_lowercase_letters_addrowrr2 || '';
                document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr3").value = grades.QuarterlyExams_Names_lowercase_letters_addrowrr3 || '';
                document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr4").value = grades.QuarterlyExams_Names_lowercase_letters_addrowrr4 || '';
                document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr1").value = grades.TeachersObservation_Names_lowercase_letters_addrowrr1 || '';
                document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr2").value = grades.TeachersObservation_Names_lowercase_letters_addrowrr2 || '';
                document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr3").value = grades.TeachersObservation_Names_lowercase_letters_addrowrr3 || '';
                document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr4").value = grades.TeachersObservation_Names_lowercase_letters_addrowrr4 || ''; 

                // Reading Readiness | Gives the sounds of uppercase letters
                document.getElementById("Gives_the_sounds_of_uppercase_letters_rr1").value = grades.Gives_the_sounds_of_uppercase_letters_rr1 || '';
                document.getElementById("Gives_the_sounds_of_uppercase_letters_rr2").value = grades.Gives_the_sounds_of_uppercase_letters_rr2 || '';
                document.getElementById("Gives_the_sounds_of_uppercase_letters_rr3").value = grades.Gives_the_sounds_of_uppercase_letters_rr3 || '';
                document.getElementById("Gives_the_sounds_of_uppercase_letters_rr4").value = grades.Gives_the_sounds_of_uppercase_letters_rr4 || '';
                document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr1").value = grades.Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr1 || '';
                document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr2").value = grades.Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr2 || '';
                document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr3").value = grades.Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr3 || '';
                document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr4").value = grades.Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr4 || '';
                document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr1").value = grades.QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr1 || '';
                document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr2").value = grades.QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr2 || '';
                document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr3").value = grades.QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr3 || '';
                document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr4").value = grades.QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr4 || '';
                document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr1").value = grades.TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr1 || '';
                document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr2").value = grades.TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr2 || '';
                document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr3").value = grades.TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr3 || '';
                document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr4").value = grades.TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr4 || ''; 

                // Reading Readiness | Gives the sounds of lowercase letters
                document.getElementById("Gives_the_sounds_of_lowercase_letters_rr1").value = grades.Gives_the_sounds_of_lowercase_letters_rr1 || '';
                document.getElementById("Gives_the_sounds_of_lowercase_letters_rr2").value = grades.Gives_the_sounds_of_lowercase_letters_rr2 || '';
                document.getElementById("Gives_the_sounds_of_lowercase_letters_rr3").value = grades.Gives_the_sounds_of_lowercase_letters_rr3 || '';
                document.getElementById("Gives_the_sounds_of_lowercase_letters_rr4").value = grades.Gives_the_sounds_of_lowercase_letters_rr4 || '';
                document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr1").value = grades.Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr1 || '';
                document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr2").value = grades.Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr2 || '';
                document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr3").value = grades.Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr3 || '';
                document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr4").value = grades.Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr4 || '';
                document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr1").value = grades.QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr1 || '';
                document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr2").value = grades.QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr2 || '';
                document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr3").value = grades.QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr3 || '';
                document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr4").value = grades.QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr4 || '';
                document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr1").value = grades.TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr1 || '';
                document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr2").value = grades.TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr2 || '';
                document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr3").value = grades.TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr3 || '';
                document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr4").value = grades.TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr4 || ''; 

                // Reading Readiness | Associates words with corresponding pictures
                document.getElementById("Associates_words_with_corresponding_pictures_rr1").value = grades.Associates_words_with_corresponding_pictures_rr1 || '';
                document.getElementById("Associates_words_with_corresponding_pictures_rr2").value = grades.Associates_words_with_corresponding_pictures_rr2 || '';
                document.getElementById("Associates_words_with_corresponding_pictures_rr3").value = grades.Associates_words_with_corresponding_pictures_rr3 || '';
                document.getElementById("Associates_words_with_corresponding_pictures_rr4").value = grades.Associates_words_with_corresponding_pictures_rr4 || '';
                document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr1").value = grades.Pretest_Associates_words_with_corresponding_pictures_addrowrr1 || '';
                document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr2").value = grades.Pretest_Associates_words_with_corresponding_pictures_addrowrr2 || '';
                document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr3").value = grades.Pretest_Associates_words_with_corresponding_pictures_addrowrr3 || '';
                document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr4").value = grades.Pretest_Associates_words_with_corresponding_pictures_addrowrr4 || '';
                document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr1").value = grades.QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr1 || '';
                document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr2").value = grades.QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr2 || '';
                document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr3").value = grades.QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr3 || '';
                document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr4").value = grades.QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr4 || '';
                document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr1").value = grades.TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr1 || '';
                document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr2").value = grades.TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr2 || '';
                document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr3").value = grades.TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr3 || '';
                document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr4").value = grades.TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr4 || '';

                // Reading Readiness | Reads CV pairs
                document.getElementById("Reads_CV_pairs_rr1").value = grades.Reads_CV_pairs_rr1 || '';
                document.getElementById("Reads_CV_pairs_rr2").value = grades.Reads_CV_pairs_rr2 || '';
                document.getElementById("Reads_CV_pairs_rr3").value = grades.Reads_CV_pairs_rr3 || '';
                document.getElementById("Reads_CV_pairs_rr4").value = grades.Reads_CV_pairs_rr4 || '';
                document.getElementById("Pretest_Reads_CV_pairs_addrowrr1").value = grades.Pretest_Reads_CV_pairs_addrowrr1 || '';
                document.getElementById("Pretest_Reads_CV_pairs_addrowrr2").value = grades.Pretest_Reads_CV_pairs_addrowrr2 || '';
                document.getElementById("Pretest_Reads_CV_pairs_addrowrr3").value = grades.Pretest_Reads_CV_pairs_addrowrr3 || '';
                document.getElementById("Pretest_Reads_CV_pairs_addrowrr4").value = grades.Pretest_Reads_CV_pairs_addrowrr4 || '';
                document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr1").value = grades.QuarterlyExams_Reads_CV_pairs_addrowrr1 || '';
                document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr2").value = grades.QuarterlyExams_Reads_CV_pairs_addrowrr2 || '';
                document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr3").value = grades.QuarterlyExams_Reads_CV_pairs_addrowrr3 || '';
                document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr4").value = grades.QuarterlyExams_Reads_CV_pairs_addrowrr4 || '';
                document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr1").value = grades.TeachersObservation_Reads_CV_pairs_addrowrr1 || '';
                document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr2").value = grades.TeachersObservation_Reads_CV_pairs_addrowrr2 || '';
                document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr3").value = grades.TeachersObservation_Reads_CV_pairs_addrowrr3 || '';
                document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr4").value = grades.TeachersObservation_Reads_CV_pairs_addrowrr4 || ''; 

                // Reading Readiness | Reads three-letter words with short vowel sounds
                document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr1").value = grades.Reads_three_letter_words_with_short_vowel_sounds_rr1 || '';
                document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr2").value = grades.Reads_three_letter_words_with_short_vowel_sounds_rr2 || '';
                document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr3").value = grades.Reads_three_letter_words_with_short_vowel_sounds_rr3 || '';
                document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr4").value = grades.Reads_three_letter_words_with_short_vowel_sounds_rr4 || '';
                document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1").value = grades.Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1 || '';
                document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2").value = grades.Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2 || '';
                document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3").value = grades.Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3 || '';
                document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4").value = grades.Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4 || '';
                document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1").value = grades.QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1 || '';
                document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2").value = grades.QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2 || '';
                document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3").value = grades.QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3 || '';
                document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4").value = grades.QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4 || '';
                document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1").value = grades.TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1 || '';
                document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2").value = grades.TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2 || '';
                document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3").value = grades.TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3 || '';
                document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4").value = grades.TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4 || ''; 

                // Reading Readiness | Reads basic sight words
                document.getElementById("Reads_basic_sight_words_rr1").value = grades.Reads_basic_sight_words_rr1 || '';
                document.getElementById("Reads_basic_sight_words_rr2").value = grades.Reads_basic_sight_words_rr2 || '';
                document.getElementById("Reads_basic_sight_words_rr3").value = grades.Reads_basic_sight_words_rr3 || '';
                document.getElementById("Reads_basic_sight_words_rr4").value = grades.Reads_basic_sight_words_rr4 || '';
                document.getElementById("Pretest_Reads_basic_sight_words_addrowrr1").value = grades.Pretest_Reads_basic_sight_words_addrowrr1 || '';
                document.getElementById("Pretest_Reads_basic_sight_words_addrowrr2").value = grades.Pretest_Reads_basic_sight_words_addrowrr2 || '';
                document.getElementById("Pretest_Reads_basic_sight_words_addrowrr3").value = grades.Pretest_Reads_basic_sight_words_addrowrr3 || '';
                document.getElementById("Pretest_Reads_basic_sight_words_addrowrr4").value = grades.Pretest_Reads_basic_sight_words_addrowrr4 || '';
                document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr1").value = grades.QuarterlyExams_Reads_basic_sight_words_addrowrr1 || '';
                document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr2").value = grades.QuarterlyExams_Reads_basic_sight_words_addrowrr2 || '';
                document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr3").value = grades.QuarterlyExams_Reads_basic_sight_words_addrowrr3 || '';
                document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr4").value = grades.QuarterlyExams_Reads_basic_sight_words_addrowrr4 || '';
                document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr1").value = grades.TeachersObservation_Reads_basic_sight_words_addrowrr1 || '';
                document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr2").value = grades.TeachersObservation_Reads_basic_sight_words_addrowrr2 || '';
                document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr3").value = grades.TeachersObservation_Reads_basic_sight_words_addrowrr3 || '';
                document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr4").value = grades.TeachersObservation_Reads_basic_sight_words_addrowrr4 || ''; 

                // Socio-Emotional Development | Cares for his/her own physical needs such as
                document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed1").value = grades.Cares_for_his_her_own_physical_needs_such_as_sed1 || '';
                document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed2").value = grades.Cares_for_his_her_own_physical_needs_such_as_sed2 || '';
                document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed3").value = grades.Cares_for_his_her_own_physical_needs_such_as_sed3 || '';
                document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed4").value = grades.Cares_for_his_her_own_physical_needs_such_as_sed4 || '';
                document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed1").value = grades.Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed1 || '';
                document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed2").value = grades.Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed2 || '';
                document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed3").value = grades.Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed3 || '';
                document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed4").value = grades.Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed4 || '';
                document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed1").value = grades.Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed1 || '';
                document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed2").value = grades.Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed2 || '';
                document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed3").value = grades.Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed3 || '';
                document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed4").value = grades.Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed4 || '';

                // Socio-Emotional Development | Follows simple directions
                document.getElementById("Follows_simple_directions_sed1").value = grades.Follows_simple_directions_sed1 || '';
                document.getElementById("Follows_simple_directions_sed2").value = grades.Follows_simple_directions_sed2 || '';
                document.getElementById("Follows_simple_directions_sed3").value = grades.Follows_simple_directions_sed3 || '';
                document.getElementById("Follows_simple_directions_sed4").value = grades.Follows_simple_directions_sed4 || '';
                document.getElementById("Pretest_Follows_simple_direction_addrowsed1").value = grades.Pretest_Follows_simple_direction_addrowsed1 || '';
                document.getElementById("Pretest_Follows_simple_direction_addrowsed2").value = grades.Pretest_Follows_simple_direction_addrowsed2 || '';
                document.getElementById("Pretest_Follows_simple_direction_addrowsed3").value = grades.Pretest_Follows_simple_direction_addrowsed3 || '';
                document.getElementById("Pretest_Follows_simple_direction_addrowsed4").value = grades.Pretest_Follows_simple_direction_addrowsed4 || '';
                document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed1").value = grades.QuarterlyExams_Follows_simple_direction_addrowsed1 || '';
                document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed2").value = grades.QuarterlyExams_Follows_simple_direction_addrowsed2 || '';
                document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed3").value = grades.QuarterlyExams_Follows_simple_direction_addrowsed3 || '';
                document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed4").value = grades.QuarterlyExams_Follows_simple_direction_addrowsed4 || '';
                document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed1").value = grades.TeachersObservation_Follows_simple_direction_addrowsed1 || '';
                document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed2").value = grades.TeachersObservation_Follows_simple_direction_addrowsed2 || '';
                document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed3").value = grades.TeachersObservation_Follows_simple_direction_addrowsed3 || '';
                document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed4").value = grades.TeachersObservation_Follows_simple_direction_addrowsed4 || ''; 

                // Socio-Emotional Development | Follows classroom rules
                document.getElementById("Follows_classroom_rules_sed1").value = grades.Follows_classroom_rules_sed1 || '';
                document.getElementById("Follows_classroom_rules_sed2").value = grades.Follows_classroom_rules_sed2 || '';
                document.getElementById("Follows_classroom_rules_sed3").value = grades.Follows_classroom_rules_sed3 || '';
                document.getElementById("Follows_classroom_rules_sed4").value = grades.Follows_classroom_rules_sed4 || '';
                document.getElementById("Pretest_Follows_classroom_rules_addrowsed1").value = grades.Pretest_Follows_classroom_rules_addrowsed1 || '';
                document.getElementById("Pretest_Follows_classroom_rules_addrowsed2").value = grades.Pretest_Follows_classroom_rules_addrowsed2 || '';
                document.getElementById("Pretest_Follows_classroom_rules_addrowsed3").value = grades.Pretest_Follows_classroom_rules_addrowsed3 || '';
                document.getElementById("Pretest_Follows_classroom_rules_addrowsed4").value = grades.Pretest_Follows_classroom_rules_addrowsed4 || '';
                document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed1").value = grades.QuarterlyExams_Follows_classroom_rules_addrowsed1 || '';
                document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed2").value = grades.QuarterlyExams_Follows_classroom_rules_addrowsed2 || '';
                document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed3").value = grades.QuarterlyExams_Follows_classroom_rules_addrowsed3 || '';
                document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed4").value = grades.QuarterlyExams_Follows_classroom_rules_addrowsed4 || '';
                document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed1").value = grades.TeachersObservation_Follows_classroom_rules_addrowsed1 || '';
                document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed2").value = grades.TeachersObservation_Follows_classroom_rules_addrowsed2 || '';
                document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed3").value = grades.TeachersObservation_Follows_classroom_rules_addrowsed3 || '';
                document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed4").value = grades.TeachersObservation_Follows_classroom_rules_addrowsed4 || ''; 

                // Socio-Emotional Development | Shares and waits for turn
                document.getElementById("Shares_and_waits_for_turn_sed1").value = grades.Shares_and_waits_for_turn_sed1 || '';
                document.getElementById("Shares_and_waits_for_turn_sed2").value = grades.Shares_and_waits_for_turn_sed2 || '';
                document.getElementById("Shares_and_waits_for_turn_sed3").value = grades.Shares_and_waits_for_turn_sed3 || '';
                document.getElementById("Shares_and_waits_for_turn_sed4").value = grades.Shares_and_waits_for_turn_sed4 || '';
                document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed1").value = grades.Pretest_Shares_and_waits_for_turn_addrowsed1 || '';
                document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed2").value = grades.Pretest_Shares_and_waits_for_turn_addrowsed2 || '';
                document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed3").value = grades.Pretest_Shares_and_waits_for_turn_addrowsed3 || '';
                document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed4").value = grades.Pretest_Shares_and_waits_for_turn_addrowsed4 || '';
                document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed1").value = grades.QuarterlyExams_Shares_and_waits_for_turn_addrowsed1 || '';
                document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed2").value = grades.QuarterlyExams_Shares_and_waits_for_turn_addrowsed2 || '';
                document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed3").value = grades.QuarterlyExams_Shares_and_waits_for_turn_addrowsed3 || '';
                document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed4").value = grades.QuarterlyExams_Shares_and_waits_for_turn_addrowsed4 || '';
                document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed1").value = grades.TeachersObservation_Shares_and_waits_for_turn_addrowsed1 || '';
                document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed2").value = grades.TeachersObservation_Shares_and_waits_for_turn_addrowsed2 || '';
                document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed3").value = grades.TeachersObservation_Shares_and_waits_for_turn_addrowsed3 || '';
                document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed4").value = grades.TeachersObservation_Shares_and_waits_for_turn_addrowsed4 || ''; 

                // Socio-Emotional Development | Plays cooperatively with others
                document.getElementById("Plays_cooperatively_with_others_sed1").value = grades.Plays_cooperatively_with_others_sed1 || '';
                document.getElementById("Plays_cooperatively_with_others_sed2").value = grades.Plays_cooperatively_with_others_sed2 || '';
                document.getElementById("Plays_cooperatively_with_others_sed3").value = grades.Plays_cooperatively_with_others_sed3 || '';
                document.getElementById("Plays_cooperatively_with_others_sed4").value = grades.Plays_cooperatively_with_others_sed4 || '';
                document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed1").value = grades.Pretest_Plays_cooperatively_with_others_addrowsed1 || '';
                document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed2").value = grades.Pretest_Plays_cooperatively_with_others_addrowsed2 || '';
                document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed3").value = grades.Pretest_Plays_cooperatively_with_others_addrowsed3 || '';
                document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed4").value = grades.Pretest_Plays_cooperatively_with_others_addrowsed4 || '';
                document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed1").value = grades.QuarterlyExams_Plays_cooperatively_with_others_addrowsed1 || '';
                document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed2").value = grades.QuarterlyExams_Plays_cooperatively_with_others_addrowsed2 || '';
                document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed3").value = grades.QuarterlyExams_Plays_cooperatively_with_others_addrowsed3 || '';
                document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed4").value = grades.QuarterlyExams_Plays_cooperatively_with_others_addrowsed4 || '';
                document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed1").value = grades.TeachersObservation_Plays_cooperatively_with_others_addrowsed1 || '';
                document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed2").value = grades.TeachersObservation_Plays_cooperatively_with_others_addrowsed2 || '';
                document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed3").value = grades.TeachersObservation_Plays_cooperatively_with_others_addrowsed3 || '';
                document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed4").value = grades.TeachersObservation_Plays_cooperatively_with_others_addrowsed4 || ''; 

                // Socio-Emotional Development | Packs away
                document.getElementById("Packs_away_sed1").value = grades.Packs_away_sed1 || '';
                document.getElementById("Packs_away_sed2").value = grades.Packs_away_sed2 || '';
                document.getElementById("Packs_away_sed3").value = grades.Packs_away_sed3 || '';
                document.getElementById("Packs_away_sed4").value = grades.Packs_away_sed4 || '';
                document.getElementById("Pretest_Packs_away_addrowsed1").value = grades.Pretest_Packs_away_addrowsed1 || '';
                document.getElementById("Pretest_Packs_away_addrowsed2").value = grades.Pretest_Packs_away_addrowsed2 || '';
                document.getElementById("Pretest_Packs_away_addrowsed3").value = grades.Pretest_Packs_away_addrowsed3 || '';
                document.getElementById("Pretest_Packs_away_addrowsed4").value = grades.Pretest_Packs_away_addrowsed4 || '';
                document.getElementById("QuarterlyExams_Packs_away_addrowsed1").value = grades.QuarterlyExams_Packs_away_addrowsed1 || '';
                document.getElementById("QuarterlyExams_Packs_away_addrowsed2").value = grades.QuarterlyExams_Packs_away_addrowsed2 || '';
                document.getElementById("QuarterlyExams_Packs_away_addrowsed3").value = grades.QuarterlyExams_Packs_away_addrowsed3 || '';
                document.getElementById("QuarterlyExams_Packs_away_addrowsed4").value = grades.QuarterlyExams_Packs_away_addrowsed4 || '';
                document.getElementById("TeachersObservation_Packs_away_addrowsed1").value = grades.TeachersObservation_Packs_away_addrowsed1 || '';
                document.getElementById("TeachersObservation_Packs_away_addrowsed2").value = grades.TeachersObservation_Packs_away_addrowsed2 || '';
                document.getElementById("TeachersObservation_Packs_away_addrowsed3").value = grades.TeachersObservation_Packs_away_addrowsed3 || '';
                document.getElementById("TeachersObservation_Packs_away_addrowsed4").value = grades.TeachersObservation_Packs_away_addrowsed4 || ''; 

                // Socio-Emotional Development | Helps in simple tasks
                document.getElementById("Helps_in_simple_tasks_sed1").value = grades.Helps_in_simple_tasks_sed1 || '';
                document.getElementById("Helps_in_simple_tasks_sed2").value = grades.Helps_in_simple_tasks_sed2 || '';
                document.getElementById("Helps_in_simple_tasks_sed3").value = grades.Helps_in_simple_tasks_sed3 || '';
                document.getElementById("Helps_in_simple_tasks_sed4").value = grades.Helps_in_simple_tasks_sed4 || '';
                document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed1").value = grades.Pretest_Helps_in_simple_tasks_addrowsed1 || '';
                document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed2").value = grades.Pretest_Helps_in_simple_tasks_addrowsed2 || '';
                document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed3").value = grades.Pretest_Helps_in_simple_tasks_addrowsed3 || '';
                document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed4").value = grades.Pretest_Helps_in_simple_tasks_addrowsed4 || '';
                document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed1").value = grades.QuarterlyExams_Helps_in_simple_tasks_addrowsed1 || '';
                document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed2").value = grades.QuarterlyExams_Helps_in_simple_tasks_addrowsed2 || '';
                document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed3").value = grades.QuarterlyExams_Helps_in_simple_tasks_addrowsed3 || '';
                document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed4").value = grades.QuarterlyExams_Helps_in_simple_tasks_addrowsed4 || '';
                document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed1").value = grades.TeachersObservation_Helps_in_simple_tasks_addrowsed1 || '';
                document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed2").value = grades.TeachersObservation_Helps_in_simple_tasks_addrowsed2 || '';
                document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed3").value = grades.TeachersObservation_Helps_in_simple_tasks_addrowsed3 || '';
                document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed4").value = grades.TeachersObservation_Helps_in_simple_tasks_addrowsed4 || ''; 

                // Socio-Emotional Development | Attends to task for increasingly longer periods of time
                document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed1").value = grades.Attends_to_task_for_increasingly_longer_periods_of_time_sed1 || '';
                document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed2").value = grades.Attends_to_task_for_increasingly_longer_periods_of_time_sed2 || '';
                document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed3").value = grades.Attends_to_task_for_increasingly_longer_periods_of_time_sed3 || '';
                document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed4").value = grades.Attends_to_task_for_increasingly_longer_periods_of_time_sed4 || '';
                document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1").value = grades.Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1 || '';
                document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2").value = grades.Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2 || '';
                document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3").value = grades.Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3 || '';
                document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4").value = grades.Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4 || '';
                document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1").value = grades.QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1 || '';
                document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2").value = grades.QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2 || '';
                document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3").value = grades.QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3 || '';
                document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4").value = grades.QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4 || '';
                document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1").value = grades.TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1 || '';
                document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2").value = grades.TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2 || '';
                document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3").value = grades.TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3 || '';
                document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4").value = grades.TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4 || ''; 


            } else {
                clearGradeInputs(); // If no grades found for the student
            }
        })
        .catch((error) => {
            console.error("Error retrieving grades: ", error);
            clearGradeInputs(); // Clear inputs on error
        });
}

// Function to clear grade input fields
function clearGradeInputs() {

    // Gross Motor Development | Walks with coordinated altering arm movements
    document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd1").value = '';
    document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd2").value = '';
    document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd3").value = '';
    document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd4").value = '';
    document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd1").value = '';
    document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd2").value = '';
    document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd3").value = '';
    document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd4").value = '';
    document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd1").value = '';
    document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd2").value = '';
    document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd3").value = '';
    document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd4").value = '';
    document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd1").value = '';
    document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd2").value = '';
    document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd3").value = '';
    document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd4").value = '';

    // Gross Motor Development | Jumps forward at least 2 times without falling
    document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd1").value = '';
    document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd2").value = '';
    document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd3").value = '';
    document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd4").value = '';
    document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd1").value = '';
    document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd2").value = '';
    document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd3").value = '';
    document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd4").value = '';
    document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd1").value = '';
    document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd2").value = '';
    document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd3").value = '';
    document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd4").value = '';
    document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd1").value = '';
    document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd2").value = '';
    document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd3").value = '';
    document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd4").value = '';

    // Gross Motor Development | Runs with coordinated alternating arm movements
    document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd1").value = '';
    document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd2").value = '';
    document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd3").value = '';
    document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd4").value = '';
    document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd1").value = '';
    document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd2").value = '';
    document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd3").value = '';
    document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd4").value = '';
    document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd1").value = '';
    document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd2").value = '';
    document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd3").value = '';
    document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd4").value = '';
    document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd1").value = '';
    document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd2").value = '';
    document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd3").value = '';
    document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd4").value = '';

    // Gross Motor Development | Moves body parts as directed
    document.getElementById("Moves_body_parts_as_directed_gmd1").value = '';
    document.getElementById("Moves_body_parts_as_directed_gmd2").value = '';
    document.getElementById("Moves_body_parts_as_directed_gmd3").value = '';
    document.getElementById("Moves_body_parts_as_directed_gmd4").value = '';
    document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd1").value = '';
    document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd2").value = '';
    document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd3").value = '';
    document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd4").value = '';
    document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd1").value = '';
    document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd2").value = '';
    document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd3").value = '';
    document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd4").value = '';
    document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd1").value = '';
    document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd2").value = '';
    document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd3").value = '';
    document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd4").value = '';

    // Gross Motor Development | Throws ball with both hands from a distance
    document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd1").value = '';
    document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd2").value = '';
    document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd3").value = '';
    document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd4").value = '';
    document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd1").value = '';
    document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd2").value = '';
    document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd3").value = '';
    document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd4").value = '';
    document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd1").value = '';
    document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd2").value = '';
    document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd3").value = '';
    document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd4").value = '';
    document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd1").value = '';
    document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd2").value = '';
    document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd3").value = '';
    document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd4").value = '';

    // Fine Motor Development | Uses construction toys to build simple objects
    document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd1").value = '';
    document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd2").value = '';
    document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd3").value = '';
    document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd4").value = '';
    document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd1").value = '';
    document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd2").value = '';
    document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd3").value = '';
    document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd4").value = '';
    document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd1").value = '';
    document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd2").value = '';
    document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd3").value = '';
    document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd4").value = '';
    document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd1").value = '';
    document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd2").value = '';
    document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd3").value = '';
    document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd4").value = '';

    // Fine Motor Development | Exhibits adequate hand movements such as
    document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd1").value = '';
    document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd2").value = '';
    document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd3").value = '';
    document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd4").value = '';
    document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd1").value = '';
    document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd2").value = '';
    document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd3").value = '';
    document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd4").value = '';
    document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd1").value = '';
    document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd2").value = '';
    document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd3").value = '';
    document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd4").value = '';
    document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd1").value = '';
    document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd2").value = '';
    document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd3").value = '';
    document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd4").value = '';

    // Fine Motor Development | Holds pencils/crayons
    document.getElementById("Holds_pencils_crayons_fmd1").value = '';
    document.getElementById("Holds_pencils_crayons_fmd2").value = '';
    document.getElementById("Holds_pencils_crayons_fmd3").value = '';
    document.getElementById("Holds_pencils_crayons_fmd4").value = '';
    document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd1").value = '';
    document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd2").value = '';
    document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd3").value = '';
    document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd4").value = '';
    document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd1").value = '';
    document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd2").value = '';
    document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd3").value = '';
    document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd4").value = '';
    document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd1").value = '';
    document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd2").value = '';
    document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd3").value = '';
    document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd4").value = '';

    // Fine Motor Development | Colors pictures
    document.getElementById("Colors_pictures_fmd1").value = '';
    document.getElementById("Colors_pictures_fmd2").value = '';
    document.getElementById("Colors_pictures_fmd3").value = '';
    document.getElementById("Colors_pictures_fmd4").value = '';
    document.getElementById("Pretest_Colors_pictures_addrowfmd1").value = '';
    document.getElementById("Pretest_Colors_pictures_addrowfmd2").value = '';
    document.getElementById("Pretest_Colors_pictures_addrowfmd3").value = '';
    document.getElementById("Pretest_Colors_pictures_addrowfmd4").value = '';
    document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd1").value = '';
    document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd2").value = '';
    document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd3").value = '';
    document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd4").value = '';
    document.getElementById("TeachersObservation_Colors_pictures_addrowfmd1").value = '';
    document.getElementById("TeachersObservation_Colors_pictures_addrowfmd2").value = '';
    document.getElementById("TeachersObservation_Colors_pictures_addrowfmd3").value = '';
    document.getElementById("TeachersObservation_Colors_pictures_addrowfmd4").value = '';

    // Fine Motor Development | Traces broken lines and connects dot-to-dot
    document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd1").value = '';
    document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd2").value = '';
    document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd3").value = '';
    document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd4").value = '';
    document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1").value = '';
    document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2").value = '';
    document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3").value = '';
    document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4").value = '';
    document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1").value = '';
    document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2").value = '';
    document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3").value = '';
    document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4").value = '';
    document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1").value = '';
    document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2").value = '';
    document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3").value = '';
    document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4").value = '';

    // Fine Motor Development | Draws shapes and simple pictures
    document.getElementById("Draws_shapes_and_simple_pictures_fmd1").value = '';
    document.getElementById("Draws_shapes_and_simple_pictures_fmd2").value = '';
    document.getElementById("Draws_shapes_and_simple_pictures_fmd3").value = '';
    document.getElementById("Draws_shapes_and_simple_pictures_fmd4").value = '';
    document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd1").value = '';
    document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd2").value = '';
    document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd3").value = '';
    document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd4").value = '';
    document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd1").value = '';
    document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd2").value = '';
    document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd3").value = '';
    document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd4").value = '';
    document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd1").value = '';
    document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd2").value = '';
    document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd3").value = '';
    document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd4").value = '';

    // Fine Motor Development | Writes uppercase letters with model
    document.getElementById("Writes_uppercase_letters_with_model_fmd1").value = '';
    document.getElementById("Writes_uppercase_letters_with_model_fmd2").value = '';
    document.getElementById("Writes_uppercase_letters_with_model_fmd3").value = '';
    document.getElementById("Writes_uppercase_letters_with_model_fmd4").value = '';
    document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd1").value = '';
    document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd2").value = '';
    document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd3").value = '';
    document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd4").value = '';
    document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd1").value = '';
    document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd2").value = '';
    document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd3").value = '';
    document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd4").value = '';
    document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd1").value = '';
    document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd2").value = '';
    document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd3").value = '';
    document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd4").value = '';

    // Fine Motor Development | Writes lowercase letters with model
    document.getElementById("Writes_lowercase_letters_with_model_fmd1").value = '';
    document.getElementById("Writes_lowercase_letters_with_model_fmd2").value = '';
    document.getElementById("Writes_lowercase_letters_with_model_fmd3").value = '';
    document.getElementById("Writes_lowercase_letters_with_model_fmd4").value = '';
    document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd1").value = '';
    document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd2").value = '';
    document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd3").value = '';
    document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd4").value = '';
    document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd1").value = '';
    document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd2").value = '';
    document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd3").value = '';
    document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd4").value = '';
    document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd1").value = '';
    document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd2").value = '';
    document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd3").value = '';
    document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd4").value = '';

    // Fine Motor Development | Writes nickname without model
    document.getElementById("Writes_nickname_without_model_fmd1").value = '';
    document.getElementById("Writes_nickname_without_model_fmd2").value = '';
    document.getElementById("Writes_nickname_without_model_fmd3").value = '';
    document.getElementById("Writes_nickname_without_model_fmd4").value = '';
    document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd1").value = '';
    document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd2").value = '';
    document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd3").value = '';
    document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd4").value = '';
    document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd1").value = '';
    document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd2").value = '';
    document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd3").value = '';
    document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd4").value = '';
    document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd1").value = '';
    document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd2").value = '';
    document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd3").value = '';
    document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd4").value = '';

    // Fine Motor Development | Writes complete name with model
    document.getElementById("Writes_complete_name_with_model_fmd1").value = '';
    document.getElementById("Writes_complete_name_with_model_fmd2").value = '';
    document.getElementById("Writes_complete_name_with_model_fmd3").value = '';
    document.getElementById("Writes_complete_name_with_model_fmd4").value = '';
    document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd1").value = '';
    document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd2").value = '';
    document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd3").value = '';
    document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd4").value = '';
    document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd1").value = '';
    document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd2").value = '';
    document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd3").value = '';
    document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd4").value = '';
    document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd1").value = '';
    document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd2").value = '';
    document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd3").value = '';
    document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd4").value = '';

    // Receptive/Expressive Language | Speaks clearly and audibly
    document.getElementById("Speaks_clearly_and_audibly_rel1").value = '';
    document.getElementById("Speaks_clearly_and_audibly_rel2").value = '';
    document.getElementById("Speaks_clearly_and_audibly_rel3").value = '';
    document.getElementById("Speaks_clearly_and_audibly_rel4").value = '';
    document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel1").value = '';
    document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel2").value = '';
    document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel3").value = '';
    document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel4").value = '';
    document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel1").value = '';
    document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel2").value = '';
    document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel3").value = '';
    document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel4").value = '';
    document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel1").value = '';
    document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel2").value = '';
    document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel3").value = '';
    document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel4").value = '';

    // Receptive/Expressive Language | Gives name
    document.getElementById("Gives_name_rel1").value = '';
    document.getElementById("Gives_name_rel2").value = '';
    document.getElementById("Gives_name_rel3").value = '';
    document.getElementById("Gives_name_rel4").value = '';
    document.getElementById("Pretest_Gives_name_addrowrel1").value = '';
    document.getElementById("Pretest_Gives_name_addrowrel2").value = '';
    document.getElementById("Pretest_Gives_name_addrowrel3").value = '';
    document.getElementById("Pretest_Gives_name_addrowrel4").value = '';
    document.getElementById("QuarterlyExams_Gives_name_addrowrel1").value = '';
    document.getElementById("QuarterlyExams_Gives_name_addrowrel2").value = '';
    document.getElementById("QuarterlyExams_Gives_name_addrowrel3").value = '';
    document.getElementById("QuarterlyExams_Gives_name_addrowrel4").value = '';
    document.getElementById("TeachersObservation_Gives_name_addrowrel1").value = '';
    document.getElementById("TeachersObservation_Gives_name_addrowrel2").value = '';
    document.getElementById("TeachersObservation_Gives_name_addrowrel3").value = '';
    document.getElementById("TeachersObservation_Gives_name_addrowrel4").value = '';

    // Receptive/Expressive Language | Sings songs taught in class
    document.getElementById("Sings_songs_taught_in_class_rel1").value = '';
    document.getElementById("Sings_songs_taught_in_class_rel2").value = '';
    document.getElementById("Sings_songs_taught_in_class_rel3").value = '';
    document.getElementById("Sings_songs_taught_in_class_rel4").value = '';
    document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel1").value = '';
    document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel2").value = '';
    document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel3").value = '';
    document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel4").value = '';
    document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel1").value = '';
    document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel2").value = '';
    document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel3").value = '';
    document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel4").value = '';
    document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel1").value = '';
    document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel2").value = '';
    document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel3").value = '';
    document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel4").value = '';

    // Receptive/Expressive Language | Talks to others
    document.getElementById("Talks_to_others_rel1").value = '';
    document.getElementById("Talks_to_others_rel2").value = '';
    document.getElementById("Talks_to_others_rel3").value = '';
    document.getElementById("Talks_to_others_rel4").value = '';
    document.getElementById("Pretest_Talks_to_others_addrowrel1").value = '';
    document.getElementById("Pretest_Talks_to_others_addrowrel2").value = '';
    document.getElementById("Pretest_Talks_to_others_addrowrel3").value = '';
    document.getElementById("Pretest_Talks_to_others_addrowrel4").value = '';
    document.getElementById("QuarterlyExams_Talks_to_others_addrowrel1").value = '';
    document.getElementById("QuarterlyExams_Talks_to_others_addrowrel2").value = '';
    document.getElementById("QuarterlyExams_Talks_to_others_addrowrel3").value = '';
    document.getElementById("QuarterlyExams_Talks_to_others_addrowrel4").value = '';
    document.getElementById("TeachersObservation_Talks_to_others_addrowrel1").value = '';
    document.getElementById("TeachersObservation_Talks_to_others_addrowrel2").value = '';
    document.getElementById("TeachersObservation_Talks_to_others_addrowrel3").value = '';
    document.getElementById("TeachersObservation_Talks_to_others_addrowrel4").value = '';

    // Receptive/Expressive Language | Answers simple questions
    document.getElementById("Answers_simple_questions_rel1").value = '';
    document.getElementById("Answers_simple_questions_rel2").value = '';
    document.getElementById("Answers_simple_questions_rel3").value = '';
    document.getElementById("Answers_simple_questions_rel4").value = '';
    document.getElementById("Pretest_Answers_simple_questions_addrowrel1").value = '';
    document.getElementById("Pretest_Answers_simple_questions_addrowrel2").value = '';
    document.getElementById("Pretest_Answers_simple_questions_addrowrel3").value = '';
    document.getElementById("Pretest_Answers_simple_questions_addrowrel4").value = '';
    document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel1").value = '';
    document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel2").value = '';
    document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel3").value = '';
    document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel4").value = '';
    document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel1").value = '';
    document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel2").value = '';
    document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel3").value = '';
    document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel4").value = '';

    // Receptive/Expressive Language | Retells simple events that happened at home or in school
    document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel1").value = '';
    document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel2").value = '';
    document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel3").value = '';
    document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel4").value = '';
    document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1").value = '';
    document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2").value = '';
    document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3").value = '';
    document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4").value = '';
    document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1").value = '';
    document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2").value = '';
    document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3").value = '';
    document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4").value = '';
    document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1").value = '';
    document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2").value = '';
    document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3").value = '';
    document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4").value = '';

    // Pre-Academic Development | Names familiar objects
    document.getElementById("Names_familiar_objects_pad1").value = '';
    document.getElementById("Names_familiar_objects_pad2").value = '';
    document.getElementById("Names_familiar_objects_pad3").value = '';
    document.getElementById("Names_familiar_objects_pad4").value = '';
    document.getElementById("Pretest_Names_familiar_objects_addrowpad1").value = '';
    document.getElementById("Pretest_Names_familiar_objects_addrowpad2").value = '';
    document.getElementById("Pretest_Names_familiar_objects_addrowpad3").value = '';
    document.getElementById("Pretest_Names_familiar_objects_addrowpad4").value = '';
    document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad1").value = '';
    document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad2").value = '';
    document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad3").value = '';
    document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad4").value = '';
    document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad1").value = '';
    document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad2").value = '';
    document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad3").value = '';
    document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad4").value = '';

    // Pre-Academic Development | Identifies own possessions
    document.getElementById("Identifies_own_possessions_pad1").value = '';
    document.getElementById("Identifies_own_possessions_pad2").value = '';
    document.getElementById("Identifies_own_possessions_pad3").value = '';
    document.getElementById("Identifies_own_possessions_pad4").value = '';
    document.getElementById("Pretest_Identifies_own_possessions_addrowpad1").value = '';
    document.getElementById("Pretest_Identifies_own_possessions_addrowpad2").value = '';
    document.getElementById("Pretest_Identifies_own_possessions_addrowpad3").value = '';
    document.getElementById("Pretest_Identifies_own_possessions_addrowpad4").value = '';
    document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad1").value = '';
    document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad2").value = '';
    document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad3").value = '';
    document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad4").value = '';
    document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad1").value = '';
    document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad2").value = '';
    document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad3").value = '';
    document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad4").value = '';

    // Pre-Academic Development | Identifies colors
    document.getElementById("Identifies_colors_pad1").value = '';
    document.getElementById("Identifies_colors_pad2").value = '';
    document.getElementById("Identifies_colors_pad3").value = '';
    document.getElementById("Identifies_colors_pad4").value = '';
    document.getElementById("Pretest_Identifies_colors_addrowpad1").value = '';
    document.getElementById("Pretest_Identifies_colors_addrowpad2").value = '';
    document.getElementById("Pretest_Identifies_colors_addrowpad3").value = '';
    document.getElementById("Pretest_Identifies_colors_addrowpad4").value = '';
    document.getElementById("QuarterlyExams_Identifies_colors_addrowpad1").value = '';
    document.getElementById("QuarterlyExams_Identifies_colors_addrowpad2").value = '';
    document.getElementById("QuarterlyExams_Identifies_colors_addrowpad3").value = '';
    document.getElementById("QuarterlyExams_Identifies_colors_addrowpad4").value = '';
    document.getElementById("TeachersObservation_Identifies_colors_addrowpad1").value = '';
    document.getElementById("TeachersObservation_Identifies_colors_addrowpad2").value = '';
    document.getElementById("TeachersObservation_Identifies_colors_addrowpad3").value = '';
    document.getElementById("TeachersObservation_Identifies_colors_addrowpad4").value = '';

    // Pre-Academic Development | Names basic shapes
    document.getElementById("Names_basic_shapes_pad1").value = '';
    document.getElementById("Names_basic_shapes_pad2").value = '';
    document.getElementById("Names_basic_shapes_pad3").value = '';
    document.getElementById("Names_basic_shapes_pad4").value = '';
    document.getElementById("Pretest_Names_basic_shapes_addrowpad1").value = '';
    document.getElementById("Pretest_Names_basic_shapes_addrowpad2").value = '';
    document.getElementById("Pretest_Names_basic_shapes_addrowpad3").value = '';
    document.getElementById("Pretest_Names_basic_shapes_addrowpad4").value = '';
    document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad1").value = '';
    document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad2").value = '';
    document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad3").value = '';
    document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad4").value = '';
    document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad1").value = '';
    document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad2").value = '';
    document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad3").value = '';
    document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad4").value = '';

    // Pre-Academic Development | Names objects as same and different
    document.getElementById("Names_objects_as_same_and_different_pad1").value = '';
    document.getElementById("Names_objects_as_same_and_different_pad2").value = '';
    document.getElementById("Names_objects_as_same_and_different_pad3").value = '';
    document.getElementById("Names_objects_as_same_and_different_pad4").value = '';
    document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad1").value = '';
    document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad2").value = '';
    document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad3").value = '';
    document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad4").value = '';
    document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad1").value = '';
    document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad2").value = '';
    document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad3").value = '';
    document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad4").value = '';
    document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad1").value = '';
    document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad2").value = '';
    document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad3").value = '';
    document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad4").value = '';

    // Pre-Academic Development | Identifies left hand and right hand
    document.getElementById("Identifies_left_hand_and_right_hand_pad1").value = '';
    document.getElementById("Identifies_left_hand_and_right_hand_pad2").value = '';
    document.getElementById("Identifies_left_hand_and_right_hand_pad3").value = '';
    document.getElementById("Identifies_left_hand_and_right_hand_pad4").value = '';
    document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad1").value = '';
    document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad2").value = '';
    document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad3").value = '';
    document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad4").value = '';
    document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad1").value = '';
    document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad2").value = '';
    document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad3").value = '';
    document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad4").value = '';
    document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad1").value = '';
    document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad2").value = '';
    document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad3").value = '';
    document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad4").value = '';

    // Pre-Academic Development | Recognizes name in print
    document.getElementById("Recognizes_name_in_print_pad1").value = '';
    document.getElementById("Recognizes_name_in_print_pad2").value = '';
    document.getElementById("Recognizes_name_in_print_pad3").value = '';
    document.getElementById("Recognizes_name_in_print_pad4").value = '';
    document.getElementById("Pretest_Recognizes_name_in_print_addrowpad1").value = '';
    document.getElementById("Pretest_Recognizes_name_in_print_addrowpad2").value = '';
    document.getElementById("Pretest_Recognizes_name_in_print_addrowpad3").value = '';
    document.getElementById("Pretest_Recognizes_name_in_print_addrowpad4").value = '';
    document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad1").value = '';
    document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad2").value = '';
    document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad3").value = '';
    document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad4").value = '';
    document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad1").value = '';
    document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad2").value = '';
    document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad3").value = '';
    document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad4").value = '';

    // Pre-Academic Development | Sees objects in relation to others in terms of spatial positions
    document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad1").value = '';
    document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad2").value = '';
    document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad3").value = '';
    document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad4").value = '';
    document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1").value = '';
    document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2").value = '';
    document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3").value = '';
    document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4").value = '';
    document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1").value = '';
    document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2").value = '';
    document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3").value = '';
    document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4").value = '';
    document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1").value = '';
    document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2").value = '';
    document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3").value = '';
    document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4").value = '';

    // Pre-Academic Development | Identifies missing parts of objects
    document.getElementById("Identifies_missing_parts_of_objects_pad1").value = '';
    document.getElementById("Identifies_missing_parts_of_objects_pad2").value = '';
    document.getElementById("Identifies_missing_parts_of_objects_pad3").value = '';
    document.getElementById("Identifies_missing_parts_of_objects_pad4").value = '';
    document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad1").value = '';
    document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad2").value = '';
    document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad3").value = '';
    document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad4").value = '';
    document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad1").value = '';
    document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad2").value = '';
    document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad3").value = '';
    document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad4").value = '';
    document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad1").value = '';
    document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad2").value = '';
    document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad3").value = '';
    document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad4").value = '';

    // Pre-Academic Development | Tells what is missing when one object is removed from a group of three
    document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad1").value = '';
    document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad2").value = '';
    document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad3").value = '';
    document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad4").value = '';
    document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1").value = '';
    document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2").value = '';
    document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3").value = '';
    document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4").value = '';
    document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1").value = '';
    document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2").value = '';
    document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3").value = '';
    document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4").value = '';
    document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1").value = '';
    document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2").value = '';
    document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3").value = '';
    document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4").value = '';

    // Logical Mathematical Development | Describes objects according to size, length, weight, and quantity
    document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd1").value = '';
    document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd2").value = '';
    document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd3").value = '';
    document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd4").value = '';
    document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1").value = '';
    document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2").value = '';
    document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3").value = '';
    document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4").value = '';

    // Logical Mathematical Development | Classifies objects according to size, color, and shape
    document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd1").value = '';
    document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd2").value = '';
    document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd3").value = '';
    document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd4").value = '';
    document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd1").value = '';
    document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd2").value = '';
    document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd3").value = '';
    document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd4").value = '';

    // Logical Mathematical Development | Compares sets
    document.getElementById("Compares_sets_lmd1").value = '';
    document.getElementById("Compares_sets_lmd2").value = '';
    document.getElementById("Compares_sets_lmd3").value = '';
    document.getElementById("Compares_sets_lmd4").value = '';
    document.getElementById("Pretest_Compares_sets_addrowlmd1").value = '';
    document.getElementById("Pretest_Compares_sets_addrowlmd2").value = '';
    document.getElementById("Pretest_Compares_sets_addrowlmd3").value = '';
    document.getElementById("Pretest_Compares_sets_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Compares_sets_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Compares_sets_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Compares_sets_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Compares_sets_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Compares_sets_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Compares_sets_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Compares_sets_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Compares_sets_addrowlmd4").value = '';

    // Logical Mathematical Development | Identifies what comes next in a pattern
    document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd1").value = '';
    document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd2").value = '';
    document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd3").value = '';
    document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd4").value = '';
    document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd1").value = '';
    document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd2").value = '';
    document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd3").value = '';
    document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd4").value = '';

    // Logical Mathematical Development | Knows one-to-one correspondence
    document.getElementById("Knows_one_to_one_correspondence_lmd1").value = '';
    document.getElementById("Knows_one_to_one_correspondence_lmd2").value = '';
    document.getElementById("Knows_one_to_one_correspondence_lmd3").value = '';
    document.getElementById("Knows_one_to_one_correspondence_lmd4").value = '';
    document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd1").value = '';
    document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd2").value = '';
    document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd3").value = '';
    document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd4").value = '';

    // Logical Mathematical Development | Rote counts up to 100
    document.getElementById("Rote_counts_up_to_100_lmd1").value = '';
    document.getElementById("Rote_counts_up_to_100_lmd2").value = '';
    document.getElementById("Rote_counts_up_to_100_lmd3").value = '';
    document.getElementById("Rote_counts_up_to_100_lmd4").value = '';
    document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd1").value = '';
    document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd2").value = '';
    document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd3").value = '';
    document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd4").value = '';

    // Logical Mathematical Development | Identifies numerals 0 to 50
    document.getElementById("Identifies_numerals_0_to_50_lmd1").value = '';
    document.getElementById("Identifies_numerals_0_to_50_lmd2").value = '';
    document.getElementById("Identifies_numerals_0_to_50_lmd3").value = '';
    document.getElementById("Identifies_numerals_0_to_50_lmd4").value = '';
    document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd1").value = '';
    document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd2").value = '';
    document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd3").value = '';
    document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd4").value = '';

    // Logical Mathematical Development | Writes numerals 0 to 20
    document.getElementById("Writes_numerals_0_to_20_lmd1").value = '';
    document.getElementById("Writes_numerals_0_to_20_lmd2").value = '';
    document.getElementById("Writes_numerals_0_to_20_lmd3").value = '';
    document.getElementById("Writes_numerals_0_to_20_lmd4").value = '';
    document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd1").value = '';
    document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd2").value = '';
    document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd3").value = '';
    document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd4").value = '';

    // Logical Mathematical Development | Puts numerals in proper sequence 
    document.getElementById("Puts_numerals_in_proper_sequence_lmd1").value = '';
    document.getElementById("Puts_numerals_in_proper_sequence_lmd2").value = '';
    document.getElementById("Puts_numerals_in_proper_sequence_lmd3").value = '';
    document.getElementById("Puts_numerals_in_proper_sequence_lmd4").value = '';
    document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd1").value = '';
    document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd2").value = '';
    document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd3").value = '';
    document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd4").value = '';

    // Logical Mathematical Development | Names position of objects 
    document.getElementById("Names_position_of_objects_lmd1").value = '';
    document.getElementById("Names_position_of_objects_lmd2").value = '';
    document.getElementById("Names_position_of_objects_lmd3").value = '';
    document.getElementById("Names_position_of_objects_lmd4").value = '';
    document.getElementById("Pretest_Names_position_of_objects_addrowlmd1").value = '';
    document.getElementById("Pretest_Names_position_of_objects_addrowlmd2").value = '';
    document.getElementById("Pretest_Names_position_of_objects_addrowlmd3").value = '';
    document.getElementById("Pretest_Names_position_of_objects_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd4").value = '';

    // Logical Mathematical Development | Performs simple addition with sum not greater than 10 using objects and picture stories 
    document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd1").value = '';
    document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd2").value = '';
    document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd3").value = '';
    document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd4").value = '';
    document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1").value = '';
    document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2").value = '';
    document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3").value = '';
    document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4").value = '';

    // Logical Mathematical Development | Performs simple subtraction of numbers between 0 to 10 using objects and picture stories 
    document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd1").value = '';
    document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd2").value = '';
    document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd3").value = '';
    document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd4").value = '';
    document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1").value = '';
    document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2").value = '';
    document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3").value = '';
    document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4").value = '';

    // Logical Mathematical Development | Tells time by hour and half hour
    document.getElementById("Tells_time_by_hour_and_half_hour_lmd1").value = '';
    document.getElementById("Tells_time_by_hour_and_half_hour_lmd2").value = '';
    document.getElementById("Tells_time_by_hour_and_half_hour_lmd3").value = '';
    document.getElementById("Tells_time_by_hour_and_half_hour_lmd4").value = '';
    document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd1").value = '';
    document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd2").value = '';
    document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd3").value = '';
    document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd4").value = '';
    document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd1").value = '';
    document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd2").value = '';
    document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd3").value = '';
    document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd4").value = '';
    document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd1").value = '';
    document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd2").value = '';
    document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd3").value = '';
    document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd4").value = '';

    // Reading Readiness | Names uppercase letters
    document.getElementById("Names_uppercase_letters_rr1").value = '';
    document.getElementById("Names_uppercase_letters_rr2").value = '';
    document.getElementById("Names_uppercase_letters_rr3").value = '';
    document.getElementById("Names_uppercase_letters_rr4").value = '';
    document.getElementById("Pretest_Names_uppercase_letters_addrowrr1").value = '';
    document.getElementById("Pretest_Names_uppercase_letters_addrowrr2").value = '';
    document.getElementById("Pretest_Names_uppercase_letters_addrowrr3").value = '';
    document.getElementById("Pretest_Names_uppercase_letters_addrowrr4").value = '';
    document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr1").value = '';
    document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr2").value = '';
    document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr3").value = '';
    document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr4").value = '';
    document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr1").value = '';
    document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr2").value = '';
    document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr3").value = '';
    document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr4").value = '';

    // Reading Readiness | Names lowercase letters
    document.getElementById("Names_lowercase_letters_rr1").value = '';
    document.getElementById("Names_lowercase_letters_rr2").value = '';
    document.getElementById("Names_lowercase_letters_rr3").value = '';
    document.getElementById("Names_lowercase_letters_rr4").value = '';
    document.getElementById("Pretest_Names_lowercase_letters_addrowrr1").value = '';
    document.getElementById("Pretest_Names_lowercase_letters_addrowrr2").value = '';
    document.getElementById("Pretest_Names_lowercase_letters_addrowrr3").value = '';
    document.getElementById("Pretest_Names_lowercase_letters_addrowrr4").value = '';
    document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr1").value = '';
    document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr2").value = '';
    document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr3").value = '';
    document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr4").value = '';
    document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr1").value = '';
    document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr2").value = '';
    document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr3").value = '';
    document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr4").value = '';

    // Reading Readiness | Gives the sounds of uppercase letters
    document.getElementById("Gives_the_sounds_of_uppercase_letters_rr1").value = '';
    document.getElementById("Gives_the_sounds_of_uppercase_letters_rr2").value = '';
    document.getElementById("Gives_the_sounds_of_uppercase_letters_rr3").value = '';
    document.getElementById("Gives_the_sounds_of_uppercase_letters_rr4").value = '';
    document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr1").value = '';
    document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr2").value = '';
    document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr3").value = '';
    document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr4").value = '';
    document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr1").value = '';
    document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr2").value = '';
    document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr3").value = '';
    document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr4").value = '';
    document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr1").value = '';
    document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr2").value = '';
    document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr3").value = '';
    document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr4").value = '';

    // Reading Readiness | Gives the sounds of lowercase letters
    document.getElementById("Gives_the_sounds_of_lowercase_letters_rr1").value = '';
    document.getElementById("Gives_the_sounds_of_lowercase_letters_rr2").value = '';
    document.getElementById("Gives_the_sounds_of_lowercase_letters_rr3").value = '';
    document.getElementById("Gives_the_sounds_of_lowercase_letters_rr4").value = '';
    document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr1").value = '';
    document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr2").value = '';
    document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr3").value = '';
    document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr4").value = '';
    document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr1").value = '';
    document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr2").value = '';
    document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr3").value = '';
    document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr4").value = '';
    document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr1").value = '';
    document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr2").value = '';
    document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr3").value = '';
    document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr4").value = '';

    // Reading Readiness | Associates words with corresponding pictures
    document.getElementById("Associates_words_with_corresponding_pictures_rr1").value = '';
    document.getElementById("Associates_words_with_corresponding_pictures_rr2").value = '';
    document.getElementById("Associates_words_with_corresponding_pictures_rr3").value = '';
    document.getElementById("Associates_words_with_corresponding_pictures_rr4").value = '';
    document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr1").value = '';
    document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr2").value = '';
    document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr3").value = '';
    document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr4").value = '';
    document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr1").value = '';
    document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr2").value = '';
    document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr3").value = '';
    document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr4").value = '';
    document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr1").value = '';
    document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr2").value = '';
    document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr3").value = '';
    document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr4").value = '';

    // Reading Readiness | Reads CV pairs
    document.getElementById("Reads_CV_pairs_rr1").value = '';
    document.getElementById("Reads_CV_pairs_rr2").value = '';
    document.getElementById("Reads_CV_pairs_rr3").value = '';
    document.getElementById("Reads_CV_pairs_rr4").value = '';
    document.getElementById("Pretest_Reads_CV_pairs_addrowrr1").value = '';
    document.getElementById("Pretest_Reads_CV_pairs_addrowrr2").value = '';
    document.getElementById("Pretest_Reads_CV_pairs_addrowrr3").value = '';
    document.getElementById("Pretest_Reads_CV_pairs_addrowrr4").value = '';
    document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr1").value = '';
    document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr2").value = '';
    document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr3").value = '';
    document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr4").value = '';
    document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr1").value = '';
    document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr2").value = '';
    document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr3").value = '';
    document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr4").value = '';

    // Reading Readiness | Reads three-letter words with short vowel sounds
    document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr1").value = '';
    document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr2").value = '';
    document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr3").value = '';
    document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr4").value = '';
    document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1").value = '';
    document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2").value = '';
    document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3").value = '';
    document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4").value = '';
    document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1").value = '';
    document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2").value = '';
    document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3").value = '';
    document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4").value = '';
    document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1").value = '';
    document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2").value = '';
    document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3").value = '';
    document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4").value = '';

    // Reading Readiness | Reads basic sight words
    document.getElementById("Reads_basic_sight_words_rr1").value = '';
    document.getElementById("Reads_basic_sight_words_rr2").value = '';
    document.getElementById("Reads_basic_sight_words_rr3").value = '';
    document.getElementById("Reads_basic_sight_words_rr4").value = '';
    document.getElementById("Pretest_Reads_basic_sight_words_addrowrr1").value = '';
    document.getElementById("Pretest_Reads_basic_sight_words_addrowrr2").value = '';
    document.getElementById("Pretest_Reads_basic_sight_words_addrowrr3").value = '';
    document.getElementById("Pretest_Reads_basic_sight_words_addrowrr4").value = '';
    document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr1").value = '';
    document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr2").value = '';
    document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr3").value = '';
    document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr4").value = '';
    document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr1").value = '';
    document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr2").value = '';
    document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr3").value = '';
    document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr4").value = '';

    // Socio-Emotional Development | Cares for his/her own physical needs such as
    document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed1").value = '';
    document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed2").value = '';
    document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed3").value = '';
    document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed4").value = '';
    document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed1").value = '';
    document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed2").value = '';
    document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed3").value = '';
    document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed4").value = '';
    document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed1").value = '';
    document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed2").value = '';
    document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed3").value = '';
    document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed4").value = '';

    // Socio-Emotional Development | Follows simple directions
    document.getElementById("Follows_simple_directions_sed1").value = '';
    document.getElementById("Follows_simple_directions_sed2").value = '';
    document.getElementById("Follows_simple_directions_sed3").value = '';
    document.getElementById("Follows_simple_directions_sed4").value = '';
    document.getElementById("Pretest_Follows_simple_direction_addrowsed1").value = '';
    document.getElementById("Pretest_Follows_simple_direction_addrowsed2").value = '';
    document.getElementById("Pretest_Follows_simple_direction_addrowsed3").value = '';
    document.getElementById("Pretest_Follows_simple_direction_addrowsed4").value = '';
    document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed1").value = '';
    document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed2").value = '';
    document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed3").value = '';
    document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed4").value = '';
    document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed1").value = '';
    document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed2").value = '';
    document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed3").value = '';
    document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed4").value = '';

    // Socio-Emotional Development | Follows classroom rules
    document.getElementById("Follows_classroom_rules_sed1").value = '';
    document.getElementById("Follows_classroom_rules_sed2").value = '';
    document.getElementById("Follows_classroom_rules_sed3").value = '';
    document.getElementById("Follows_classroom_rules_sed4").value = '';
    document.getElementById("Pretest_Follows_classroom_rules_addrowsed1").value = '';
    document.getElementById("Pretest_Follows_classroom_rules_addrowsed2").value = '';
    document.getElementById("Pretest_Follows_classroom_rules_addrowsed3").value = '';
    document.getElementById("Pretest_Follows_classroom_rules_addrowsed4").value = '';
    document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed1").value = '';
    document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed2").value = '';
    document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed3").value = '';
    document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed4").value = '';
    document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed1").value = '';
    document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed2").value = '';
    document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed3").value = '';
    document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed4").value = '';

    // Socio-Emotional Development | Shares and waits for turn
    document.getElementById("Shares_and_waits_for_turn_sed1").value = '';
    document.getElementById("Shares_and_waits_for_turn_sed2").value = '';
    document.getElementById("Shares_and_waits_for_turn_sed3").value = '';
    document.getElementById("Shares_and_waits_for_turn_sed4").value = '';
    document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed1").value = '';
    document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed2").value = '';
    document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed3").value = '';
    document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed4").value = '';
    document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed1").value = '';
    document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed2").value = '';
    document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed3").value = '';
    document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed4").value = '';
    document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed1").value = '';
    document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed2").value = '';
    document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed3").value = '';
    document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed4").value = '';

    // Socio-Emotional Development | Plays cooperatively with others
    document.getElementById("Plays_cooperatively_with_others_sed1").value = '';
    document.getElementById("Plays_cooperatively_with_others_sed2").value = '';
    document.getElementById("Plays_cooperatively_with_others_sed3").value = '';
    document.getElementById("Plays_cooperatively_with_others_sed4").value = '';
    document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed1").value = '';
    document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed2").value = '';
    document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed3").value = '';
    document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed4").value = '';
    document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed1").value = '';
    document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed2").value = '';
    document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed3").value = '';
    document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed4").value = '';
    document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed1").value = '';
    document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed2").value = '';
    document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed3").value = '';
    document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed4").value = '';

    // Socio-Emotional Development | Packs away
    document.getElementById("Packs_away_sed1").value = '';
    document.getElementById("Packs_away_sed2").value = '';
    document.getElementById("Packs_away_sed3").value = '';
    document.getElementById("Packs_away_sed4").value = '';
    document.getElementById("Pretest_Packs_away_addrowsed1").value = '';
    document.getElementById("Pretest_Packs_away_addrowsed2").value = '';
    document.getElementById("Pretest_Packs_away_addrowsed3").value = '';
    document.getElementById("Pretest_Packs_away_addrowsed4").value = '';
    document.getElementById("QuarterlyExams_Packs_away_addrowsed1").value = '';
    document.getElementById("QuarterlyExams_Packs_away_addrowsed2").value = '';
    document.getElementById("QuarterlyExams_Packs_away_addrowsed3").value = '';
    document.getElementById("QuarterlyExams_Packs_away_addrowsed4").value = '';
    document.getElementById("TeachersObservation_Packs_away_addrowsed1").value = '';
    document.getElementById("TeachersObservation_Packs_away_addrowsed2").value = '';
    document.getElementById("TeachersObservation_Packs_away_addrowsed3").value = '';
    document.getElementById("TeachersObservation_Packs_away_addrowsed4").value = '';

    // Socio-Emotional Development | Helps in simple tasks
    document.getElementById("Helps_in_simple_tasks_sed1").value = '';
    document.getElementById("Helps_in_simple_tasks_sed2").value = '';
    document.getElementById("Helps_in_simple_tasks_sed3").value = '';
    document.getElementById("Helps_in_simple_tasks_sed4").value = '';
    document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed1").value = '';
    document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed2").value = '';
    document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed3").value = '';
    document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed4").value = '';
    document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed1").value = '';
    document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed2").value = '';
    document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed3").value = '';
    document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed4").value = '';
    document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed1").value = '';
    document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed2").value = '';
    document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed3").value = '';
    document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed4").value = '';

    // Socio-Emotional Development | Attends to task for increasingly longer periods of time
    document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed1").value = '';
    document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed2").value = '';
    document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed3").value = '';
    document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed4").value = '';
    document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1").value = '';
    document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2").value = '';
    document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3").value = '';
    document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4").value = '';
    document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1").value = '';
    document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2").value = '';
    document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3").value = '';
    document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4").value = '';
    document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1").value = '';
    document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2").value = '';
    document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3").value = '';
    document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4").value = '';

}

// Function to save grades to Firestore
function saveGrades() {
    if (!currentStudentId) {
        console.error("No current student ID found.");
        return;
    }

    // Retrieve grade inputs

    // Gross Motor Development | Walks with coordinated altering arm movements
    const Walks_with_coordinated_altering_arm_movements_gmd1 = document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd1").value;
    const Walks_with_coordinated_altering_arm_movements_gmd2 = document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd2").value;
    const Walks_with_coordinated_altering_arm_movements_gmd3 = document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd3").value;
    const Walks_with_coordinated_altering_arm_movements_gmd4 = document.getElementById("Walks_with_coordinated_altering_arm_movements_gmd4").value;
    const Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd1 = document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd1").value;
    const Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd2 = document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd2").value;
    const Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd3 = document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd3").value;
    const Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd4 = document.getElementById("Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd4").value;
    const QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd1 = document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd1").value;
    const QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd2 = document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd2").value;
    const QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd3 = document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd3").value;
    const QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd4 = document.getElementById("QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd4").value;
    const TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd1 = document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd1").value;
    const TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd2 = document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd2").value;
    const TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd3 = document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd3").value;
    const TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd4 = document.getElementById("TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd4").value;

    // Gross Motor Development | Walks with coordinated altering arm movements
    const Jumps_forward_at_least_2_times_without_falling_gmd1 = document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd1").value;
    const Jumps_forward_at_least_2_times_without_falling_gmd2 = document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd2").value;
    const Jumps_forward_at_least_2_times_without_falling_gmd3 = document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd3").value;
    const Jumps_forward_at_least_2_times_without_falling_gmd4 = document.getElementById("Jumps_forward_at_least_2_times_without_falling_gmd4").value;
    const Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd1 = document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd1").value;
    const Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd2 = document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd2").value;
    const Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd3 = document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd3").value;
    const Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd4 = document.getElementById("Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd4").value;
    const QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd1 = document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd1").value;
    const QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd2 = document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd2").value;
    const QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd3 = document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd3").value;
    const QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd4 = document.getElementById("QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd4").value;
    const TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd1 = document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd1").value;
    const TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd2 = document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd2").value;
    const TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd3 = document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd3").value;
    const TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd4 = document.getElementById("TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd4").value;

    // Gross Motor Development | Runs with coordinated alternating arm movements
    const Runs_with_coordinated_alternating_arm_movements_gmd1 = document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd1").value;
    const Runs_with_coordinated_alternating_arm_movements_gmd2 = document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd2").value;
    const Runs_with_coordinated_alternating_arm_movements_gmd3 = document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd3").value;
    const Runs_with_coordinated_alternating_arm_movements_gmd4 = document.getElementById("Runs_with_coordinated_alternating_arm_movements_gmd4").value;
    const Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd1 = document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd1").value;
    const Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd2 = document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd2").value;
    const Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd3 = document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd3").value;
    const Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd4 = document.getElementById("Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd4").value;
    const QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd1 = document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd1").value;
    const QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd2 = document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd2").value;
    const QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd3 = document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd3").value;
    const QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd4 = document.getElementById("QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd4").value;
    const TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd1 = document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd1").value;
    const TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd2 = document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd2").value;
    const TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd3 = document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd3").value;
    const TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd4 = document.getElementById("TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd4").value;

    // Gross Motor Development | Moves body parts as directed
    const Moves_body_parts_as_directed_gmd1 = document.getElementById("Moves_body_parts_as_directed_gmd1").value;
    const Moves_body_parts_as_directed_gmd2 = document.getElementById("Moves_body_parts_as_directed_gmd2").value;
    const Moves_body_parts_as_directed_gmd3 = document.getElementById("Moves_body_parts_as_directed_gmd3").value;
    const Moves_body_parts_as_directed_gmd4 = document.getElementById("Moves_body_parts_as_directed_gmd4").value;
    const Pretest_Moves_body_parts_as_directed_addrowgmd1 = document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd1").value;
    const Pretest_Moves_body_parts_as_directed_addrowgmd2 = document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd2").value;
    const Pretest_Moves_body_parts_as_directed_addrowgmd3 = document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd3").value;
    const Pretest_Moves_body_parts_as_directed_addrowgmd4 = document.getElementById("Pretest_Moves_body_parts_as_directed_addrowgmd4").value;
    const QuarterlyExams_Moves_body_parts_as_directed_addrowgmd1 = document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd1").value;
    const QuarterlyExams_Moves_body_parts_as_directed_addrowgmd2 = document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd2").value;
    const QuarterlyExams_Moves_body_parts_as_directed_addrowgmd3 = document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd3").value;
    const QuarterlyExams_Moves_body_parts_as_directed_addrowgmd4 = document.getElementById("QuarterlyExams_Moves_body_parts_as_directed_addrowgmd4").value;
    const TeachersObservation_Moves_body_parts_as_directed_addrowgmd1 = document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd1").value;
    const TeachersObservation_Moves_body_parts_as_directed_addrowgmd2 = document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd2").value;
    const TeachersObservation_Moves_body_parts_as_directed_addrowgmd3 = document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd3").value;
    const TeachersObservation_Moves_body_parts_as_directed_addrowgmd4 = document.getElementById("TeachersObservation_Moves_body_parts_as_directed_addrowgmd4").value;

    // Gross Motor Development | Throws ball with both hands from a distance
    const Throws_ball_with_both_hands_from_a_distance_gmd1 = document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd1").value;
    const Throws_ball_with_both_hands_from_a_distance_gmd2 = document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd2").value;
    const Throws_ball_with_both_hands_from_a_distance_gmd3 = document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd3").value;
    const Throws_ball_with_both_hands_from_a_distance_gmd4 = document.getElementById("Throws_ball_with_both_hands_from_a_distance_gmd4").value;
    const Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd1 = document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd1").value;
    const Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd2 = document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd2").value;
    const Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd3 = document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd3").value;
    const Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd4 = document.getElementById("Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd4").value;
    const QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd1 = document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd1").value;
    const QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd2 = document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd2").value;
    const QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd3 = document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd3").value;
    const QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd4 = document.getElementById("QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd4").value;
    const TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd1 = document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd1").value;
    const TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd2 = document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd2").value;
    const TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd3 = document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd3").value;
    const TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd4 = document.getElementById("TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd4").value;

    // Fine Motor Development | Uses construction toys to build simple objects
    const Uses_construction_toys_to_build_simple_objects_fmd1 = document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd1").value;
    const Uses_construction_toys_to_build_simple_objects_fmd2 = document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd2").value;
    const Uses_construction_toys_to_build_simple_objects_fmd3 = document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd3").value;
    const Uses_construction_toys_to_build_simple_objects_fmd4 = document.getElementById("Uses_construction_toys_to_build_simple_objects_fmd4").value;
    const Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd1 = document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd1").value;
    const Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd2 = document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd2").value;
    const Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd3 = document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd3").value;
    const Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd4 = document.getElementById("Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd4").value;
    const QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd1 = document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd1").value;
    const QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd2 = document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd2").value;
    const QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd3 = document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd3").value;
    const QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd4 = document.getElementById("QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd4").value;
    const TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd1 = document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd1").value;
    const TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd2 = document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd2").value;
    const TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd3 = document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd3").value;
    const TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd4 = document.getElementById("TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd4").value;

    // Fine Motor Development | Exhibits adequate hand movements such as
    const Exhibits_adequate_hand_movements_such_as_fmd1 = document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd1").value;
    const Exhibits_adequate_hand_movements_such_as_fmd2 = document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd2").value;
    const Exhibits_adequate_hand_movements_such_as_fmd3 = document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd3").value;
    const Exhibits_adequate_hand_movements_such_as_fmd4 = document.getElementById("Exhibits_adequate_hand_movements_such_as_fmd4").value;
    const Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd1 = document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd1").value;
    const Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd2 = document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd2").value;
    const Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd3 = document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd3").value;
    const Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd4 = document.getElementById("Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd4").value;
    const Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd1 = document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd1").value;
    const Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd2 = document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd2").value;
    const Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd3 = document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd3").value;
    const Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd4 = document.getElementById("Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd4").value;
    const TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd1 = document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd1").value;
    const TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd2 = document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd2").value;
    const TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd3 = document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd3").value;
    const TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd4 = document.getElementById("TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd4").value;

    // Fine Motor Development | Holds pencils/crayons
    const Holds_pencils_crayons_fmd1 = document.getElementById("Holds_pencils_crayons_fmd1").value;
    const Holds_pencils_crayons_fmd2 = document.getElementById("Holds_pencils_crayons_fmd2").value;
    const Holds_pencils_crayons_fmd3 = document.getElementById("Holds_pencils_crayons_fmd3").value;
    const Holds_pencils_crayons_fmd4 = document.getElementById("Holds_pencils_crayons_fmd4").value;
    const Pretest_Holds_pencils_crayons_addrowfmd1 = document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd1").value;
    const Pretest_Holds_pencils_crayons_addrowfmd2 = document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd2").value;
    const Pretest_Holds_pencils_crayons_addrowfmd3 = document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd3").value;
    const Pretest_Holds_pencils_crayons_addrowfmd4 = document.getElementById("Pretest_Holds_pencils_crayons_addrowfmd4").value;
    const QuarterlyExams_Holds_pencils_crayons_addrowfmd1 = document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd1").value;
    const QuarterlyExams_Holds_pencils_crayons_addrowfmd2 = document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd2").value;
    const QuarterlyExams_Holds_pencils_crayons_addrowfmd3 = document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd3").value;
    const QuarterlyExams_Holds_pencils_crayons_addrowfmd4 = document.getElementById("QuarterlyExams_Holds_pencils_crayons_addrowfmd4").value;
    const TeachersObservation_Holds_pencils_crayons_addrowfmd1 = document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd1").value;
    const TeachersObservation_Holds_pencils_crayons_addrowfmd2 = document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd2").value;
    const TeachersObservation_Holds_pencils_crayons_addrowfmd3 = document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd3").value;
    const TeachersObservation_Holds_pencils_crayons_addrowfmd4 = document.getElementById("TeachersObservation_Holds_pencils_crayons_addrowfmd4").value;

    // Fine Motor Development | Colors pictures
    const Colors_pictures_fmd1 = document.getElementById("Colors_pictures_fmd1").value;
    const Colors_pictures_fmd2 = document.getElementById("Colors_pictures_fmd2").value;
    const Colors_pictures_fmd3 = document.getElementById("Colors_pictures_fmd3").value;
    const Colors_pictures_fmd4 = document.getElementById("Colors_pictures_fmd4").value;
    const Pretest_Colors_pictures_addrowfmd1 = document.getElementById("Pretest_Colors_pictures_addrowfmd1").value;
    const Pretest_Colors_pictures_addrowfmd2 = document.getElementById("Pretest_Colors_pictures_addrowfmd2").value;
    const Pretest_Colors_pictures_addrowfmd3 = document.getElementById("Pretest_Colors_pictures_addrowfmd3").value;
    const Pretest_Colors_pictures_addrowfmd4 = document.getElementById("Pretest_Colors_pictures_addrowfmd4").value;
    const QuarterlyExams_Colors_pictures_addrowfmd1 = document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd1").value;
    const QuarterlyExams_Colors_pictures_addrowfmd2 = document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd2").value;
    const QuarterlyExams_Colors_pictures_addrowfmd3 = document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd3").value;
    const QuarterlyExams_Colors_pictures_addrowfmd4 = document.getElementById("QuarterlyExams_Colors_pictures_addrowfmd4").value;
    const TeachersObservation_Colors_pictures_addrowfmd1 = document.getElementById("TeachersObservation_Colors_pictures_addrowfmd1").value;
    const TeachersObservation_Colors_pictures_addrowfmd2 = document.getElementById("TeachersObservation_Colors_pictures_addrowfmd2").value;
    const TeachersObservation_Colors_pictures_addrowfmd3 = document.getElementById("TeachersObservation_Colors_pictures_addrowfmd3").value;
    const TeachersObservation_Colors_pictures_addrowfmd4 = document.getElementById("TeachersObservation_Colors_pictures_addrowfmd4").value;

    // Fine Motor Development | Traces broken lines and connects dot-to-dot
    const Traces_broken_lines_and_connects_dot_to_dot_fmd1 = document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd1").value;
    const Traces_broken_lines_and_connects_dot_to_dot_fmd2 = document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd2").value;
    const Traces_broken_lines_and_connects_dot_to_dot_fmd3 = document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd3").value;
    const Traces_broken_lines_and_connects_dot_to_dot_fmd4 = document.getElementById("Traces_broken_lines_and_connects_dot_to_dot_fmd4").value;
    const Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1 = document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1").value;
    const Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2 = document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2").value;
    const Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3 = document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3").value;
    const Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4 = document.getElementById("Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4").value;
    const QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1 = document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1").value;
    const QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2 = document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2").value;
    const QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3 = document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3").value;
    const QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4 = document.getElementById("QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4").value;
    const TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1 = document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1").value;
    const TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2 = document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2").value;
    const TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3 = document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3").value;
    const TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4 = document.getElementById("TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4").value;

    // Fine Motor Development | Draws shapes and simple pictures
    const Draws_shapes_and_simple_pictures_fmd1 = document.getElementById("Draws_shapes_and_simple_pictures_fmd1").value;
    const Draws_shapes_and_simple_pictures_fmd2 = document.getElementById("Draws_shapes_and_simple_pictures_fmd2").value;
    const Draws_shapes_and_simple_pictures_fmd3 = document.getElementById("Draws_shapes_and_simple_pictures_fmd3").value;
    const Draws_shapes_and_simple_pictures_fmd4 = document.getElementById("Draws_shapes_and_simple_pictures_fmd4").value;
    const Pretest_Draws_shapes_and_simple_pictures_addrowfmd1 = document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd1").value;
    const Pretest_Draws_shapes_and_simple_pictures_addrowfmd2 = document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd2").value;
    const Pretest_Draws_shapes_and_simple_pictures_addrowfmd3 = document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd3").value;
    const Pretest_Draws_shapes_and_simple_pictures_addrowfmd4 = document.getElementById("Pretest_Draws_shapes_and_simple_pictures_addrowfmd4").value;
    const QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd1 = document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd1").value;
    const QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd2 = document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd2").value;
    const QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd3 = document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd3").value;
    const QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd4 = document.getElementById("QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd4").value;
    const TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd1 = document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd1").value;
    const TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd2 = document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd2").value;
    const TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd3 = document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd3").value;
    const TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd4 = document.getElementById("TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd4").value;

    // Fine Motor Development | Writes uppercase letters with model
    const Writes_uppercase_letters_with_model_fmd1 = document.getElementById("Writes_uppercase_letters_with_model_fmd1").value;
    const Writes_uppercase_letters_with_model_fmd2 = document.getElementById("Writes_uppercase_letters_with_model_fmd2").value;
    const Writes_uppercase_letters_with_model_fmd3 = document.getElementById("Writes_uppercase_letters_with_model_fmd3").value;
    const Writes_uppercase_letters_with_model_fmd4 = document.getElementById("Writes_uppercase_letters_with_model_fmd4").value;
    const Pretest_Writes_uppercase_letters_with_model_addrowfmd1 = document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd1").value;
    const Pretest_Writes_uppercase_letters_with_model_addrowfmd2 = document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd2").value;
    const Pretest_Writes_uppercase_letters_with_model_addrowfmd3 = document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd3").value;
    const Pretest_Writes_uppercase_letters_with_model_addrowfmd4 = document.getElementById("Pretest_Writes_uppercase_letters_with_model_addrowfmd4").value;
    const QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd1 = document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd1").value;
    const QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd2 = document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd2").value;
    const QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd3 = document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd3").value;
    const QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd4 = document.getElementById("QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd4").value;
    const TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd1 = document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd1").value;
    const TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd2 = document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd2").value;
    const TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd3 = document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd3").value;
    const TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd4 = document.getElementById("TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd4").value;

    // Fine Motor Development | Writes uppercase letters with model
    const Writes_lowercase_letters_with_model_fmd1 = document.getElementById("Writes_lowercase_letters_with_model_fmd1").value;
    const Writes_lowercase_letters_with_model_fmd2 = document.getElementById("Writes_lowercase_letters_with_model_fmd2").value;
    const Writes_lowercase_letters_with_model_fmd3 = document.getElementById("Writes_lowercase_letters_with_model_fmd3").value;
    const Writes_lowercase_letters_with_model_fmd4 = document.getElementById("Writes_lowercase_letters_with_model_fmd4").value;
    const Pretest_Writes_lowercase_letters_with_model_addrowfmd1 = document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd1").value;
    const Pretest_Writes_lowercase_letters_with_model_addrowfmd2 = document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd2").value;
    const Pretest_Writes_lowercase_letters_with_model_addrowfmd3 = document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd3").value;
    const Pretest_Writes_lowercase_letters_with_model_addrowfmd4 = document.getElementById("Pretest_Writes_lowercase_letters_with_model_addrowfmd4").value;
    const QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd1 = document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd1").value;
    const QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd2 = document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd2").value;
    const QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd3 = document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd3").value;
    const QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd4 = document.getElementById("QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd4").value;
    const TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd1 = document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd1").value;
    const TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd2 = document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd2").value;
    const TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd3 = document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd3").value;
    const TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd4 = document.getElementById("TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd4").value;

    // Fine Motor Development | Writes nickname without model
    const Writes_nickname_without_model_fmd1 = document.getElementById("Writes_nickname_without_model_fmd1").value;
    const Writes_nickname_without_model_fmd2 = document.getElementById("Writes_nickname_without_model_fmd2").value;
    const Writes_nickname_without_model_fmd3 = document.getElementById("Writes_nickname_without_model_fmd3").value;
    const Writes_nickname_without_model_fmd4 = document.getElementById("Writes_nickname_without_model_fmd4").value;
    const Pretest_Writes_nickname_without_model_addrowfmd1 = document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd1").value;
    const Pretest_Writes_nickname_without_model_addrowfmd2 = document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd2").value;
    const Pretest_Writes_nickname_without_model_addrowfmd3 = document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd3").value;
    const Pretest_Writes_nickname_without_model_addrowfmd4 = document.getElementById("Pretest_Writes_nickname_without_model_addrowfmd4").value;
    const QuarterlyExams_Writes_nickname_without_model_addrowfmd1 = document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd1").value;
    const QuarterlyExams_Writes_nickname_without_model_addrowfmd2 = document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd2").value;
    const QuarterlyExams_Writes_nickname_without_model_addrowfmd3 = document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd3").value;
    const QuarterlyExams_Writes_nickname_without_model_addrowfmd4 = document.getElementById("QuarterlyExams_Writes_nickname_without_model_addrowfmd4").value;
    const TeachersObservation_Writes_nickname_without_model_addrowfmd1 = document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd1").value;
    const TeachersObservation_Writes_nickname_without_model_addrowfmd2 = document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd2").value;
    const TeachersObservation_Writes_nickname_without_model_addrowfmd3 = document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd3").value;
    const TeachersObservation_Writes_nickname_without_model_addrowfmd4 = document.getElementById("TeachersObservation_Writes_nickname_without_model_addrowfmd4").value;

    // Fine Motor Development | Writes complete name with model
    const Writes_complete_name_with_model_fmd1 = document.getElementById("Writes_complete_name_with_model_fmd1").value;
    const Writes_complete_name_with_model_fmd2 = document.getElementById("Writes_complete_name_with_model_fmd2").value;
    const Writes_complete_name_with_model_fmd3 = document.getElementById("Writes_complete_name_with_model_fmd3").value;
    const Writes_complete_name_with_model_fmd4 = document.getElementById("Writes_complete_name_with_model_fmd4").value;
    const Pretest_Writes_complete_name_with_model_addrowfmd1 = document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd1").value;
    const Pretest_Writes_complete_name_with_model_addrowfmd2 = document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd2").value;
    const Pretest_Writes_complete_name_with_model_addrowfmd3 = document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd3").value;
    const Pretest_Writes_complete_name_with_model_addrowfmd4 = document.getElementById("Pretest_Writes_complete_name_with_model_addrowfmd4").value;
    const QuarterlyExams_Writes_complete_name_with_model_addrowfmd1 = document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd1").value;
    const QuarterlyExams_Writes_complete_name_with_model_addrowfmd2 = document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd2").value;
    const QuarterlyExams_Writes_complete_name_with_model_addrowfmd3 = document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd3").value;
    const QuarterlyExams_Writes_complete_name_with_model_addrowfmd4 = document.getElementById("QuarterlyExams_Writes_complete_name_with_model_addrowfmd4").value;
    const TeachersObservation_Writes_complete_name_with_model_addrowfmd1 = document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd1").value;
    const TeachersObservation_Writes_complete_name_with_model_addrowfmd2 = document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd2").value;
    const TeachersObservation_Writes_complete_name_with_model_addrowfmd3 = document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd3").value;
    const TeachersObservation_Writes_complete_name_with_model_addrowfmd4 = document.getElementById("TeachersObservation_Writes_complete_name_with_model_addrowfmd4").value;

    // Receptive/Expressive Language | Speaks clearly and audibly
    const Speaks_clearly_and_audibly_rel1 = document.getElementById("Speaks_clearly_and_audibly_rel1").value;
    const Speaks_clearly_and_audibly_rel2 = document.getElementById("Speaks_clearly_and_audibly_rel2").value;
    const Speaks_clearly_and_audibly_rel3 = document.getElementById("Speaks_clearly_and_audibly_rel3").value;
    const Speaks_clearly_and_audibly_rel4 = document.getElementById("Speaks_clearly_and_audibly_rel4").value;
    const Pretest_Speaks_clearly_and_audibly_addrowrel1 = document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel1").value;
    const Pretest_Speaks_clearly_and_audibly_addrowrel2 = document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel2").value;
    const Pretest_Speaks_clearly_and_audibly_addrowrel3 = document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel3").value;
    const Pretest_Speaks_clearly_and_audibly_addrowrel4 = document.getElementById("Pretest_Speaks_clearly_and_audibly_addrowrel4").value;
    const QuarterlyExams_Speaks_clearly_and_audibly_addrowrel1 = document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel1").value;
    const QuarterlyExams_Speaks_clearly_and_audibly_addrowrel2 = document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel2").value;
    const QuarterlyExams_Speaks_clearly_and_audibly_addrowrel3 = document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel3").value;
    const QuarterlyExams_Speaks_clearly_and_audibly_addrowrel4 = document.getElementById("QuarterlyExams_Speaks_clearly_and_audibly_addrowrel4").value;
    const TeachersObservation_Speaks_clearly_and_audibly_addrowrel1 = document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel1").value;
    const TeachersObservation_Speaks_clearly_and_audibly_addrowrel2 = document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel2").value;
    const TeachersObservation_Speaks_clearly_and_audibly_addrowrel3 = document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel3").value;
    const TeachersObservation_Speaks_clearly_and_audibly_addrowrel4 = document.getElementById("TeachersObservation_Speaks_clearly_and_audibly_addrowrel4").value;

    // Receptive/Expressive Language | Gives Name
    const Gives_name_rel1 = document.getElementById("Gives_name_rel1").value;
    const Gives_name_rel2 = document.getElementById("Gives_name_rel2").value;
    const Gives_name_rel3 = document.getElementById("Gives_name_rel3").value;
    const Gives_name_rel4 = document.getElementById("Gives_name_rel4").value;
    const Pretest_Gives_name_addrowrel1 = document.getElementById("Pretest_Gives_name_addrowrel1").value;
    const Pretest_Gives_name_addrowrel2 = document.getElementById("Pretest_Gives_name_addrowrel2").value;
    const Pretest_Gives_name_addrowrel3 = document.getElementById("Pretest_Gives_name_addrowrel3").value;
    const Pretest_Gives_name_addrowrel4 = document.getElementById("Pretest_Gives_name_addrowrel4").value;
    const QuarterlyExams_Gives_name_addrowrel1 = document.getElementById("QuarterlyExams_Gives_name_addrowrel1").value;
    const QuarterlyExams_Gives_name_addrowrel2 = document.getElementById("QuarterlyExams_Gives_name_addrowrel2").value;
    const QuarterlyExams_Gives_name_addrowrel3 = document.getElementById("QuarterlyExams_Gives_name_addrowrel3").value;
    const QuarterlyExams_Gives_name_addrowrel4 = document.getElementById("QuarterlyExams_Gives_name_addrowrel4").value;
    const TeachersObservation_Gives_name_addrowrel1 = document.getElementById("TeachersObservation_Gives_name_addrowrel1").value;
    const TeachersObservation_Gives_name_addrowrel2 = document.getElementById("TeachersObservation_Gives_name_addrowrel2").value;
    const TeachersObservation_Gives_name_addrowrel3 = document.getElementById("TeachersObservation_Gives_name_addrowrel3").value;
    const TeachersObservation_Gives_name_addrowrel4 = document.getElementById("TeachersObservation_Gives_name_addrowrel4").value;

    // Receptive/Expressive Language | Sings songs taught in class
    const Sings_songs_taught_in_class_rel1 = document.getElementById("Sings_songs_taught_in_class_rel1").value;
    const Sings_songs_taught_in_class_rel2 = document.getElementById("Sings_songs_taught_in_class_rel2").value;
    const Sings_songs_taught_in_class_rel3 = document.getElementById("Sings_songs_taught_in_class_rel3").value;
    const Sings_songs_taught_in_class_rel4 = document.getElementById("Sings_songs_taught_in_class_rel4").value;
    const Pretest_Sings_songs_taught_in_class_addrowrel1 = document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel1").value;
    const Pretest_Sings_songs_taught_in_class_addrowrel2 = document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel2").value;
    const Pretest_Sings_songs_taught_in_class_addrowrel3 = document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel3").value;
    const Pretest_Sings_songs_taught_in_class_addrowrel4 = document.getElementById("Pretest_Sings_songs_taught_in_class_addrowrel4").value;
    const QuarterlyExams_Sings_songs_taught_in_class_addrowrel1 = document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel1").value;
    const QuarterlyExams_Sings_songs_taught_in_class_addrowrel2 = document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel2").value;
    const QuarterlyExams_Sings_songs_taught_in_class_addrowrel3 = document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel3").value;
    const QuarterlyExams_Sings_songs_taught_in_class_addrowrel4 = document.getElementById("QuarterlyExams_Sings_songs_taught_in_class_addrowrel4").value;
    const TeachersObservation_Sings_songs_taught_in_class_addrowrel1 = document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel1").value;
    const TeachersObservation_Sings_songs_taught_in_class_addrowrel2 = document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel2").value;
    const TeachersObservation_Sings_songs_taught_in_class_addrowrel3 = document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel3").value;
    const TeachersObservation_Sings_songs_taught_in_class_addrowrel4 = document.getElementById("TeachersObservation_Sings_songs_taught_in_class_addrowrel4").value;

    // Receptive/Expressive Language | Talks to others
    const Talks_to_others_rel1 = document.getElementById("Talks_to_others_rel1").value;
    const Talks_to_others_rel2 = document.getElementById("Talks_to_others_rel2").value;
    const Talks_to_others_rel3 = document.getElementById("Talks_to_others_rel3").value;
    const Talks_to_others_rel4 = document.getElementById("Talks_to_others_rel4").value;
    const Pretest_Talks_to_others_addrowrel1 = document.getElementById("Pretest_Talks_to_others_addrowrel1").value;
    const Pretest_Talks_to_others_addrowrel2 = document.getElementById("Pretest_Talks_to_others_addrowrel2").value;
    const Pretest_Talks_to_others_addrowrel3 = document.getElementById("Pretest_Talks_to_others_addrowrel3").value;
    const Pretest_Talks_to_others_addrowrel4 = document.getElementById("Pretest_Talks_to_others_addrowrel4").value;
    const QuarterlyExams_Talks_to_others_addrowrel1 = document.getElementById("QuarterlyExams_Talks_to_others_addrowrel1").value;
    const QuarterlyExams_Talks_to_others_addrowrel2 = document.getElementById("QuarterlyExams_Talks_to_others_addrowrel2").value;
    const QuarterlyExams_Talks_to_others_addrowrel3 = document.getElementById("QuarterlyExams_Talks_to_others_addrowrel3").value;
    const QuarterlyExams_Talks_to_others_addrowrel4 = document.getElementById("QuarterlyExams_Talks_to_others_addrowrel4").value;
    const TeachersObservation_Talks_to_others_addrowrel1 = document.getElementById("TeachersObservation_Talks_to_others_addrowrel1").value;
    const TeachersObservation_Talks_to_others_addrowrel2 = document.getElementById("TeachersObservation_Talks_to_others_addrowrel2").value;
    const TeachersObservation_Talks_to_others_addrowrel3 = document.getElementById("TeachersObservation_Talks_to_others_addrowrel3").value;
    const TeachersObservation_Talks_to_others_addrowrel4 = document.getElementById("TeachersObservation_Talks_to_others_addrowrel4").value;

    // Receptive/Expressive Language | Answers simple questions
    const Answers_simple_questions_rel1 = document.getElementById("Answers_simple_questions_rel1").value;
    const Answers_simple_questions_rel2 = document.getElementById("Answers_simple_questions_rel2").value;
    const Answers_simple_questions_rel3 = document.getElementById("Answers_simple_questions_rel3").value;
    const Answers_simple_questions_rel4 = document.getElementById("Answers_simple_questions_rel4").value;
    const Pretest_Answers_simple_questions_addrowrel1 = document.getElementById("Pretest_Answers_simple_questions_addrowrel1").value;
    const Pretest_Answers_simple_questions_addrowrel2 = document.getElementById("Pretest_Answers_simple_questions_addrowrel2").value;
    const Pretest_Answers_simple_questions_addrowrel3 = document.getElementById("Pretest_Answers_simple_questions_addrowrel3").value;
    const Pretest_Answers_simple_questions_addrowrel4 = document.getElementById("Pretest_Answers_simple_questions_addrowrel4").value;
    const QuarterlyExams_Answers_simple_questions_addrowrel1 = document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel1").value;
    const QuarterlyExams_Answers_simple_questions_addrowrel2 = document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel2").value;
    const QuarterlyExams_Answers_simple_questions_addrowrel3 = document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel3").value;
    const QuarterlyExams_Answers_simple_questions_addrowrel4 = document.getElementById("QuarterlyExams_Answers_simple_questions_addrowrel4").value;
    const TeachersObservation_Answers_simple_questions_addrowrel1 = document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel1").value;
    const TeachersObservation_Answers_simple_questions_addrowrel2 = document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel2").value;
    const TeachersObservation_Answers_simple_questions_addrowrel3 = document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel3").value;
    const TeachersObservation_Answers_simple_questions_addrowrel4 = document.getElementById("TeachersObservation_Answers_simple_questions_addrowrel4").value;

    // Receptive/Expressive Language | Retells simple events that happened at home or in school
    const Retells_simple_events_that_happened_at_home_or_in_school_rel1 = document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel1").value;
    const Retells_simple_events_that_happened_at_home_or_in_school_rel2 = document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel2").value;
    const Retells_simple_events_that_happened_at_home_or_in_school_rel3 = document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel3").value;
    const Retells_simple_events_that_happened_at_home_or_in_school_rel4 = document.getElementById("Retells_simple_events_that_happened_at_home_or_in_school_rel4").value;
    const Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1 = document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1").value;
    const Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2 = document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2").value;
    const Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3 = document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3").value;
    const Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4 = document.getElementById("Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4").value;
    const QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1 = document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1").value;
    const QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2 = document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2").value;
    const QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3 = document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3").value;
    const QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4 = document.getElementById("QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4").value;
    const TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1 = document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1").value;
    const TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2 = document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2").value;
    const TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3 = document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3").value;
    const TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4 = document.getElementById("TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4").value;

    // Pre-Academic Development | Names familiar objects
    const Names_familiar_objects_pad1 = document.getElementById("Names_familiar_objects_pad1").value;
    const Names_familiar_objects_pad2 = document.getElementById("Names_familiar_objects_pad2").value;
    const Names_familiar_objects_pad3 = document.getElementById("Names_familiar_objects_pad3").value;
    const Names_familiar_objects_pad4 = document.getElementById("Names_familiar_objects_pad4").value;
    const Pretest_Names_familiar_objects_addrowpad1 = document.getElementById("Pretest_Names_familiar_objects_addrowpad1").value;
    const Pretest_Names_familiar_objects_addrowpad2 = document.getElementById("Pretest_Names_familiar_objects_addrowpad2").value;
    const Pretest_Names_familiar_objects_addrowpad3 = document.getElementById("Pretest_Names_familiar_objects_addrowpad3").value;
    const Pretest_Names_familiar_objects_addrowpad4 = document.getElementById("Pretest_Names_familiar_objects_addrowpad4").value;
    const QuarterlyExams_Names_familiar_objects_addrowpad1 = document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad1").value;
    const QuarterlyExams_Names_familiar_objects_addrowpad2 = document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad2").value;
    const QuarterlyExams_Names_familiar_objects_addrowpad3 = document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad3").value;
    const QuarterlyExams_Names_familiar_objects_addrowpad4 = document.getElementById("QuarterlyExams_Names_familiar_objects_addrowpad4").value;
    const TeachersObservation_Names_familiar_objects_addrowpad1 = document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad1").value;
    const TeachersObservation_Names_familiar_objects_addrowpad2 = document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad2").value;
    const TeachersObservation_Names_familiar_objects_addrowpad3 = document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad3").value;
    const TeachersObservation_Names_familiar_objects_addrowpad4 = document.getElementById("TeachersObservation_Names_familiar_objects_addrowpad4").value;

    // Pre-Academic Development | Names familiar objects
    const Identifies_own_possessions_pad1 = document.getElementById("Identifies_own_possessions_pad1").value;
    const Identifies_own_possessions_pad2 = document.getElementById("Identifies_own_possessions_pad2").value;
    const Identifies_own_possessions_pad3 = document.getElementById("Identifies_own_possessions_pad3").value;
    const Identifies_own_possessions_pad4 = document.getElementById("Identifies_own_possessions_pad4").value;
    const Pretest_Identifies_own_possessions_addrowpad1 = document.getElementById("Pretest_Identifies_own_possessions_addrowpad1").value;
    const Pretest_Identifies_own_possessions_addrowpad2 = document.getElementById("Pretest_Identifies_own_possessions_addrowpad2").value;
    const Pretest_Identifies_own_possessions_addrowpad3 = document.getElementById("Pretest_Identifies_own_possessions_addrowpad3").value;
    const Pretest_Identifies_own_possessions_addrowpad4 = document.getElementById("Pretest_Identifies_own_possessions_addrowpad4").value;
    const QuarterlyExams_Identifies_own_possessions_addrowpad1 = document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad1").value;
    const QuarterlyExams_Identifies_own_possessions_addrowpad2 = document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad2").value;
    const QuarterlyExams_Identifies_own_possessions_addrowpad3 = document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad3").value;
    const QuarterlyExams_Identifies_own_possessions_addrowpad4 = document.getElementById("QuarterlyExams_Identifies_own_possessions_addrowpad4").value;
    const TeachersObservation_Identifies_own_possessions_addrowpad1 = document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad1").value;
    const TeachersObservation_Identifies_own_possessions_addrowpad2 = document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad2").value;
    const TeachersObservation_Identifies_own_possessions_addrowpad3 = document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad3").value;
    const TeachersObservation_Identifies_own_possessions_addrowpad4 = document.getElementById("TeachersObservation_Identifies_own_possessions_addrowpad4").value;

    // Pre-Academic Development | Identifies colors
    const Identifies_colors_pad1 = document.getElementById("Identifies_colors_pad1").value;
    const Identifies_colors_pad2 = document.getElementById("Identifies_colors_pad2").value;
    const Identifies_colors_pad3 = document.getElementById("Identifies_colors_pad3").value;
    const Identifies_colors_pad4 = document.getElementById("Identifies_colors_pad4").value;
    const Pretest_Identifies_colors_addrowpad1 = document.getElementById("Pretest_Identifies_colors_addrowpad1").value;
    const Pretest_Identifies_colors_addrowpad2 = document.getElementById("Pretest_Identifies_colors_addrowpad2").value;
    const Pretest_Identifies_colors_addrowpad3 = document.getElementById("Pretest_Identifies_colors_addrowpad3").value;
    const Pretest_Identifies_colors_addrowpad4 = document.getElementById("Pretest_Identifies_colors_addrowpad4").value;
    const QuarterlyExams_Identifies_colors_addrowpad1 = document.getElementById("QuarterlyExams_Identifies_colors_addrowpad1").value;
    const QuarterlyExams_Identifies_colors_addrowpad2 = document.getElementById("QuarterlyExams_Identifies_colors_addrowpad2").value;
    const QuarterlyExams_Identifies_colors_addrowpad3 = document.getElementById("QuarterlyExams_Identifies_colors_addrowpad3").value;
    const QuarterlyExams_Identifies_colors_addrowpad4 = document.getElementById("QuarterlyExams_Identifies_colors_addrowpad4").value;
    const TeachersObservation_Identifies_colors_addrowpad1 = document.getElementById("TeachersObservation_Identifies_colors_addrowpad1").value;
    const TeachersObservation_Identifies_colors_addrowpad2 = document.getElementById("TeachersObservation_Identifies_colors_addrowpad2").value;
    const TeachersObservation_Identifies_colors_addrowpad3 = document.getElementById("TeachersObservation_Identifies_colors_addrowpad3").value;
    const TeachersObservation_Identifies_colors_addrowpad4 = document.getElementById("TeachersObservation_Identifies_colors_addrowpad4").value;

    // Pre-Academic Development | Names basic shapes
    const Names_basic_shapes_pad1 = document.getElementById("Names_basic_shapes_pad1").value;
    const Names_basic_shapes_pad2 = document.getElementById("Names_basic_shapes_pad2").value;
    const Names_basic_shapes_pad3 = document.getElementById("Names_basic_shapes_pad3").value;
    const Names_basic_shapes_pad4 = document.getElementById("Names_basic_shapes_pad4").value;
    const Pretest_Names_basic_shapes_addrowpad1 = document.getElementById("Pretest_Names_basic_shapes_addrowpad1").value;
    const Pretest_Names_basic_shapes_addrowpad2 = document.getElementById("Pretest_Names_basic_shapes_addrowpad2").value;
    const Pretest_Names_basic_shapes_addrowpad3 = document.getElementById("Pretest_Names_basic_shapes_addrowpad3").value;
    const Pretest_Names_basic_shapes_addrowpad4 = document.getElementById("Pretest_Names_basic_shapes_addrowpad4").value;
    const QuarterlyExams_Names_basic_shapes_addrowpad1 = document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad1").value;
    const QuarterlyExams_Names_basic_shapes_addrowpad2 = document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad2").value;
    const QuarterlyExams_Names_basic_shapes_addrowpad3 = document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad3").value;
    const QuarterlyExams_Names_basic_shapes_addrowpad4 = document.getElementById("QuarterlyExams_Names_basic_shapes_addrowpad4").value;
    const TeachersObservation_Names_basic_shapes_addrowpad1 = document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad1").value;
    const TeachersObservation_Names_basic_shapes_addrowpad2 = document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad2").value;
    const TeachersObservation_Names_basic_shapes_addrowpad3 = document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad3").value;
    const TeachersObservation_Names_basic_shapes_addrowpad4 = document.getElementById("TeachersObservation_Names_basic_shapes_addrowpad4").value;

    // Pre-Academic Development | Names objects as same and different
    const Names_objects_as_same_and_different_pad1 = document.getElementById("Names_objects_as_same_and_different_pad1").value;
    const Names_objects_as_same_and_different_pad2 = document.getElementById("Names_objects_as_same_and_different_pad2").value;
    const Names_objects_as_same_and_different_pad3 = document.getElementById("Names_objects_as_same_and_different_pad3").value;
    const Names_objects_as_same_and_different_pad4 = document.getElementById("Names_objects_as_same_and_different_pad4").value;
    const Pretest_Names_objects_as_same_and_different_addrowpad1 = document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad1").value;
    const Pretest_Names_objects_as_same_and_different_addrowpad2 = document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad2").value;
    const Pretest_Names_objects_as_same_and_different_addrowpad3 = document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad3").value;
    const Pretest_Names_objects_as_same_and_different_addrowpad4 = document.getElementById("Pretest_Names_objects_as_same_and_different_addrowpad4").value;
    const QuarterlyExams_Names_objects_as_same_and_different_addrowpad1 = document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad1").value;
    const QuarterlyExams_Names_objects_as_same_and_different_addrowpad2 = document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad2").value;
    const QuarterlyExams_Names_objects_as_same_and_different_addrowpad3 = document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad3").value;
    const QuarterlyExams_Names_objects_as_same_and_different_addrowpad4 = document.getElementById("QuarterlyExams_Names_objects_as_same_and_different_addrowpad4").value;
    const TeachersObservation_Names_objects_as_same_and_different_addrowpad1 = document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad1").value;
    const TeachersObservation_Names_objects_as_same_and_different_addrowpad2 = document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad2").value;
    const TeachersObservation_Names_objects_as_same_and_different_addrowpad3 = document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad3").value;
    const TeachersObservation_Names_objects_as_same_and_different_addrowpad4 = document.getElementById("TeachersObservation_Names_objects_as_same_and_different_addrowpad4").value;

    // Pre-Academic Development | Names objects as same and different
    const Identifies_left_hand_and_right_hand_pad1 = document.getElementById("Identifies_left_hand_and_right_hand_pad1").value;
    const Identifies_left_hand_and_right_hand_pad2 = document.getElementById("Identifies_left_hand_and_right_hand_pad2").value;
    const Identifies_left_hand_and_right_hand_pad3 = document.getElementById("Identifies_left_hand_and_right_hand_pad3").value;
    const Identifies_left_hand_and_right_hand_pad4 = document.getElementById("Identifies_left_hand_and_right_hand_pad4").value;
    const Pretest_Identifies_left_hand_and_right_hand_addrowpad1 = document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad1").value;
    const Pretest_Identifies_left_hand_and_right_hand_addrowpad2 = document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad2").value;
    const Pretest_Identifies_left_hand_and_right_hand_addrowpad3 = document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad3").value;
    const Pretest_Identifies_left_hand_and_right_hand_addrowpad4 = document.getElementById("Pretest_Identifies_left_hand_and_right_hand_addrowpad4").value;
    const QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad1 = document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad1").value;
    const QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad2 = document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad2").value;
    const QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad3 = document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad3").value;
    const QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad4 = document.getElementById("QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad4").value;
    const TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad1 = document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad1").value;
    const TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad2 = document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad2").value;
    const TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad3 = document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad3").value;
    const TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad4 = document.getElementById("TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad4").value;

    // Pre-Academic Development | Recognizes name in print
    const Recognizes_name_in_print_pad1 = document.getElementById("Recognizes_name_in_print_pad1").value;
    const Recognizes_name_in_print_pad2 = document.getElementById("Recognizes_name_in_print_pad2").value;
    const Recognizes_name_in_print_pad3 = document.getElementById("Recognizes_name_in_print_pad3").value;
    const Recognizes_name_in_print_pad4 = document.getElementById("Recognizes_name_in_print_pad4").value;
    const Pretest_Recognizes_name_in_print_addrowpad1 = document.getElementById("Pretest_Recognizes_name_in_print_addrowpad1").value;
    const Pretest_Recognizes_name_in_print_addrowpad2 = document.getElementById("Pretest_Recognizes_name_in_print_addrowpad2").value;
    const Pretest_Recognizes_name_in_print_addrowpad3 = document.getElementById("Pretest_Recognizes_name_in_print_addrowpad3").value;
    const Pretest_Recognizes_name_in_print_addrowpad4 = document.getElementById("Pretest_Recognizes_name_in_print_addrowpad4").value;
    const QuarterlyExams_Recognizes_name_in_print_addrowpad1 = document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad1").value;
    const QuarterlyExams_Recognizes_name_in_print_addrowpad2 = document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad2").value;
    const QuarterlyExams_Recognizes_name_in_print_addrowpad3 = document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad3").value;
    const QuarterlyExams_Recognizes_name_in_print_addrowpad4 = document.getElementById("QuarterlyExams_Recognizes_name_in_print_addrowpad4").value;
    const TeachersObservation_Recognizes_name_in_print_addrowpad1 = document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad1").value;
    const TeachersObservation_Recognizes_name_in_print_addrowpad2 = document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad2").value;
    const TeachersObservation_Recognizes_name_in_print_addrowpad3 = document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad3").value;
    const TeachersObservation_Recognizes_name_in_print_addrowpad4 = document.getElementById("TeachersObservation_Recognizes_name_in_print_addrowpad4").value;

    // Pre-Academic Development | Sees objects in relation to others in terms of spatial positions
    const Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad1 = document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad1").value;
    const Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad2 = document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad2").value;
    const Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad3 = document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad3").value;
    const Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad4 = document.getElementById("Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad4").value;
    const Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1 = document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1").value;
    const Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2 = document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2").value;
    const Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3 = document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3").value;
    const Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4 = document.getElementById("Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4").value;
    const QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1 = document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1").value;
    const QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2 = document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2").value;
    const QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3 = document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3").value;
    const QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4 = document.getElementById("QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4").value;
    const TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1 = document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1").value;
    const TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2 = document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2").value;
    const TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3 = document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3").value;
    const TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4 = document.getElementById("TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4").value;

    // Pre-Academic Development | Identifies missing parts of objects
    const Identifies_missing_parts_of_objects_pad1 = document.getElementById("Identifies_missing_parts_of_objects_pad1").value;
    const Identifies_missing_parts_of_objects_pad2 = document.getElementById("Identifies_missing_parts_of_objects_pad2").value;
    const Identifies_missing_parts_of_objects_pad3 = document.getElementById("Identifies_missing_parts_of_objects_pad3").value;
    const Identifies_missing_parts_of_objects_pad4 = document.getElementById("Identifies_missing_parts_of_objects_pad4").value;
    const Pretest_Identifies_missing_parts_of_objects_addrowpad1 = document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad1").value;
    const Pretest_Identifies_missing_parts_of_objects_addrowpad2 = document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad2").value;
    const Pretest_Identifies_missing_parts_of_objects_addrowpad3 = document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad3").value;
    const Pretest_Identifies_missing_parts_of_objects_addrowpad4 = document.getElementById("Pretest_Identifies_missing_parts_of_objects_addrowpad4").value;
    const QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad1 = document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad1").value;
    const QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad2 = document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad2").value;
    const QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad3 = document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad3").value;
    const QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad4 = document.getElementById("QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad4").value;
    const TeachersObservation_Identifies_missing_parts_of_objects_addrowpad1 = document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad1").value;
    const TeachersObservation_Identifies_missing_parts_of_objects_addrowpad2 = document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad2").value;
    const TeachersObservation_Identifies_missing_parts_of_objects_addrowpad3 = document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad3").value;
    const TeachersObservation_Identifies_missing_parts_of_objects_addrowpad4 = document.getElementById("TeachersObservation_Identifies_missing_parts_of_objects_addrowpad4").value;

    // Pre-Academic Development | Tells what is missing when one object is removed from a group of three
    const Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad1 = document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad1").value;
    const Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad2 = document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad2").value;
    const Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad3 = document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad3").value;
    const Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad4 = document.getElementById("Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad4").value;
    const Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1 = document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1").value;
    const Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2 = document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2").value;
    const Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3 = document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3").value;
    const Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4 = document.getElementById("Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4").value;
    const QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1 = document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1").value;
    const QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2 = document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2").value;
    const QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3 = document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3").value;
    const QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4 = document.getElementById("QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4").value;
    const TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1 = document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1").value;
    const TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2 = document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2").value;
    const TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3 = document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3").value;
    const TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4 = document.getElementById("TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4").value;

    // Logical Mathematical Development | Describes objects according to size, length, weight, and quantity
    const Describes_objects_according_to_size_length_weight_and_quantity_lmd1 = document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd1").value;
    const Describes_objects_according_to_size_length_weight_and_quantity_lmd2 = document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd2").value;
    const Describes_objects_according_to_size_length_weight_and_quantity_lmd3 = document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd3").value;
    const Describes_objects_according_to_size_length_weight_and_quantity_lmd4 = document.getElementById("Describes_objects_according_to_size_length_weight_and_quantity_lmd4").value;
    const Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1 = document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1").value;
    const Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2 = document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2").value;
    const Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3 = document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3").value;
    const Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4 = document.getElementById("Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4").value;
    const QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1 = document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1").value;
    const QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2 = document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2").value;
    const QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3 = document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3").value;
    const QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4 = document.getElementById("QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4").value;
    const TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1 = document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1").value;
    const TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2 = document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2").value;
    const TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3 = document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3").value;
    const TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4 = document.getElementById("TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4").value;

    // Logical Mathematical Development | Classifies objects according to size, color, and shape
    const Classifies_objects_according_to_size_color_and_shape_lmd1 = document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd1").value;
    const Classifies_objects_according_to_size_color_and_shape_lmd2 = document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd2").value;
    const Classifies_objects_according_to_size_color_and_shape_lmd3 = document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd3").value;
    const Classifies_objects_according_to_size_color_and_shape_lmd4 = document.getElementById("Classifies_objects_according_to_size_color_and_shape_lmd4").value;
    const Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd1 = document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd1").value;
    const Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd2 = document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd2").value;
    const Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd3 = document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd3").value;
    const Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd4 = document.getElementById("Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd4").value;
    const QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd1 = document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd1").value;
    const QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd2 = document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd2").value;
    const QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd3 = document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd3").value;
    const QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd4 = document.getElementById("QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd4").value;
    const TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd1 = document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd1").value;
    const TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd2 = document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd2").value;
    const TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd3 = document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd3").value;
    const TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd4 = document.getElementById("TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd4").value;

    // Logical Mathematical Development | Compare Sets
    const Compares_sets_lmd1 = document.getElementById("Compares_sets_lmd1").value;
    const Compares_sets_lmd2 = document.getElementById("Compares_sets_lmd2").value;
    const Compares_sets_lmd3 = document.getElementById("Compares_sets_lmd3").value;
    const Compares_sets_lmd4 = document.getElementById("Compares_sets_lmd4").value;
    const Pretest_Compares_sets_addrowlmd1 = document.getElementById("Pretest_Compares_sets_addrowlmd1").value;
    const Pretest_Compares_sets_addrowlmd2 = document.getElementById("Pretest_Compares_sets_addrowlmd2").value;
    const Pretest_Compares_sets_addrowlmd3 = document.getElementById("Pretest_Compares_sets_addrowlmd3").value;
    const Pretest_Compares_sets_addrowlmd4 = document.getElementById("Pretest_Compares_sets_addrowlmd4").value;
    const QuarterlyExams_Compares_sets_addrowlmd1 = document.getElementById("QuarterlyExams_Compares_sets_addrowlmd1").value;
    const QuarterlyExams_Compares_sets_addrowlmd2 = document.getElementById("QuarterlyExams_Compares_sets_addrowlmd2").value;
    const QuarterlyExams_Compares_sets_addrowlmd3 = document.getElementById("QuarterlyExams_Compares_sets_addrowlmd3").value;
    const QuarterlyExams_Compares_sets_addrowlmd4 = document.getElementById("QuarterlyExams_Compares_sets_addrowlmd4").value;
    const TeachersObservation_Compares_sets_addrowlmd1 = document.getElementById("TeachersObservation_Compares_sets_addrowlmd1").value;
    const TeachersObservation_Compares_sets_addrowlmd2 = document.getElementById("TeachersObservation_Compares_sets_addrowlmd2").value;
    const TeachersObservation_Compares_sets_addrowlmd3 = document.getElementById("TeachersObservation_Compares_sets_addrowlmd3").value;
    const TeachersObservation_Compares_sets_addrowlmd4 = document.getElementById("TeachersObservation_Compares_sets_addrowlmd4").value;

    // Logical Mathematical Development | Identifies what comes next in a pattern
    const Identifies_what_comes_next_in_a_pattern_lmd1 = document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd1").value;
    const Identifies_what_comes_next_in_a_pattern_lmd2 = document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd2").value;
    const Identifies_what_comes_next_in_a_pattern_lmd3 = document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd3").value;
    const Identifies_what_comes_next_in_a_pattern_lmd4 = document.getElementById("Identifies_what_comes_next_in_a_pattern_lmd4").value;
    const Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd1 = document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd1").value;
    const Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd2 = document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd2").value;
    const Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd3 = document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd3").value;
    const Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd4 = document.getElementById("Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd4").value;
    const QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd1 = document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd1").value;
    const QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd2 = document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd2").value;
    const QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd3 = document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd3").value;
    const QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd4 = document.getElementById("QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd4").value;
    const TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd1 = document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd1").value;
    const TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd2 = document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd2").value;
    const TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd3 = document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd3").value;
    const TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd4 = document.getElementById("TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd4").value;

    // Logical Mathematical Development | Knows one-to-one correspondence
    const Knows_one_to_one_correspondence_lmd1 = document.getElementById("Knows_one_to_one_correspondence_lmd1").value;
    const Knows_one_to_one_correspondence_lmd2 = document.getElementById("Knows_one_to_one_correspondence_lmd2").value;
    const Knows_one_to_one_correspondence_lmd3 = document.getElementById("Knows_one_to_one_correspondence_lmd3").value;
    const Knows_one_to_one_correspondence_lmd4 = document.getElementById("Knows_one_to_one_correspondence_lmd4").value;
    const Pretest_Knows_one_to_one_correspondence_addrowlmd1 = document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd1").value;
    const Pretest_Knows_one_to_one_correspondence_addrowlmd2 = document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd2").value;
    const Pretest_Knows_one_to_one_correspondence_addrowlmd3 = document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd3").value;
    const Pretest_Knows_one_to_one_correspondence_addrowlmd4 = document.getElementById("Pretest_Knows_one_to_one_correspondence_addrowlmd4").value;
    const QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd1 = document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd1").value;
    const QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd2 = document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd2").value;
    const QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd3 = document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd3").value;
    const QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd4 = document.getElementById("QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd4").value;
    const TeachersObservation_Knows_one_to_one_correspondence_addrowlmd1 = document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd1").value;
    const TeachersObservation_Knows_one_to_one_correspondence_addrowlmd2 = document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd2").value;
    const TeachersObservation_Knows_one_to_one_correspondence_addrowlmd3 = document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd3").value;
    const TeachersObservation_Knows_one_to_one_correspondence_addrowlmd4 = document.getElementById("TeachersObservation_Knows_one_to_one_correspondence_addrowlmd4").value;

    // Logical Mathematical Development | Rote counts up to 100
    const Rote_counts_up_to_100_lmd1 = document.getElementById("Rote_counts_up_to_100_lmd1").value;
    const Rote_counts_up_to_100_lmd2 = document.getElementById("Rote_counts_up_to_100_lmd2").value;
    const Rote_counts_up_to_100_lmd3 = document.getElementById("Rote_counts_up_to_100_lmd3").value;
    const Rote_counts_up_to_100_lmd4 = document.getElementById("Rote_counts_up_to_100_lmd4").value;
    const Pretest_Rote_counts_up_to_100_addrowlmd1 = document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd1").value;
    const Pretest_Rote_counts_up_to_100_addrowlmd2 = document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd2").value;
    const Pretest_Rote_counts_up_to_100_addrowlmd3 = document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd3").value;
    const Pretest_Rote_counts_up_to_100_addrowlmd4 = document.getElementById("Pretest_Rote_counts_up_to_100_addrowlmd4").value;
    const QuarterlyExams_Rote_counts_up_to_100_addrowlmd1 = document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd1").value;
    const QuarterlyExams_Rote_counts_up_to_100_addrowlmd2 = document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd2").value;
    const QuarterlyExams_Rote_counts_up_to_100_addrowlmd3 = document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd3").value;
    const QuarterlyExams_Rote_counts_up_to_100_addrowlmd4 = document.getElementById("QuarterlyExams_Rote_counts_up_to_100_addrowlmd4").value;
    const TeachersObservation_Rote_counts_up_to_100_addrowlmd1 = document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd1").value;
    const TeachersObservation_Rote_counts_up_to_100_addrowlmd2 = document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd2").value;
    const TeachersObservation_Rote_counts_up_to_100_addrowlmd3 = document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd3").value;
    const TeachersObservation_Rote_counts_up_to_100_addrowlmd4 = document.getElementById("TeachersObservation_Rote_counts_up_to_100_addrowlmd4").value;

    // Logical Mathematical Development | Identifies numerals 0 to 50
    const Identifies_numerals_0_to_50_lmd1 = document.getElementById("Identifies_numerals_0_to_50_lmd1").value;
    const Identifies_numerals_0_to_50_lmd2 = document.getElementById("Identifies_numerals_0_to_50_lmd2").value;
    const Identifies_numerals_0_to_50_lmd3 = document.getElementById("Identifies_numerals_0_to_50_lmd3").value;
    const Identifies_numerals_0_to_50_lmd4 = document.getElementById("Identifies_numerals_0_to_50_lmd4").value;
    const Pretest_Identifies_numerals_0_to_50_addrowlmd1 = document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd1").value;
    const Pretest_Identifies_numerals_0_to_50_addrowlmd2 = document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd2").value;
    const Pretest_Identifies_numerals_0_to_50_addrowlmd3 = document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd3").value;
    const Pretest_Identifies_numerals_0_to_50_addrowlmd4 = document.getElementById("Pretest_Identifies_numerals_0_to_50_addrowlmd4").value;
    const QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd1 = document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd1").value;
    const QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd2 = document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd2").value;
    const QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd3 = document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd3").value;
    const QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd4 = document.getElementById("QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd4").value;
    const TeachersObservation_Identifies_numerals_0_to_50_addrowlmd1 = document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd1").value;
    const TeachersObservation_Identifies_numerals_0_to_50_addrowlmd2 = document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd2").value;
    const TeachersObservation_Identifies_numerals_0_to_50_addrowlmd3 = document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd3").value;
    const TeachersObservation_Identifies_numerals_0_to_50_addrowlmd4 = document.getElementById("TeachersObservation_Identifies_numerals_0_to_50_addrowlmd4").value;

    // Logical Mathematical Development | Writes numerals 0 to 20
    const Writes_numerals_0_to_20_lmd1 = document.getElementById("Writes_numerals_0_to_20_lmd1").value;
    const Writes_numerals_0_to_20_lmd2 = document.getElementById("Writes_numerals_0_to_20_lmd2").value;
    const Writes_numerals_0_to_20_lmd3 = document.getElementById("Writes_numerals_0_to_20_lmd3").value;
    const Writes_numerals_0_to_20_lmd4 = document.getElementById("Writes_numerals_0_to_20_lmd4").value;
    const Pretest_Writes_numerals_0_to_20_addrowlmd1 = document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd1").value;
    const Pretest_Writes_numerals_0_to_20_addrowlmd2 = document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd2").value;
    const Pretest_Writes_numerals_0_to_20_addrowlmd3 = document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd3").value;
    const Pretest_Writes_numerals_0_to_20_addrowlmd4 = document.getElementById("Pretest_Writes_numerals_0_to_20_addrowlmd4").value;
    const QuarterlyExams_Writes_numerals_0_to_20_addrowlmd1 = document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd1").value;
    const QuarterlyExams_Writes_numerals_0_to_20_addrowlmd2 = document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd2").value;
    const QuarterlyExams_Writes_numerals_0_to_20_addrowlmd3 = document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd3").value;
    const QuarterlyExams_Writes_numerals_0_to_20_addrowlmd4 = document.getElementById("QuarterlyExams_Writes_numerals_0_to_20_addrowlmd4").value;
    const TeachersObservation_Writes_numerals_0_to_20_addrowlmd1 = document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd1").value;
    const TeachersObservation_Writes_numerals_0_to_20_addrowlmd2 = document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd2").value;
    const TeachersObservation_Writes_numerals_0_to_20_addrowlmd3 = document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd3").value;
    const TeachersObservation_Writes_numerals_0_to_20_addrowlmd4 = document.getElementById("TeachersObservation_Writes_numerals_0_to_20_addrowlmd4").value;

    // Logical Mathematical Development | Puts numerals in proper sequence 
    const Puts_numerals_in_proper_sequence_lmd1 = document.getElementById("Puts_numerals_in_proper_sequence_lmd1").value;
    const Puts_numerals_in_proper_sequence_lmd2 = document.getElementById("Puts_numerals_in_proper_sequence_lmd2").value;
    const Puts_numerals_in_proper_sequence_lmd3 = document.getElementById("Puts_numerals_in_proper_sequence_lmd3").value;
    const Puts_numerals_in_proper_sequence_lmd4 = document.getElementById("Puts_numerals_in_proper_sequence_lmd4").value;
    const Pretest_Puts_numerals_in_proper_sequence_addrowlmd1 = document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd1").value;
    const Pretest_Puts_numerals_in_proper_sequence_addrowlmd2 = document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd2").value;
    const Pretest_Puts_numerals_in_proper_sequence_addrowlmd3 = document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd3").value;
    const Pretest_Puts_numerals_in_proper_sequence_addrowlmd4 = document.getElementById("Pretest_Puts_numerals_in_proper_sequence_addrowlmd4").value;
    const QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd1 = document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd1").value;
    const QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd2 = document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd2").value;
    const QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd3 = document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd3").value;
    const QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd4 = document.getElementById("QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd4").value;
    const TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd1 = document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd1").value;
    const TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd2 = document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd2").value;
    const TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd3 = document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd3").value;
    const TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd4 = document.getElementById("TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd4").value;

    // Logical Mathematical Development | Names position of objects 
    const Names_position_of_objects_lmd1 = document.getElementById("Names_position_of_objects_lmd1").value;
    const Names_position_of_objects_lmd2 = document.getElementById("Names_position_of_objects_lmd2").value;
    const Names_position_of_objects_lmd3 = document.getElementById("Names_position_of_objects_lmd3").value;
    const Names_position_of_objects_lmd4 = document.getElementById("Names_position_of_objects_lmd4").value;
    const Pretest_Names_position_of_objects_addrowlmd1 = document.getElementById("Pretest_Names_position_of_objects_addrowlmd1").value;
    const Pretest_Names_position_of_objects_addrowlmd2 = document.getElementById("Pretest_Names_position_of_objects_addrowlmd2").value;
    const Pretest_Names_position_of_objects_addrowlmd3 = document.getElementById("Pretest_Names_position_of_objects_addrowlmd3").value;
    const Pretest_Names_position_of_objects_addrowlmd4 = document.getElementById("Pretest_Names_position_of_objects_addrowlmd4").value;
    const QuarterlyExams_Names_position_of_objects_addrowlmd1 = document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd1").value;
    const QuarterlyExams_Names_position_of_objects_addrowlmd2 = document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd2").value;
    const QuarterlyExams_Names_position_of_objects_addrowlmd3 = document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd3").value;
    const QuarterlyExams_Names_position_of_objects_addrowlmd4 = document.getElementById("QuarterlyExams_Names_position_of_objects_addrowlmd4").value;
    const TeachersObservation_Names_position_of_objects_addrowlmd1 = document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd1").value;
    const TeachersObservation_Names_position_of_objects_addrowlmd2 = document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd2").value;
    const TeachersObservation_Names_position_of_objects_addrowlmd3 = document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd3").value;
    const TeachersObservation_Names_position_of_objects_addrowlmd4 = document.getElementById("TeachersObservation_Names_position_of_objects_addrowlmd4").value;

    // Logical Mathematical Development | Performs simple addition with sum not greater than 10 using objects and picture stories 
    const Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd1 = document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd1").value;
    const Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd2 = document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd2").value;
    const Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd3 = document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd3").value;
    const Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd4 = document.getElementById("Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd4").value;
    const Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1 = document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1").value;
    const Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2 = document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2").value;
    const Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3 = document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3").value;
    const Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4 = document.getElementById("Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4").value;
    const QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1 = document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1").value;
    const QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2 = document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2").value;
    const QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3 = document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3").value;
    const QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4 = document.getElementById("QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4").value;
    const TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1 = document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1").value;
    const TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2 = document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2").value;
    const TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3 = document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3").value;
    const TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4 = document.getElementById("TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4").value;

    // Logical Mathematical Development | Performs simple subtraction of numbers between 0 to 10 using objects and picture stories 
    const Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd1 = document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd1").value;
    const Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd2 = document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd2").value;
    const Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd3 = document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd3").value;
    const Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd4 = document.getElementById("Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd4").value;
    const Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1 = document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1").value;
    const Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2 = document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2").value;
    const Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3 = document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3").value;
    const Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4 = document.getElementById("Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4").value;
    const QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1 = document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1").value;
    const QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2 = document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2").value;
    const QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3 = document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3").value;
    const QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4 = document.getElementById("QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4").value;
    const TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1 = document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1").value;
    const TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2 = document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2").value;
    const TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3 = document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3").value;
    const TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4 = document.getElementById("TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4").value;

    // Logical Mathematical Development | Tells time by hour and half hour
    const Tells_time_by_hour_and_half_hour_lmd1 = document.getElementById("Tells_time_by_hour_and_half_hour_lmd1").value;
    const Tells_time_by_hour_and_half_hour_lmd2 = document.getElementById("Tells_time_by_hour_and_half_hour_lmd2").value;
    const Tells_time_by_hour_and_half_hour_lmd3 = document.getElementById("Tells_time_by_hour_and_half_hour_lmd3").value;
    const Tells_time_by_hour_and_half_hour_lmd4 = document.getElementById("Tells_time_by_hour_and_half_hour_lmd4").value;
    const Pretest_Tells_time_by_hour_and_half_hour_addrowlmd1 = document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd1").value;
    const Pretest_Tells_time_by_hour_and_half_hour_addrowlmd2 = document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd2").value;
    const Pretest_Tells_time_by_hour_and_half_hour_addrowlmd3 = document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd3").value;
    const Pretest_Tells_time_by_hour_and_half_hour_addrowlmd4 = document.getElementById("Pretest_Tells_time_by_hour_and_half_hour_addrowlmd4").value;
    const QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd1 = document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd1").value;
    const QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd2 = document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd2").value;
    const QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd3 = document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd3").value;
    const QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd4 = document.getElementById("QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd4").value;
    const TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd1 = document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd1").value;
    const TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd2 = document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd2").value;
    const TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd3 = document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd3").value;
    const TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd4 = document.getElementById("TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd4").value;

    // Reading Readiness | Names uppercase letters
    const Names_uppercase_letters_rr1 = document.getElementById("Names_uppercase_letters_rr1").value;
    const Names_uppercase_letters_rr2 = document.getElementById("Names_uppercase_letters_rr2").value;
    const Names_uppercase_letters_rr3 = document.getElementById("Names_uppercase_letters_rr3").value;
    const Names_uppercase_letters_rr4 = document.getElementById("Names_uppercase_letters_rr4").value;
    const Pretest_Names_uppercase_letters_addrowrr1 = document.getElementById("Pretest_Names_uppercase_letters_addrowrr1").value;
    const Pretest_Names_uppercase_letters_addrowrr2 = document.getElementById("Pretest_Names_uppercase_letters_addrowrr2").value;
    const Pretest_Names_uppercase_letters_addrowrr3 = document.getElementById("Pretest_Names_uppercase_letters_addrowrr3").value;
    const Pretest_Names_uppercase_letters_addrowrr4 = document.getElementById("Pretest_Names_uppercase_letters_addrowrr4").value;
    const QuarterlyExams_Names_uppercase_letters_addrowrr1 = document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr1").value;
    const QuarterlyExams_Names_uppercase_letters_addrowrr2 = document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr2").value;
    const QuarterlyExams_Names_uppercase_letters_addrowrr3 = document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr3").value;
    const QuarterlyExams_Names_uppercase_letters_addrowrr4 = document.getElementById("QuarterlyExams_Names_uppercase_letters_addrowrr4").value;
    const TeachersObservation_Names_uppercase_letters_addrowrr1 = document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr1").value;
    const TeachersObservation_Names_uppercase_letters_addrowrr2 = document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr2").value;
    const TeachersObservation_Names_uppercase_letters_addrowrr3 = document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr3").value;
    const TeachersObservation_Names_uppercase_letters_addrowrr4 = document.getElementById("TeachersObservation_Names_uppercase_letters_addrowrr4").value;

    // Reading Readiness | Names lowercase letters
    const Names_lowercase_letters_rr1 = document.getElementById("Names_lowercase_letters_rr1").value;
    const Names_lowercase_letters_rr2 = document.getElementById("Names_lowercase_letters_rr2").value;
    const Names_lowercase_letters_rr3 = document.getElementById("Names_lowercase_letters_rr3").value;
    const Names_lowercase_letters_rr4 = document.getElementById("Names_lowercase_letters_rr4").value;
    const Pretest_Names_lowercase_letters_addrowrr1 = document.getElementById("Pretest_Names_lowercase_letters_addrowrr1").value;
    const Pretest_Names_lowercase_letters_addrowrr2 = document.getElementById("Pretest_Names_lowercase_letters_addrowrr2").value;
    const Pretest_Names_lowercase_letters_addrowrr3 = document.getElementById("Pretest_Names_lowercase_letters_addrowrr3").value;
    const Pretest_Names_lowercase_letters_addrowrr4 = document.getElementById("Pretest_Names_lowercase_letters_addrowrr4").value;
    const QuarterlyExams_Names_lowercase_letters_addrowrr1 = document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr1").value;
    const QuarterlyExams_Names_lowercase_letters_addrowrr2 = document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr2").value;
    const QuarterlyExams_Names_lowercase_letters_addrowrr3 = document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr3").value;
    const QuarterlyExams_Names_lowercase_letters_addrowrr4 = document.getElementById("QuarterlyExams_Names_lowercase_letters_addrowrr4").value;
    const TeachersObservation_Names_lowercase_letters_addrowrr1 = document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr1").value;
    const TeachersObservation_Names_lowercase_letters_addrowrr2 = document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr2").value;
    const TeachersObservation_Names_lowercase_letters_addrowrr3 = document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr3").value;
    const TeachersObservation_Names_lowercase_letters_addrowrr4 = document.getElementById("TeachersObservation_Names_lowercase_letters_addrowrr4").value;

    // Reading Readiness | Gives the sounds of uppercase letters
    const Gives_the_sounds_of_uppercase_letters_rr1 = document.getElementById("Gives_the_sounds_of_uppercase_letters_rr1").value;
    const Gives_the_sounds_of_uppercase_letters_rr2 = document.getElementById("Gives_the_sounds_of_uppercase_letters_rr2").value;
    const Gives_the_sounds_of_uppercase_letters_rr3 = document.getElementById("Gives_the_sounds_of_uppercase_letters_rr3").value;
    const Gives_the_sounds_of_uppercase_letters_rr4 = document.getElementById("Gives_the_sounds_of_uppercase_letters_rr4").value;
    const Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr1 = document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr1").value;
    const Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr2 = document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr2").value;
    const Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr3 = document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr3").value;
    const Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr4 = document.getElementById("Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr4").value;
    const QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr1 = document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr1").value;
    const QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr2 = document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr2").value;
    const QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr3 = document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr3").value;
    const QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr4 = document.getElementById("QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr4").value;
    const TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr1 = document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr1").value;
    const TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr2 = document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr2").value;
    const TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr3 = document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr3").value;
    const TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr4 = document.getElementById("TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr4").value;

    // Reading Readiness | Gives the sounds of lowercase letters
    const Gives_the_sounds_of_lowercase_letters_rr1 = document.getElementById("Gives_the_sounds_of_lowercase_letters_rr1").value;
    const Gives_the_sounds_of_lowercase_letters_rr2 = document.getElementById("Gives_the_sounds_of_lowercase_letters_rr2").value;
    const Gives_the_sounds_of_lowercase_letters_rr3 = document.getElementById("Gives_the_sounds_of_lowercase_letters_rr3").value;
    const Gives_the_sounds_of_lowercase_letters_rr4 = document.getElementById("Gives_the_sounds_of_lowercase_letters_rr4").value;
    const Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr1 = document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr1").value;
    const Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr2 = document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr2").value;
    const Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr3 = document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr3").value;
    const Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr4 = document.getElementById("Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr4").value;
    const QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr1 = document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr1").value;
    const QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr2 = document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr2").value;
    const QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr3 = document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr3").value;
    const QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr4 = document.getElementById("QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr4").value;
    const TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr1 = document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr1").value;
    const TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr2 = document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr2").value;
    const TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr3 = document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr3").value;
    const TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr4 = document.getElementById("TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr4").value;

    // Reading Readiness | Associates words with corresponding pictures
    const Associates_words_with_corresponding_pictures_rr1 = document.getElementById("Associates_words_with_corresponding_pictures_rr1").value;
    const Associates_words_with_corresponding_pictures_rr2 = document.getElementById("Associates_words_with_corresponding_pictures_rr2").value;
    const Associates_words_with_corresponding_pictures_rr3 = document.getElementById("Associates_words_with_corresponding_pictures_rr3").value;
    const Associates_words_with_corresponding_pictures_rr4 = document.getElementById("Associates_words_with_corresponding_pictures_rr4").value;
    const Pretest_Associates_words_with_corresponding_pictures_addrowrr1 = document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr1").value;
    const Pretest_Associates_words_with_corresponding_pictures_addrowrr2 = document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr2").value;
    const Pretest_Associates_words_with_corresponding_pictures_addrowrr3 = document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr3").value;
    const Pretest_Associates_words_with_corresponding_pictures_addrowrr4 = document.getElementById("Pretest_Associates_words_with_corresponding_pictures_addrowrr4").value;
    const QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr1 = document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr1").value;
    const QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr2 = document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr2").value;
    const QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr3 = document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr3").value;
    const QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr4 = document.getElementById("QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr4").value;
    const TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr1 = document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr1").value;
    const TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr2 = document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr2").value;
    const TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr3 = document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr3").value;
    const TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr4 = document.getElementById("TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr4").value;

    // Reading Readiness | Reads CV pairs
    const Reads_CV_pairs_rr1 = document.getElementById("Reads_CV_pairs_rr1").value;
    const Reads_CV_pairs_rr2 = document.getElementById("Reads_CV_pairs_rr2").value;
    const Reads_CV_pairs_rr3 = document.getElementById("Reads_CV_pairs_rr3").value;
    const Reads_CV_pairs_rr4 = document.getElementById("Reads_CV_pairs_rr4").value;
    const Pretest_Reads_CV_pairs_addrowrr1 = document.getElementById("Pretest_Reads_CV_pairs_addrowrr1").value;
    const Pretest_Reads_CV_pairs_addrowrr2 = document.getElementById("Pretest_Reads_CV_pairs_addrowrr2").value;
    const Pretest_Reads_CV_pairs_addrowrr3 = document.getElementById("Pretest_Reads_CV_pairs_addrowrr3").value;
    const Pretest_Reads_CV_pairs_addrowrr4 = document.getElementById("Pretest_Reads_CV_pairs_addrowrr4").value;
    const QuarterlyExams_Reads_CV_pairs_addrowrr1 = document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr1").value;
    const QuarterlyExams_Reads_CV_pairs_addrowrr2 = document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr2").value;
    const QuarterlyExams_Reads_CV_pairs_addrowrr3 = document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr3").value;
    const QuarterlyExams_Reads_CV_pairs_addrowrr4 = document.getElementById("QuarterlyExams_Reads_CV_pairs_addrowrr4").value;
    const TeachersObservation_Reads_CV_pairs_addrowrr1 = document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr1").value;
    const TeachersObservation_Reads_CV_pairs_addrowrr2 = document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr2").value;
    const TeachersObservation_Reads_CV_pairs_addrowrr3 = document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr3").value;
    const TeachersObservation_Reads_CV_pairs_addrowrr4 = document.getElementById("TeachersObservation_Reads_CV_pairs_addrowrr4").value;

    // Reading Readiness | Reads three-letter words with short vowel sounds
    const Reads_three_letter_words_with_short_vowel_sounds_rr1 = document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr1").value;
    const Reads_three_letter_words_with_short_vowel_sounds_rr2 = document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr2").value;
    const Reads_three_letter_words_with_short_vowel_sounds_rr3 = document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr3").value;
    const Reads_three_letter_words_with_short_vowel_sounds_rr4 = document.getElementById("Reads_three_letter_words_with_short_vowel_sounds_rr4").value;
    const Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1 = document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1").value;
    const Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2 = document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2").value;
    const Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3 = document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3").value;
    const Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4 = document.getElementById("Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4").value;
    const QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1 = document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1").value;
    const QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2 = document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2").value;
    const QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3 = document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3").value;
    const QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4 = document.getElementById("QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4").value;
    const TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1 = document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1").value;
    const TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2 = document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2").value;
    const TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3 = document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3").value;
    const TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4 = document.getElementById("TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4").value;

    // Reading Readiness | Reads basic sight words
    const Reads_basic_sight_words_rr1 = document.getElementById("Reads_basic_sight_words_rr1").value;
    const Reads_basic_sight_words_rr2 = document.getElementById("Reads_basic_sight_words_rr2").value;
    const Reads_basic_sight_words_rr3 = document.getElementById("Reads_basic_sight_words_rr3").value;
    const Reads_basic_sight_words_rr4 = document.getElementById("Reads_basic_sight_words_rr4").value;
    const Pretest_Reads_basic_sight_words_addrowrr1 = document.getElementById("Pretest_Reads_basic_sight_words_addrowrr1").value;
    const Pretest_Reads_basic_sight_words_addrowrr2 = document.getElementById("Pretest_Reads_basic_sight_words_addrowrr2").value;
    const Pretest_Reads_basic_sight_words_addrowrr3 = document.getElementById("Pretest_Reads_basic_sight_words_addrowrr3").value;
    const Pretest_Reads_basic_sight_words_addrowrr4 = document.getElementById("Pretest_Reads_basic_sight_words_addrowrr4").value;
    const QuarterlyExams_Reads_basic_sight_words_addrowrr1 = document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr1").value;
    const QuarterlyExams_Reads_basic_sight_words_addrowrr2 = document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr2").value;
    const QuarterlyExams_Reads_basic_sight_words_addrowrr3 = document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr3").value;
    const QuarterlyExams_Reads_basic_sight_words_addrowrr4 = document.getElementById("QuarterlyExams_Reads_basic_sight_words_addrowrr4").value;
    const TeachersObservation_Reads_basic_sight_words_addrowrr1 = document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr1").value;
    const TeachersObservation_Reads_basic_sight_words_addrowrr2 = document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr2").value;
    const TeachersObservation_Reads_basic_sight_words_addrowrr3 = document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr3").value;
    const TeachersObservation_Reads_basic_sight_words_addrowrr4 = document.getElementById("TeachersObservation_Reads_basic_sight_words_addrowrr4").value;

    // Socio-Emotional Development | Cares for his/her own physical needs such as
    const Cares_for_his_her_own_physical_needs_such_as_sed1 = document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed1").value;
    const Cares_for_his_her_own_physical_needs_such_as_sed2 = document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed2").value;
    const Cares_for_his_her_own_physical_needs_such_as_sed3 = document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed3").value;
    const Cares_for_his_her_own_physical_needs_such_as_sed4 = document.getElementById("Cares_for_his_her_own_physical_needs_such_as_sed4").value;
    const Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed1 = document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed1").value;
    const Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed2 = document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed2").value;
    const Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed3 = document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed3").value;
    const Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed4 = document.getElementById("Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed4").value;
    const Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed1 = document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed1").value;
    const Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed2 = document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed2").value;
    const Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed3 = document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed3").value;
    const Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed4 = document.getElementById("Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed4").value;

    // Socio-Emotional Development | Follows simple directions
    const Follows_simple_directions_sed1 = document.getElementById("Follows_simple_directions_sed1").value;
    const Follows_simple_directions_sed2 = document.getElementById("Follows_simple_directions_sed2").value;
    const Follows_simple_directions_sed3 = document.getElementById("Follows_simple_directions_sed3").value;
    const Follows_simple_directions_sed4 = document.getElementById("Follows_simple_directions_sed4").value;
    const Pretest_Follows_simple_direction_addrowsed1 = document.getElementById("Pretest_Follows_simple_direction_addrowsed1").value;
    const Pretest_Follows_simple_direction_addrowsed2 = document.getElementById("Pretest_Follows_simple_direction_addrowsed2").value;
    const Pretest_Follows_simple_direction_addrowsed3 = document.getElementById("Pretest_Follows_simple_direction_addrowsed3").value;
    const Pretest_Follows_simple_direction_addrowsed4 = document.getElementById("Pretest_Follows_simple_direction_addrowsed4").value;
    const QuarterlyExams_Follows_simple_direction_addrowsed1 = document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed1").value;
    const QuarterlyExams_Follows_simple_direction_addrowsed2 = document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed2").value;
    const QuarterlyExams_Follows_simple_direction_addrowsed3 = document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed3").value;
    const QuarterlyExams_Follows_simple_direction_addrowsed4 = document.getElementById("QuarterlyExams_Follows_simple_direction_addrowsed4").value;
    const TeachersObservation_Follows_simple_direction_addrowsed1 = document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed1").value;
    const TeachersObservation_Follows_simple_direction_addrowsed2 = document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed2").value;
    const TeachersObservation_Follows_simple_direction_addrowsed3 = document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed3").value;
    const TeachersObservation_Follows_simple_direction_addrowsed4 = document.getElementById("TeachersObservation_Follows_simple_direction_addrowsed4").value;

    // Socio-Emotional Development | Follows classroom rules
    const Follows_classroom_rules_sed1 = document.getElementById("Follows_classroom_rules_sed1").value;
    const Follows_classroom_rules_sed2 = document.getElementById("Follows_classroom_rules_sed2").value;
    const Follows_classroom_rules_sed3 = document.getElementById("Follows_classroom_rules_sed3").value;
    const Follows_classroom_rules_sed4 = document.getElementById("Follows_classroom_rules_sed4").value;
    const Pretest_Follows_classroom_rules_addrowsed1 = document.getElementById("Pretest_Follows_classroom_rules_addrowsed1").value;
    const Pretest_Follows_classroom_rules_addrowsed2 = document.getElementById("Pretest_Follows_classroom_rules_addrowsed2").value;
    const Pretest_Follows_classroom_rules_addrowsed3 = document.getElementById("Pretest_Follows_classroom_rules_addrowsed3").value;
    const Pretest_Follows_classroom_rules_addrowsed4 = document.getElementById("Pretest_Follows_classroom_rules_addrowsed4").value;
    const QuarterlyExams_Follows_classroom_rules_addrowsed1 = document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed1").value;
    const QuarterlyExams_Follows_classroom_rules_addrowsed2 = document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed2").value;
    const QuarterlyExams_Follows_classroom_rules_addrowsed3 = document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed3").value;
    const QuarterlyExams_Follows_classroom_rules_addrowsed4 = document.getElementById("QuarterlyExams_Follows_classroom_rules_addrowsed4").value;
    const TeachersObservation_Follows_classroom_rules_addrowsed1 = document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed1").value;
    const TeachersObservation_Follows_classroom_rules_addrowsed2 = document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed2").value;
    const TeachersObservation_Follows_classroom_rules_addrowsed3 = document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed3").value;
    const TeachersObservation_Follows_classroom_rules_addrowsed4 = document.getElementById("TeachersObservation_Follows_classroom_rules_addrowsed4").value;

    // Socio-Emotional Development | Shares and waits for turn
    const Shares_and_waits_for_turn_sed1 = document.getElementById("Shares_and_waits_for_turn_sed1").value;
    const Shares_and_waits_for_turn_sed2 = document.getElementById("Shares_and_waits_for_turn_sed2").value;
    const Shares_and_waits_for_turn_sed3 = document.getElementById("Shares_and_waits_for_turn_sed3").value;
    const Shares_and_waits_for_turn_sed4 = document.getElementById("Shares_and_waits_for_turn_sed4").value;
    const Pretest_Shares_and_waits_for_turn_addrowsed1 = document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed1").value;
    const Pretest_Shares_and_waits_for_turn_addrowsed2 = document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed2").value;
    const Pretest_Shares_and_waits_for_turn_addrowsed3 = document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed3").value;
    const Pretest_Shares_and_waits_for_turn_addrowsed4 = document.getElementById("Pretest_Shares_and_waits_for_turn_addrowsed4").value;
    const QuarterlyExams_Shares_and_waits_for_turn_addrowsed1 = document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed1").value;
    const QuarterlyExams_Shares_and_waits_for_turn_addrowsed2 = document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed2").value;
    const QuarterlyExams_Shares_and_waits_for_turn_addrowsed3 = document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed3").value;
    const QuarterlyExams_Shares_and_waits_for_turn_addrowsed4 = document.getElementById("QuarterlyExams_Shares_and_waits_for_turn_addrowsed4").value;
    const TeachersObservation_Shares_and_waits_for_turn_addrowsed1 = document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed1").value;
    const TeachersObservation_Shares_and_waits_for_turn_addrowsed2 = document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed2").value;
    const TeachersObservation_Shares_and_waits_for_turn_addrowsed3 = document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed3").value;
    const TeachersObservation_Shares_and_waits_for_turn_addrowsed4 = document.getElementById("TeachersObservation_Shares_and_waits_for_turn_addrowsed4").value;

    // Socio-Emotional Development | Plays cooperatively with others
    const Plays_cooperatively_with_others_sed1 = document.getElementById("Plays_cooperatively_with_others_sed1").value;
    const Plays_cooperatively_with_others_sed2 = document.getElementById("Plays_cooperatively_with_others_sed2").value;
    const Plays_cooperatively_with_others_sed3 = document.getElementById("Plays_cooperatively_with_others_sed3").value;
    const Plays_cooperatively_with_others_sed4 = document.getElementById("Plays_cooperatively_with_others_sed4").value;
    const Pretest_Plays_cooperatively_with_others_addrowsed1 = document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed1").value;
    const Pretest_Plays_cooperatively_with_others_addrowsed2 = document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed2").value;
    const Pretest_Plays_cooperatively_with_others_addrowsed3 = document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed3").value;
    const Pretest_Plays_cooperatively_with_others_addrowsed4 = document.getElementById("Pretest_Plays_cooperatively_with_others_addrowsed4").value;
    const QuarterlyExams_Plays_cooperatively_with_others_addrowsed1 = document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed1").value;
    const QuarterlyExams_Plays_cooperatively_with_others_addrowsed2 = document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed2").value;
    const QuarterlyExams_Plays_cooperatively_with_others_addrowsed3 = document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed3").value;
    const QuarterlyExams_Plays_cooperatively_with_others_addrowsed4 = document.getElementById("QuarterlyExams_Plays_cooperatively_with_others_addrowsed4").value;
    const TeachersObservation_Plays_cooperatively_with_others_addrowsed1 = document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed1").value;
    const TeachersObservation_Plays_cooperatively_with_others_addrowsed2 = document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed2").value;
    const TeachersObservation_Plays_cooperatively_with_others_addrowsed3 = document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed3").value;
    const TeachersObservation_Plays_cooperatively_with_others_addrowsed4 = document.getElementById("TeachersObservation_Plays_cooperatively_with_others_addrowsed4").value;

    // Socio-Emotional Development | Packs away
    const Packs_away_sed1 = document.getElementById("Packs_away_sed1").value;
    const Packs_away_sed2 = document.getElementById("Packs_away_sed2").value;
    const Packs_away_sed3 = document.getElementById("Packs_away_sed3").value;
    const Packs_away_sed4 = document.getElementById("Packs_away_sed4").value;
    const Pretest_Packs_away_addrowsed1 = document.getElementById("Pretest_Packs_away_addrowsed1").value;
    const Pretest_Packs_away_addrowsed2 = document.getElementById("Pretest_Packs_away_addrowsed2").value;
    const Pretest_Packs_away_addrowsed3 = document.getElementById("Pretest_Packs_away_addrowsed3").value;
    const Pretest_Packs_away_addrowsed4 = document.getElementById("Pretest_Packs_away_addrowsed4").value;
    const QuarterlyExams_Packs_away_addrowsed1 = document.getElementById("QuarterlyExams_Packs_away_addrowsed1").value;
    const QuarterlyExams_Packs_away_addrowsed2 = document.getElementById("QuarterlyExams_Packs_away_addrowsed2").value;
    const QuarterlyExams_Packs_away_addrowsed3 = document.getElementById("QuarterlyExams_Packs_away_addrowsed3").value;
    const QuarterlyExams_Packs_away_addrowsed4 = document.getElementById("QuarterlyExams_Packs_away_addrowsed4").value;
    const TeachersObservation_Packs_away_addrowsed1 = document.getElementById("TeachersObservation_Packs_away_addrowsed1").value;
    const TeachersObservation_Packs_away_addrowsed2 = document.getElementById("TeachersObservation_Packs_away_addrowsed2").value;
    const TeachersObservation_Packs_away_addrowsed3 = document.getElementById("TeachersObservation_Packs_away_addrowsed3").value;
    const TeachersObservation_Packs_away_addrowsed4 = document.getElementById("TeachersObservation_Packs_away_addrowsed4").value;

    // Socio-Emotional Development | Helps in simple tasks
    const Helps_in_simple_tasks_sed1 = document.getElementById("Helps_in_simple_tasks_sed1").value;
    const Helps_in_simple_tasks_sed2 = document.getElementById("Helps_in_simple_tasks_sed2").value;
    const Helps_in_simple_tasks_sed3 = document.getElementById("Helps_in_simple_tasks_sed3").value;
    const Helps_in_simple_tasks_sed4 = document.getElementById("Helps_in_simple_tasks_sed4").value;
    const Pretest_Helps_in_simple_tasks_addrowsed1 = document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed1").value;
    const Pretest_Helps_in_simple_tasks_addrowsed2 = document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed2").value;
    const Pretest_Helps_in_simple_tasks_addrowsed3 = document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed3").value;
    const Pretest_Helps_in_simple_tasks_addrowsed4 = document.getElementById("Pretest_Helps_in_simple_tasks_addrowsed4").value;
    const QuarterlyExams_Helps_in_simple_tasks_addrowsed1 = document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed1").value;
    const QuarterlyExams_Helps_in_simple_tasks_addrowsed2 = document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed2").value;
    const QuarterlyExams_Helps_in_simple_tasks_addrowsed3 = document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed3").value;
    const QuarterlyExams_Helps_in_simple_tasks_addrowsed4 = document.getElementById("QuarterlyExams_Helps_in_simple_tasks_addrowsed4").value;
    const TeachersObservation_Helps_in_simple_tasks_addrowsed1 = document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed1").value;
    const TeachersObservation_Helps_in_simple_tasks_addrowsed2 = document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed2").value;
    const TeachersObservation_Helps_in_simple_tasks_addrowsed3 = document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed3").value;
    const TeachersObservation_Helps_in_simple_tasks_addrowsed4 = document.getElementById("TeachersObservation_Helps_in_simple_tasks_addrowsed4").value;

    // Socio-Emotional Development | Attends to task for increasingly longer periods of time
    const Attends_to_task_for_increasingly_longer_periods_of_time_sed1 = document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed1").value;
    const Attends_to_task_for_increasingly_longer_periods_of_time_sed2 = document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed2").value;
    const Attends_to_task_for_increasingly_longer_periods_of_time_sed3 = document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed3").value;
    const Attends_to_task_for_increasingly_longer_periods_of_time_sed4 = document.getElementById("Attends_to_task_for_increasingly_longer_periods_of_time_sed4").value;
    const Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1 = document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1").value;
    const Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2 = document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2").value;
    const Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3 = document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3").value;
    const Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4 = document.getElementById("Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4").value;
    const QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1 = document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1").value;
    const QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2 = document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2").value;
    const QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3 = document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3").value;
    const QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4 = document.getElementById("QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4").value;
    const TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1 = document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1").value;
    const TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2 = document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2").value;
    const TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3 = document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3").value;
    const TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4 = document.getElementById("TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4").value;


    // Save grades to Firestore under the current student's document
    gradesDB.doc(currentStudentId)
        .set({
            // Gross Motor Development | Walks with coordinated altering arm movements
            Walks_with_coordinated_altering_arm_movements_gmd1,
            Walks_with_coordinated_altering_arm_movements_gmd2,
            Walks_with_coordinated_altering_arm_movements_gmd3,
            Walks_with_coordinated_altering_arm_movements_gmd4,
            Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd1,
            Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd2,
            Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd3,
            Pretest_Walks_with_coordinated_altering_arm_movements_addrowgmd4,
            QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd1,
            QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd2,
            QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd3,
            QuarterlyExams_Walks_with_coordinated_altering_arm_movements_addrowgmd4,
            TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd1,
            TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd2,
            TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd3,
            TeachersObservation_Walks_with_coordinated_altering_arm_movements_addrowgmd4,
            
            // Gross Motor Development | Walks with coordinated altering arm movements
            Jumps_forward_at_least_2_times_without_falling_gmd1,
            Jumps_forward_at_least_2_times_without_falling_gmd2,
            Jumps_forward_at_least_2_times_without_falling_gmd3,
            Jumps_forward_at_least_2_times_without_falling_gmd4,
            Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd1,
            Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd2,
            Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd3,
            Pretest_Jumps_forward_at_least_2_times_without_falling_addrowgmd4,
            QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd1,
            QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd2,
            QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd3,
            QuarterlyExams_Jumps_forward_at_least_2_times_without_falling_addrowgmd4,
            TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd1,
            TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd2,
            TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd3,
            TeachersObservation_Jumps_forward_at_least_2_times_without_falling_addrowgmd4,

            // Gross Motor Development | Runs with coordinated alternating arm movements
            Runs_with_coordinated_alternating_arm_movements_gmd1,
            Runs_with_coordinated_alternating_arm_movements_gmd2,
            Runs_with_coordinated_alternating_arm_movements_gmd3,
            Runs_with_coordinated_alternating_arm_movements_gmd4,
            Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd1,
            Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd2,
            Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd3,
            Pretest_Runs_with_coordinated_alternating_arm_movements_addrowgmd4,
            QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd1,
            QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd2,
            QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd3,
            QuarterlyExams_Runs_with_coordinated_alternating_arm_movements_addrowgmd4,
            TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd1,
            TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd2,
            TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd3,
            TeachersObservation_Runs_with_coordinated_alternating_arm_movements_addrowgmd4,

            // Gross Motor Development | Moves body parts as directed
            Moves_body_parts_as_directed_gmd1,
            Moves_body_parts_as_directed_gmd2,
            Moves_body_parts_as_directed_gmd3,
            Moves_body_parts_as_directed_gmd4,
            Pretest_Moves_body_parts_as_directed_addrowgmd1,
            Pretest_Moves_body_parts_as_directed_addrowgmd2,
            Pretest_Moves_body_parts_as_directed_addrowgmd3,
            Pretest_Moves_body_parts_as_directed_addrowgmd4,
            QuarterlyExams_Moves_body_parts_as_directed_addrowgmd1,
            QuarterlyExams_Moves_body_parts_as_directed_addrowgmd2,
            QuarterlyExams_Moves_body_parts_as_directed_addrowgmd3,
            QuarterlyExams_Moves_body_parts_as_directed_addrowgmd4,
            TeachersObservation_Moves_body_parts_as_directed_addrowgmd1,
            TeachersObservation_Moves_body_parts_as_directed_addrowgmd2,
            TeachersObservation_Moves_body_parts_as_directed_addrowgmd3,
            TeachersObservation_Moves_body_parts_as_directed_addrowgmd4,

            // Gross Motor Development | Moves body parts as directed
            Throws_ball_with_both_hands_from_a_distance_gmd1,
            Throws_ball_with_both_hands_from_a_distance_gmd2,
            Throws_ball_with_both_hands_from_a_distance_gmd3,
            Throws_ball_with_both_hands_from_a_distance_gmd4,
            Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd1,
            Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd2,
            Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd3,
            Pretest_Throws_ball_with_both_hands_from_a_distance_addrowgmd4,
            QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd1,
            QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd2,
            QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd3,
            QuarterlyExams_Throws_ball_with_both_hands_from_a_distance_addrowgmd4,
            TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd1,
            TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd2,
            TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd3,
            TeachersObservation_Throws_ball_with_both_hands_from_a_distance_addrowgmd4,

            // Fine Motor Development | Uses construction toys to build simple objects
            Uses_construction_toys_to_build_simple_objects_fmd1,
            Uses_construction_toys_to_build_simple_objects_fmd2,
            Uses_construction_toys_to_build_simple_objects_fmd3,
            Uses_construction_toys_to_build_simple_objects_fmd4,
            Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd1,
            Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd2,
            Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd3,
            Pretest_Uses_construction_toys_to_build_simple_objects_addrowfmd4,
            QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd1,
            QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd2,
            QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd3,
            QuarterlyExams_Uses_construction_toys_to_build_simple_objects_addrowfmd4,
            TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd1,
            TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd2,
            TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd3,
            TeachersObservation_Uses_construction_toys_to_build_simple_objects_addrowfmd4,

            // Fine Motor Development | Exhibits adequate hand movements such as
            Exhibits_adequate_hand_movements_such_as_fmd1,
            Exhibits_adequate_hand_movements_such_as_fmd2,
            Exhibits_adequate_hand_movements_such_as_fmd3,
            Exhibits_adequate_hand_movements_such_as_fmd4,
            Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd1,
            Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd2,
            Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd3,
            Stringingbeads_Exhibits_adequate_hand_movements_such_as_addrowfmd4,
            Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd1,
            Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd2,
            Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd3,
            Tearingandpastingpaper_Exhibits_adequate_hand_movements_such_as_addrowfmd4,
            TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd1,
            TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd2,
            TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd3,
            TeachersObservation_Exhibits_adequate_hand_movements_such_as_addrowfmd4,

            // Fine Motor Development | Holds pencils/crayons
            Holds_pencils_crayons_fmd1,
            Holds_pencils_crayons_fmd2,
            Holds_pencils_crayons_fmd3,
            Holds_pencils_crayons_fmd4,
            Pretest_Holds_pencils_crayons_addrowfmd1,
            Pretest_Holds_pencils_crayons_addrowfmd2,
            Pretest_Holds_pencils_crayons_addrowfmd3,
            Pretest_Holds_pencils_crayons_addrowfmd4,
            QuarterlyExams_Holds_pencils_crayons_addrowfmd1,
            QuarterlyExams_Holds_pencils_crayons_addrowfmd2,
            QuarterlyExams_Holds_pencils_crayons_addrowfmd3,
            QuarterlyExams_Holds_pencils_crayons_addrowfmd4,
            TeachersObservation_Holds_pencils_crayons_addrowfmd1,
            TeachersObservation_Holds_pencils_crayons_addrowfmd2,
            TeachersObservation_Holds_pencils_crayons_addrowfmd3,
            TeachersObservation_Holds_pencils_crayons_addrowfmd4,

            // Fine Motor Development | Colors pictures
            Colors_pictures_fmd1,
            Colors_pictures_fmd2,
            Colors_pictures_fmd3,
            Colors_pictures_fmd4,
            Pretest_Colors_pictures_addrowfmd1,
            Pretest_Colors_pictures_addrowfmd2,
            Pretest_Colors_pictures_addrowfmd3,
            Pretest_Colors_pictures_addrowfmd4,
            QuarterlyExams_Colors_pictures_addrowfmd1,
            QuarterlyExams_Colors_pictures_addrowfmd2,
            QuarterlyExams_Colors_pictures_addrowfmd3,
            QuarterlyExams_Colors_pictures_addrowfmd4,
            TeachersObservation_Colors_pictures_addrowfmd1,
            TeachersObservation_Colors_pictures_addrowfmd2,
            TeachersObservation_Colors_pictures_addrowfmd3,
            TeachersObservation_Colors_pictures_addrowfmd4,

            // Fine Motor Development | Traces broken lines and connects dot-to-dot
            Traces_broken_lines_and_connects_dot_to_dot_fmd1,
            Traces_broken_lines_and_connects_dot_to_dot_fmd2,
            Traces_broken_lines_and_connects_dot_to_dot_fmd3,
            Traces_broken_lines_and_connects_dot_to_dot_fmd4,
            Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1,
            Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2,
            Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3,
            Pretest_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4,
            QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1,
            QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2,
            QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3,
            QuarterlyExams_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4,
            TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd1,
            TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd2,
            TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd3,
            TeachersObservation_Traces_broken_lines_and_connects_dot_to_dot_addrowfmd4,
            
            // Fine Motor Development | Draws shapes and simple pictures
            Draws_shapes_and_simple_pictures_fmd1,
            Draws_shapes_and_simple_pictures_fmd2,
            Draws_shapes_and_simple_pictures_fmd3,
            Draws_shapes_and_simple_pictures_fmd4,
            Pretest_Draws_shapes_and_simple_pictures_addrowfmd1,
            Pretest_Draws_shapes_and_simple_pictures_addrowfmd2,
            Pretest_Draws_shapes_and_simple_pictures_addrowfmd3,
            Pretest_Draws_shapes_and_simple_pictures_addrowfmd4,
            QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd1,
            QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd2,
            QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd3,
            QuarterlyExams_Draws_shapes_and_simple_pictures_addrowfmd4,
            TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd1,
            TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd2,
            TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd3,
            TeachersObservation_Draws_shapes_and_simple_pictures_addrowfmd4,

            // Fine Motor Development | Writes uppercase letters with model
            Writes_uppercase_letters_with_model_fmd1,
            Writes_uppercase_letters_with_model_fmd2,
            Writes_uppercase_letters_with_model_fmd3,
            Writes_uppercase_letters_with_model_fmd4,
            Pretest_Writes_uppercase_letters_with_model_addrowfmd1,
            Pretest_Writes_uppercase_letters_with_model_addrowfmd2,
            Pretest_Writes_uppercase_letters_with_model_addrowfmd3,
            Pretest_Writes_uppercase_letters_with_model_addrowfmd4,
            QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd1,
            QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd2,
            QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd3,
            QuarterlyExams_Writes_uppercase_letters_with_model_addrowfmd4,
            TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd1,
            TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd2,
            TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd3,
            TeachersObservation_Writes_uppercase_letters_with_model_addrowfmd4,

            // Fine Motor Development | Writes lowercase letters with model
            Writes_lowercase_letters_with_model_fmd1,
            Writes_lowercase_letters_with_model_fmd2,
            Writes_lowercase_letters_with_model_fmd3,
            Writes_lowercase_letters_with_model_fmd4,
            Pretest_Writes_lowercase_letters_with_model_addrowfmd1,
            Pretest_Writes_lowercase_letters_with_model_addrowfmd2,
            Pretest_Writes_lowercase_letters_with_model_addrowfmd3,
            Pretest_Writes_lowercase_letters_with_model_addrowfmd4,
            QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd1,
            QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd2,
            QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd3,
            QuarterlyExams_Writes_lowercase_letters_with_model_addrowfmd4,
            TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd1,
            TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd2,
            TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd3,
            TeachersObservation_Writes_lowercase_letters_with_model_addrowfmd4,

            // Fine Motor Development | Writes nickname without model
            Writes_nickname_without_model_fmd1,
            Writes_nickname_without_model_fmd2,
            Writes_nickname_without_model_fmd3,
            Writes_nickname_without_model_fmd4,
            Pretest_Writes_nickname_without_model_addrowfmd1,
            Pretest_Writes_nickname_without_model_addrowfmd2,
            Pretest_Writes_nickname_without_model_addrowfmd3,
            Pretest_Writes_nickname_without_model_addrowfmd4,
            QuarterlyExams_Writes_nickname_without_model_addrowfmd1,
            QuarterlyExams_Writes_nickname_without_model_addrowfmd2,
            QuarterlyExams_Writes_nickname_without_model_addrowfmd3,
            QuarterlyExams_Writes_nickname_without_model_addrowfmd4,
            TeachersObservation_Writes_nickname_without_model_addrowfmd1,
            TeachersObservation_Writes_nickname_without_model_addrowfmd2,
            TeachersObservation_Writes_nickname_without_model_addrowfmd3,
            TeachersObservation_Writes_nickname_without_model_addrowfmd4,

            // Fine Motor Development | Writes complete name with model
            Writes_complete_name_with_model_fmd1,
            Writes_complete_name_with_model_fmd2,
            Writes_complete_name_with_model_fmd3,
            Writes_complete_name_with_model_fmd4,
            Pretest_Writes_complete_name_with_model_addrowfmd1,
            Pretest_Writes_complete_name_with_model_addrowfmd2,
            Pretest_Writes_complete_name_with_model_addrowfmd3,
            Pretest_Writes_complete_name_with_model_addrowfmd4,
            QuarterlyExams_Writes_complete_name_with_model_addrowfmd1,
            QuarterlyExams_Writes_complete_name_with_model_addrowfmd2,
            QuarterlyExams_Writes_complete_name_with_model_addrowfmd3,
            QuarterlyExams_Writes_complete_name_with_model_addrowfmd4,
            TeachersObservation_Writes_complete_name_with_model_addrowfmd1,
            TeachersObservation_Writes_complete_name_with_model_addrowfmd2,
            TeachersObservation_Writes_complete_name_with_model_addrowfmd3,
            TeachersObservation_Writes_complete_name_with_model_addrowfmd4,

            // Receptive/Expressive Language | Speaks clearly and audibly
            Speaks_clearly_and_audibly_rel1,
            Speaks_clearly_and_audibly_rel2,
            Speaks_clearly_and_audibly_rel3,
            Speaks_clearly_and_audibly_rel4,
            Pretest_Speaks_clearly_and_audibly_addrowrel1,
            Pretest_Speaks_clearly_and_audibly_addrowrel2,
            Pretest_Speaks_clearly_and_audibly_addrowrel3,
            Pretest_Speaks_clearly_and_audibly_addrowrel4,
            QuarterlyExams_Speaks_clearly_and_audibly_addrowrel1,
            QuarterlyExams_Speaks_clearly_and_audibly_addrowrel2,
            QuarterlyExams_Speaks_clearly_and_audibly_addrowrel3,
            QuarterlyExams_Speaks_clearly_and_audibly_addrowrel4,
            TeachersObservation_Speaks_clearly_and_audibly_addrowrel1,
            TeachersObservation_Speaks_clearly_and_audibly_addrowrel2,
            TeachersObservation_Speaks_clearly_and_audibly_addrowrel3,
            TeachersObservation_Speaks_clearly_and_audibly_addrowrel4,

            // Receptive/Expressive Language | Gives Name
            Gives_name_rel1,
            Gives_name_rel2,
            Gives_name_rel3,
            Gives_name_rel4,
            Pretest_Gives_name_addrowrel1,
            Pretest_Gives_name_addrowrel2,
            Pretest_Gives_name_addrowrel3,
            Pretest_Gives_name_addrowrel4,
            QuarterlyExams_Gives_name_addrowrel1,
            QuarterlyExams_Gives_name_addrowrel2,
            QuarterlyExams_Gives_name_addrowrel3,
            QuarterlyExams_Gives_name_addrowrel4,
            TeachersObservation_Gives_name_addrowrel1,
            TeachersObservation_Gives_name_addrowrel2,
            TeachersObservation_Gives_name_addrowrel3,
            TeachersObservation_Gives_name_addrowrel4,

            // Receptive/Expressive Language | Sings songs taught in class
            Sings_songs_taught_in_class_rel1,
            Sings_songs_taught_in_class_rel2,
            Sings_songs_taught_in_class_rel3,
            Sings_songs_taught_in_class_rel4,
            Pretest_Sings_songs_taught_in_class_addrowrel1,
            Pretest_Sings_songs_taught_in_class_addrowrel2,
            Pretest_Sings_songs_taught_in_class_addrowrel3,
            Pretest_Sings_songs_taught_in_class_addrowrel4,
            QuarterlyExams_Sings_songs_taught_in_class_addrowrel1,
            QuarterlyExams_Sings_songs_taught_in_class_addrowrel2,
            QuarterlyExams_Sings_songs_taught_in_class_addrowrel3,
            QuarterlyExams_Sings_songs_taught_in_class_addrowrel4,
            TeachersObservation_Sings_songs_taught_in_class_addrowrel1,
            TeachersObservation_Sings_songs_taught_in_class_addrowrel2,
            TeachersObservation_Sings_songs_taught_in_class_addrowrel3,
            TeachersObservation_Sings_songs_taught_in_class_addrowrel4,

            // Receptive/Expressive Language | Talks to others
            Talks_to_others_rel1,
            Talks_to_others_rel2,
            Talks_to_others_rel3,
            Talks_to_others_rel4,
            Pretest_Talks_to_others_addrowrel1,
            Pretest_Talks_to_others_addrowrel2,
            Pretest_Talks_to_others_addrowrel3,
            Pretest_Talks_to_others_addrowrel4,
            QuarterlyExams_Talks_to_others_addrowrel1,
            QuarterlyExams_Talks_to_others_addrowrel2,
            QuarterlyExams_Talks_to_others_addrowrel3,
            QuarterlyExams_Talks_to_others_addrowrel4,
            TeachersObservation_Talks_to_others_addrowrel1,
            TeachersObservation_Talks_to_others_addrowrel2,
            TeachersObservation_Talks_to_others_addrowrel3,
            TeachersObservation_Talks_to_others_addrowrel4,

            // Receptive/Expressive Language | Answers simple questions
            Answers_simple_questions_rel1,
            Answers_simple_questions_rel2,
            Answers_simple_questions_rel3,
            Answers_simple_questions_rel4,
            Pretest_Answers_simple_questions_addrowrel1,
            Pretest_Answers_simple_questions_addrowrel2,
            Pretest_Answers_simple_questions_addrowrel3,
            Pretest_Answers_simple_questions_addrowrel4,
            QuarterlyExams_Answers_simple_questions_addrowrel1,
            QuarterlyExams_Answers_simple_questions_addrowrel2,
            QuarterlyExams_Answers_simple_questions_addrowrel3,
            QuarterlyExams_Answers_simple_questions_addrowrel4,
            TeachersObservation_Answers_simple_questions_addrowrel1,
            TeachersObservation_Answers_simple_questions_addrowrel2,
            TeachersObservation_Answers_simple_questions_addrowrel3,
            TeachersObservation_Answers_simple_questions_addrowrel4,

            // Receptive/Expressive Language | Retells simple events that happened at home or in school
            Retells_simple_events_that_happened_at_home_or_in_school_rel1,
            Retells_simple_events_that_happened_at_home_or_in_school_rel2,
            Retells_simple_events_that_happened_at_home_or_in_school_rel3,
            Retells_simple_events_that_happened_at_home_or_in_school_rel4,
            Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1,
            Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2,
            Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3,
            Pretest_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4,
            QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1,
            QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2,
            QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3,
            QuarterlyExams_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4,
            TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel1,
            TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel2,
            TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel3,
            TeachersObservation_Retells_simple_events_that_happened_at_home_or_in_school_addrowrel4,

            // Pre-Academic Development | Names familiar objects
            Names_familiar_objects_pad1,
            Names_familiar_objects_pad2,
            Names_familiar_objects_pad3,
            Names_familiar_objects_pad4,
            Pretest_Names_familiar_objects_addrowpad1,
            Pretest_Names_familiar_objects_addrowpad2,
            Pretest_Names_familiar_objects_addrowpad3,
            Pretest_Names_familiar_objects_addrowpad4,
            QuarterlyExams_Names_familiar_objects_addrowpad1,
            QuarterlyExams_Names_familiar_objects_addrowpad2,
            QuarterlyExams_Names_familiar_objects_addrowpad3,
            QuarterlyExams_Names_familiar_objects_addrowpad4,
            TeachersObservation_Names_familiar_objects_addrowpad1,
            TeachersObservation_Names_familiar_objects_addrowpad2,
            TeachersObservation_Names_familiar_objects_addrowpad3,
            TeachersObservation_Names_familiar_objects_addrowpad4,

            // Pre-Academic Development | Identifies own possessions
            Identifies_own_possessions_pad1,
            Identifies_own_possessions_pad2,
            Identifies_own_possessions_pad3,
            Identifies_own_possessions_pad4,
            Pretest_Identifies_own_possessions_addrowpad1,
            Pretest_Identifies_own_possessions_addrowpad2,
            Pretest_Identifies_own_possessions_addrowpad3,
            Pretest_Identifies_own_possessions_addrowpad4,
            QuarterlyExams_Identifies_own_possessions_addrowpad1,
            QuarterlyExams_Identifies_own_possessions_addrowpad2,
            QuarterlyExams_Identifies_own_possessions_addrowpad3,
            QuarterlyExams_Identifies_own_possessions_addrowpad4,
            TeachersObservation_Identifies_own_possessions_addrowpad1,
            TeachersObservation_Identifies_own_possessions_addrowpad2,
            TeachersObservation_Identifies_own_possessions_addrowpad3,
            TeachersObservation_Identifies_own_possessions_addrowpad4,

            // Pre-Academic Development | Identifies colors
            Identifies_colors_pad1,
            Identifies_colors_pad2,
            Identifies_colors_pad3,
            Identifies_colors_pad4,
            Pretest_Identifies_colors_addrowpad1,
            Pretest_Identifies_colors_addrowpad2,
            Pretest_Identifies_colors_addrowpad3,
            Pretest_Identifies_colors_addrowpad4,
            QuarterlyExams_Identifies_colors_addrowpad1,
            QuarterlyExams_Identifies_colors_addrowpad2,
            QuarterlyExams_Identifies_colors_addrowpad3,
            QuarterlyExams_Identifies_colors_addrowpad4,
            TeachersObservation_Identifies_colors_addrowpad1,
            TeachersObservation_Identifies_colors_addrowpad2,
            TeachersObservation_Identifies_colors_addrowpad3,
            TeachersObservation_Identifies_colors_addrowpad4,

            // Pre-Academic Development | Names basic shapes
            Names_basic_shapes_pad1,
            Names_basic_shapes_pad2,
            Names_basic_shapes_pad3,
            Names_basic_shapes_pad4,
            Pretest_Names_basic_shapes_addrowpad1,
            Pretest_Names_basic_shapes_addrowpad2,
            Pretest_Names_basic_shapes_addrowpad3,
            Pretest_Names_basic_shapes_addrowpad4,
            QuarterlyExams_Names_basic_shapes_addrowpad1,
            QuarterlyExams_Names_basic_shapes_addrowpad2,
            QuarterlyExams_Names_basic_shapes_addrowpad3,
            QuarterlyExams_Names_basic_shapes_addrowpad4,
            TeachersObservation_Names_basic_shapes_addrowpad1,
            TeachersObservation_Names_basic_shapes_addrowpad2,
            TeachersObservation_Names_basic_shapes_addrowpad3,
            TeachersObservation_Names_basic_shapes_addrowpad4,

            // Pre-Academic Development | Names objects as same and different
            Names_objects_as_same_and_different_pad1,
            Names_objects_as_same_and_different_pad2,
            Names_objects_as_same_and_different_pad3,
            Names_objects_as_same_and_different_pad4,
            Pretest_Names_objects_as_same_and_different_addrowpad1,
            Pretest_Names_objects_as_same_and_different_addrowpad2,
            Pretest_Names_objects_as_same_and_different_addrowpad3,
            Pretest_Names_objects_as_same_and_different_addrowpad4,
            QuarterlyExams_Names_objects_as_same_and_different_addrowpad1,
            QuarterlyExams_Names_objects_as_same_and_different_addrowpad2,
            QuarterlyExams_Names_objects_as_same_and_different_addrowpad3,
            QuarterlyExams_Names_objects_as_same_and_different_addrowpad4,
            TeachersObservation_Names_objects_as_same_and_different_addrowpad1,
            TeachersObservation_Names_objects_as_same_and_different_addrowpad2,
            TeachersObservation_Names_objects_as_same_and_different_addrowpad3,
            TeachersObservation_Names_objects_as_same_and_different_addrowpad4,

            // Pre-Academic Development | Identifies left hand and right hand
            Identifies_left_hand_and_right_hand_pad1,
            Identifies_left_hand_and_right_hand_pad2,
            Identifies_left_hand_and_right_hand_pad3,
            Identifies_left_hand_and_right_hand_pad4,
            Pretest_Identifies_left_hand_and_right_hand_addrowpad1,
            Pretest_Identifies_left_hand_and_right_hand_addrowpad2,
            Pretest_Identifies_left_hand_and_right_hand_addrowpad3,
            Pretest_Identifies_left_hand_and_right_hand_addrowpad4,
            QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad1,
            QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad2,
            QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad3,
            QuarterlyExams_Identifies_left_hand_and_right_hand_addrowpad4,
            TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad1,
            TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad2,
            TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad3,
            TeachersObservation_Identifies_left_hand_and_right_hand_addrowpad4,

            // Pre-Academic Development | Recognizes name in print
            Recognizes_name_in_print_pad1,
            Recognizes_name_in_print_pad2,
            Recognizes_name_in_print_pad3,
            Recognizes_name_in_print_pad4,
            Pretest_Recognizes_name_in_print_addrowpad1,
            Pretest_Recognizes_name_in_print_addrowpad2,
            Pretest_Recognizes_name_in_print_addrowpad3,
            Pretest_Recognizes_name_in_print_addrowpad4,
            QuarterlyExams_Recognizes_name_in_print_addrowpad1,
            QuarterlyExams_Recognizes_name_in_print_addrowpad2,
            QuarterlyExams_Recognizes_name_in_print_addrowpad3,
            QuarterlyExams_Recognizes_name_in_print_addrowpad4,
            TeachersObservation_Recognizes_name_in_print_addrowpad1,
            TeachersObservation_Recognizes_name_in_print_addrowpad2,
            TeachersObservation_Recognizes_name_in_print_addrowpad3,
            TeachersObservation_Recognizes_name_in_print_addrowpad4,

            // Pre-Academic Development | Sees objects in relation to others in terms of spatial positions
            Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad1,
            Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad2,
            Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad3,
            Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_pad4,
            Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1,
            Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2,
            Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3,
            Pretest_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4,
            QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1,
            QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2,
            QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3,
            QuarterlyExams_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4,
            TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad1,
            TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad2,
            TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad3,
            TeachersObservation_Sees_objects_in_relation_to_others_in_terms_of_spatial_positions_addrowpad4,

            // Pre-Academic Development | Identifies missing parts of objects
            Identifies_missing_parts_of_objects_pad1,
            Identifies_missing_parts_of_objects_pad2,
            Identifies_missing_parts_of_objects_pad3,
            Identifies_missing_parts_of_objects_pad4,
            Pretest_Identifies_missing_parts_of_objects_addrowpad1,
            Pretest_Identifies_missing_parts_of_objects_addrowpad2,
            Pretest_Identifies_missing_parts_of_objects_addrowpad3,
            Pretest_Identifies_missing_parts_of_objects_addrowpad4,
            QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad1,
            QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad2,
            QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad3,
            QuarterlyExams_Identifies_missing_parts_of_objects_addrowpad4,
            TeachersObservation_Identifies_missing_parts_of_objects_addrowpad1,
            TeachersObservation_Identifies_missing_parts_of_objects_addrowpad2,
            TeachersObservation_Identifies_missing_parts_of_objects_addrowpad3,
            TeachersObservation_Identifies_missing_parts_of_objects_addrowpad4,

            // Pre-Academic Development | Tells what is missing when one object is removed from a group of three
            Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad1,
            Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad2,
            Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad3,
            Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_pad4,
            Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1,
            Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2,
            Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3,
            Pretest_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4,
            QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1,
            QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2,
            QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3,
            QuarterlyExams_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4,
            TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad1,
            TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad2,
            TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad3,
            TeachersObservation_Tells_what_is_missing_when_one_object_is_removed_from_a_group_of_three_addrowpad4,

            // Logical Mathematical Development | Describes objects according to size, length, weight, and quantity
            Describes_objects_according_to_size_length_weight_and_quantity_lmd1,
            Describes_objects_according_to_size_length_weight_and_quantity_lmd2,
            Describes_objects_according_to_size_length_weight_and_quantity_lmd3,
            Describes_objects_according_to_size_length_weight_and_quantity_lmd4,
            Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1,
            Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2,
            Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3,
            Pretest_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4,
            QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1,
            QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2,
            QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3,
            QuarterlyExams_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4,
            TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd1,
            TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd2,
            TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd3,
            TeachersObservation_Describes_objects_according_to_size_length_weight_and_quantity_addrowlmd4,

            // Logical Mathematical Development | Classifies objects according to size, color, and shape
            Classifies_objects_according_to_size_color_and_shape_lmd1,
            Classifies_objects_according_to_size_color_and_shape_lmd2,
            Classifies_objects_according_to_size_color_and_shape_lmd3,
            Classifies_objects_according_to_size_color_and_shape_lmd4,
            Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd1,
            Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd2,
            Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd3,
            Pretest_Classifies_objects_according_to_size_color_and_shape_addrowlmd4,
            QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd1,
            QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd2,
            QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd3,
            QuarterlyExams_Classifies_objects_according_to_size_color_and_shape_addrowlmd4,
            TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd1,
            TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd2,
            TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd3,
            TeachersObservation_Classifies_objects_according_to_size_color_and_shape_addrowlmd4,

            // Logical Mathematical Development | Compares sets
            Compares_sets_lmd1,
            Compares_sets_lmd2,
            Compares_sets_lmd3,
            Compares_sets_lmd4,
            Pretest_Compares_sets_addrowlmd1,
            Pretest_Compares_sets_addrowlmd2,
            Pretest_Compares_sets_addrowlmd3,
            Pretest_Compares_sets_addrowlmd4,
            QuarterlyExams_Compares_sets_addrowlmd1,
            QuarterlyExams_Compares_sets_addrowlmd2,
            QuarterlyExams_Compares_sets_addrowlmd3,
            QuarterlyExams_Compares_sets_addrowlmd4,
            TeachersObservation_Compares_sets_addrowlmd1,
            TeachersObservation_Compares_sets_addrowlmd2,
            TeachersObservation_Compares_sets_addrowlmd3,
            TeachersObservation_Compares_sets_addrowlmd4,

            // Logical Mathematical Development | Identifies what comes next in a pattern
            Identifies_what_comes_next_in_a_pattern_lmd1,
            Identifies_what_comes_next_in_a_pattern_lmd2,
            Identifies_what_comes_next_in_a_pattern_lmd3,
            Identifies_what_comes_next_in_a_pattern_lmd4,
            Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd1,
            Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd2,
            Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd3,
            Pretest_Identifies_what_comes_next_in_a_pattern_addrowlmd4,
            QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd1,
            QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd2,
            QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd3,
            QuarterlyExams_Identifies_what_comes_next_in_a_pattern_addrowlmd4,
            TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd1,
            TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd2,
            TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd3,
            TeachersObservation_Identifies_what_comes_next_in_a_pattern_addrowlmd4,

            // Logical Mathematical Development | Knows one-to-one correspondence
            Knows_one_to_one_correspondence_lmd1,
            Knows_one_to_one_correspondence_lmd2,
            Knows_one_to_one_correspondence_lmd3,
            Knows_one_to_one_correspondence_lmd4,
            Pretest_Knows_one_to_one_correspondence_addrowlmd1,
            Pretest_Knows_one_to_one_correspondence_addrowlmd2,
            Pretest_Knows_one_to_one_correspondence_addrowlmd3,
            Pretest_Knows_one_to_one_correspondence_addrowlmd4,
            QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd1,
            QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd2,
            QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd3,
            QuarterlyExams_Knows_one_to_one_correspondence_addrowlmd4,
            TeachersObservation_Knows_one_to_one_correspondence_addrowlmd1,
            TeachersObservation_Knows_one_to_one_correspondence_addrowlmd2,
            TeachersObservation_Knows_one_to_one_correspondence_addrowlmd3,
            TeachersObservation_Knows_one_to_one_correspondence_addrowlmd4,

            // Logical Mathematical Development | Rote counts up to 100
            Rote_counts_up_to_100_lmd1,
            Rote_counts_up_to_100_lmd2,
            Rote_counts_up_to_100_lmd3,
            Rote_counts_up_to_100_lmd4,
            Pretest_Rote_counts_up_to_100_addrowlmd1,
            Pretest_Rote_counts_up_to_100_addrowlmd2,
            Pretest_Rote_counts_up_to_100_addrowlmd3,
            Pretest_Rote_counts_up_to_100_addrowlmd4,
            QuarterlyExams_Rote_counts_up_to_100_addrowlmd1,
            QuarterlyExams_Rote_counts_up_to_100_addrowlmd2,
            QuarterlyExams_Rote_counts_up_to_100_addrowlmd3,
            QuarterlyExams_Rote_counts_up_to_100_addrowlmd4,
            TeachersObservation_Rote_counts_up_to_100_addrowlmd1,
            TeachersObservation_Rote_counts_up_to_100_addrowlmd2,
            TeachersObservation_Rote_counts_up_to_100_addrowlmd3,
            TeachersObservation_Rote_counts_up_to_100_addrowlmd4,

            // Logical Mathematical Development | Identifies numerals 0 to 50
            Identifies_numerals_0_to_50_lmd1,
            Identifies_numerals_0_to_50_lmd2,
            Identifies_numerals_0_to_50_lmd3,
            Identifies_numerals_0_to_50_lmd4,
            Pretest_Identifies_numerals_0_to_50_addrowlmd1,
            Pretest_Identifies_numerals_0_to_50_addrowlmd2,
            Pretest_Identifies_numerals_0_to_50_addrowlmd3,
            Pretest_Identifies_numerals_0_to_50_addrowlmd4,
            QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd1,
            QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd2,
            QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd3,
            QuarterlyExams_Identifies_numerals_0_to_50_addrowlmd4,
            TeachersObservation_Identifies_numerals_0_to_50_addrowlmd1,
            TeachersObservation_Identifies_numerals_0_to_50_addrowlmd2,
            TeachersObservation_Identifies_numerals_0_to_50_addrowlmd3,
            TeachersObservation_Identifies_numerals_0_to_50_addrowlmd4,

            // Logical Mathematical Development | Writes numerals 0 to 20
            Writes_numerals_0_to_20_lmd1,
            Writes_numerals_0_to_20_lmd2,
            Writes_numerals_0_to_20_lmd3,
            Writes_numerals_0_to_20_lmd4,
            Pretest_Writes_numerals_0_to_20_addrowlmd1,
            Pretest_Writes_numerals_0_to_20_addrowlmd2,
            Pretest_Writes_numerals_0_to_20_addrowlmd3,
            Pretest_Writes_numerals_0_to_20_addrowlmd4,
            QuarterlyExams_Writes_numerals_0_to_20_addrowlmd1,
            QuarterlyExams_Writes_numerals_0_to_20_addrowlmd2,
            QuarterlyExams_Writes_numerals_0_to_20_addrowlmd3,
            QuarterlyExams_Writes_numerals_0_to_20_addrowlmd4,
            TeachersObservation_Writes_numerals_0_to_20_addrowlmd1,
            TeachersObservation_Writes_numerals_0_to_20_addrowlmd2,
            TeachersObservation_Writes_numerals_0_to_20_addrowlmd3,
            TeachersObservation_Writes_numerals_0_to_20_addrowlmd4,

            // Logical Mathematical Development | Puts numerals in proper sequence 
            Puts_numerals_in_proper_sequence_lmd1,
            Puts_numerals_in_proper_sequence_lmd2,
            Puts_numerals_in_proper_sequence_lmd3,
            Puts_numerals_in_proper_sequence_lmd4,
            Pretest_Puts_numerals_in_proper_sequence_addrowlmd1,
            Pretest_Puts_numerals_in_proper_sequence_addrowlmd2,
            Pretest_Puts_numerals_in_proper_sequence_addrowlmd3,
            Pretest_Puts_numerals_in_proper_sequence_addrowlmd4,
            QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd1,
            QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd2,
            QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd3,
            QuarterlyExams_Puts_numerals_in_proper_sequence_addrowlmd4,
            TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd1,
            TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd2,
            TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd3,
            TeachersObservation_Puts_numerals_in_proper_sequence_addrowlmd4,

            // Logical Mathematical Development | Names position of objects 
            Names_position_of_objects_lmd1,
            Names_position_of_objects_lmd2,
            Names_position_of_objects_lmd3,
            Names_position_of_objects_lmd4,
            Pretest_Names_position_of_objects_addrowlmd1,
            Pretest_Names_position_of_objects_addrowlmd2,
            Pretest_Names_position_of_objects_addrowlmd3,
            Pretest_Names_position_of_objects_addrowlmd4,
            QuarterlyExams_Names_position_of_objects_addrowlmd1,
            QuarterlyExams_Names_position_of_objects_addrowlmd2,
            QuarterlyExams_Names_position_of_objects_addrowlmd3,
            QuarterlyExams_Names_position_of_objects_addrowlmd4,
            TeachersObservation_Names_position_of_objects_addrowlmd1,
            TeachersObservation_Names_position_of_objects_addrowlmd2,
            TeachersObservation_Names_position_of_objects_addrowlmd3,
            TeachersObservation_Names_position_of_objects_addrowlmd4,

            // Logical Mathematical Development | Performs simple addition with sum not greater than 10 using objects and picture stories 
            Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd1,
            Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd2,
            Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd3,
            Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_lmd4,
            Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1,
            Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2,
            Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3,
            Pretest_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4,
            QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1,
            QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2,
            QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3,
            QuarterlyExams_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4,
            TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd1,
            TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd2,
            TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd3,
            TeachersObservation_Performs_simple_addition_with_sum_not_greater_than_10_using_objects_and_picture_stories_addrowlmd4,

            // Logical Mathematical Development | Performs simple subtraction of numbers between 0 to 10 using objects and picture stories 
            Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd1,
            Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd2,
            Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd3,
            Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_lmd4,
            Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1,
            Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2,
            Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3,
            Pretest_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4,
            QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1,
            QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2,
            QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3,
            QuarterlyExams_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4,
            TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd1,
            TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd2,
            TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd3,
            TeachersObservation_Performs_simple_subtraction_of_numbers_between_0_to_10_using_objects_and_picture_stories_addrowlmd4,

            // Logical Mathematical Development | Tells time by hour and half hour
            Tells_time_by_hour_and_half_hour_lmd1,
            Tells_time_by_hour_and_half_hour_lmd2,
            Tells_time_by_hour_and_half_hour_lmd3,
            Tells_time_by_hour_and_half_hour_lmd4,
            Pretest_Tells_time_by_hour_and_half_hour_addrowlmd1,
            Pretest_Tells_time_by_hour_and_half_hour_addrowlmd2,
            Pretest_Tells_time_by_hour_and_half_hour_addrowlmd3,
            Pretest_Tells_time_by_hour_and_half_hour_addrowlmd4,
            QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd1,
            QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd2,
            QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd3,
            QuarterlyExams_Tells_time_by_hour_and_half_hour_addrowlmd4,
            TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd1,
            TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd2,
            TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd3,
            TeachersObservation_Tells_time_by_hour_and_half_hour_addrowlmd4,

            // Reading Readiness | Names uppercase letters
            Names_uppercase_letters_rr1,
            Names_uppercase_letters_rr2,
            Names_uppercase_letters_rr3,
            Names_uppercase_letters_rr4,
            Pretest_Names_uppercase_letters_addrowrr1,
            Pretest_Names_uppercase_letters_addrowrr2,
            Pretest_Names_uppercase_letters_addrowrr3,
            Pretest_Names_uppercase_letters_addrowrr4,
            QuarterlyExams_Names_uppercase_letters_addrowrr1,
            QuarterlyExams_Names_uppercase_letters_addrowrr2,
            QuarterlyExams_Names_uppercase_letters_addrowrr3,
            QuarterlyExams_Names_uppercase_letters_addrowrr4,
            TeachersObservation_Names_uppercase_letters_addrowrr1,
            TeachersObservation_Names_uppercase_letters_addrowrr2,
            TeachersObservation_Names_uppercase_letters_addrowrr3,
            TeachersObservation_Names_uppercase_letters_addrowrr4,

            // Reading Readiness | Names lowercase letters
            Names_lowercase_letters_rr1,
            Names_lowercase_letters_rr2,
            Names_lowercase_letters_rr3,
            Names_lowercase_letters_rr4,
            Pretest_Names_lowercase_letters_addrowrr1,
            Pretest_Names_lowercase_letters_addrowrr2,
            Pretest_Names_lowercase_letters_addrowrr3,
            Pretest_Names_lowercase_letters_addrowrr4,
            QuarterlyExams_Names_lowercase_letters_addrowrr1,
            QuarterlyExams_Names_lowercase_letters_addrowrr2,
            QuarterlyExams_Names_lowercase_letters_addrowrr3,
            QuarterlyExams_Names_lowercase_letters_addrowrr4,
            TeachersObservation_Names_lowercase_letters_addrowrr1,
            TeachersObservation_Names_lowercase_letters_addrowrr2,
            TeachersObservation_Names_lowercase_letters_addrowrr3,
            TeachersObservation_Names_lowercase_letters_addrowrr4,

            // Reading Readiness | Gives the sounds of uppercase letters
            Gives_the_sounds_of_uppercase_letters_rr1,
            Gives_the_sounds_of_uppercase_letters_rr2,
            Gives_the_sounds_of_uppercase_letters_rr3,
            Gives_the_sounds_of_uppercase_letters_rr4,
            Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr1,
            Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr2,
            Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr3,
            Pretest_Gives_the_sounds_of_uppercase_letters_addrowrr4,
            QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr1,
            QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr2,
            QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr3,
            QuarterlyExams_Gives_the_sounds_of_uppercase_letters_addrowrr4,
            TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr1,
            TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr2,
            TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr3,
            TeachersObservation_Gives_the_sounds_of_uppercase_letters_addrowrr4,

            // Reading Readiness | Gives the sounds of lowercase letters
            Gives_the_sounds_of_lowercase_letters_rr1,
            Gives_the_sounds_of_lowercase_letters_rr2,
            Gives_the_sounds_of_lowercase_letters_rr3,
            Gives_the_sounds_of_lowercase_letters_rr4,
            Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr1,
            Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr2,
            Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr3,
            Pretest_Gives_the_sounds_of_lowercase_letters_addrowrr4,
            QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr1,
            QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr2,
            QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr3,
            QuarterlyExams_Gives_the_sounds_of_lowercase_letters_addrowrr4,
            TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr1,
            TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr2,
            TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr3,
            TeachersObservation_Gives_the_sounds_of_lowercase_letters_addrowrr4,

            // Reading Readiness | Associates words with corresponding pictures
            Associates_words_with_corresponding_pictures_rr1,
            Associates_words_with_corresponding_pictures_rr2,
            Associates_words_with_corresponding_pictures_rr3,
            Associates_words_with_corresponding_pictures_rr4,
            Pretest_Associates_words_with_corresponding_pictures_addrowrr1,
            Pretest_Associates_words_with_corresponding_pictures_addrowrr2,
            Pretest_Associates_words_with_corresponding_pictures_addrowrr3,
            Pretest_Associates_words_with_corresponding_pictures_addrowrr4,
            QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr1,
            QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr2,
            QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr3,
            QuarterlyExams_Associates_words_with_corresponding_pictures_addrowrr4,
            TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr1,
            TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr2,
            TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr3,
            TeachersObservation_Associates_words_with_corresponding_pictures_addrowrr4,

            // Reading Readiness | Reads CV pairs
            Reads_CV_pairs_rr1,
            Reads_CV_pairs_rr2,
            Reads_CV_pairs_rr3,
            Reads_CV_pairs_rr4,
            Pretest_Reads_CV_pairs_addrowrr1,
            Pretest_Reads_CV_pairs_addrowrr2,
            Pretest_Reads_CV_pairs_addrowrr3,
            Pretest_Reads_CV_pairs_addrowrr4,
            QuarterlyExams_Reads_CV_pairs_addrowrr1,
            QuarterlyExams_Reads_CV_pairs_addrowrr2,
            QuarterlyExams_Reads_CV_pairs_addrowrr3,
            QuarterlyExams_Reads_CV_pairs_addrowrr4,
            TeachersObservation_Reads_CV_pairs_addrowrr1,
            TeachersObservation_Reads_CV_pairs_addrowrr2,
            TeachersObservation_Reads_CV_pairs_addrowrr3,
            TeachersObservation_Reads_CV_pairs_addrowrr4,

            // Reading Readiness | Reads three-letter words with short vowel sounds
            Reads_three_letter_words_with_short_vowel_sounds_rr1,
            Reads_three_letter_words_with_short_vowel_sounds_rr2,
            Reads_three_letter_words_with_short_vowel_sounds_rr3,
            Reads_three_letter_words_with_short_vowel_sounds_rr4,
            Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1,
            Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2,
            Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3,
            Pretest_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4,
            QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1,
            QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2,
            QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3,
            QuarterlyExams_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4,
            TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr1,
            TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr2,
            TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr3,
            TeachersObservation_Reads_three_letter_words_with_short_vowel_sounds_addrowrr4,

            // Reading Readiness | Reads basic sight words
            Reads_basic_sight_words_rr1,
            Reads_basic_sight_words_rr2,
            Reads_basic_sight_words_rr3,
            Reads_basic_sight_words_rr4,
            Pretest_Reads_basic_sight_words_addrowrr1,
            Pretest_Reads_basic_sight_words_addrowrr2,
            Pretest_Reads_basic_sight_words_addrowrr3,
            Pretest_Reads_basic_sight_words_addrowrr4,
            QuarterlyExams_Reads_basic_sight_words_addrowrr1,
            QuarterlyExams_Reads_basic_sight_words_addrowrr2,
            QuarterlyExams_Reads_basic_sight_words_addrowrr3,
            QuarterlyExams_Reads_basic_sight_words_addrowrr4,
            TeachersObservation_Reads_basic_sight_words_addrowrr1,
            TeachersObservation_Reads_basic_sight_words_addrowrr2,
            TeachersObservation_Reads_basic_sight_words_addrowrr3,
            TeachersObservation_Reads_basic_sight_words_addrowrr4,

            // Socio-Emotional Development | Cares for his/her own physical needs such as
            Cares_for_his_her_own_physical_needs_such_as_sed1,
            Cares_for_his_her_own_physical_needs_such_as_sed2,
            Cares_for_his_her_own_physical_needs_such_as_sed3,
            Cares_for_his_her_own_physical_needs_such_as_sed4,
            Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed1,
            Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed2,
            Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed3,
            Eating_Cares_for_his_her_own_physical_needs_such_as_addrowsed4,
            Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed1,
            Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed2,
            Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed3,
            Grooming_Cares_for_his_her_own_physical_needs_such_as_addrowsed4,

            // Socio-Emotional Development | Follows simple directions
            Follows_simple_directions_sed1,
            Follows_simple_directions_sed2,
            Follows_simple_directions_sed3,
            Follows_simple_directions_sed4,
            Pretest_Follows_simple_direction_addrowsed1,
            Pretest_Follows_simple_direction_addrowsed2,
            Pretest_Follows_simple_direction_addrowsed3,
            Pretest_Follows_simple_direction_addrowsed4,
            QuarterlyExams_Follows_simple_direction_addrowsed1,
            QuarterlyExams_Follows_simple_direction_addrowsed2,
            QuarterlyExams_Follows_simple_direction_addrowsed3,
            QuarterlyExams_Follows_simple_direction_addrowsed4,
            TeachersObservation_Follows_simple_direction_addrowsed1,
            TeachersObservation_Follows_simple_direction_addrowsed2,
            TeachersObservation_Follows_simple_direction_addrowsed3,
            TeachersObservation_Follows_simple_direction_addrowsed4,

            // Socio-Emotional Development | Follows classroom rules
            Follows_classroom_rules_sed1,
            Follows_classroom_rules_sed2,
            Follows_classroom_rules_sed3,
            Follows_classroom_rules_sed4,
            Pretest_Follows_classroom_rules_addrowsed1,
            Pretest_Follows_classroom_rules_addrowsed2,
            Pretest_Follows_classroom_rules_addrowsed3,
            Pretest_Follows_classroom_rules_addrowsed4,
            QuarterlyExams_Follows_classroom_rules_addrowsed1,
            QuarterlyExams_Follows_classroom_rules_addrowsed2,
            QuarterlyExams_Follows_classroom_rules_addrowsed3,
            QuarterlyExams_Follows_classroom_rules_addrowsed4,
            TeachersObservation_Follows_classroom_rules_addrowsed1,
            TeachersObservation_Follows_classroom_rules_addrowsed2,
            TeachersObservation_Follows_classroom_rules_addrowsed3,
            TeachersObservation_Follows_classroom_rules_addrowsed4,

            // Socio-Emotional Development | Shares and waits for turn
            Shares_and_waits_for_turn_sed1,
            Shares_and_waits_for_turn_sed2,
            Shares_and_waits_for_turn_sed3,
            Shares_and_waits_for_turn_sed4,
            Pretest_Shares_and_waits_for_turn_addrowsed1,
            Pretest_Shares_and_waits_for_turn_addrowsed2,
            Pretest_Shares_and_waits_for_turn_addrowsed3,
            Pretest_Shares_and_waits_for_turn_addrowsed4,
            QuarterlyExams_Shares_and_waits_for_turn_addrowsed1,
            QuarterlyExams_Shares_and_waits_for_turn_addrowsed2,
            QuarterlyExams_Shares_and_waits_for_turn_addrowsed3,
            QuarterlyExams_Shares_and_waits_for_turn_addrowsed4,
            TeachersObservation_Shares_and_waits_for_turn_addrowsed1,
            TeachersObservation_Shares_and_waits_for_turn_addrowsed2,
            TeachersObservation_Shares_and_waits_for_turn_addrowsed3,
            TeachersObservation_Shares_and_waits_for_turn_addrowsed4,

            // Socio-Emotional Development | Plays cooperatively with others
            Plays_cooperatively_with_others_sed1,
            Plays_cooperatively_with_others_sed2,
            Plays_cooperatively_with_others_sed3,
            Plays_cooperatively_with_others_sed4,
            Pretest_Plays_cooperatively_with_others_addrowsed1,
            Pretest_Plays_cooperatively_with_others_addrowsed2,
            Pretest_Plays_cooperatively_with_others_addrowsed3,
            Pretest_Plays_cooperatively_with_others_addrowsed4,
            QuarterlyExams_Plays_cooperatively_with_others_addrowsed1,
            QuarterlyExams_Plays_cooperatively_with_others_addrowsed2,
            QuarterlyExams_Plays_cooperatively_with_others_addrowsed3,
            QuarterlyExams_Plays_cooperatively_with_others_addrowsed4,
            TeachersObservation_Plays_cooperatively_with_others_addrowsed1,
            TeachersObservation_Plays_cooperatively_with_others_addrowsed2,
            TeachersObservation_Plays_cooperatively_with_others_addrowsed3,
            TeachersObservation_Plays_cooperatively_with_others_addrowsed4,

            // Socio-Emotional Development | Packs away
            Packs_away_sed1,
            Packs_away_sed2,
            Packs_away_sed3,
            Packs_away_sed4,
            Pretest_Packs_away_addrowsed1,
            Pretest_Packs_away_addrowsed2,
            Pretest_Packs_away_addrowsed3,
            Pretest_Packs_away_addrowsed4,
            QuarterlyExams_Packs_away_addrowsed1,
            QuarterlyExams_Packs_away_addrowsed2,
            QuarterlyExams_Packs_away_addrowsed3,
            QuarterlyExams_Packs_away_addrowsed4,
            TeachersObservation_Packs_away_addrowsed1,
            TeachersObservation_Packs_away_addrowsed2,
            TeachersObservation_Packs_away_addrowsed3,
            TeachersObservation_Packs_away_addrowsed4,

            // Socio-Emotional Development | Helps in simple tasks
            Helps_in_simple_tasks_sed1,
            Helps_in_simple_tasks_sed2,
            Helps_in_simple_tasks_sed3,
            Helps_in_simple_tasks_sed4,
            Pretest_Helps_in_simple_tasks_addrowsed1,
            Pretest_Helps_in_simple_tasks_addrowsed2,
            Pretest_Helps_in_simple_tasks_addrowsed3,
            Pretest_Helps_in_simple_tasks_addrowsed4,
            QuarterlyExams_Helps_in_simple_tasks_addrowsed1,
            QuarterlyExams_Helps_in_simple_tasks_addrowsed2,
            QuarterlyExams_Helps_in_simple_tasks_addrowsed3,
            QuarterlyExams_Helps_in_simple_tasks_addrowsed4,
            TeachersObservation_Helps_in_simple_tasks_addrowsed1,
            TeachersObservation_Helps_in_simple_tasks_addrowsed2,
            TeachersObservation_Helps_in_simple_tasks_addrowsed3,
            TeachersObservation_Helps_in_simple_tasks_addrowsed4,

            // Socio-Emotional Development | Attends to task for increasingly longer periods of time
            Attends_to_task_for_increasingly_longer_periods_of_time_sed1,
            Attends_to_task_for_increasingly_longer_periods_of_time_sed2,
            Attends_to_task_for_increasingly_longer_periods_of_time_sed3,
            Attends_to_task_for_increasingly_longer_periods_of_time_sed4,
            Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1,
            Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2,
            Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3,
            Pretest_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4,
            QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1,
            QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2,
            QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3,
            QuarterlyExams_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4,
            TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed1,
            TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed2,
            TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed3,
            TeachersObservation_Attends_to_task_for_increasingly_longer_periods_of_time_addrowsed4
            

        })
        .then(() => {
            // Show notification
            const notification = document.getElementById('save-grade-notification');
            notification.classList.add('show');

            // Hide notification after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        })
        .catch((error) => {
            console.error("Error saving grades:", error);
        });
}

// Function to add focus and blur effects to inputs
function addInputFocusEffects() {
    const inputs = document.querySelectorAll('input'); // Select all input elements

    inputs.forEach(input => {
        // Add event listener for focus (when the input is selected)
        input.addEventListener('focus', () => {
            input.classList.add('input-highlight'); // Add red border on focus
        });

        // Add event listener for blur (when the input is deselected)
        input.addEventListener('blur', () => {
            input.classList.remove('input-highlight'); // Remove red border on blur
        });
    });
}


// Window onload function to initialize the page
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('studentId'); // Assume you pass studentId in the URL
    if (studentId) {
        displayStudentProfile(studentId); // Display profile if ID is present
    }

    addInputFocusEffects(); // Add focus effects to inputs
};











