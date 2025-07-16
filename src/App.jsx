import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Countdown from './pages/Countdown';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/countdown" element={<Countdown />} />
    </Routes>
  );
}

export default App;