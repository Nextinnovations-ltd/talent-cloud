import { TalentCloudLogoImg } from '@/assets/svgs/svgs'
import { Link } from 'react-router-dom'


export const Logo = () => {
  return (
    <Link to={'/'} className=''>
        <TalentCloudLogoImg width='180' height='49' />
    </Link>
  )
}
