import { ReactNode } from "react";


const SUMMARYDATA = [
    {
        value: "Remote",
        des:'Workplace Type'
    },
    {
        value: "22",
        des:'Age'
    },
    {
        value: "Fond-End Developer",
        des:'Role'
    },
    {
        value: "Remote",
        des:'Workplace Type'
    },
    {
        value: "22",
        des:'Age'
    },
    {
        value: "Fond-End Developer",
        des:'Role'
    }
]

 const OverView = () => {
  return (
    <div className="space-y-[50px]">
        <Frame title="Profile Summary" children={
            <div className="grid grid-cols-3  gap-[32px]">
            {
                SUMMARYDATA.map((e,index)=> <div key={index} className="px-[24px]  flex flex-col items-center justify-center rounded-3xl border-[#CBD5E1] py-[40px] border-[1px]">
                <h3 className="text-[16px]">{e.value}</h3> 
                <p className="mt-[6px] text-[#6B6B6B] text-[12px]">{e.des}</p>
                </div>)
            }
            </div>
        }/>
        <Frame title="Recent Application " children={
              <div className="grid grid-cols-3  gap-[52px]">
              {
                  SUMMARYDATA.map((e,index)=> <div key={index} className="px-[15px]  flex flex-col items-start justify-start  border-l-[#0481EF]  border-l-[4px] rounded-[2px]">
                  <h3 className="text-[16px] font-[500px]">{e.value}</h3> 
                  <p className="mt-[6px] text-[#6B6B6B] text-[12px]">{e.des}</p>
                  </div>)
              }
              </div>
        }/>
    </div>
  )
}


const Frame = ({title,children}:{title:string,children:ReactNode})=> {
    return (
        <div className="border border-[#CBD5E1] rounded-xl mt-[72px] w-full py-[35px] px-[40px] ">
            <h3 className="text-[24px] font-semibold mb-[32px]">{title}</h3>
            {children}
        </div>
    )
}

export default OverView;