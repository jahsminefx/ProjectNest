import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard.jsx';

function KanbanColumn({ onUpload, status, tasks, uploadingTaskId }) {
  return (
    <section className="flex min-h-[520px] min-w-[280px] flex-1 flex-col rounded-md border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">{status.title}</h2>
        <span className="rounded-full bg-panel px-2.5 py-1 text-xs font-semibold text-slate-600">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={status.id}>
        {(provided, snapshot) => (
          <div
            className={[
              'flex flex-1 flex-col gap-3 p-3 transition',
              snapshot.isDraggingOver ? 'bg-teal-50' : 'bg-panel'
            ].join(' ')}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard
                index={index}
                key={task.id}
                onUpload={onUpload}
                task={task}
                uploading={uploadingTaskId === task.id}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}

export default KanbanColumn;
