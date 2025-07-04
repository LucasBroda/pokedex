import { Routes, Route } from "react-router";
import {Accueil, Ajout, Liste } from "@pages";
import Navbar from "@components";

function App() {
  return (
    <><Navbar /><Routes>
      <Route path='/' element={<Accueil />} />
      <Route path="/liste" element={<Liste />} />
      <Route path='/ajout' element={<Ajout />} />
    </Routes></>

  )
}

export default App