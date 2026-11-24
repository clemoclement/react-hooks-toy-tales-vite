import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const API = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  // GET: load all toys on page load
  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data) => setToys(data))
      .catch((err) => console.error("Failed to load toys:", err));
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  // POST: create a new toy
  function handleAddToy(newToy) {
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newToy, likes: 0 }),
    })
      .then((r) => r.json())
      .then((createdToy) => setToys((prev) => [...prev, createdToy]));
  }

  // PATCH: increase likes
  function handleLike(toy) {
    fetch(`${API}/${toy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: toy.likes + 1 }),
    })
      .then((r) => r.json())
      .then((updatedToy) =>
        setToys((prev) =>
          prev.map((t) => (t.id === updatedToy.id ? updatedToy : t))
        )
      );
  }

  // DELETE: donate a toy
  function handleDonate(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() =>
      setToys((prev) => prev.filter((t) => t.id !== id))
    );
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onLike={handleLike} onDonate={handleDonate} />
    </>
  );
}

export default App;