document.getElementById('studentIDNumber').addEventListener('input', function (e) {
    // Remove non-numeric characters
    this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('studentPhoneNumber').addEventListener('input', function (e) {
    // Remove non-numeric characters
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAV7L0ZetJ0PzfExRLm71hrr9NBa_UHKbY",
    authDomain: "arck-co-little-trackie.firebaseapp.com",
    projectId: "arck-co-little-trackie",
    storageBucket: "arck-co-little-trackie.appspot.com",
    messagingSenderId: "786902861892",
    appId: "1:786902861892:web:5a7e98db05c43f6e7cd411"
};
firebase.initializeApp(firebaseConfig);

// Reference to Firestore database
const db = firebase.firestore();
const studentFormDB = db.collection("Students");
const classroomFormDB = db.collection("Classrooms");


// Function to display students based on the classroomId
function displayStudents(classroomId) {
    const container = document.getElementById("studentList");
    container.innerHTML = '';  // Clear the container before adding new students

    const user = firebase.auth().currentUser;
    if (!user) {
        alert("No user is currently signed in.");
        return;
    }
    const userId = user.uid;

    // Fetch students from Firestore
    studentFormDB.where("createdBy", "==", userId)
        .where("classroomId", "==", classroomId)
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                container.innerHTML = '<p class="no-student-message">No students found.</p>';
                return;
            }

            // Convert snapshot to an array and sort by first name
            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            students.sort((a, b) => a.sFirstName.localeCompare(b.sFirstName));


            students.forEach((doc) => {
                const studentElement = document.createElement('div');
                studentElement.className = 'student-card';

                // Add student details
                studentElement.innerHTML = `
                    <div class="student-card">
                        <div class="icon"></div>
                        <p class="student-name">${doc.sFirstName} ${doc.sLastName}</p>
                        <button class="remove-btn">Remove</button>
                    </div>
                `;

                // Add event listener to view student profile
                studentElement.addEventListener('click', () => {
                    window.location.href = `/STUDENTPROFILE/studentProfile.html?studentId=${doc.id}`;
                });

                // Add event listener for removing student
                const removeButton = studentElement.querySelector('.remove-btn');
                removeButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    removeStudent(doc.id);
                });

                container.appendChild(studentElement);
            });
        })
        .catch((error) => {
            console.error("Error fetching students: ", error);
        });
}

// Handle page load
window.onload = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const urlParams = new URLSearchParams(window.location.search);
            const classroomId = urlParams.get('classroomId');
            if (!classroomId) {
                alert("No classroom ID provided.");
                return;
            }
            displayStudents(classroomId);
            retrieveClassroomDetails(classroomId); // Retrieve and display classroom details
            displayTotalStudentCount(classroomId); 
        }
    });
};

function removeStudent(studentId) {
    // Show the custom confirmation modal
    const confirmModal = document.getElementById('custom-confirm');
    confirmModal.style.display = 'flex';

    // Set up event listeners for confirmation buttons
    const confirmButton = document.getElementById('confirm-delete');
    const cancelButton = document.getElementById('cancel-delete');

    // Handle confirmation
    confirmButton.onclick = () => {
        // Close the modal
        confirmModal.style.display = 'none';

        // Proceed with deletion
        studentFormDB.doc(studentId).delete()
            .then(() => {
                // Refresh the page to reload the student list
                location.reload(); // Full page refresh
            })
            .catch((error) => {
                console.error("Error removing student:", error);
                alert("Error removing student. Please try again.");
            });
    };

    // Handle cancellation
    cancelButton.onclick = () => {
        confirmModal.style.display = 'none';
    };
}




// Handle form submission for adding a student
document.getElementById('studentAddForm').addEventListener('submit', submitStudentForm);

function submitStudentForm(e) {
    e.preventDefault(); // Prevent form from submitting the default way

    const sFirstName = document.getElementById('studentFirstName').value;
    const sLastName = document.getElementById('studentLastName').value;
    const sAge = document.getElementById('studentAge').value;
    const sDateOfBirth = document.getElementById('studentDateOfBirth').value;
    const sIDNumber = document.getElementById('studentIDNumber').value;
    const sAddress = document.getElementById('studentAddress').value;
    const sGender = document.querySelector('input[name="gender"]:checked').value;
    const sParentOrGuardian = document.getElementById('studentParentOrGuardian').value;
    const sEmail = document.getElementById('studentEmail').value;
    const sPhoneNumber = document.getElementById('studentPhoneNumber').value;
    const sRelationship = document.getElementById('studentRelationship').value;

    if (sFirstName && sLastName && sAge && sDateOfBirth && sIDNumber && sAddress && sGender && sParentOrGuardian && sEmail && sPhoneNumber && sRelationship) {
        saveStudent(sFirstName, sLastName, sAge, sDateOfBirth, sIDNumber, sAddress, sGender, sParentOrGuardian, sEmail, sPhoneNumber, sRelationship);
    } else {
        alert("Please fill out all fields!");
    }
}

// Save student data to Firestore Database
const saveStudent = (sFirstName, sLastName, sAge, sDateOfBirth, sIDNumber, sAddress, sGender, sParentOrGuardian, sEmail, sPhoneNumber, sRelationship) => {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("No user is currently signed in.");
        return;
    }
    const userId = user.uid;

    // Get classroomId from the URL (since it's passed in the query string)
    const urlParams = new URLSearchParams(window.location.search);
    const classroomId = urlParams.get('classroomId');

    if (!classroomId) {
        alert("Classroom ID is required to save the student.");
        return;
    }

    studentFormDB.add({
        sFirstName: sFirstName,
        sLastName: sLastName,
        sAge: sAge,
        sDateOfBirth: sDateOfBirth,
        sIDNumber: sIDNumber,
        sAddress: sAddress,
        sGender: sGender,
        sParentOrGuardian: sParentOrGuardian,
        sEmail: sEmail,
        sPhoneNumber: sPhoneNumber,
        sRelationship: sRelationship,
        createdBy: userId,
        classroomId: classroomId // Save the classroomId with the student
    })
    .then(() => {

        // Show notification
        const notification = document.getElementById('add-student-notification');
        notification.classList.add('show');

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
        
        location.reload(); // Full page refresh
        // Reset the form inputs
        document.getElementById('studentAddForm').reset();

        // Update the student list dynamically without a page reload
        displayStudents(classroomId);
    })
    .catch((error) => {
        alert("Error adding student. Please try again.");
    });
};

// Function to retrieve and display classroom details for a specific classroomId
function retrieveClassroomDetails(classroomId) {
    classroomFormDB.doc(classroomId).get()
        .then((doc) => {
            if (doc.exists) {
                const classroomData = doc.data();

                // Dynamically update HTML elements with classroom details
                const sectionNameElement = document.getElementById("sectionName");
                const preSchoolElement = document.getElementById("preSchool");
                const scheduleElement = document.getElementById("schedule");

                if (sectionNameElement && preSchoolElement && scheduleElement) {
                    sectionNameElement.innerText = classroomData.sectionName;
                    preSchoolElement.innerText = classroomData.preSchool;
                    scheduleElement.innerText = classroomData.schedule;
                }
            } else {
                console.log("Classroom not found for ID:", classroomId);
            }
        })
        .catch((error) => {
            console.error("Error retrieving classroom details: ", error);
        });
}

// Function to retrieve and display total number of students for a specific classroomId
function displayTotalStudentCount(classroomId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("No user is currently signed in.");
        return;
    }
    const userId = user.uid;

    // Query to count students based on classroomId and createdBy (for security)
    studentFormDB.where("createdBy", "==", userId)
        .where("classroomId", "==", classroomId)
        .get()
        .then((snapshot) => {
            const studentCount = snapshot.size;
            const studentText = studentCount === 1 ? 'Student' : 'Students';

            // Display the count in the desired element
            const studentCountElement = document.getElementById("totalStudentCount");
            if (studentCountElement) {
                studentCountElement.innerText = `${studentCount} ${studentText} >`;
            }
        })
        .catch((error) => {
            console.error("Error counting students: ", error);
        });
}


