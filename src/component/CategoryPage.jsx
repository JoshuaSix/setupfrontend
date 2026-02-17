import { useState } from "react";
import SearchDropdown from "./SearchDropdown";

function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [values, setValues] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState(null);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    fetchValues(cat.id);
  };

  const fetchValues = (categoryId) => {
    setLoading(true);
    setError(null);
    
    fetch(`http://localhost:8080/api/setup/categories/${categoryId}/values`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch values');
        return res.json();
      })
      .then(data => {
        // Properly parse the JSON strings
        const cleaned = data.map(v => {
          try {
            const parsed = JSON.parse(v.value);
            if (typeof parsed === 'string') {
              return { ...v, value: parsed };
            } else if (parsed.value) {
              return { ...v, value: parsed.value };
            } else {
              const firstKey = Object.keys(parsed)[0];
              return { ...v, value: parsed[firstKey] || '' };
            }
          // eslint-disable-next-line no-unused-vars
          } catch (e) {
            // Fallback cleaning
            return { 
              ...v, 
              // eslint-disable-next-line no-useless-escape
              value: v.value.replace(/[\{\}"\r\n]/g, "").trim() 
            };
          }
        });
        setValues(cleaned);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const handleAddValue = () => {
    if (!newValue.trim()) {
      setAddError('Please enter a value');
      return;
    }
    
    if (!selectedCategory) {
      setAddError('Please select a category first');
      return;
    }

    // Check for duplicates
    if (values.some(v => v.value.toLowerCase() === newValue.trim().toLowerCase())) {
      setAddError('This value already exists');
      return;
    }

    setAddError(null);
    setLoading(true);

    // Send the value as a proper JSON object
    const payload = { value: JSON.stringify({ value: newValue.trim() }) };

    fetch(`http://localhost:8080/api/setup/categories/${selectedCategory.id}/values`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add value');
        return res.json();
      })
      .then(() => {
        setNewValue("");
        // Refresh values
        return fetchValues(selectedCategory.id);
      })
      .catch(err => {
        console.error(err);
        setAddError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteValue = (id) => {
    if (!window.confirm('Are you sure you want to delete this value?')) return;
    
    setLoading(true);
    fetch(`http://localhost:8080/api/setup/categories/values/${id}`, { 
      method: "DELETE" 
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete value');
        setValues(values.filter(v => v.id !== id));
      })
      .catch(err => {
        console.error(err);
        alert('Failed to delete value: ' + err.message);
      })
      .finally(() => setLoading(false));
  };

  const filteredValues = values.filter(v =>
    v.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Category Management</h2>

      <SearchDropdown onSelect={handleSelectCategory} />

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}

      {selectedCategory && (
        <div style={{ marginTop: '20px' }}>
          <h3>Values for: {selectedCategory.name}</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Search values..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          {loading && <p>Loading...</p>}

          {filteredValues.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {filteredValues.map(v => (
                <li 
                  key={v.id} 
                  style={{ 
                    padding: '10px', 
                    margin: '5px 0',
                    backgroundColor: '#f5f5f5',
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
                      cursor: 'pointer'
                    }}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p>No values found</p>
          )}

          <div style={{ marginTop: '20px' }}>
            {addError && (
              <div style={{ color: 'red', marginBottom: '10px' }}>
                {addError}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Add new value"
                value={newValue}
                onChange={e => {
                  setNewValue(e.target.value);
                  setAddError(null);
                }}
                style={{ flex: 1, padding: '8px' }}
                disabled={loading}
              />
              <button 
                onClick={handleAddValue}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={loading || !newValue.trim()}
              >
                Add Value
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;