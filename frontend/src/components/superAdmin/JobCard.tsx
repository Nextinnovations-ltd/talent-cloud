import CompanyIcon from "@/assets/SuperAdmin/company.svg"
import Calendar from "@/assets/SuperAdmin/calendar-clock.svg"
import Eye from "@/assets/SuperAdmin/eye.svg"
import UserIcon from "@/assets/SuperAdmin/users.svg"

const JobCard = () => {
    return (
        <div className="max-w-[312px] px-[21.5px] py-[15.5px] border border-[#CBD5E1] rounded-xl">
            <div className="flex justify-between items-start">
                <div className="font-medium leading-[135%]">
                    <h3 className="text-[14px] text-[#575757]">Position</h3>
                    <h3 className="text-[16px] text-[#000]">UI UX Designer</h3>
                </div>
                <div>Button</div>
            </div>

            <div className="space-y-[12px] mt-[12px] text-[#575757] text-[12px] font-medium leading-[135%]">
                <div className="flex items-center gap-[12px]">
                    <img src={CompanyIcon} alt="" />
                    <p>Next Innovations</p>
                </div>
                <div className="flex items-center gap-[12px]">
                    <img src={Calendar} alt="" />
                    <p>Deadline : <span className="">July 10 2025</span></p>
                </div>
                <div className="flex items-center gap-[12px]">
                    <img src={Eye} alt="" />
                    <p>Views : <span className="text-[#0481EF]">253</span></p>
                </div>
                <div className="flex items-center gap-[12px]">
                    <img src={UserIcon} alt="" />
                    <p>Applicants : 82</p>
                </div>
            </div>

            <div className="flex items-center justify-around mt-[24.5px]">
                <button className="bg-[#F0F9FF] p-2 rounded-full group">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:fill-black">
                    <path d="M4.6665 14C4.29984 14 3.98606 13.8696 3.72517 13.6087C3.46428 13.3478 3.33362 13.0338 3.33317 12.6667V4H2.6665V2.66667H5.99984V2H9.99984V2.66667H13.3332V4H12.6665V12.6667C12.6665 13.0333 12.5361 13.3473 12.2752 13.6087C12.0143 13.87 11.7003 14.0004 11.3332 14H4.6665ZM11.3332 4H4.6665V12.6667H11.3332V4ZM5.99984 11.3333H7.33317V5.33333H5.99984V11.3333ZM8.6665 11.3333H9.99984V5.33333H8.6665V11.3333Z"
                        className="fill-[#0481EF] group-hover:fill-black transition-colors"
                    />
                    </svg>
                </button>
                <button className="bg-[#F0F9FF] p-2 rounded-full group">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.3335 8C1.3335 8 3.3335 3.33333 8.00016 3.33333C12.6668 3.33333 14.6668 8 14.6668 8C14.6668 8 12.6668 12.6667 8.00016 12.6667C3.3335 12.6667 1.3335 8 1.3335 8Z"
                        className="stroke-[#0481EF] group-hover:stroke-black transition-colors"
                        stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                        className="stroke-[#0481EF] group-hover:stroke-black transition-colors"
                        stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button className="bg-[#F0F9FF] p-2 rounded-full group">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 13.3333H14" className="stroke-[#0481EF] group-hover:stroke-black transition-colors" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11 2.33333C11.2652 2.06811 11.6249 1.91911 12 1.91911C12.1857 1.91911 12.3696 1.95569 12.5412 2.02676C12.7128 2.09783 12.8687 2.202 13 2.33333C13.1313 2.46465 13.2355 2.62055 13.3066 2.79213C13.3776 2.96371 13.4142 3.14761 13.4142 3.33333C13.4142 3.51904 13.3776 3.70294 13.3066 3.87452C13.2355 4.0461 13.1313 4.202 13 4.33333L4.66667 12.6667L2 13.3333L2.66667 10.6667L11 2.33333Z"
                        className="stroke-[#0481EF] group-hover:stroke-black transition-colors"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>

        </div>
    );
}

export default JobCard;
