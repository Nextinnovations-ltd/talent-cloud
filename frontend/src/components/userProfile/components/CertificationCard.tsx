interface CertificationCardProps {
    img?: string;
    name: string;
    org: string;
    id: string;
    expire: string;
    isEdit?: boolean;
}

export const CertificationCard = ({
    img,
    name,
    org,
    id,
    expire,
    isEdit = false
}: CertificationCardProps) => {
    return (
        <div className="relative">
            {isEdit && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button className="p-1 bg-white rounded-full shadow hover:bg-gray-100" title="Edit">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2z" /></svg>
                    </button>
                    <button className="p-1 bg-white rounded-full shadow hover:bg-gray-100" title="Delete">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}
            <div className='bg-[#CBD5E1] rounded-[20px] p-[20px] mb-[30px]'>
                {img && <img src={img} alt="Certification" />}
            </div>
            <h3 className='text-[26px] font-[600] mb-[20px]'>{name}</h3>
            <h3 className='text-[18px] mb-[16px]'>{org}</h3>
            <h3 className='mb-[16px] text-[#6B6B6B]'>{id}</h3>
            <h3 className='mb-[16px] text-[#6B6B6B]'>{expire}</h3>
        </div>
    );
}; 