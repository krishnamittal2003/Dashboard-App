// App.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Widget from "./components/Widget";
import AddWidgetModal from "./components/AddWidgetModal";
import Sidebar from "./components/Sidebar";

function App() {
  const categories = useSelector((state) => state.dashboard.categories);
  const [activeDashboard, setActiveDashboard] = useState(
    "home"
  );
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleToggleTheme = () => setIsDark(!isDark);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white">
      <div
        className={`fixed z-40 inset-y-0 left-0 w-64 transform bg-gray-100 dark:bg-gray-800 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block`}
      >
        <Sidebar
          activeDashboard={activeDashboard}
          setActiveDashboard={(dash) => {
            setActiveDashboard(dash);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        />
      )}

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 top-0 bg-white dark:bg-gray-900 pb-2 z-10">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-2xl"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-2xl font-bold">Dynamic Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleTheme}
              className="text-lg px-3 py-1 rounded border dark:border-gray-600"
            >
              {isDark ? "🌞" : "🌙"}
            </button>
            {activeDashboard !== "home" && (
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                + Add Widget
              </button>
            )}
          </div>
        </div>

        {activeDashboard === "home" ? (
          Object.entries(categories).map(([cat, widgets]) => (
            <div key={cat} className="mb-10">
              <h2 className="text-xl font-semibold mb-2">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {widgets.map((widget) => (
                  <Widget key={widget.id} widget={widget} category={cat} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">{activeDashboard}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(categories[activeDashboard] || []).map((widget) => (
                <Widget
                  key={widget.id}
                  widget={widget}
                  category={activeDashboard}
                />
              ))}
            </div>
          </>
        )}

        {showModal && (
          <AddWidgetModal
            onClose={() => setShowModal(false)}
            activeDashboard={activeDashboard}
          />
        )}
      </div>
    </div>
  );
}

export default App;
