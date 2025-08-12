const Admins = () => {
  return (
    <div className='flex gap-1 mt-4'>
      {[1,2,3,4].map((item) => (
        <div key={item} className='relative'>
          <img 
            className='w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border object-cover'
            src='https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg'
            alt={`Admin ${item}`}
          />
        </div>
      ))}
    </div>
  )
}

export default Admins;