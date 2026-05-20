import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { fetchBoardTasks, patchTaskStatus, uploadTaskAttachment } from '../api/client.js';
import KanbanBoard from '../components/KanbanBoard.jsx';
import MobileWorkspaceSwitcher from '../components/MobileWorkspaceSwitcher.jsx';

function applyDragMove(tasks, result) {
  const { destination, draggableId, source } = result;
  const sourceTasks = tasks.filter((task) => task.status === source.droppableId);
  const destinationTasks = tasks.filter((task) => task.status === destination.droppableId);
  const movingTask = sourceTasks.find((task) => task.id === draggableId);

  if (!movingTask) {
    return tasks;
  }

  const remainingTasks = tasks.filter((task) => task.id !== draggableId);
  const movedTask = { ...movingTask, status: destination.droppableId };
  const destinationIds = destinationTasks.map((task) => task.id);
  const insertBeforeId = destinationIds[destination.index];

  if (!insertBeforeId) {
    const lastDestinationTaskId = destinationIds[destinationIds.length - 1];
    const lastDestinationIndex = remainingTasks.findIndex((task) => task.id === lastDestinationTaskId);

    if (lastDestinationIndex === -1) {
      return [...remainingTasks, movedTask];
    }

    return [
      ...remainingTasks.slice(0, lastDestinationIndex + 1),
      movedTask,
      ...remainingTasks.slice(lastDestinationIndex + 1)
    ];
  }

  const insertBeforeIndex = remainingTasks.findIndex((task) => task.id === insertBeforeId);

  return [
    ...remainingTasks.slice(0, insertBeforeIndex),
    movedTask,
    ...remainingTasks.slice(insertBeforeIndex)
  ];
}

function BoardPage() {
  const navigate = useNavigate();
  const { activeWorkspace, workspaces } = useOutletContext();
  const { workspaceId } = useParams();
  const [statuses, setStatuses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingTaskId, setSavingTaskId] = useState('');
  const [uploadingTaskId, setUploadingTaskId] = useState('');

  const activeTaskCount = useMemo(
    () => tasks.filter((task) => task.status !== 'DONE').length,
    [tasks]
  );

  const completedTaskCount = useMemo(
    () => tasks.filter((task) => task.status === 'DONE').length,
    [tasks]
  );

  const loadBoard = useCallback(() => {
    if (!workspaceId || workspaceId === 'select') {
      setLoading(false);
      setStatuses([]);
      setTasks([]);
      return;
    }

    setLoading(true);
    setError('');

    fetchBoardTasks(workspaceId)
      .then((data) => {
        setStatuses(data.statuses);
        setTasks(data.tasks);
      })
      .catch(() => {
        setError('Could not load this board. Check the API server, database, and seed data.');
      })
      .finally(() => setLoading(false));
  }, [workspaceId]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const handleWorkspaceChange = (nextWorkspaceId) => {
    navigate(`/workspace/${nextWorkspaceId}/board`);
  };

  const handleDragEnd = async (result) => {
    const { destination, draggableId, source } = result;

    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    const previousTasks = tasks;
    const nextStatus = destination.droppableId;
    setTasks((currentTasks) => applyDragMove(currentTasks, result));
    setSavingTaskId(draggableId);

    try {
      await patchTaskStatus(workspaceId, draggableId, nextStatus);
    } catch (requestError) {
      setTasks(previousTasks);
      alert('The task could not be moved. Your board has been restored.');
    } finally {
      setSavingTaskId('');
    }
  };

  const handleTaskUpload = async (taskId, file) => {
    setUploadingTaskId(taskId);

    try {
      const result = await uploadTaskAttachment(workspaceId, taskId, file);

      if (result.task) {
        setTasks((currentTasks) => currentTasks.map((task) => (
          task.id === taskId
            ? {
                ...task,
                ...result.task,
                assignee_name: task.assignee_name,
                project_name: task.project_name
              }
            : task
        )));
      }
    } catch (requestError) {
      alert(requestError.response?.data?.error || 'The file could not be uploaded.');
    } finally {
      setUploadingTaskId('');
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 md:p-6">
      <MobileWorkspaceSwitcher
        activeWorkspaceId={workspaceId}
        onChange={handleWorkspaceChange}
        workspaces={workspaces}
      />

      <section className="flex flex-col justify-between gap-3 border-b border-line pb-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {activeWorkspace?.slug || 'workspace'}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">Kanban Board</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <div className="rounded-md border border-line bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Backlog</p>
            <p className="mt-1 text-xl font-semibold text-ink">{activeTaskCount}</p>
          </div>
          <div className="rounded-md border border-line bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Done</p>
            <p className="mt-1 text-xl font-semibold text-ink">{completedTaskCount}</p>
          </div>
        </div>
      </section>

      {savingTaskId && (
        <div className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-accent">
          Saving task movement...
        </div>
      )}

      {loading && (
        <div className="rounded-md border border-line bg-white p-6 text-sm text-slate-600">
          Loading board...
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <KanbanBoard
          onDragEnd={handleDragEnd}
          onUpload={handleTaskUpload}
          statuses={statuses}
          tasks={tasks}
          uploadingTaskId={uploadingTaskId}
        />
      )}
    </div>
  );
}

export default BoardPage;
