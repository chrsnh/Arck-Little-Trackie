// Event listeners for input fields to remove non-numeric characters
document.getElementById('studentIDNumber').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
});

document.getElementById('studentPhoneNumber').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
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

// Firestore references
const db = firebase.firestore();
const studentFormDB = db.collection("Students");
const classroomFormDB = db.collection("Classrooms");

function isValidEmail(email) {
    // Basic check for email format (contains '@')
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Global variable for tracking edit mode
let editingStudentId = null;

// Toggle menu visibility
function toggleMenu(event) {
    event.stopPropagation();
    const menuOptions = event.target.closest('.menu').querySelector('.menu-options');
    const isVisible = menuOptions.style.display === 'block';
    document.querySelectorAll('.menu-options').forEach(menu => menu.style.display = 'none'); // Hide other menus
    menuOptions.style.display = isVisible ? 'none' : 'block';
}

// Close all menus when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.menu-options').forEach(menu => menu.style.display = 'none');
});

// Display students based on classroomId
function displayStudents(classroomId) {
    const container = document.getElementById("studentList");
    container.innerHTML = '';  // Clear existing students

    const user = firebase.auth().currentUser;
    if (!user) {
        alert("No user is currently signed in.");
        return;
    }
    const userId = user.uid;

    // Set up Firestore real-time listener
    studentFormDB.where("createdBy", "==", userId)
        .where("classroomId", "==", classroomId)
        .onSnapshot((snapshot) => {
            container.innerHTML = ''; // Clear the container before rendering updated list

            if (snapshot.empty) {
                container.innerHTML = '<p class="no-student-message">No students found.</p>';
                return;
            }

            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => a.sFirstName.localeCompare(b.sFirstName));

            students.forEach((student) => {
                const studentElement = createStudentElement(student);
                container.appendChild(studentElement);
            });
        }, (error) => {
            console.error("Error fetching students: ", error);
        });
}

// Create student card element
function createStudentElement(student) {
    const studentElement = document.createElement('div');
    studentElement.className = 'student-card';

    studentElement.innerHTML = `
        <div class="student-card">
            <div class="icon"></div>
            <p class="student-name">${student.sFirstName} ${student.sLastName}</p>
            <div class="menu">
                <button class="menu-button" onclick="toggleMenu(event)">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </button>
                <div class="menu-options" style="display: none;">
                    <button class="remove-btn">Remove</button>
                    <button class="edit-btn" onclick="editStudent('${student.id}')">Edit</button>
                </div>
            </div>
        </div>
    `;

    // View student profile
    studentElement.addEventListener('click', () => {
        window.location.href = `studentProfile.html?studentId=${student.id}`;
    });

    // Remove student
    const removeButton = studentElement.querySelector('.remove-btn');
    removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        removeStudent(student.id);
    });

    // Edit student
    const editButton = studentElement.querySelector('.edit-btn');
    editButton.addEventListener('click', (event) => {
        event.stopPropagation();
        editStudent(student.id);
    });

    return studentElement;
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

// Remove student and confirm deletion
function removeStudent(studentId) {
    const confirmModal = document.getElementById('custom-confirm');
    confirmModal.style.display = 'flex';

    const confirmButton = document.getElementById('confirm-delete');
    const cancelButton = document.getElementById('cancel-delete');

    confirmButton.onclick = () => {
        confirmModal.style.display = 'none';

        // Delete student from Firestore
        studentFormDB.doc(studentId).delete()
            .then(() => {
                // Find the student element in the DOM and remove it
                const studentElement = document.getElementById(studentId);
                if (studentElement) {
                    studentElement.remove(); // Remove the student element from the DOM
                }
            })
            .catch((error) => {
                console.error("Error removing student:", error);
                alert("Error removing student. Please try again.");
            });
    };

    cancelButton.onclick = () => {
        confirmModal.style.display = 'none';
    };
}

// Edit student details
function editStudent(studentId) {
    const confirmModal = document.getElementById('edit-student-confirm');
    confirmModal.style.display = 'flex';

    const confirmButton = document.getElementById('edit-confirm-yes');
    const cancelButton = document.getElementById('edit-confirm-no');

    // Prevent the modal from closing when clicking inside it
    confirmModal.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent click from closing the modal
    });

    // Handle 'Yes' click to confirm editing the student
    confirmButton.onclick = () => {
        confirmModal.style.display = 'none'; // Close the modal

        studentFormDB.doc(studentId).get()
            .then((doc) => {
                if (doc.exists) {
                    const studentData = doc.data();
                    editingStudentId = studentId; // Set the ID of the student being edited

                    // Show the form and overlay
                    document.getElementById("studentForm").style.display = "block";
                    document.getElementById("overlay").style.display = "block";

                    // Populate the form with the student's current data
                    document.getElementById("studentFirstName").value = studentData.sFirstName;
                    document.getElementById("studentLastName").value = studentData.sLastName;
                    document.getElementById("studentAge").value = studentData.sAge;
                    document.getElementById("studentDateOfBirth").value = studentData.sDateOfBirth;
                    document.getElementById("studentIDNumber").value = studentData.sIDNumber;
                    document.getElementById("studentAddress").value = studentData.sAddress;
                    document.getElementById("studentParentOrGuardian").value = studentData.sParentOrGuardian;
                    document.getElementById("studentEmail").value = studentData.sEmail;
                    document.getElementById("studentPhoneNumber").value = studentData.sPhoneNumber;
                    document.getElementById("studentRelationship").value = studentData.sRelationship;
                    document.querySelector(`input[name="gender"][value="${studentData.sGender}"]`).checked = true;

                    // Update form action for saving updated data
                    document.getElementById("studentAddForm").onsubmit = (event) => {
                        event.preventDefault(); // Prevent form submission
                        saveUpdatedStudent(studentId); // Save the updated student details
                    };
                } else {
                    alert("Student not found.");
                }
            })
            .catch((error) => {
                console.error("Error editing student:", error);
            });
    };

    // Handle 'No' click to cancel editing the student
    cancelButton.onclick = () => {
        confirmModal.style.display = 'none'; // Close the modal if the user cancels
    };
}

// Save updated student data
function saveUpdatedStudent(studentId) {
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

    // Check if the email is valid
    if (!isValidEmail(sEmail)) {
        // Show notification
        const notification = document.getElementById('email-student-notification');
        notification.classList.add('show');

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
        return; // Prevent form submission if email is invalid
    }

    if (sFirstName && sLastName && sAge && sDateOfBirth && sIDNumber && sAddress && sGender && sParentOrGuardian && sEmail && sPhoneNumber && sRelationship) {
        studentFormDB.doc(studentId).update({
            sFirstName, sLastName, sAge, sDateOfBirth, sIDNumber, sAddress, sGender, sParentOrGuardian, sEmail, sPhoneNumber, sRelationship
        })
        .then(() => {
            console.log('Student updated successfully');

            // Dynamically update the student list after edit
            const classroomId = new URLSearchParams(window.location.search).get('classroomId');
            displayStudents(classroomId);

            // Show notification
            const notification = document.getElementById('update-student-notification');
            notification.classList.add('show');
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);

            clearStudentForm(); // Clear the form
            editingStudentId = null; // Clear editing state
        })
            .catch((error) => {
                console.error("Error updating student: ", error);
            });
    } else {
        alert("Please fill out all fields!");
    }
}

// Modify form submission logic for adding or updating students
document.getElementById("studentAddForm").onsubmit = function (event) {
    event.preventDefault();

    if (editingStudentId) {
        saveUpdatedStudent(editingStudentId); // Save edited student data
    } else {
        addStudent();
    }
};


function addStudent() {

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

    // Check if the email is valid before proceeding
    if (!isValidEmail(sEmail)) {
        // Show notification
        const notification = document.getElementById('email-student-notification');
        notification.classList.add('show');

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
        return; // Stop further execution if email is invalid
    }

    // If the email is valid, show the confirmation modal
    const confirmModal = document.getElementById('student-confirm');
    confirmModal.style.display = 'flex';

    const confirmButton = document.getElementById('student-confirm-yes');
    const cancelButton = document.getElementById('student-confirm-no');

    // Prevent the modal from closing when clicking inside it
    confirmModal.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent click from closing the modal
    });

    // Handle 'Yes' click to confirm adding the student
    confirmButton.onclick = () => {
        confirmModal.style.display = 'none'; // Close the modal

        if (sFirstName && sLastName) {
            const user = firebase.auth().currentUser;
            if (!user) {
                alert("Please sign in first!");
                return;
            }

            const userId = user.uid;
            const classroomId = new URLSearchParams(window.location.search).get('classroomId');

            studentFormDB.add({
                sFirstName, sLastName, sAge, sDateOfBirth, sIDNumber, sAddress, sGender, sParentOrGuardian, sEmail, sPhoneNumber, sRelationship,
                createdBy: userId, classroomId: classroomId
            })
            .then(() => {
                console.log('Student added successfully');

                // Dynamically update the student list
                displayStudents(classroomId);

                // Update the student count
                displayTotalStudentCount(classroomId);

                // Show notification
                const notification = document.getElementById('add-student-notification');
                notification.classList.add('show');
            
                // Hide notification after 3 seconds
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);

                clearStudentForm(); // Clear the form
            })
            .catch((error) => {
                console.error("Error adding student: ", error);
            });
        } else {
            alert("Please fill out all fields!");
        }
    };

    // Handle 'No' click to cancel
    cancelButton.onclick = () => {
        confirmModal.style.display = 'none'; // Close the modal
    };
}



// Clear form after submission
function clearStudentForm() {
    document.getElementById('studentAddForm').reset();
    document.getElementById('studentForm').style.display = "none";
    document.getElementById('overlay').style.display = "none";
}

// Classroom details retrieval
function retrieveClassroomDetails(classroomId) {
    classroomFormDB.doc(classroomId).get()
        .then(doc => {
            if (doc.exists) {
                const classroomData = doc.data();
                document.getElementById("classroomName").innerText = classroomData.name;
                document.getElementById("classroomTeacher").innerText = classroomData.teacher;
            } else {
                console.log("Classroom not found.");
            }
        })
        .catch(error => {
            console.error("Error fetching classroom details: ", error);
        });
}

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

function displayTotalStudentCount(classroomId) {
    const user = firebase.auth().currentUser;

    // Ensure the user is signed in
    if (!user) {
        alert("No user is currently signed in.");
        return;
    }

    const userId = user.uid;

    // Use Firestore real-time listener to track changes
    studentFormDB
        .where("createdBy", "==", userId)
        .where("classroomId", "==", classroomId)
        .onSnapshot((snapshot) => {
            const studentCount = snapshot.size; // Get the real-time number of documents
            const studentText = studentCount === 1 ? 'Student' : 'Students';

            // Locate the element and update its text
            const studentCountElement = document.getElementById("totalStudentCount");
            if (studentCountElement) {
                studentCountElement.innerText = `${studentCount} ${studentText} >`;
            } else {
                console.warn("Element with ID 'totalStudentCount' not found.");
            }
        }, (error) => {
            console.error("Error listening to real-time updates: ", error);
        });
}