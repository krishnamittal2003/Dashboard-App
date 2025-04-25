import React from "react";
import Widget from "./Widget";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import { reorderWidgets } from "../redux/dashboardSlice";
import { Menu } from 'react-feather';

function SortableWidget({ widget, category }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
    >
      {/* 🔥 Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 text-gray-400 cursor-grab hover:text-gray-600 z-10"
        title="Drag"
      >
        <Menu size={16} />
      </div>

      {/* Actual Widget */}
      <Widget widget={widget} category={category} />
    </div>
  );
}

function Category({ name, widgets, searchQuery }) {
  const dispatch = useDispatch();
  const filtered = widgets.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((w) => w.id === active.id);
    const newIndex = filtered.findIndex((w) => w.id === over.id);
    const newOrder = arrayMove(filtered, oldIndex, newIndex);

    // Update redux store
    dispatch(reorderWidgets({ category: name, widgets: newOrder }));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filtered.map((w) => w.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((widget) => (
              <SortableWidget key={widget.id} widget={widget} category={name} />
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default Category;
