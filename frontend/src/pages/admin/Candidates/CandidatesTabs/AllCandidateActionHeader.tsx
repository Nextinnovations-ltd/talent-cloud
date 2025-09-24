import { Search } from "lucide-react"
import SortsButtons from "../../AllJobs/SortsButtons"
import React from "react";

interface AllCandidateActionProps {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  search: string
}

const AllCandidateActionHeader: React.FC<AllCandidateActionProps> = ({
  sortBy,
  setSortBy,
  setSearch,
  search
}) => {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("search") as string
    setSearch(query) // update parent state
    console.log("Searching for:", query)
  }

  return (
    <div className="flex items-center justify-between gap-4 ">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-[#F3F4F6] rounded-[35px] h-[62px] px-4 py-2 w-full max-w-[368px] shadow-sm focus-within:ring-2 focus-within:ring-[#0481EF]"
      >
        <input
          name="search"
          value={search} // controlled input
          onChange={(e) => setSearch(e.target.value)} // update state on typing
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
          field="experience_years"
          currentSort={sortBy}
          onToggle={setSortBy}
        />
        <SortsButtons
          title="Available"
          field="open_to_work"
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
