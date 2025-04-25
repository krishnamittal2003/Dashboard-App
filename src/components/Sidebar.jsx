// components/Sidebar.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addDashboard } from "../redux/dashboardSlice";

function Sidebar({ activeDashboard, setActiveDashboard }) {
  const categories = useSelector((state) =>
    Object.keys(state.dashboard.categories)
  );
  const dispatch = useDispatch();
  const [newDash, setNewDash] = useState("");

  const handleCreate = () => {
    if (newDash.trim()) {
      dispatch(addDashboard(newDash.trim()));
      setActiveDashboard(newDash.trim());
      setNewDash("");
    }
  };

  return (
    <div className="h-full p-4 w-64 bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold mb-2">📊 Dashboards</h2>
        <button
          onClick={() => setActiveDashboard("home")}
          className={`block w-full text-left px-3 py-2 rounded ${
            activeDashboard === "home" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          🏠 Home
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveDashboard(cat)}
            className={`block w-full text-left px-3 py-2 rounded ${
              activeDashboard === cat ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-600 dark:border-gray-600 mt-4">
        <input
          value={newDash}
          onChange={(e) => setNewDash(e.target.value)}
          placeholder="New Dashboard"
          className="w-full px-2 py-1 text-black rounded mb-2"
        />
        <button
          onClick={handleCreate}
          className="w-full bg-green-600 text-white px-2 py-1 rounded"
        >
          + Create
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
