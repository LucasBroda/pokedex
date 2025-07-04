import { Routes, Route } from "react-router";
import {Accueil, Ajout } from "@pages";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Accueil />} />
      <Route path='/ajout' element={<Ajout />} />
    </Routes>

  )
}

export default App