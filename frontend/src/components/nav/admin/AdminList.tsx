import SvgAdminList from '@/assets/svgs/SvgAdminList';
import { ChevronDown, Plus } from 'lucide-react';
import Admins from './Admins';
import { useState } from 'react'; // Import useState hook

const AdminList = () => {
  // Add state to track whether the panel is visible
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  // Function to toggle panel visibility
  const togglePanelVisibility = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <div className='mt-[48px] px-[24px]'>
      <div 
        className='flex items-center justify-between cursor-pointer' 
        onClick={togglePanelVisibility} // Make the whole header clickable
      >
        <p className='font-semibold text-[12px] text-[#575757]'>Admins</p>
        <ChevronDown 
          color='#575757' 
          size={20}
          className={`transition-transform duration-200 ${!isPanelVisible ? 'rotate-180' : ''}`} // Rotate icon when panel is hidden
        />
      </div>
      
      {/* Conditionally render the panel content */}
      {isPanelVisible && (
        <div>
          <div className='mt-[16px]'>
            <div className='flex items-center cursor-pointer justify-start gap-[16px] text-[#575757]'>
              <SvgAdminList/> <p className='text-[16px] font-medium'>Admin List</p>
            </div>
            <Admins/>
          </div>
        </div>
      )}
      
      <div className='flex items-center mt-[32px] cursor-pointer justify-start gap-[16px] text-[#0481EF]'>
        <Plus/> <p className='text-[16px] font-medium'>Add New Admin</p>
      </div>
    </div>
  )
}

export default AdminList;