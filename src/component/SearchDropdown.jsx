import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchDropdown({ onSelect }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [show, setShow] = useState(false);
  const [values, setValues] = useState([])
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/setup/categories")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const selectItem = (item) => {
    setQuery(item.name);
    setSelectedItem(item);
    setShow(false);
    if (onSelect) onSelect(item);
  };
  console.log(filtered)

  const handleSearch = async (selectedItem) => {
    try {
      const response = await fetch(`http://localhost:8080/api/setup/categories/${selectedItem.id}/values`);
      const data = await response.json();
      console.log("values>>>>", data)
      setValues(data)

    } catch (error) {
      console.log("Error getting values>>>", error)

    }






    // if (selectedItem) {
    //   console.log("selected item>>>", selectedItem)
    //   navigate(`/categories/${selectedItem.id}`);
    // } else {
    //   alert("Please select a category first!");
    // }
  };


  const handleChange = async (e) => {
    const id = e.target.value;
    setSelectedId(id);

    if (!id) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/setup/categories/${id}/values`
      );
      const data = await response.json();
      console.log("values>>>>", data)
      setValues(data);
    } catch (error) {
      console.log("Error getting values>>>", error);
    }
  };

  return (
    <div style={{ width: "300px", position: "relative" }}>
      {/* <input
        type="text"
        placeholder="Search..."
        value={query}
        onFocus={() => setShow(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setShow(true);
        }}
        style={{ width: "70%", padding: "8px" }}
      />
      <button onClick={handleSearch(selectedItem.id)} style={{ padding: "8px", marginLeft: "5px" }}>
        Search
      </button>

      {show && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            border: "1px solid #ccc",
            background: "#fff",
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 10
          }}
        >
          {filtered.length > 0 ? (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => selectItem(item)}
                style={{ padding: "8px", cursor: "pointer" }}
              >
                {item.name}
              </div>
            ))
          ) : (
            <div style={{ padding: "8px", color: "#888" }}>
              No results
            </div>
          )}
        </div>
      )} */}



      <select
        value={selectedId}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px" }}
      >
        <option value="">Select Category</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>


      {values.content.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <strong>Values:</strong>
          <ul>
            {values.content.map((val) => (
              <li key={val.id}>{val.value}</li>
            ))}
          </ul>
        </div>
      )}


    </div>
  );
}

export default SearchDropdown;
