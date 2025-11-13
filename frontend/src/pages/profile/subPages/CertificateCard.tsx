/* eslint-disable @typescript-eslint/no-explicit-any */
import BGGRADIENT from '@/assets/images/projectCardBg.png'
import SvgDelete from '@/assets/svgs/SvgDelete';
import SvgEdit from '@/assets/svgs/SvgEdit';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";



type CertificateCardProps = {
    id: number;
    title: string;
    handleEdit: any;
    handleDelete: any;
    organization: string;
    expirationDate: string;
    modalTitle:string;
    setDeleteModal:any;
    deleteModal:any
}

const CertificateCard: React.FC<CertificateCardProps> = ({
    id,
    handleDelete,
    handleEdit,
    title,
    organization,
    expirationDate,
    modalTitle,
    setDeleteModal,
    deleteModal
}) => {

    // ✅ Format expiration date like "Dec 2026"
    const formatExpirationDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // fallback if invalid
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="border border-[#CFD1D4] p-5 mt-5 rounded-[12px] relative bg-white transition-all duration-200 ">
            <div className="flex items-start justify-between">
                {/* Project Info */}
                <div className="flex gap-5 items-start">
                    <img
                        width={140}
                        height={117}
                        className="rounded-[8px] object-cover h-[117px]"
                        src={BGGRADIENT}
                        alt={title}
                    />
                    <div className='flex flex-col gap-[6px] w-full'>
                        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                        <p className="text-sm text-[#27272A] font-medium mt-1">
                            {organization}
                        </p>

                        {expirationDate && (
                            <p className='text-[#6B6B6B] text-[12px]'>
                                Expiration Date: {formatExpirationDate(expirationDate)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleEdit(id)}
                        className="flex items-center justify-center gap-[7px] border border-[#D0D0D0] text-[12px] text-[#6B6B6B] w-[73px] h-[35px] rounded-xl hover:bg-gray-100 transition"
                    >
                        <SvgEdit size={16} color="#6B6B6B" /> Edit
                    </button>

                     {/* Delete Button with Dialog */}
            <Dialog open={deleteModal} onOpenChange={setDeleteModal}  >
              <DialogTrigger asChild>
                <button className="flex items-center justify-center  border border-[#D0D0D0] text-[12px] text-[#6B6B6B] w-[85px] h-[35px] rounded-xl hover:bg-gray-100 transition">
                  <SvgDelete size={16} color="#6B6B6B" /> Delete
                </button>
              </DialogTrigger>

              <DialogContent className="h-[220px] p-[34px]">
                <DialogHeader>
                  <DialogTitle className="text-[20px] font-normal text-[#E50914]">{modalTitle || "Delete"}</DialogTitle>
                  <DialogDescription className="pt-[5px] text-[#484747]">
                    Are you sure you want to delete <b>{title}</b>? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex  justify-end gap-2">
                  <button
                    className="px-4 py-2 border h-[50px] w-full rounded-lg hover:bg-gray-100 bg-[#0481EF17]"
                    onClick={() => setDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 border rounded-lg w-full h-[50px] hover:bg-[#DB2323]/80 bg-[#DB2323] text-white"
                    onClick={()=>handleDelete(id)}
                  >
                    Delete
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CertificateCard;
