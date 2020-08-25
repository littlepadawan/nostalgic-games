import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

/*
 * Fetches leaderboard and returns a promise holding an array of our score objects
 * game is either "memory, "snake" or "minesweeper"
 * orderBy  is an array of sorting instructions, e.g. for snake [["score", "desc"],["timesMs", "asc"]]
 */
export function fetchLeaderboard(game, orderBy) {
  console.log("Fetching leaderboard");

  const auth = firebase.auth();
  const db = firebase.firestore();

  return auth
    .signInAnonymously()
    .then(() => {
      let query = db.collection(game);
      orderBy.forEach((rule) => {
        // Unwrap array and send content as array to the function
        query = query.orderBy(...rule);
      });
      // Return top 10 from database
      return query.limit(10).get();
    })
    .then((querySnapshot) => {
      let leaderboard = [];
      querySnapshot.forEach((doc) => {
        leaderboard.push(doc.data());
      });
      // Return content of top 10 from database as an array
      return leaderboard;
    })
    .catch(function (error) {
      console.log("Error getting leaderboard: ", error);
    });
}

/*
 * Save score to database
 * Returns a promise for saving the score
 */
export function saveScore(game, score) {
  const auth = firebase.auth();
  const db = firebase.firestore();

  return auth
    .signInAnonymously()
    .then(() => db.collection(game).add(score))
    .catch(function (error) {
      console.log("Error saving score: ", error);
    });
}

// Present time as minutes and seconds
export function prettifyTime(timeMs) {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;

  if (minutes) {
    return `${minutes} min ${seconds} sec`;
  } else {
    return `${seconds} sec`;
  }
}
