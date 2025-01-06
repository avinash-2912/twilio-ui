import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css";
import Phone from "./Phone";
import DeviceCall from './DeviceCall';

const App = () => {
  const [token, setToken] = useState(null);
  const [clicked, setClicked] = useState(false);
  const identity = "phil";

  const handleClick = () => {
    setClicked(true);
    fetch(`https://twiliobackend-zjoe.onrender.com/voice/token?identity=${encodeURIComponent(identity)}`)
      .then(response=> response.json())
      .then(({ token }) => setToken(token));
  };

  return (
    <BrowserRouter>
      <div className="app">
        <header className="App-header">
          <h1>React &amp; Twilio Phone</h1>
        </header>

        <main>
          {!clicked && <button onClick={handleClick}>Connect to Phone</button>}

          {token ? (
            <Routes>
              <Route path="/" element={<Phone token={token} />} />
              <Route path="/:deviceId" element={<DeviceCall token={token} />} />
            </Routes>
          ) : (
            <p>Loading...</p>
          )}
        </main>

        <footer>
          <p>
            Built on Twitch by <a href="https://twitch.tv/phil_nash">phil_nash</a>
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;