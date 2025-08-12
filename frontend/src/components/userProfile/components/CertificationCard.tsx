import SvgDelete from "@/assets/svgs/SvgDelete";
import SvgEdit from "@/assets/svgs/SvgEdit";
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import  { useState } from 'react';
import { useDeleteCertificationByIdMutation } from '@/services/slices/jobSeekerSlice';
import useToast from '@/hooks/use-toast';

interface CertificationCardProps {
    img?: string;
    name: string;
    org: string;
    expire: string;
    isEdit?: boolean;
    id:number;
    url:string
}

// Define the expected response type for deleteCertificationById
interface DeleteCertificationResponse {
    status: boolean;
    message: string;
    data: null;
}

export const CertificationCard = ({
    img,
    name,
    org,
    id,
    expire,
    isEdit = false,
    url
}: CertificationCardProps) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [deleteCertificationById] = useDeleteCertificationByIdMutation();
    const { showNotification } = useToast();
    const handleDelete = async () => {
        if (id) {
            try {
                const response = await deleteCertificationById(id) as { data: DeleteCertificationResponse };
                if (response?.data?.status) {
                    showNotification({ message: response.data.message || "Delete Success", type: 'success' });
                } else {
                    showNotification({ message: response?.data?.message || "Delete failed", type: 'danger' });
                }
            } catch (error) {
                showNotification({ message: (error as Error)?.message || "Delete failed", type: 'danger' });
            }
            setOpen(false);
        }
    };

    const handleEdit = () => {
        try {
            navigate(`/user/edit/certifications?id=${id}`);
        } catch (error) {
            showNotification({ message: (error as Error)?.message || "Navigation failed", type: 'danger' });
        }
    };
    return (
        <div className="relative">
           
            {isEdit && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button onClick={handleEdit} className="p-1 w-[35px] h-[35px] flex items-center justify-center rounded-full bg-[#0389FF]  shadow  hover:bg-[#0389FF]/80 hover:scale-105" title="Edit">
                        <SvgEdit size={16} color={'#ffffff'} />
                    </button>
                    <button onClick={() => setOpen(true)} className="p-1 w-[35px] h-[35px] bg-[#F23030] rounded-full shadow hover:bg-[#F23030]/80 hover:scale-105" title="Delete">
                        <SvgDelete size={18} color={'#ffffff'} />
                    </button>
                </div>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle>Delete Certification</DialogTitle>
                    <div className="mb-4">
                        Are you sure you want to delete <span className="font-semibold">{name}</span> from <span className="font-semibold">{org}</span>?
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
            <div className='bg-[#CBD5E1] rounded-[20px] p-[20px] mb-[30px]'>
                {img && <img src={img} alt="Certification" />}
            </div>
           <div className="flex mb-[20px] items-center justify-between"> <h3 className='text-[26px] font-[600] '>{name}</h3> {url && (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-[62px] h-[40px]  flex items-center justify-center rounded-full bg-[#10B981]/40 shadow hover:bg-[#10B981]/80 hover:scale-105"
                            title="View Certificate"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m3-3h5m0 0v5m0-5L10 14"/></svg>
                        </a>
                    )}</div>
            <h3 className='text-[18px] mb-[16px]'>{org}</h3>
            <h3 className='mb-[16px] text-[#6B6B6B]'>{expire}</h3>
        </div>
    );
}; 