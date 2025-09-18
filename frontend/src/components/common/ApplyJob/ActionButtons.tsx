import React from 'react';
import { Button } from '../../ui/button';
import { useBookMarkedJobMutation, useDeleteBookMarkedJobMutation } from '@/services/slices/jobApplySlice';
import { LoadingSpinner } from '../LoadingSpinner';
import {  Link } from 'react-router-dom';
import useToast from '@/hooks/use-toast';

interface ActionButtonsProps {
  jobId: number;
  alreadyApplied: boolean | undefined;
  isBookmarked?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ jobId, alreadyApplied, isBookmarked }) => {
  const [bookmarkJob, { isLoading: JOBBOOKLOADING }] = useBookMarkedJobMutation();
  const [deleteBookMark, { isLoading: DELETELOADING }] = useDeleteBookMarkedJobMutation();
  const { showNotification } = useToast();

  const handleBookmark = async (jobId: number) => {
    try {
      const response = await bookmarkJob(jobId).unwrap();
      showNotification({
        message: response?.message,
        type: 'success',
      });
    } catch (error: unknown) {
      let errorMessage = 'An error occurred';
      if (typeof error === 'object' && error !== null) {
        // @ts-expect-error RTK Query error object may have data property
        errorMessage = error?.data?.message || error?.message || errorMessage;
      }
      if (errorMessage === 'Job is already bookmarked.') {
        handleDeleteBookmark(jobId);
      } else {
        showNotification({
          message: errorMessage,
          type: 'danger',
        });
      }
    }
  };

  const handleDeleteBookmark = async (jobId: number) => {
    try {
      const response = await deleteBookMark(jobId).unwrap();
      showNotification({
        message: response?.message,
        type: 'success',
      });
    } catch (error: unknown) {
      let errorMessage = 'An error occurred';
      if (typeof error === 'object' && error !== null) {
        // @ts-expect-error RTK Query error object may have data property
        errorMessage = error?.data?.message || error?.message || errorMessage;
      }
      showNotification({
        message: errorMessage,
        type: 'danger',
      });
    }
  };

  return (
    <div className='gap-[28px] mb-[40px] flex items-center '>
    
      <Button
        onClick={() => (isBookmarked ? handleDeleteBookmark(jobId) : handleBookmark(jobId))}
        className={` rounded-[12px] shadow-none text-[16px] h-[48px]  w-[100px] text-[#0481EF] gap-2 bg-[#E6F3FF]   `}
        disabled={JOBBOOKLOADING || DELETELOADING}
      >
        {(JOBBOOKLOADING || DELETELOADING) ? <LoadingSpinner /> : <>{isBookmarked ? 'Unsave' : 'Save'}</>}
      </Button>
      <div className='flex items-center gap-[28px] justify-center'>
     {
        !alreadyApplied ? (
          <Link to={`user/job_apply/${jobId}`}>
            <Button className='bg-blue-500 shadow-none text-[16px] h-[48px] px-[20px]  rounded-[12px] text-white'>Quick Apply</Button>
          </Link>
        ) : (
          <p  className='text-blue-500   text-[16px]   rounded-[12px]'>Applied</p>
        )
      }
     </div>
    </div>
  );
}; 