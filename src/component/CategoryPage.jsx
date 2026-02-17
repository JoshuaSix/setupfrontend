import { useState } from "react";
import SearchDropdown from "./SearchDropdown";

function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [values, setValues] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Define the function that will be passed to SearchDropdown
  const handleCategorySearch = (category) => {
    console.log("🔵 handleCategorySearch RECEIVED:", category);
    
    if (!category) {
      console.log("🔵 No category received, clearing...");
      setSelectedCategory(null);
      setValues([]);
      return;
    }

    console.log("🔵 Setting selected category:", category.name);
    setSelectedCategory(category);
    
    // Process values
    if (category.values && category.values.length > 0) {
      console.log("🔵 Processing values:", category.values);
      const parsedValues = category.values.map(v => {
        // Extract text between quotes
        const match = v.value.match(/"([^"]*)"/);
        const cleanValue = match ? match[1] : v.value.replace(/[\{\}"\r\n]/g, "").trim();
        return { id: v.id, value: cleanValue };
      });
      console.log("🔵 Parsed values:", parsedValues);
      setValues(parsedValues);
    } else {
      console.log("🔵 No values for this category");
      setValues([]);
    }
  };

  const handleAddValue = async () => {
    if (!newValue.trim() || !selectedCategory) return;
    console.log("Adding value:", newValue);
    // ... rest of your add value code
  };

  const handleDeleteValue = async (id) => {
    console.log("Deleting value:", id);
    // ... rest of your delete value code
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Category Management</h1>

      <div style={{ marginBottom: '30px' }}>
        {/* Pass the function as onSearch prop */}
        <SearchDropdown onSearch={handleCategorySearch} />
      </div>

      {/* Debug: Show current state */}
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <strong>Debug:</strong> Selected Category: {selectedCategory ? selectedCategory.name : 'None'} | Values count: {values.length}
      </div>

      {selectedCategory && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div>
              <h2 style={{ margin: 0, color: '#007bff' }}>
                {selectedCategory.name}
              </h2>
              <p style={{ margin: '5px 0 0', color: '#6c757d' }}>
                Code: {selectedCategory.code} | ID: {selectedCategory.id}
              </p>
            </div>
          </div>

          {/* Values List */}
          {values.length > 0 ? (
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              marginBottom: '20px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {values.map(v => (
                <li
                  key={v.id}
                  style={{
                    padding: '12px 15px',
                    marginBottom: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{v.value}</span>
                  <button
                    onClick={() => handleDeleteValue(v.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6c757d',
              border: '2px dashed #dee2e6',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              No values found for this category
            </div>
          )}

          {/* Add Value Form */}
          <div style={{ 
            display: 'flex', 
            gap: '10px',
            borderTop: '1px solid #dee2e6',
            paddingTop: '20px'
          }}>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter new value"
              style={{
                flex: 1,
                padding: '10px',
                border: '2px solid #dee2e6',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleAddValue}
              disabled={!newValue.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: newValue.trim() ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: newValue.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 'bold'
              }}
            >
              Add Value
            </button>
          </div>
        </div>
      )}

      {!selectedCategory && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #dee2e6',
          color: '#6c757d'
        }}>
          <h3>Select a category to view its values</h3>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;