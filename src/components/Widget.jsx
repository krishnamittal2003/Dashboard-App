import React, { useRef } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';
import { useDispatch } from 'react-redux';
import { removeWidget } from '../redux/dashboardSlice';
import html2canvas from 'html2canvas';

const COLORS = ['#4F46E5', '#22C55E', '#EF4444', '#FACC15', '#06B6D4', '#A855F7'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // Center between inner and outer radius
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if(percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function Widget({ widget, category }) {
  const dispatch = useDispatch();
  const chartRef = useRef(null);

  const validChart = widget.chart?.filter(c => c?.label && c?.value > 0) || [];
  const chartType = widget.chartType || (validChart.length ? 'pie' : null);

  const handleExportChart = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = `${widget.name || 'chart'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="relative flex flex-col justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded shadow text-black dark:text-white h-[420px] overflow-hidden">
      {/* Drag Handle */}
      {/* <div className="absolute top-2 left-2 text-gray-400 cursor-grab hover:text-gray-600 z-10">
        <Menu size={14} />
      </div> */}

      {/* Remove Button */}
      <button
        onClick={() => dispatch(removeWidget({ category, id: widget.id }))}
        className="absolute top-2 right-2 text-red-400 hover:text-red-600"
      >
        ✕
      </button>

      {/* Widget Title */}
      <h3 className="text-md font-semibold mb-1 capitalize">{widget.name}</h3>

      {/* Chart or Text */}
      {validChart.length && chartType ? (
        <div className="flex-1 overflow-hidden mt-1 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold truncate">
              {widget.name} {chartType === 'pie' ? 'Distribution' : 'Overview'}
            </h4>
            <button
              onClick={handleExportChart}
              className="text-xs px-2 py-1 bg-green-600 text-white rounded"
            >
              Export 🖼️
            </button>
          </div>

          {/* Chart Section */}
          <div ref={chartRef} className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart
                  data={validChart}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  animationDuration={700}
                >
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" barSize={40} isAnimationActive={true} animationDuration={800} animationEasing="ease-out">
                    {validChart.map((entry, index) => (
                      <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart margin={{ top: 10, bottom: 10 }}>
                  <Pie
                    data={validChart}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing='ease-out'
                  >
                    {validChart.map((entry, index) => (
                      <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="text-sm mt-2">{widget.text}</p>
      )}
    </div>
  );
}

export default Widget;