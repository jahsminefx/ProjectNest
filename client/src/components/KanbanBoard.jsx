import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn.jsx';

function groupTasksByStatus(statuses, tasks) {
  return statuses.reduce((columns, status) => {
    columns[status.id] = tasks.filter((task) => task.status === status.id);
    return columns;
  }, {});
}

function KanbanBoard({ onDragEnd, onUpload, statuses, tasks, uploadingTaskId }) {
  const columns = groupTasksByStatus(statuses, tasks);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <KanbanColumn
            key={status.id}
            onUpload={onUpload}
            status={status}
            tasks={columns[status.id] || []}
            uploadingTaskId={uploadingTaskId}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;
