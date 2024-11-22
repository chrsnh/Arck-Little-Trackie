import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider,  signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyAV7L0ZetJ0PzfExRLm71hrr9NBa_UHKbY",
    authDomain: "arck-co-little-trackie.firebaseapp.com",
    projectId: "arck-co-little-trackie",
    storageBucket: "arck-co-little-trackie.appspot.com",
    messagingSenderId: "786902861892",
    appId: "1:786902861892:web:5a7e98db05c43f6e7cd411"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.language = 'en';
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

function showMessage(message, divId) {
    console.log(`Message: ${message}, DivId: ${divId}`); // Debugging output
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}


// SIGN UP
const signUp=document.getElementById('submitSignUp');
signUp.addEventListener('click', (event)=> {
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstname=document.getElementById('fName').value;
    const lastname=document.getElementById('lName').value;

    // Check if all fields are filled
    if (!email || !password || !firstname || !lastname) {
        showMessage('Please fill in all the required fields.', 'signUpMessage');
        return; // Stop if fields are not filled
    }

    // Check if the email ends with @gbox.adnu.edu.ph
    if (!email.endsWith('@gbox.adnu.edu.ph')) {
        showMessage('Only ADNU Gbox accounts are allowed for sign up.', 'signUpMessage');
        return; // Stop the signup process if the email is not valid
    }
    

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
            email: email,
            firstname: firstname,
            lastname: lastname
        };
        showMessage('Account Created Successfully!', 'signUpMessageSuccess');
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href='index.html';
        })
        .catch ((error) => {
            console.error("error writing document", error);
        });
    })
    .catch ((error) => {
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use') {
            showMessage('Email Address Already Exists !!!', 'signUpMessage');
        }
        else 
        {
            showMessage('Password should be at least 8 characters', 'signUpMessage');
        }
    })
});

// SIGN IN
const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email=document.getElementById('Email').value;
    const password=document.getElementById('Password').value;

    // Check if all fields are filled
    if (!email || !password) {
        showMessage('Please fill in all the required fields.', 'signInMessage');
        return; // Stop if fields are not filled
    }

    // Check if the email ends with @gbox.adnu.edu.ph
    if (!email.endsWith('@gbox.adnu.edu.ph')) {
        showMessage('Only ADNU Gbox accounts are allowed.', 'signInMessage');
        return; // Stop the sign-in process if the email is not valid
    }

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('login is successful!', 'signInMessageSuccess');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='/HOMEPAGE/homePage.html';
    })
    .catch((error) => {
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password!', 'signInMessage');
        }
        else
        {
            showMessage('Account does not Exist!', 'signInMessage');
        }
    });
});

// SIGN IN WITH GBOX
const googlelogin = document.getElementById('signInWithGbox');
googlelogin.addEventListener('click', function() {
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        const userEmail = user.email;

        // Check if the email ends with @gbox.adnu.edu.ph
        if (userEmail.endsWith('@gbox.adnu.edu.ph')) {
            console.log('Authorized user:', user);
            window.location.href = '/HOMEPAGE/homePage.html'; // Allow access to the homepage
        } else {
            console.error('Unauthorized user:', userEmail);
            alert('Only ADNU Gbox accounts are allowed.');
            // Optionally, sign the user out
            auth.signOut();
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error ${errorCode}: ${errorMessage}`);
    });
});

// Toggle Password Visibility
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('rPassword');

togglePassword.addEventListener('click', function() {
    // Toggle the input type between 'password' and 'text'
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // Toggle the eye icon between open and closed
    if (passwordField.type === 'password') {
        // When password is hidden, show the closed eye icon
        this.querySelector('i').classList.remove('fa-eye-slash');
        this.querySelector('i').classList.add('fa-eye');
    } else {
        // When password is visible, show the open eye icon
        this.querySelector('i').classList.remove('fa-eye');
        this.querySelector('i').classList.add('fa-eye-slash');
    }
});


// Toggle Password Visibility
const togglePasswordSignin = document.getElementById('togglePassword-signin');
const passwordFieldSignin = document.getElementById('Password');

togglePasswordSignin.addEventListener('click', function() {
    // Toggle the input type between 'password' and 'text'
    const type = passwordFieldSignin.type === 'password' ? 'text' : 'password';
    passwordFieldSignin.type = type;

    // Toggle the eye icon between open and closed
    if (passwordFieldSignin.type === 'password') {
        // When password is hidden, show the closed eye icon
        this.querySelector('i').classList.remove('fa-eye-slash');
        this.querySelector('i').classList.add('fa-eye');
    } else {
        // When password is visible, show the open eye icon
        this.querySelector('i').classList.remove('fa-eye');
        this.querySelector('i').classList.add('fa-eye-slash');
    }
});

