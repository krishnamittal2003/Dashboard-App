import React from 'react';
import Widget from './Widget';

function Category({ name, widgets, searchTerm }) {
  const filteredWidgets = widgets.filter(widget =>
    (widget?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWidgets.length ? (
          filteredWidgets.map(widget => (
            <Widget key={widget.id} widget={widget} category={name} />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No matching widgets found.</p>
        )}
      </div>
    </div>
  );
}

export default Category;