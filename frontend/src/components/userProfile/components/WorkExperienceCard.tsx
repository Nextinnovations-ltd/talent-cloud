import NOLOGO from '@/assets/Login/Login/VectorNO.svg';
import SvgDelete from '@/assets/svgs/SvgDelete';
import SvgEdit from '@/assets/svgs/SvgEdit';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDeleteExperienceByIdMutation } from '@/services/slices/jobSeekerSlice';
import useToast from '@/hooks/use-toast';

interface WorkExperienceCardProps {
    logo?: string;
    title: string;
    companyName: string;
    experience: string;
    description: string;
    isEdit?: boolean;
    id?: number
}

export const WorkExperienceCard = ({
    logo,
    title,
    companyName,
    experience,
    description,
    isEdit = false,
    id
}: WorkExperienceCardProps) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [deleteExperienceById] = useDeleteExperienceByIdMutation();
    const { showNotification } = useToast();
    const handleDelete = async () => {
        if (id) {
            await deleteExperienceById(id);
            showNotification({ message: "DeleteSucces", type: 'success' })
            setOpen(false);
            // Optionally, show a toast or update UI
        }
    };

    return (
        <div className="relative">
            {/* Edit icons if in edit mode */}
            {isEdit && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                    {/* Replace with your actual edit/delete icons as needed */}
                    <button onClick={() => navigate(`/user/edit/workexperience?id=${id}`)} className="p-1 w-[35px] h-[35px] flex items-center justify-center rounded-full bg-[#0389FF]  shadow  hover:bg-[#0389FF]/80 hover:scale-105" title="Edit">
                        <SvgEdit size={16} color={'#ffffff'} />
                    </button>
                    <button onClick={() => setOpen(true)} className="p-1 w-[35px] h-[35px] bg-[#F23030] rounded-full shadow hover:bg-[#F23030]/80 hover:scale-105" title="Delete">
                        <SvgDelete size={18} color={'#ffffff'} />
                    </button>
                </div>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle>Delete Work Experience</DialogTitle>
                    <div className="mb-4">
                        Are you sure you want to delete <span className="font-semibold">{title}</span> at <span className="font-semibold">{companyName}</span>?
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
            {logo ? (
                <img className='h-[96px] mb-[36px]' src={logo} alt="Company Logo" />
            ) : (
                <div className='w-[96px] bg-[#EFF2F6] flex items-center justify-center mb-[36px] h-[96px] rounded-full'>
                    <img src={NOLOGO} alt="No Logo" />
                </div>
            )}
            <div>
                <h3 className='font-bold text-[26px] mb-[20px]'>{title}</h3>
                <div>
                    <p className='text-[18px] mb-[16px]'>{companyName}</p>
                    <p className='text-[16px] text-[#6B6B6B] mb-[30px]'>{experience}</p>
                </div>
                <p className='text-[18px] text-[#6B6B6B]'>{description}</p>
            </div>
        </div>
    );
}; 