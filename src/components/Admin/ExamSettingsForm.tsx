'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@/components/shared';
import { InputField } from '@/components/shared';
import { toast } from 'react-toastify';
import {AdminCustomButton} from '@/components/Admin';

interface ExamSettings {
  title?: string;
  description?: string;
  price?: number;
  examTime?: string; // Duration string like "4 hours", "2 hours", "30 minutes"
  attemptCount?: number; // Number of attempts a user can make
}

interface ExamSettingsFormProps {
  initialData?: ExamSettings;
  onSubmit: (settings: ExamSettings) => Promise<void>;
  onCancel: () => void;
  examType: 'BARRISTER' | 'SOLICITOR';
  examSet: 'SET_A' | 'SET_B';
  isLoading?: boolean;
}

const ExamSettingsForm: React.FC<ExamSettingsFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  examType,
  examSet,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ExamSettings>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    examTime: initialData?.examTime || '',
    attemptCount: initialData?.attemptCount || undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        examTime: initialData.examTime || '',
        attemptCount: initialData.attemptCount || undefined,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof ExamSettings) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value: any;
    if (field === 'price') {
      value = parseFloat(e.target.value) || 0;
    } else if (field === 'attemptCount') {
      value = e.target.value ? parseInt(e.target.value) || undefined : undefined;
    } else {
      value = e.target.value;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.price && formData.price < 0) {
      toast.error('Price must be a positive number');
      return;
    }

    if (formData.examTime && formData.examTime.trim().length === 0) {
      toast.error('Exam time duration is required');
      return;
    }

    if (formData.attemptCount !== undefined && formData.attemptCount < 1) {
      toast.error('Attempt count must be a positive integer');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format the data for submission
      const submitData: ExamSettings = {
        title: formData.title || undefined,
        description: formData.description || undefined,
        price: formData.price ? formData.price : undefined,
        examTime: formData.examTime?.trim() || undefined,
        attemptCount: formData.attemptCount !== undefined && formData.attemptCount !== null 
          ? formData.attemptCount 
          : undefined,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting exam settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className='space-y-6'>
      <Box>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Exam Settings - {examType} {examSet.replace('_', ' ')}
        </h3>
      </Box>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <Box>
          <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1'>
            Exam Title
          </label>
          <InputField
            name='title'
            type='text'
            value={formData.title || ''}
            onChange={handleChange('title')}
            placeholder='Enter exam title'
          />
        </Box>

        <Box>
          <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
            Exam Description
          </label>
          <textarea
            id='description'
            value={formData.description}
            onChange={handleChange('description')}
            placeholder='Enter exam description'
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            rows={3}
          />
        </Box>

        <Box>
          <label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-1'>
            Price (USD)
          </label>
          <InputField
            name='price'
            type='number'
            value={String(formData.price || 0)}
            onChange={handleChange('price')}
            placeholder='Enter price'
          />
        </Box>

        <Box>
          <label htmlFor='examTime' className='block text-sm font-medium text-gray-700 mb-1'>
            Exam Duration
          </label>
          <InputField
            name='examTime'
            type='text'
            value={formData.examTime || ''}
            onChange={handleChange('examTime')}
            placeholder='e.g., 4 hours, 2 hours, 30 minutes'
          />
          <p className='text-xs text-gray-500 mt-1'>
            Enter the duration of the exam (e.g., "4 hours", "2 hours", "30 minutes")
          </p>
        </Box>

        <Box>
          <label htmlFor='attemptCount' className='block text-sm font-medium text-gray-700 mb-1'>
            Attempt Count
          </label>
          <InputField
            name='attemptCount'
            type='number'
            value={String(formData.attemptCount || '')}
            onChange={handleChange('attemptCount')}
            placeholder='Enter number of attempts allowed'
            min='1'
          />
          <p className='text-xs text-gray-500 mt-1'>
            Number of times a user can attempt this exam
          </p>
        </Box>

        <Box className='flex gap-3 pt-4'>
          <AdminCustomButton
            type='submit'
            variant='primary'
            disabled={isSubmitting || isLoading}
            className='flex-1'
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </AdminCustomButton>
          <AdminCustomButton
            type='button'
            variant='secondary'
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            className='flex-1'
          >
            Cancel
          </AdminCustomButton>
        </Box>
      </form>
    </Box>
  );
};

export default ExamSettingsForm;