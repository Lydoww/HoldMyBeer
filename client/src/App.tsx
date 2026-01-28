import { BrowserRouter, Route, Routes } from "react-router"
import Homepage from "./pages/Homepage"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Homepage />} path="/" />
      </Routes>
    </BrowserRouter>
  )
}

export default App