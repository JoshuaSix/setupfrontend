import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchDropdown from "./SearchDropdown";

function SelectCategory() {
  const [selectedCat, setSelectedCat] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedCat) {
      alert("Please select a category");
      return;
    }
    navigate(`/categories/${selectedCat.id}`);
  };

  return (
    <div>
      <SearchDropdown onSelect={setSelectedCat} />

      <button onClick={handleContinue} style={{ marginTop: "10px" }}>
        Load Category Values
      </button>

      {selectedCat && (
        <p>
          Selected: {selectedCat.name} (ID: {selectedCat.id})
        </p>
      )}
    </div>
  );
}

export default SelectCategory;
