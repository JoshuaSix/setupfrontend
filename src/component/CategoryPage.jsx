import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CategoryPage() {
  const { id } = useParams();
  const [values, setValues] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [page, setPage] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // new search state

  const fetchValues = () => {
    fetch(`http://localhost:8080/api/setup/categories/${id}/values`)
      .then(res => res.json())
      .then(data => {
        setValues(data.content);
        // setTotalPages(data.totalPages);
      })
      .catch(err => console.error("Error fetching values:", err));
  };

  useEffect(() => {
    fetchValues();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page]);

  const handleAddValue = () => {
    if (!newValue.trim()) return;

    fetch(`http://localhost:8080/api/setup/categories/${id}/values`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newValue),
    })
      .then(() => {
        setNewValue("");
        fetchValues();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (valueId) => {
    fetch(`http://localhost:8080/api/setup/categories/values/${valueId}`, {
      method: "DELETE",
    }).then(() => fetchValues());
  };

  // filter values based on searchQuery
const filteredValues = values.filter(v =>
  v.value.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Category Values</h2>

      <input
        type="text"
        placeholder="Search values..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />

      <ul>
        {filteredValues.map(v => (
          <li key={v.id}>
            {v.val}
            <button
              onClick={() => handleDelete(v.id)}
              style={{ marginLeft: 10 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Add new value"
        value={newValue}
        onChange={e => setNewValue(e.target.value)}
      />
      <button onClick={handleAddValue} style={{ marginLeft: 10 }}>
        Add Value
      </button>

      <div style={{ marginTop: 20 }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            disabled={i === page}
            style={{ marginRight: 5 }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
