import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoryPage from "./component/CategoryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;