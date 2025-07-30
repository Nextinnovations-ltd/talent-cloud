import SearchBtn from "@/assets/SuperAdmin/Search.svg"

const SearchBox = () => {
    return (
        <form>   
            <div className="relative max-w-[800px]">
                <input type="search" className="block w-full h-[72px] text-[16px] text-[#575757] font-normal leading-[135%] rounded-[25px] p-[19px] bg-[#F3F4F6] border-2 border-[rgba(4, 129, 239, 0.75)] focus:border-[#0481EF] focus:outline-none" placeholder="What are you looking for ?" />
                <button type="submit" className="w-[38px] h-[38px] bg-[#0481EF] flex justify-center items-center rounded-full absolute top-[17px] end-[11px]">
                    <img src={SearchBtn} alt="" />
                </button>
            </div>
        </form>
    );
}

export default SearchBox;
