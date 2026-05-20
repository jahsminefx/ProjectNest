import { Draggable } from '@hello-pangea/dnd';

const priorityStyles = {
  LOW: 'border-slate-300 bg-slate-50 text-slate-600',
  MEDIUM: 'border-sky-200 bg-sky-50 text-sky-700',
  HIGH: 'border-amber-200 bg-amber-50 text-amber-700',
  URGENT: 'border-red-200 bg-red-50 text-red-700'
};

function TaskCard({ index, onUpload, task, uploading }) {
  const uploadId = `upload-${task.id}`;

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onUpload(task.id, file);
      event.target.value = '';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <article
          className={[
            'rounded-md border border-line bg-white p-4 shadow-sm transition',
            snapshot.isDragging ? 'shadow-soft ring-2 ring-teal-100' : ''
          ].join(' ')}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className="flex cursor-grab items-start justify-between gap-3 active:cursor-grabbing"
            {...provided.dragHandleProps}
          >
            <h3 className="text-sm font-semibold leading-5 text-ink">{task.title}</h3>
            <span
              className={[
                'shrink-0 rounded border px-2 py-0.5 text-[11px] font-semibold',
                priorityStyles[task.priority] || priorityStyles.MEDIUM
              ].join(' ')}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{task.description}</p>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span className="truncate">{task.project_name || 'No project'}</span>
            <span className="shrink-0">{task.assignee_name || 'Unassigned'}</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
            <span className="truncate text-xs text-slate-500">
              {task.attachment_url ? 'Attachment saved' : 'No attachment'}
            </span>
            <label
              className={[
                'shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition',
                uploading
                  ? 'cursor-not-allowed border-line bg-panel text-slate-400'
                  : 'cursor-pointer border-line text-slate-700 hover:border-accent hover:text-accent'
              ].join(' ')}
              htmlFor={uploadId}
            >
              {uploading ? 'Uploading...' : task.attachment_url ? 'Replace' : 'Attach'}
            </label>
            <input
              className="sr-only"
              disabled={uploading}
              id={uploadId}
              onChange={handleUpload}
              type="file"
            />
          </div>
        </article>
      )}
    </Draggable>
  );
}

export default TaskCard;
