import clsx from "clsx";


const PortalCopyRight = ({ boarding }: { boarding?: boolean }) => {
    return (
        <div className={clsx('h-[50px]  text-[#6F748B] bg-[#F5F5F5]  bottom-0 left-0 right-0 py-[13px] flex items-center justify-center',boarding ? "h-[84px] z-50" : 'h-[50px]')}> {boarding ? "Copyright © Next Innovations Ltd. 2025" : "Copyright © Talent Cloud"}</div>
    )
}

export default PortalCopyRight;
