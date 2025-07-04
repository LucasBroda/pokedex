import { Routes, Route } from "react-router";
import {Accueil, Ajout, Liste } from "@pages";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Accueil />} />
      <Route path="/liste" element={<Liste />} />
      <Route path='/ajout' element={<Ajout />} />
    </Routes>

  )
}

export default App