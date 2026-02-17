import { useEffect, useState } from "react";

function SearchDropdown({ onSearch }) {
  console.log("🔴 SearchDropdown rendered with onSearch:", onSearch); // Add this line
  
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/setup/categories");
        const data = await response.json();
        console.log(" Categories loaded>>>>", data);
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories>>>>>", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await fetch(`http://localhost:8080/api/setup/categories/${id}`, {
        method: "DELETE",
      });

      setCategories(categories.filter(cat => cat.id !== id));

      if (selectedId === id.toString()) {
        setSelectedId("");
        if (onSearch) {
          onSearch(null);
        }
      }
    } catch (err) {
      console.error("Error deleting category>>>>>", err);
    }
  };

  const handleSearch = () => {
    console.log(" handleSearch called, selectedId>>>>>", selectedId);
    console.log(" onSearch type:", typeof onSearch);
    
    if (!selectedId) {
      if (onSearch) {
        onSearch(null);
      }
      return;
    }

    const selectedCat = categories.find(
      cat => cat.id.toString() === selectedId
    );
    
    console.log(" Selected category>>>>>>", selectedCat);
    
    if (onSearch) {
      console.log("Calling onSearch with category");
      onSearch(selectedCat);
    } else {
      console.error(" onSearch is not a function!");
    }
  };

  return (
    <div style={{ 
      padding: '15px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px',
            border: '2px solid #dee2e6',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name} 
              {/* ({cat.code}) */}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          disabled={loading || !selectedId}
          style={{
            padding: '10px 20px',
            backgroundColor: selectedId ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedId ? 'pointer' : 'not-allowed',
            fontWeight: 'bold'
          }}
        >
          Search
        </button>

        {selectedId && (
          <button
            onClick={() => handleDeleteCategory(Number(selectedId))}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Delete
          </button>
        )}
      </div>
      
      {loading && (
        <p style={{ marginTop: '10px', color: '#666' }}>Loading categories...</p>
      )}
    </div>
  );
}

export default SearchDropdown;