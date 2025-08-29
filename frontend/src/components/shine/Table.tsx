const Table = () => {
    return (
        <table className="w-[1055px]">
            <tr>
                <th className="text-[20px] text-center font-medium leading-[135%] tracking-[0%] pb-[41px]">Notification Title</th>
                <th className="text-[20px] text-center font-medium leading-[135%] tracking-[0%] pb-[41px]">Message Preview</th>
                <th className="text-[20px] text-center font-medium leading-[135%] tracking-[0%] pb-[41px]">Type</th>
                <th className="text-[20px] text-center font-medium leading-[135%] tracking-[0%] pb-[41px]">Sent On</th>
                <th className="text-[20px] text-center font-medium leading-[135%] tracking-[0%] pb-[41px]">Actions</th>
            </tr>
            <tr className="text-[#575757]">
                <td className="text-[16px] text-center font-medium leading-[135%] tracking-[0%] py-[32px]">New Job Posted</td>
                <td className="text-[16px] text-start font-medium leading-[135%] tracking-[0%] w-[192px]">our profile has been approved.</td>
                <td className="text-[16px] text-center font-medium leading-[135%] tracking-[0%]">Job Alert</td>
                <td className="text-[16px] text-center font-medium leading-[135%] tracking-[0%]">7/29/2025</td>
                <td>
                    <div className="flex gap-4 justify-center">
                        <button className="p-[7px] rounded-full bg-[#F9F9FA]">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 11.666H12.25" stroke="#575757" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9.625 2.04212C9.85706 1.81006 10.1718 1.67969 10.5 1.67969C10.6625 1.67969 10.8234 1.71169 10.9735 1.77388C11.1237 1.83607 11.2601 1.92722 11.375 2.04212C11.4899 2.15703 11.5811 2.29344 11.6432 2.44358C11.7054 2.59371 11.7374 2.75462 11.7374 2.91712C11.7374 3.07963 11.7054 3.24054 11.6432 3.39067C11.5811 3.5408 11.4899 3.67722 11.375 3.79212L4.08333 11.0838L1.75 11.6671L2.33333 9.33379L9.625 2.04212Z" stroke="#575757" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button className="p-[7px] rounded-full bg-[#F9F9FA]">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.08203 12.25C3.7612 12.25 3.48664 12.1359 3.25836 11.9076C3.03009 11.6793 2.91575 11.4046 2.91536 11.0833V3.5H2.33203V2.33333H5.2487V1.75H8.7487V2.33333H11.6654V3.5H11.082V11.0833C11.082 11.4042 10.9679 11.6789 10.7396 11.9076C10.5113 12.1362 10.2366 12.2504 9.91536 12.25H4.08203ZM9.91536 3.5H4.08203V11.0833H9.91536V3.5ZM5.2487 9.91667H6.41536V4.66667H5.2487V9.91667ZM7.58203 9.91667H8.7487V4.66667H7.58203V9.91667Z" fill="#E50914"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        </table>
    );
}

export default Table;
