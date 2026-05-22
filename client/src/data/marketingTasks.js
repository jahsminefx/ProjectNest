export const marketingTasks = [
  {
    id: 'task-1',
    title: 'Submit code review',
    naturalLanguage: 'Submit code review tomorrow at 4pm #Sprint2 p1',
    dueLabel: 'Tomorrow, 4:00 PM',
    project: 'Sprint2',
    priority: 'P1',
    status: 'todo',
    labels: ['engineering', 'review'],
    calendarDay: 18
  },
  {
    id: 'task-2',
    title: 'Finalize workspace billing notes',
    naturalLanguage: 'Finalize workspace billing notes Friday #Ops p2',
    dueLabel: 'Friday',
    project: 'Ops',
    priority: 'P2',
    status: 'in_progress',
    labels: ['finance'],
    calendarDay: 21
  },
  {
    id: 'task-3',
    title: 'Share onboarding checklist',
    naturalLanguage: 'Share onboarding checklist next Monday #HR p3',
    dueLabel: 'Next Monday',
    project: 'HR',
    priority: 'P3',
    status: 'todo',
    labels: ['people'],
    calendarDay: 24
  },
  {
    id: 'task-4',
    title: 'Archive completed launch tasks',
    naturalLanguage: 'Archive completed launch tasks today #Launch p4',
    dueLabel: 'Today',
    project: 'Launch',
    priority: 'P4',
    status: 'done',
    labels: ['cleanup'],
    calendarDay: 16
  }
];

export const quickAddExample = marketingTasks[0];

export const viewModes = ['List', 'Board', 'Calendar'];
