import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

///adding touch action: none to allow mobile drag action 
const KanbanItem = ({
  title,
  content,
  index,
  parent,
  removeTask
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: title,
    data: {
      title,
      content,
      index,
      parent,
    },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div
      className="bg-white shadow rounded p-2 mb-2 last:mb-0 touch-none"
      style={style}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      <div className="font-bold flex justify-between items-center">
        <div>{title}</div>
        <button onClick={() => removeTask(parent, index)} className="text-gray-400">x</button>
      </div>
      <div>{content}</div>
    </div>
  );
};

export default function KanbanLane({ title, items, removeTask }) {
  const { setNodeRef } = useDroppable({
    id: title,
  });

  return (
    <div className="bg-gray-200 p-2 rounded flex flex-col gap-2">
      <div className="font-bold text-xl">{title}</div>
      <div ref={setNodeRef} className="flex-1">
        {items?.length ? ((items.map((i, idx) => (
          <KanbanItem key={idx} title={i.title} content={i.content} index={idx} parent={title} removeTask={removeTask} />
        )))) : (<div></div>)}
      </div>
    </div>
  );
}