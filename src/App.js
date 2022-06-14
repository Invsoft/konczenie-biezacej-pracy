import logo from './logo.svg';
import './App.css';
import packageJson from './../package.json';
import preval from 'preval.macro';
import { KonczenieBiezacejPracy } from './konczenieBiezacejPracy/KonczenieBiezacejPracy'

function App() {
  return (
    <div className="App" data_build_version={packageJson.version} data_build_time={preval`module.exports = new Date().toISOString();`}>
      <KonczenieBiezacejPracy />
    </div>
  );
}

export default App;
