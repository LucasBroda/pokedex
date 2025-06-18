import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './accueil';
// import d’autres pages...

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        {/* autres routes ici */}
      </Routes>
    </Router>
  );
}

export default App;
