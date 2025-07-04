import { Routes, Route } from "react-router";
import Accueil from "./pages/accueil";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Accueil />}>
      </Route>
    </Routes>

  )
}

export default App