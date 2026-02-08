import React from 'react';
import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  return (
    <div className={`border rounded-lg p-4 mb-2 flex items-center justify-between ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-3"
        />
        <div>
          <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
              {task.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            Created: {new Date(task.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:text-red-900 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;