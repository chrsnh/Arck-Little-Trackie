// Event listener for creating a classroom
document.getElementById("openClassroomForm").addEventListener("click", function() {
    document.getElementById("classroomForm").classList.add("show");
    document.getElementById("overlay").classList.add("show");
});

// Event listener to close the classroom form
document.getElementById("closeClassroomForm").addEventListener("click", function() {
    document.getElementById("classroomForm").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
});

// Event listener for adding a student
document.querySelectorAll(".add-student-btn").forEach(button => {
    button.addEventListener("click", function(event) {
        event.stopPropagation(); 
        document.getElementById("studentForm").classList.add("show");
        document.getElementById("overlay").classList.add("show");
    });
});

// Event listener to close the student form
document.getElementById("closeStudentForm").addEventListener("click", function() {
    document.getElementById("studentForm").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
});

// Hide any open forms and overlay if user clicks outside the form
document.getElementById("overlay").addEventListener("click", function() {
    document.getElementById("classroomForm").classList.remove("show");
    document.getElementById("studentForm").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
});

document.getElementById('studentIDNumber').addEventListener('input', function (e) {
    // Remove non-numeric characters
    this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('studentPhoneNumber').addEventListener('input', function (e) {
    // Remove non-numeric characters
    this.value = this.value.replace(/[^0-9]/g, '');
});


// Adding Classrooms and Students to Database
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
const classroomFormDB = db.collection("Classrooms");
const studentFormDB = db.collection("Students");


// Handle form submission for adding a classroom 
document.getElementById('classroomAddForm').addEventListener('submit', submitClassroomForm);

function submitClassroomForm(e) {
    e.preventDefault();

    // Get input values from the form fields
    const preSchool = document.getElementById('preSchool').value;
    const sectionName = document.getElementById('sectionName').value;
    const schedule = document.getElementById('schedule').value;

    // Check if all fields are filled out
    if(preSchool && sectionName && schedule) {
        saveMessages(preSchool, sectionName, schedule);
    } else {
        alert("Please fill out all fields!");
    }
}

function formatTime(timeStr) {
    if (!timeStr) return '';
    let [hours, minutes] = timeStr.split(':');
    hours = parseInt(hours);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  function updateSchedule() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    if (startTime && endTime) {
      const formattedStart = formatTime(startTime);
      const formattedEnd = formatTime(endTime);
      document.getElementById('schedule').value = `${formattedStart} - ${formattedEnd}`;
    } else {
      document.getElementById('schedule').value = '';
    }
}


// Save classroom data to the Firestore database
const saveMessages = (preSchool, sectionName, schedule) => {
    const user = firebase.auth(). currentUser;
    if (!user) {
        alert("No user is currently signed in.");
        return;
    }
    const userId = user.uid;

    classroomFormDB.add({
        preSchool: preSchool,
        sectionName: sectionName,
        schedule: schedule,
        createdBy: userId
    })
    .then (() => {
    // Show notification
    const notification = document.getElementById('add-classroom-notification');
    notification.classList.add('show');

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);

        document.getElementById('classroomForm').classList.remove("show");
        document.getElementById("overlay").classList.remove("show");
        document.getElementById('classroomAddForm').reset();
        displayClassrooms();
    })
    .catch ((error) => {
        alert("Error adding classroom. Please try again.");   // Show an error message if adding fails
    });  
};


// Display the list of classrooms
function displayClassrooms() {
    const container = document.getElementById('classroomList');
    container.innerHTML = '';
    console.log('Displaying classroos...');

    const user = firebase.auth( ).currentUser;
    if (!user) {
        alert("No user is currently signed in.");
        return;
    }
    const userId = user.uid;

// Fetch all classroom documents from Firestore
    classroomFormDB.where('createdBy', '==', userId).get()
    .then((snapshot) => {
        console.log('Snapshot:', snapshot);
        if (snapshot.empty) {                   // Check if there are any classrooms
            console.log('No matching document.');
            container.innerHTML = '<p class="no-student-message">No classrooms found.</p>';
        }
        snapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;
            console.log('Document data:', data);

            const classroomElement = document.createElement('div');
            classroomElement.className = 'red-BG-Board';

// Set wallpaper based on the preSchool value
            let wallpaperSrc = '';
            if (data.preSchool === 'Nursery 1'){
                wallpaperSrc = '/assets/greenwallpaper.png';
            } else if (data.preSchool === 'Nursery 2') {
                wallpaperSrc = '/assets/bluewallpaper.png';
            } else if (data.preSchool === 'Kinder') {
                wallpaperSrc = '/assets/pinkwallpaper.png';
            }

        // Set the inner HTML
        classroomElement.innerHTML = `
        <img class="pinkwall" src="${wallpaperSrc}">
        <p class="class-textTop"><strong>Level:</strong> ${data.preSchool}</p>
        <p class="class-text"><strong>Section:</strong> ${data.sectionName}</p>
        <p class="class-textLast"><strong>Schedule:</strong> ${data.schedule}</p>
        `;

        // Add delete button and add-student button, and prevent propagation on click
        const addStudent = document.createElement('button');
        addStudent.className = 'add-student-btn';
        addStudent.innerHTML = `<img src="/assets/add-user.png" alt="AddStudent" />`;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.innerHTML = `<img src="/assets/DeleteBtn.png" alt="Delete" />`;

        // Stop navigation to classlist.html if delete button or add-student button is clicked
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click from bubbling to classroomElement
            deleteClassroom(docId);
        });

        // Add event listener for Add Student button
        addStudent.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click from bubbling to classroomElement
            document.getElementById("studentForm").classList.add("show"); // Show student form
            document.getElementById("overlay").classList.add("show"); // Show overlay

            // Set the classroom ID in the hidden input field of the student form
            document.getElementById('studentClassroomId').value = docId;
        });

        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container'; // Add CSS class for styling if needed
        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(addStudent);

        classroomElement.appendChild(buttonContainer);


        // Add event listener to navigate to classlist.html on click of the classroom element
        classroomElement.addEventListener('click', () => {
            window.location.href = `/CLASSLIST/classList.html?classroomId=${docId}`;
        });

        container.appendChild(classroomElement);    
        });
    }). catch((error) => {
        console.log("Error fetching classrooms:", error);
    });
}

// Display classrooms when the page loads
window.onload = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            displayClassrooms();
        }
    })
};

function deleteClassroom(id) {
    console.log("Deleting document with ID:", id); // Debugging log

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
        classroomFormDB.doc(id).delete().then(() => {
            // Show notification
            const notification = document.getElementById('delete-classroom-notification');
            notification.classList.add('show');

            // Hide notification after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);

            displayClassrooms(); // Refresh the classroom list
        }).catch((error) => {
            console.error("Error removing classroom:", error);
            alert("Error removing classroom. Please try again.");
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
    e.preventDefault();

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
        saveStudent (sFirstName, sLastName, sAge, sDateOfBirth, sIDNumber, sAddress, sGender, sParentOrGuardian, sEmail, sPhoneNumber, sRelationship);
    } else {
        alert ("Please fiil out all fields!");
    }
}

// Save student data to the Firestore Database
const saveStudent = (sFirstName, sLastName, sAge, sDateOfBirth, sIDNumber, sAddress, sGender, sParentOrGuardian, sEmail, sPhoneNumber, sRelationship) => {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("No user is currently signed in.");
        return;
    }
    const userId = user.uid;

    const classroomID = document.getElementById('studentClassroomId').value;

    studentFormDB.add ({
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
        classroomId: classroomID
    })
    .then (() => {
        // Show notification
        const notification = document.getElementById('add-student-notification');
        notification.classList.add('show');

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);

        document.getElementById('studentForm').classList.remove("show");
        document.getElementById("overlay").classList.remove("show");
        document.getElementById('studentAddForm').reset();
    })
    .catch ((error) => {
        alert ("Error adding student. Please try again.");
    });
};