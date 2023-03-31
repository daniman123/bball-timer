import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Howl } from 'howler';



interface TimerProps {
  setTimeUp: () => void;
}

const TIMER_INITIAL_TIME = 120;
const MAX_ROUNDS = 17;
const WARNING_TIME = 100;
const SWITCH_HANDS_TIME = 90;


const Timer: React.FC<TimerProps> = ({ setTimeUp }) => {
  const [time, setTime] = useState(TIMER_INITIAL_TIME);
  const [state, setState] = useState<{ currentHand: "right" | "left", round: number }>({
    currentHand: "right",
    round: 1,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);


  const audioFiles = useMemo(() => [
    new Howl({ src: [process.env.PUBLIC_URL+'/sfx/Discord Stream Start - sound effect.mp3'] }),
    new Howl({ src: [process.env.PUBLIC_URL+'/sfx/10 Seconds Left Female Voiceline Valorant Gaming Sound Effect HD.mp3'] }),
    new Howl({ src: [process.env.PUBLIC_URL+'/sfx/Right - Sound Effect.mp3'] }),
    new Howl({ src: [process.env.PUBLIC_URL+'/sfx/Left - Sound Effect.mp3'] }),
    new Howl({ src: [process.env.PUBLIC_URL+'/sfx/_Time Over!_ Sound Effect.mp3'] }),
    new Howl({ src: [process.env.PUBLIC_URL+'/sfx/GTA ( mission complete ) sound effect.mp3'] }),
  ], []);

  useEffect(() => {
    if (state.round === MAX_ROUNDS) {
      audioFiles[audioFiles.length - 1].play();
      setTimeUp();
      return;
    }

    if (time === WARNING_TIME) {
      audioFiles[1].play();
    }

    if (time === SWITCH_HANDS_TIME) {
      audioFiles[state.currentHand === 'right' ? 2 : 3].play();
    }

    if (time === 0) {
      audioFiles[4].play();
      setState((prevState) => ({ ...prevState, round: prevState.round + 1, currentHand: prevState.currentHand === 'right' ? 'left' : 'right' }));
      setTime(TIMER_INITIAL_TIME);
    }

  }, [time, state.round, state.currentHand, audioFiles, setTimeUp]);

  const startTimer = () => {
    if (intervalRef.current !== null) return;
    const newAudioContext = new AudioContext();
    newAudioContext.resume();
    console.log("ssssssssss")

    audioFiles[0].play();
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);
  };
  
  const stopTimer = () => {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };
  
  const resetTimer = () => {
    stopTimer();
    setState({ ...state, round: 1, currentHand:'right' });
    setTime(TIMER_INITIAL_TIME);
  };
  

  return (
  <div className="timer-container">
    <div className='Round'>Round: {state.round}</div>
    <div  className='Hand'>Hand: {state.currentHand}</div>
    <div className="timer-display">Time: {`${Math.floor(time / 60)
        .toString()
        .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`}</div>
    <div className="timer-buttons">
      <button className="timer-button" onClick={startTimer}>Start</button>
      <button className="timer-button" onClick={stopTimer}>Pause</button>
      <button className="timer-button" onClick={resetTimer}>Reset</button>
    </div>
  </div>
  );
};

export default Timer;



