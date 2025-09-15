import { Search } from "lucide-react"

 const AllCandidateActionHeader = () => {
  return (
    <div>
        <div className="flex bg-[#F3F4F6]">
            <input placeholder="Search by name ?"/>
            <div className="w-[38px] h-[38px] bg-[#0481EF] rounded-full flex items-center justify-centers"><Search color="#ffffff"/></div>
        </div>

    </div>
  )
}

export default AllCandidateActionHeader