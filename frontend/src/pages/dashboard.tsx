import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import TaskForm from '@/components/task-form';
import TaskList from '@/components/task-list';
import Modal from '@/components/modal';
import { useAppAuth } from '@/context/AuthContext';

const Dashboard: React.FC = () => {
  const { state } = useAppAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data.data.tasks);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (state.token) {
      fetchTasks();
    }
  }, [state.token]);

  // Filter tasks based on selection
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  // Create or update task
  const handleSaveTask = async (title: string, description: string) => {
    try {
      let response;
      if (editingTask) {
        // Update existing task
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description }),
        });
      } else {
        // Create new task
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description }),
        });
      }

      if (response.ok) {
        const result = await response.json();
        if (editingTask) {
          // Update the task in the list
          setTasks(tasks.map(t => t.id === editingTask.id ? result.data : t));
        } else {
          // Add new task to the list
          setTasks([...tasks, result.data]);
        }
        setEditingTask(null);
      } else {
        console.error('Failed to save task');
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Toggle task completion
  const handleToggleTask = async (taskId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/toggle-completion`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        // Update the task in the list
        setTasks(tasks.map(t => t.id === taskId ? result.data : t));
      } else {
        console.error('Failed to toggle task');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Prepare task for editing
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  // Confirm task deletion
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the task from the list
        setTasks(tasks.filter(t => t.id !== taskToDelete));
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Tasks</h1>

      {/* Task Creation/Editing Form */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <TaskForm
          onSubmit={handleSaveTask}
          initialData={editingTask ? {
            id: editingTask.id,
            title: editingTask.title,
            description: editingTask.description || '',
            completed: editingTask.completed,
            dueDate: editingTask.dueDate
          } : undefined}
          buttonText={editingTask ? "Update Task" : "Create Task"}
        />
        {editingTask && (
          <button
            onClick={() => setEditingTask(null)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Task Filters */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-md ${
            filter === 'active'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-md ${
            filter === 'completed'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Deletion"
        onConfirm={handleDeleteTask}
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this task? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default Dashboard;