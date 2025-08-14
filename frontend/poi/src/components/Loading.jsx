import {Loader2} from 'lucide-react'

export default function Loading(){
    return(
        <div className='animate-pulse text-fuchsia-700 absolute z-20 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
            <Loader2 size={40}/>
        </div>
    )
}