import { Video, Image } from 'lucide-react';

interface Props {
  index: string
}

export default function SkeletonPost({index}: Props) {

  return (
    <div className='basis-1/3 w-1/3 min-h-80 relative p-[0.5px]'>
      {
         +index % 2 === 0 ? 
        (<div className='bg-gray-300 h-full w-full flex items-center justify-center relative'>
          <div className='absolute right-2.5 top-2.5 text-white'><Image /></div>
        </div>) 
        :
        (<div className='bg-gray-300 h-full w-full flex items-center relative'>
          <div className='absolute right-2.5 top-2.5 text-white'><Video /></div>
        </div>)
        }
    </div>
  )
}
