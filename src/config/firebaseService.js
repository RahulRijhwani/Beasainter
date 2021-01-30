import firebase, { Firebase } from "react-native-firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA_vB3rDhE-lcGrkF79mQ6VvA4BQO7prnA",
  authDomain: "",
  databaseURL: "",
  projectId: "quickyfly",
  storageBucket: "",
  messagingSenderId: "446740218885"
};

let instance = null;

class FirebaseService {
  constructor() {
    if (!instance) {
      this.app = firebase.initializeApp(firebaseConfig);
      instance = this;
    }
    return instance;
  }
}

const firebaseService = new FirebaseService().app;
export default firebaseService;