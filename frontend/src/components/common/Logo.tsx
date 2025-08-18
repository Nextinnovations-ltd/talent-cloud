import TalentCloudLogo from "@/assets/Employee/Vector (3).svg";

import { Link } from 'react-router-dom'


export const Logo = () => {
  return (
    <Link to={'/'} className=''>
        <img src={TalentCloudLogo} width={180} height={50}/>
    </Link>
  )
}
