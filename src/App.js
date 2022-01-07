import './App.css';

import React, { useState, useRef } from 'react'

function Break(props) {
  return (
    <div className='text-center'>
      <h3 id='break-label'>Descanso</h3>
      <div className='counter grid grid-cols-3'>
        <div><span id='break-decrement' onClick={() => props.action('down')}><i className="fas fa-arrow-circle-down"></i></span></div>
        <div><span id='break-length'>{props.length}</span></div>
        <div><span id='break-increment' onClick={() => props.action('up')}><i className="fas fa-arrow-circle-up"></i></span></div>
      </div>
    </div>
  )
}

function Session(props) {
  return (
    <div className='text-center'>
      <h3 id='session-label'>Sesión</h3>
      <div className='counter grid grid-cols-3'>
        <div><span id='session-decrement' onClick={ ()=> props.action('down')}><i className="fas fa-arrow-circle-down"></i></span></div>
        <div><span id='session-length'>{props.length}</span></div>
        <div><span id='session-increment' onClick={ ()=> props.action('up')}><i className="fas fa-arrow-circle-up"></i></span></div>
      </div>
    </div>
  )
}

function Timer(props) {
  return (
    <div className='timer text-center my-5 mx-auto'>
      <h3 id='timer-label'>{props.title}</h3>
      <div className='time-left'>
        <span id='time-left'>{props.timer}</span>
      </div>
    </div>
  )
}

function PlayStop(props) {
  return (
    <div>
      <button id='start_stop' className='btn py-2 px-4 rounded' onClick={props.action}><i className="fas fa-play"></i> <i className="fas fa-pause"></i></button>
    </div>
  )
}

function Reset(props) {
  return (
    <div>
      <button id='reset' className='btn py-2 px-4 rounded' onClick={props.action}><i className="fas fa-redo-alt"></i></button>
    </div>
  )
}

/* usando hooks: https://es.reactjs.org/docs/hooks-state.html */

function App() {
  const beep = useRef(null); // useRef alternative to ID
  const converToMiliseconds = (minutes) => minutes * 60 * 1000
  const [mode, setMode] = useState('session')
  const [breakCount, setBreakCount] = useState(5)
  const [sessionCount, setSessionCount] = useState(25)
  const [mainMiliseconds, setMainMiliseconds] = useState(converToMiliseconds(25));
  const [intervalId, setIntervalId] = useState(0);

  // increment/decrement break time
  const breakUpDown = (method) => {
    if (method === 'up'){
      if(breakCount < 60) setBreakCount(breakCount + 1)
    }
    else{
      if (breakCount > 1) setBreakCount(breakCount - 1)
    }
  }

  // increment/decrement session time
  const sessionUpDown = (method) => {
    if (method === 'up') {
      if (sessionCount < 60) {
        setSessionCount(sessionCount + 1)
        setMainMiliseconds(converToMiliseconds(sessionCount+1))
      }
    }
    else{
      if (sessionCount > 1) {
        setSessionCount(sessionCount - 1)
        setMainMiliseconds(converToMiliseconds(sessionCount-1))
      }
    }
  }

  // play/stop countdown timer
  const play = () => { 

    //https://sebhastian.com/setinterval-react/
    // si existe un intervalo, lo detenemos
    if(intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
      return;
    }
    
    // empezamos el intervalo
    const newIntervalId = setInterval( () =>{
      if(mainMiliseconds > 0) setMainMiliseconds( mainMiliseconds => mainMiliseconds - 1000 )
    }, 1000)
    
    // reasignamos intervalo
    setIntervalId(newIntervalId);
  }

  // convert miliseconds to mm:ss
  const convertToTimer = (miliseconds) => {
    checkTimerFinish ();

    let allSeconds = miliseconds / 1000
    let minutes = Math.trunc(allSeconds / 60)
    let seconds = allSeconds - (minutes * 60)

    return minutes.toString().padStart(2, '0') +':'+seconds.toString().padStart(2, '0')
  }

  // check time Finish
  const checkTimerFinish = () => {
    if(mainMiliseconds === 0) playSound();
    if(mainMiliseconds === -1000){
      
      if(mode === 'session'){
        setMainMiliseconds( converToMiliseconds(breakCount) );
        setMode('break')
      }
      else if(mode === 'break'){
        setMainMiliseconds( converToMiliseconds(sessionCount) );
        setMode('session')
      }
    }
  }

  // reset initial values
  const reset = () =>{
    setBreakCount(5)
    setSessionCount(25)
    setMainMiliseconds(converToMiliseconds(25))
    setMode('session')
    beep.current.pause(); // acceder a useRef con current
    beep.current.currentTime = 0
    if(intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
    }
  }

  // play sound
  const playSound = () => {
    beep.current.play(); // acceder a useRef con current
  }

  return (
    <div className='container mx-auto'>
      <div className='clock my-6 mx-auto'>

        <div className='title'>
          <h1 className="text-3xl font-bold text-center my-5"><i className="far fa-clock"></i> 25+5 Clock</h1>
        </div>

        <div className='counters grid gap-4 grid-cols-2 mx-auto'>
          <Break length={breakCount} action={breakUpDown} />
          <Session length={sessionCount} action={sessionUpDown} />
        </div>

        <Timer timer={convertToTimer(mainMiliseconds)} title={mode==='session' ? 'Session' : 'Break'} />

        <div className='grid grid-cols-2 text-center'>
          <PlayStop action={play} />
          <Reset action={reset} />
        </div>

        <audio id="beep" ref={beep} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
      </div>
    </div>
  );
}

export default App;
