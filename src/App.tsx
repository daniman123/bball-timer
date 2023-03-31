import React, { useState } from 'react';
import Timer from './components/Timer';
import './App.css';

function App() {
  const [timeUp, setTimeUp] = useState(false);

  return (
    <div className="App">
      <Timer setTimeUp={() => setTimeUp(true)} />
      {timeUp && <p>Time is up!</p>}
    </div>
  );
}

export default App;
