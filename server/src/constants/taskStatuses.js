const TASK_STATUSES = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' }
];

const TASK_STATUS_IDS = TASK_STATUSES.map((status) => status.id);

module.exports = {
  TASK_STATUSES,
  TASK_STATUS_IDS
};
