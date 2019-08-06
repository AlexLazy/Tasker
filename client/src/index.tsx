import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

let arr = [3, 2, 5, 6, 8, 1, 21];
// debugger;
function bubbleSortConcept1(arr: Number[]) {
  for (let j = 0; j < arr.length; j++) {
    for (let i = 0; i < arr.length - j; i++) {
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
      }
    }
  }
}
bubbleSortConcept1(arr);
console.log(arr);
