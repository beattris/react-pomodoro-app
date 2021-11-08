import React, {useState, useRef} from "react";
import "./App.css";
import AlarmStart from "./audio/AlarmStart.mp3";
import AlarmUp from "./audio/AlarmUp.mp3";
import {Howl} from "howler";

// the padStart is used to add an additional 0 to the front of the timer number
function padTime(time){
  return time.toString().padStart(2, '0');
}

function App() {
  const [title, setTitle] = useState('Let the countdown begin!!');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const soundPlay = (src) => {
    const sound = new Howl({
      src,
      autoplay: true,
      loop: true,
      volume: 0.5,
      id: Math.random()
    })
    sound.play();
  }

  function startTimer() {
    // this prevents the interval incrementing when start is hit more than once
    if (intervalRef.current !== null) return;
    setTitle('Your time began!');
    setIsRunning(true);
    soundPlay(AlarmStart);
    /* creating an interval with useRef, makes it have the same value with when u want to clear the interval; it kind-of
      creates a link to that interval. To use useRef, you have to store it into .current
      */
    intervalRef.current = setInterval(() => {
      setTimeLeft(timeLeft => {
        // if statements are used to prevent the timer from
        // counting in -1 once it reaches 1
        if(timeLeft >= 1) return timeLeft - 1;
        // makes the timer to begin at 25mins after it's elapsed
        resetTimer(); 
        // this makes the timer to return 0 after reaching 1
        return 0;
      });
    }, 1000);
  }

  function stopTimer() {
    // this prevents the interval incrementing when stop is hit more than once
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTitle('Timer Stopped');
    setIsRunning(false);
    // soundPlay(AlarmUp);
  }

  function resetTimer(){
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setTitle(`timer's reset`);
  }

  const minutes = padTime(Math.floor(timeLeft / 60)); 
  const seconds = padTime(timeLeft - minutes * 60);

  return (
    <div className="app">
      <h2>{title}</h2>

      <div className="timer">
        <span>{minutes}</span>
        <span>:</span>
        <span>{seconds}</span>
      </div>

      <div className="buttons">
        {!isRunning && <button onClick={startTimer}>Start</button>}
        {isRunning && <button onClick={stopTimer}>Stop</button>}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default App;
