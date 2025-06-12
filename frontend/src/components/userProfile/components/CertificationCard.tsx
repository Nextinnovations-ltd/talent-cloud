interface CertificationCardProps {
    img?: string;
    name: string;
    org: string;
    id: string;
    expire: string;
}

export const CertificationCard = ({
    img,
    name,
    org,
    id,
    expire
}: CertificationCardProps) => {
    return (
        <div>
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