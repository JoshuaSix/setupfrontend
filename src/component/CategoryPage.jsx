import { useState, useEffect } from "react";
import SearchDropdown from "./SearchDropdown";

function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [values, setValues] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle category selection from SearchDropdown
  const handleCategorySearch = (category) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
    if (category) {
      fetchValues(category.id);
    } else {
      setValues([]);
    }
  };

  // Fetch values for selected category using the correct endpoint
  const fetchValues = async (categoryId) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching values for category ID: ${categoryId}`);
      const response = await fetch(
        `http://localhost:8080/api/setup/categories/${categoryId}/values?page=0&size=50`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch values');
      }
      
      const data = await response.json();
      console.log("Values from API:", data);
      
      // Parse the values correctly
      const parsedValues = data.map(item => ({
        id: item.id,
        // Extract the actual value from the JSON string
        value: parseValue(item.value)
      }));
      
      setValues(parsedValues);
    } catch (err) {
      console.error("Error fetching values:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse value strings
  const parseValue = (valueString) => {
    if (!valueString) return "";
    
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(valueString);
      if (typeof parsed === 'string') return parsed;
      if (parsed.value) return parsed.value;
      // If it's an object with a single key, take that value
      const firstKey = Object.keys(parsed)[0];
      return parsed[firstKey] || '';
    } catch {
      // If parsing fails, extract text between quotes
      const match = valueString.match(/"([^"]*)"/);
      if (match && match[1]) {
        return match[1];
      }
      // Last resort: clean the string
      return valueString.replace(/[\{\}"\r\n]/g, "").trim();
    }
  };

  // Add value to category - FIXED VERSION
  const handleAddValue = async () => {
    if (!newValue.trim()) {
      setError("Please enter a value");
      return;
    }
    
    if (!selectedCategory) {
      setError("Please select a category first");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`Adding value to category ${selectedCategory.id}:`, newValue);
      
      // FIX: Send as an object with "value" property, not as a string
      const response = await fetch(
        `http://localhost:8080/api/setup/categories/${selectedCategory.id}/values`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: newValue.trim() }) // Send as object, not string
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add value');
      }

      setSuccessMessage("Value added successfully!");
      setNewValue("");
      
      // Refresh values
      await fetchValues(selectedCategory.id);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error adding value:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete value
  const handleDeleteValue = async (valueId) => {
    if (!window.confirm('Are you sure you want to delete this value?')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Deleting value ID: ${valueId}`);
      
      const response = await fetch(
        `http://localhost:8080/api/setup/categories/values/${valueId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete value');
      }

      setSuccessMessage("Value deleted successfully!");
      setValues(values.filter(v => v.id !== valueId));
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error deleting value:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Category Management System</h1>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div style={{
          padding: '12px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
           {successMessage}
        </div>
      )}
      
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
           Error: {error}
        </div>
      )}

      {/* SearchDropdown Component */}
      <div style={{ marginBottom: '30px' }}>
        <SearchDropdown onSearch={handleCategorySearch} />
      </div>

      {/* Values Section */}
      {selectedCategory ? (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '25px', 
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          {/* Category Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid #dee2e6'
          }}>
            <div>
              <h2 style={{ margin: 0, color: '#007bff' }}>
                {selectedCategory.name}
              </h2>
              <p style={{ margin: '5px 0 0', color: '#6c757d' }}>
                Code: {selectedCategory.code} 
                {/* | ID: {selectedCategory.id} */}
              </p>
            </div>
            <span style={{ 
              backgroundColor: '#007bff', 
              color: 'white', 
              padding: '5px 10px', 
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {values.length} {values.length === 1 ? 'Value' : 'Values'}
            </span>
          </div>

          {/* Values List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>⏳</div>
              <div>Loading values...</div>
            </div>
          ) : (
            <>
              {values.length > 0 ? (
                <div style={{ 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  marginBottom: '20px'
                }}>
                  {values.map(v => (
                    <div
                      key={v.id}
                      style={{
                        padding: '15px',
                        marginBottom: '10px',
                        backgroundColor: 'white',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>{v.value}</span>
                      <button
                        onClick={() => handleDeleteValue(v.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px', 
                  color: '#6c757d',
                  border: '2px dashed #dee2e6',
                  borderRadius: '4px',
                  marginBottom: '20px'
                }}>
                  {/* <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div> */}
                  <h3>No values yet</h3>
                  <p>Add your first value using the form below</p>
                </div>
              )}

              {/* Add Value Form */}
              <div style={{ 
                borderTop: '1px solid #dee2e6',
                paddingTop: '20px'
              }}>
                <h3 style={{ margin: '0 0 15px', fontSize: '18px' }}>Add New Value</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => {
                      setNewValue(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter value name"
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '2px solid #dee2e6',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={handleAddValue}
                    disabled={loading || !newValue.trim()}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: newValue.trim() ? '#28a745' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: newValue.trim() ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Value'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #dee2e6',
          color: '#6c757d'
        }}>
          {/* <div style={{ fontSize: '48px', marginBottom: '20px' }}>👆</div> */}
          <h2>Select a category to get started</h2>
          <p>Choose a category from the dropdown above to view and manage its values</p>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;