import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import clsx from 'clsx';

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void;
  initialData?: {
    id?: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate?: Date;
  };
  buttonText?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, buttonText = "Save Task" }) => {
  const [loading, setLoading] = useState(false);

  // Define schema
  const schema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional().or(z.literal('')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || ''
    }
  });

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      await onSubmit(data.title, data.description);
      // Reset form after successful submission
      if (!initialData) {
        reset();
      }
    } catch (error) {
      console.error('Task submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <div className="mt-1">
          <input
            id="title"
            {...register('title')}
            type="text"
            className={clsx(
              'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border',
              errors.title ? 'border-red-300' : 'border-gray-300',
              'rounded-md p-2'
            )}
            placeholder="Task title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className={clsx(
              'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border',
              errors.description ? 'border-red-300' : 'border-gray-300',
              'rounded-md p-2'
            )}
            placeholder="Task description (optional)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message as string}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={clsx(
            'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2',
            loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700',
            'focus:ring-indigo-500'
          )}
        >
          {loading ? 'Saving...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;