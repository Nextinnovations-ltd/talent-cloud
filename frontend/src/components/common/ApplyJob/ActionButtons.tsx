import React from 'react';
import { Button } from '../../ui/button';
import BOOKMARK from '@/assets/Bookmark.svg';

export const ActionButtons: React.FC = () => (
  <div className='gap-[28px] mb-[40px] flex'>
    <Button className='bg-blue-500 text-white'>Quick Apply</Button>
    <Button className='bg-[#C8C8C8] text-white gap-2'>
      <img width={24} height={24} src={BOOKMARK} alt="Bookmark"/>Save
    </Button>
  </div>
); 