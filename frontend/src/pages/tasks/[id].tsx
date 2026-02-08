import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { Task } from '@/types';
import { taskService } from '@/services/taskService';
import { formatDate } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

const TaskDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // Fetch task on component mount
  useEffect(() => {
    const fetchTask = async () => {
      if (typeof id !== 'string') return;

      try {
        setLoading(true);
        const fetchedTask = await taskService.getTasks({ limit: 1, page: 1 });
        const foundTask = fetchedTask.find(t => t.id === id);

        if (!foundTask) {
          setError('Task not found');
          return;
        }

        setTask(foundTask);
        setEditTitle(foundTask.title);
        setEditDescription(foundTask.description || '');
        setEditDueDate(foundTask.dueDate ? foundTask.dueDate.toISOString().split('T')[0] : '');
      } catch (err: any) {
        setError(err.message || 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleToggleCompletion = async () => {
    if (!task) return;

    try {
      const updatedTask = await taskService.toggleTaskCompletion(task.id);
      setTask(updatedTask);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleSave = async () => {
    if (!task) return;

    try {
      const updatedTask = await taskService.updateTask(task.id, {
        title: editTitle,
        description: editDescription || undefined,
        dueDate: editDueDate ? new Date(editDueDate) : undefined,
      });

      setTask(updatedTask);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.deleteTask(task.id);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error: {error}</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Please try again later.</p>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (loading || !task) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>{task.title} - Todo App</title>
          <meta name="description" content={`Details for task: ${task.title}`} />
        </Head>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
              <Button onClick={() => router.push('/dashboard')} variant="secondary">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>

        <main>
          <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    {isEditing ? (
                      <Input
                        id="edit-task-title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full text-lg font-medium text-gray-900"
                      />
                    ) : (
                      <h3
                        className={`text-lg leading-6 font-medium ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                    )}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={handleToggleCompletion}
                        className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Textarea
                        id="edit-task-description"
                        label="Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                      />
                      <div>
                        <label htmlFor="edit-due-date" className="block text-sm font-medium text-gray-700">
                          Due Date
                        </label>
                        <input
                          type="date"
                          id="edit-due-date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleSave} variant="primary">
                          Save Changes
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="secondary">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Description</h4>
                        <div className="mt-1 text-sm text-gray-900">
                          {task.description || 'No description provided.'}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
                        <div className="mt-1 text-sm text-gray-900">
                          {task.dueDate ? formatDate(task.dueDate) : 'No due date set.'}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Created</h4>
                        <div className="mt-1 text-sm text-gray-900">
                          {formatDate(task.createdAt)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                        <div className="mt-1 text-sm text-gray-900">
                          {formatDate(task.updatedAt)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex space-x-3">
                    {isEditing ? null : (
                      <>
                        <Button onClick={() => setIsEditing(true)} variant="secondary">
                          Edit Task
                        </Button>
                        <Button onClick={handleDelete} variant="danger">
                          Delete Task
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default TaskDetailsPage;