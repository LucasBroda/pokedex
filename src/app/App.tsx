import { Routes, Route } from "react-router";
import Accueil from "@pages";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Accueil />}>
      </Route>
    </Routes>

  )
}

export default App