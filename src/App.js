import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import SearchForm from './components/SearchForm';
import './App.css';

function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LfvEawrAAAAAHnO--MtAuiErMDAsHMTxCyzlc8c">
      <div className="App">
        <main>
          <SearchForm />
        </main>
      </div>
    </GoogleReCaptchaProvider>
  );
}

export default App;