export default function Loading(){
    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="relative w-16 h-16">
                {/* Top circle */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-6 rounded-full bg-[#f4511e] animate-ping"></div>
                
                {/* Bottom-left circle */}
                <div className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-green-600 animate-ping [animation-delay:0.2s]"></div>
                
                {/* Bottom-right circle */}
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-red-600 animate-ping [animation-delay:0.4s]"></div>
            </div>
        </div>
    )
}