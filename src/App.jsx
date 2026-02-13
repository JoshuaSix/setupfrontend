import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchDropdown from "./component/SearchDropdown";
import CategoryPage from "./component/CategoryPage"; // make sure this file exists

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchDropdown />} />
        <Route path="/categories/:id" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
