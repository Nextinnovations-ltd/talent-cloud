

export const RecenTitles = ({title,handleAction,viewAll = true}:{title:string,handleAction?:()=>void,viewAll?:boolean}) => {
  return (
    <div className="flex items-center border-b py-[24px] border-b-[#CBD5E1] justify-between">
        <h3 className="text-[16px] font-semibold">{title}</h3>
        {
        viewAll && <h3 className="text-[#0389FF] hover:underline cursor-pointer" onClick={handleAction}>View All</h3>
        }
    </div>
  )
}
