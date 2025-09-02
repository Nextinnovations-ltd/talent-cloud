import SCHOOLLOGO from '@/assets/Login/SchoolLogo.svg';
import NOEDU from '@/assets/Login/Login/Vector.svg';
import { useNavigate } from 'react-router-dom';
import SvgEdit from '@/assets/svgs/SvgEdit';
import SvgDelete from '@/assets/svgs/SvgDelete';
import { useState } from 'react';
import { useDeleteEducationByIdMutation } from '@/services/slices/jobSeekerSlice';
import useToast from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface EducationCardProps {
    hasSchoolLogo?: boolean;
    isEdit?: boolean;
    id?: number;
    institution: string;
    degree: string;
    description: string;
    is_currently_attending: boolean;
    start_date: string;
    end_date: string

}

// Helper function to format date from ISO format to display format
const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
};

// Helper function to format date range
const formatDateRange = (startDate: string, endDate: string, isCurrentlyAttending: boolean): string => {
    const startFormatted = formatDateForDisplay(startDate);
    
    if (isCurrentlyAttending) {
        return `${startFormatted} - Present`;
    }
    
    const endFormatted = formatDateForDisplay(endDate);
    return `${startFormatted} - ${endFormatted}`;
};

export const EducationCard = ({ hasSchoolLogo = false, isEdit = false, id, institution, degree, description, is_currently_attending, start_date, end_date }: EducationCardProps) => {

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [deleteEducationById] = useDeleteEducationByIdMutation();
    const {showNotification} = useToast();

    const handleDelete = async () => {
        if (id) {
            await deleteEducationById(id);
            showNotification({message:"DeleteSucces",type:'success'})
            setOpen(false);
            // Optionally, show a toast or update UI
        }
    };

    // Format the date range
    const dateRange = formatDateRange(start_date, end_date, is_currently_attending);

    return (
        <div className="relative ">
            {isEdit && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                    {/* Replace with your actual edit/delete icons as needed */}
                    <button onClick={() => navigate(`/user/edit/education?id=${id}`)} className="p-1 w-[35px] h-[35px] flex items-center justify-center rounded-full bg-[#0389FF]  shadow  hover:bg-[#0389FF]/80 hover:scale-105" title="Edit">
                        <SvgEdit size={16} color={'#ffffff'} />
                    </button>
                    <button onClick={() => setOpen(true)} className="p-1 w-[35px] h-[35px] bg-[#F23030] rounded-full shadow hover:bg-[#F23030]/80 hover:scale-105" title="Delete">
                        <SvgDelete size={18} color={'#ffffff'} />
                    </button>
                </div>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle>Delete Education</DialogTitle>
                    <div className="mb-4">
                        Are you sure you want to delete <span className="font-semibold">{degree}</span> at <span className="font-semibold">{institution}</span>?
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            className="px-4 w-[100px] py-2 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => setOpen(false)}
                        >
                            No
                        </button>
                        <button
                            className="px-4 py-2 w-[100px] bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={handleDelete}
                        >
                            Yes
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
            <div>
                {hasSchoolLogo ? (
                    <img className='h-[96px] mb-[36px]' src={SCHOOLLOGO} alt="School Logo" />
                ) : (
                    <div className='w-[96px] bg-[#EFF2F6] flex items-center justify-center mb-[36px] h-[96px] rounded-full'>
                        <img src={NOEDU} alt="No Education Logo" />
                    </div>
                )}
                <div>
                    <h3 className='font-bold text-[26px] mb-[20px]'>
                      {degree}
                    </h3>
                    <div>
                        <p className='text-[18px] mb-[16px]'>{institution}</p>
                        <p className='text-[16px] text-[#6B6B6B] mb-[30px]'>{dateRange}</p>
                    </div>
                    <p className='text-[18px] text-[#6B6B6B]'>
                       {description}
                    </p>
                </div>
            </div>
        </div>
    );
}; 