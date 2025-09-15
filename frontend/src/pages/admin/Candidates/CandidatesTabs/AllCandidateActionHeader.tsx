import { Search } from "lucide-react"

const AllCandidateActionHeader = () => {
    return (
        <div>
            <div className="flex bg-[#F3F4F6] h-[72px] px-[19px] justify-between items-center rounded-[30px] w-[382px]">
                <input className="bg-[#F3F4F6] outline-none" placeholder="Search by name ?" />
                <div className="w-[38px] h-[38px] bg-[#0481EF] rounded-full flex items-center justify-center"><Search color="#ffffff" /></div>
            </div>

        </div>
    )

}

export default AllCandidateActionHeader