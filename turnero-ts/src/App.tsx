import React, { useState } from 'react';
import './App.css';
import TurneroInicio from './components/TurneroInicio';
import logo from './assets/guaymallen5.png';

function App() {
  const [resetKey, setResetKey] = useState(0);

  const handleDniIngresado = (dni: string | null) => {
    // No hacer nada aquí, dejar que TurneroInicio maneje todo
    if (dni === null) {
      setResetKey(prev => prev + 1);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <img src={logo} alt="Logo Guaymallén" className="logo" />
      </header>
      
      <TurneroInicio key={resetKey} onDniIngresado={handleDniIngresado} />
    </div>
  );
}

export default App;