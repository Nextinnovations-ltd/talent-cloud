import { Search } from "lucide-react"
import SortsButtons from "../../AllJobs/SortsButtons"

interface AllCandidateActionProps {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>,
}

const AllCandidateActionHeader: React.FC<AllCandidateActionProps> = ({
  sortBy,
  setSortBy
}) => {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("search") as string
    console.log("Searching for:", query)
    // you can lift this up as a prop to handle search
  }

  return (
    <div className="flex items-center justify-between gap-4 ">
      {/* Search Bar */}
      <form 
        onSubmit={handleSearch} 
        className="flex items-center bg-[#F3F4F6] rounded-[30px] h-[72px] px-4 py-2 w-full max-w-[382px] shadow-sm focus-within:ring-2 focus-within:ring-[#0481EF]"
      >
        <input 
          name="search"
          className="flex-1 bg-transparent text-[#333] placeholder-[#888] text-sm md:text-base outline-none"
          placeholder="Search candidates by name..."
        />
        <button 
          type="submit" 
          aria-label="Search"
          className="w-10 h-10 bg-[#0481EF] rounded-full flex items-center justify-center hover:bg-[#036ad4] transition"
        >
          <Search size={18} color="#ffffff" />
        </button>
      </form>

      {/* Sort Buttons */}
      <div className="flex items-center justify-center gap-2 md:gap-4 pr-4">
        <SortsButtons
          title="Year of experience"
          field="year_of_experience"
          currentSort={sortBy}
          onToggle={setSortBy}
        />
        <SortsButtons
          title="Available"
          field="available"
          currentSort={sortBy}
          onToggle={setSortBy}
        />
        <SortsButtons
          title="Date"
          field="created_at"
          currentSort={sortBy}
          onToggle={setSortBy}
        />
      </div>
    </div>
  )
}

export default AllCandidateActionHeader
