import { useEffect, useState } from "react";

// Mock data for testing
const MOCK_CATEGORIES = [
  {
    id: 1,
    code: "CAT001",
    name: "Electronics",
    values: [
      { id: 1, value: "{\r\n  \"value\": \"Mobile Phones\"\r\n}" },
      { id: 2, value: "{\r\n  \"Laptops\"\r\n}" },
      { id: 3, value: "{\r\n \"TVs\"\r\n}" }
    ]
  },
  {
    id: 2,
    code: "CAT003",
    name: "Books",
    values: [
      { id: 4, value: "{\n  \"things fall Apart\"\n}" },
      { id: 5, value: "{\n  \"New King James\"\n}" },
      { id: 6, value: "{\n  \"Craddle to the grave\"\n}" }
    ]
  },
  {
    id: 3,
    code: "CAT004",
    name: "Furniture",
    values: [
      { id: 7, value: "{\n  \"beach bench\"\n}" },
      { id: 8, value: "{\n  \"sofa\"\n}" },
      { id: 9, value: "{\n  \"rocking chair\"\n}" }
    ]
  },
  {
    id: 4,
    code: "CAT005",
    name: "Clothing",
    values: [
      { id: 10, value: "{\n  \"H&M\"\n}" },
      { id: 11, value: "{\n  \"Polo Ts\"\n}" },
      { id: 12, value: "{\n  \"Polo Latency\"\n}" }
    ]
  }
];

function SearchDropdown({ onSelect, useMockData = false }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (useMockData) {
          console.log("Using mock data");
          setTimeout(() => {
            setCategories(MOCK_CATEGORIES);
            setLoading(false);
          }, 500);
          return;
        }

        console.log("Fetching from API...");
        const response = await fetch("http://localhost:8080/api/setup/categories");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Received categories:", data);
        setCategories(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setCategories(MOCK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [useMockData]);

  // Robust function to extract the actual value from various formats
  const extractValue = (valueString) => {
    if (!valueString) return "";
    
    console.log("Extracting value from:", valueString);
    
    // Remove any surrounding quotes and trim
    let cleaned = valueString.trim();
    
    // If it's wrapped in curly braces, extract the content
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      // Remove the braces
      cleaned = cleaned.substring(1, cleaned.length - 1).trim();
    }
    
    // Remove any newlines and extra spaces
    cleaned = cleaned.replace(/[\r\n]/g, '').trim();
    
    // Check if it has a key-value format with "value" key
    const valueMatch = cleaned.match(/"value"\s*:\s*"([^"]*)"/);
    if (valueMatch && valueMatch[1]) {
      return valueMatch[1];
    }
    
    // Check for just a quoted string
    const quotedMatch = cleaned.match(/"([^"]*)"/);
    if (quotedMatch && quotedMatch[1]) {
      return quotedMatch[1];
    }
    
    // If it's just text without quotes
    if (!cleaned.includes('"')) {
      return cleaned;
    }
    
    // Fallback: remove all quotes, braces, and clean up
    return cleaned
      .replace(/["{}]/g, '')
      .trim();
  };

  useEffect(() => {
    if (!selectedCategoryId) {
      setValues([]);
      return;
    }

    const fetchValues = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get values from mock data first if available
        if (useMockData) {
          const category = categories.find(c => c.id.toString() === selectedCategoryId);
          if (category && category.values) {
            console.log("Using mock values for category:", category.name);
            const parsedValues = category.values.map(v => ({
              id: v.id,
              value: extractValue(v.value)
            }));
            console.log("Parsed mock values:", parsedValues);
            setValues(parsedValues);
            setLoading(false);
            return;
          }
        }

        // Fetch from API
        console.log(`Fetching values from API for category ID: ${selectedCategoryId}`);
        const response = await fetch(`http://localhost:8080/api/setup/categories/${selectedCategoryId}/values`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Raw API response:", data);
        
        // Extract values from each item
        const parsedValues = data.map(item => {
          console.log(`Processing item ${item.id}:`, item.value);
          return {
            id: item.id,
            value: extractValue(item.value)
          };
        });
        
        console.log("Final parsed values:", parsedValues);
        setValues(parsedValues);
      } catch (err) {
        console.error("Error fetching values:", err);
        setError(err.message);
        
        // Try mock data as fallback
        const category = categories.find(c => c.id.toString() === selectedCategoryId);
        if (category && category.values) {
          console.log("Falling back to mock values");
          const parsedValues = category.values.map(v => ({
            id: v.id,
            value: extractValue(v.value)
          }));
          setValues(parsedValues);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchValues();
  }, [selectedCategoryId, categories, useMockData]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    console.log("Category selected:", categoryId);
    
    setSelectedCategoryId(categoryId);
    
    const selectedCat = categories.find(cat => cat.id.toString() === categoryId);
    console.log("Found category:", selectedCat);
    
    if (selectedCat && onSelect) {
      onSelect(selectedCat);
    }
  };

  return (
    <div style={{ width: 300 }}>
      {error && (
        <div style={{ 
          color: 'orange', 
          marginBottom: '10px', 
          fontSize: '14px',
          padding: '8px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          borderRadius: '4px'
        }}>
           {error}
        </div>
      )}
      
      <select
        value={selectedCategoryId}
        onChange={handleCategoryChange}
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {loading && (
        <p style={{ marginTop: '10px', color: '#666' }}>
          Loading...
        </p>
      )}

      {values.length > 0 && (
        <div style={{ 
          marginTop: 15,
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
            Values ({values.length}):
          </h4>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '20px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {values.map(v => (
              <li key={v.id} style={{ marginBottom: '4px' }}>
                {v.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchDropdown;