import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addWidget } from '../redux/dashboardSlice';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';
import html2canvas from 'html2canvas';

const TABS = ['CSPM', 'CWPP', 'Image', 'Ticket'];
const DEFAULT_COLORS = ['#6366F1', '#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#A855F7'];

function AddWidgetModal({ onClose, activeDashboard }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('CSPM');
  const [formData, setFormData] = useState({});
  const [chartType, setChartType] = useState('pie');
  const chartRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('widgetFormData');
    if (stored) setFormData(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('widgetFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (tab, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }));
  };

  const handleChartData = (tab, index, field, value) => {
    setFormData((prev) => {
      const chart = prev[tab]?.chart || [];
      chart[index] = {
        ...chart[index],
        [field]: field === 'value' ? parseInt(value) : value,
      };
      return {
        ...prev,
        [tab]: {
          ...prev[tab],
          chart,
        },
      };
    });
  };

  const handleAddLabel = () => {
    setFormData((prev) => {
      const chart = [...(prev[activeTab]?.chart || []), {
        label: '', value: 0, color: DEFAULT_COLORS[(prev[activeTab]?.chart?.length || 0) % DEFAULT_COLORS.length]
      }];
      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          chart,
        },
      };
    });
  };

  const handleRemoveLabel = (index) => {
    setFormData((prev) => {
      const chart = prev[activeTab]?.chart?.filter((_, i) => i !== index) || [];
      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          chart,
        },
      };
    });
  };

  const handleAdd = () => {
    const data = formData[activeTab];
    if (!data?.name) return;

    dispatch(
      addWidget({
        category: activeDashboard,
        widget: {
          id: Date.now(),
          name: data.name,
          text: data.text || '',
          chart: data.chart || [],
          chartType: activeTab === 'Image' ? chartType : null,
        },
      })
    );

    onClose();
  };

  const handleExportChart = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = `${formData[activeTab]?.name || 'chart'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const previewChart = formData[activeTab]?.chart?.filter(c => c.label && c.value > 0) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Widget</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-full text-sm border ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Widget name */}
        <input
          type="text"
          placeholder="Widget Name"
          value={formData[activeTab]?.name || ''}
          onChange={(e) => handleChange(activeTab, 'name', e.target.value)}
          className="w-full px-3 py-2 mb-3 border rounded dark:bg-gray-800 dark:text-white"
        />

        {/* Text or Chart Form */}
        {activeTab === 'Image' ? (
          <>
            {/* Chart type selection */}
            <div className="flex justify-between mb-2">
              <label className="font-medium">Chart Type</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="px-2 py-1 rounded border dark:bg-gray-800 dark:text-white"
              >
                <option value="pie">Pie Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>

            {/* Label inputs */}
            {formData[activeTab]?.chart?.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => handleChartData(activeTab, i, 'label', e.target.value)}
                  className="flex-1 px-2 py-1 border rounded dark:bg-gray-800 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) => handleChartData(activeTab, i, 'value', e.target.value)}
                  className="w-24 px-2 py-1 border rounded dark:bg-gray-800 dark:text-white"
                />
                <input
                  type="color"
                  value={item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                  onChange={(e) => handleChartData(activeTab, i, 'color', e.target.value)}
                  className="w-10 h-8 border rounded"
                />
                <button onClick={() => handleRemoveLabel(i)} className="text-red-600">✕</button>
              </div>
            ))}

            <button
              onClick={handleAddLabel}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded text-sm mb-4"
            >
              + Add Label
            </button>

            {/* Live preview */}
            {previewChart.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-semibold mb-2">Live Chart Preview</h3>
                  <button
                    onClick={handleExportChart}
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Export 🖼️
                  </button>
                </div>
                <div ref={chartRef} className="h-64 bg-white dark:bg-gray-800 rounded p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                      <BarChart data={previewChart} animationDuration={800}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value">
                          {previewChart.map((entry, index) => (
                            <Cell key={index} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={previewChart}
                          dataKey="value"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          animationDuration={800}
                        >
                          {previewChart.map((entry, index) => (
                            <Cell key={index} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout="horizontal" verticalAlign="bottom" />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        ) : (
          <textarea
            placeholder="Widget Text"
            value={formData[activeTab]?.text || ''}
            onChange={(e) => handleChange(activeTab, 'text', e.target.value)}
            className="w-full px-3 py-2 h-28 border rounded dark:bg-gray-800 dark:text-white"
          />
        )}

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default AddWidgetModal;