import { apiService } from './api';
import { Task, TaskFilterState } from '@/types';

interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: Date;
}

interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean;
}

interface GetTasksParams {
  status?: 'all' | 'completed' | 'pending';
  page?: number;
  limit?: number;
}

class TaskService {
  /**
   * Get all tasks for the authenticated user
   */
  async getTasks(params?: GetTasksParams): Promise<Task[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const queryString = queryParams.toString();
      const url = queryString ? `/tasks?${queryString}` : '/tasks';

      const response = await apiService.get<{ tasks: Task[] }>(url);
      return response.data.tasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        ...(task.dueDate && { dueDate: new Date(task.dueDate) })
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: CreateTaskData): Promise<Task> {
    try {
      const response = await apiService.post<Task>('/tasks', {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : undefined
      });

      const newTask = response.data;
      return {
        ...newTask,
        createdAt: new Date(newTask.createdAt),
        updatedAt: new Date(newTask.updatedAt),
        ...(newTask.dueDate && { dueDate: new Date(newTask.dueDate) })
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
    try {
      const response = await apiService.put<Task>(`/tasks/${id}`, {
        ...taskData,
        ...(taskData.dueDate && { dueDate: new Date(taskData.dueDate).toISOString() })
      });

      const updatedTask = response.data;
      return {
        ...updatedTask,
        createdAt: new Date(updatedTask.createdAt),
        updatedAt: new Date(updatedTask.updatedAt),
        ...(updatedTask.dueDate && { dueDate: new Date(updatedTask.dueDate) })
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update task');
    }
  }

  /**
   * Toggle task completion status
   */
  async toggleTaskCompletion(id: string): Promise<Task> {
    try {
      const response = await apiService.patch<Task>(`/tasks/${id}/toggle-completion`);

      const updatedTask = response.data;
      return {
        ...updatedTask,
        createdAt: new Date(updatedTask.createdAt),
        updatedAt: new Date(updatedTask.updatedAt),
        ...(updatedTask.dueDate && { dueDate: new Date(updatedTask.dueDate) })
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to toggle task completion');
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    try {
      await apiService.delete(`/tasks/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete task');
    }
  }

  /**
   * Filter tasks based on provided criteria
   */
  filterTasks(tasks: Task[], filters: TaskFilterState): Task[] {
    return tasks.filter(task => {
      // Filter by status
      if (filters.status === 'completed' && !task.completed) {
        return false;
      }
      if (filters.status === 'pending' && task.completed) {
        return false;
      }

      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort by specified field
      let comparison = 0;
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updatedAt':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'dueDate':
          if (a.dueDate && b.dueDate) {
            comparison = a.dueDate.getTime() - b.dueDate.getTime();
          } else if (a.dueDate) {
            comparison = -1;
          } else if (b.dueDate) {
            comparison = 1;
          } else {
            comparison = 0;
          }
          break;
        default:
          comparison = 0;
      }

      // Apply sort direction
      return filters.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
}

export const taskService = new TaskService();

export default TaskService;