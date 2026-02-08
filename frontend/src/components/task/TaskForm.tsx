import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import { Task } from '@/types';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onSubmit: (data: { title: string; description?: string; dueDate?: Date }) => void;
  initialData?: {
    id?: string;
    title: string;
    description?: string;
    completed: boolean;
  } & Partial<Pick<Task, 'dueDate'>>;
  buttonText?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, buttonText }) => {
  const [isExpanded, setIsExpanded] = useState(!!initialData); // Expand if initial data is provided

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    },
  });

  // Update form values when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      setValue('description', initialData.description || '');
      setValue('dueDate', initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
    }
  }, [initialData, setValue]);

  const onSubmitHandler = (data: TaskFormData) => {
    onSubmit({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });

    // Reset the form and collapse after submission
    reset();
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
    // Focus the title field when expanding
    setTimeout(() => {
      const titleField = document.getElementById('task-title');
      if (titleField) titleField.focus();
    }, 100);
  };

  const handleCancel = () => {
    reset();
    setIsExpanded(false);
  };

  return (
    <Card>
      {isExpanded ? (
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <Input
            id="task-title"
            label="Task Title"
            error={errors.title?.message}
            required
            {...register('title')}
          />

          <Textarea
            id="task-description"
            label="Description"
            error={errors.description?.message}
            {...register('description')}
            rows={3}
          />

          <div>
            <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700">
              Due Date (optional)
            </label>
            <input
              type="date"
              id="task-due-date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              {...register('dueDate')}
            />
            {errors.dueDate?.message && (
              <p className="mt-1 text-sm text-danger-600">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="flex space-x-2">
            <Button type="submit" loading={isSubmitting} variant="primary">
              {isSubmitting ? (initialData ? 'Updating...' : 'Creating...') : (buttonText || (initialData ? 'Update Task' : 'Create Task'))}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <Button variant="primary" fullWidth onClick={handleExpand}>
            + Add New Task
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TaskForm;