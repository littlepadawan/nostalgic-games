import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  // Your web app's Firebase configuration
  apiKey: "AIzaSyCscXyE4f3vDr1DhS6dnor00GMCYAuw8vQ",
  authDomain: "nostalgic-games.firebaseapp.com",
  databaseURL: "https://nostalgic-games.firebaseio.com",
  projectId: "nostalgic-games",
  storageBucket: "nostalgic-games.appspot.com",
  messagingSenderId: "575235290051",
  appId: "1:575235290051:web:89b88811f1bbb2d3004376",
  measurementId: "G-E55MEP3V2K",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById("app"));
