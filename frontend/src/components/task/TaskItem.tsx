import React, { useState } from 'react';
import { Task } from '@/types';
import { formatDate } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface TaskItemProps {
  task: Task;
  onTaskUpdate: (id: string, taskData: Partial<Task>) => void;
  onTaskToggle: (id: string) => void;
  onTaskDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdate, onTaskToggle, onTaskDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editDueDate, setEditDueDate] = useState(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');

  const handleSave = () => {
    onTaskUpdate(task.id, {
      title: editTitle,
      description: editDescription || undefined,
      dueDate: editDueDate ? new Date(editDueDate) : undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const handleToggle = () => {
    onTaskToggle(task.id);
  };

  const handleDelete = () => {
    onTaskDelete(task.id);
  };

  return (
    <li className="px-4 py-4 sm:px-6 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
          />
          <div className="ml-3 min-w-0 flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  id={`edit-title-${task.id}`}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full"
                />
                <Textarea
                  id={`edit-description-${task.id}`}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full"
                />
                <div>
                  <label htmlFor={`edit-due-date-${task.id}`} className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id={`edit-due-date-${task.id}`}
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="primary" size="sm" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p
                  className={`text-sm font-medium ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-500 truncate">{task.description}</p>
                )}
                <div className="flex items-center mt-1">
                  {task.dueDate && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        new Date(task.dueDate) < new Date() && !task.completed
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {formatDate(task.dueDate)}
                    </span>
                  )}
                  <span className="ml-2 text-xs text-gray-500">
                    Created: {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing && (
            <>
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default TaskItem;