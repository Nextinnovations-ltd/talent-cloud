import React from 'react';
import { Button } from '../../ui/button';
import BOOKMARK from '@/assets/Bookmark.svg';
import { useBookMarkedJobMutation } from '@/services/slices/jobApplySlice';
import { LoadingSpinner } from '../LoadingSpinner';
import {  Link } from 'react-router-dom';
import useToast from '@/hooks/use-toast';
import { Bookmark } from 'lucide-react';

interface ActionButtonsProps {
  jobId:number
}



export const ActionButtons: React.FC<ActionButtonsProps> = ({jobId}) => {

  const [bookmarkJob, { isLoading:JOBBOOKLOADING}] = useBookMarkedJobMutation();
  const { showNotification } = useToast();


  const handleBookmark = async (jobId: number) => {
    try {
      const response = await bookmarkJob(jobId).unwrap();
      showNotification({
        message: response?.message,
        type: "success",
      });
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: "danger",
      });
    }
  };



 return ( <div className='gap-[28px] mb-[40px] flex'>
   <Link to={`user/job_apply/${jobId}`}>
   <Button  className='bg-blue-500 drop-shadow-lg rounded-[12px] text-white'>Quick Apply</Button></Link>
    <Button onClick={()=>handleBookmark(jobId)} className='bg-[#C8C8C8] drop-shadow-lg rounded-[12px] w-[100px] text-white gap-2'>
      {
        JOBBOOKLOADING ? <LoadingSpinner/>: <><Bookmark />Save</>
      }
    </Button>
  </div>)
}; 