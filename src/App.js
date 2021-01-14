import logo from './logo.svg';
import './App.css';
import RaportujZakonczonaPrace from './raportowanieZakonczonychPrac/RaportujZakonczonaPrace'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <img src={logo} className="App-logo" alt="logo" />
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <RaportujZakonczonaPrace/>
    </div>
  );
}

export default App;
