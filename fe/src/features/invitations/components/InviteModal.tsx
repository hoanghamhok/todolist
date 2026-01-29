interface InviteModalProps{
    open:boolean;
    inviteToken:string;
    onAccept:(token:string) => void;
    onReject:(token:string) => void;
    onClose:() => void;
    isLoading:boolean;
    error?:string;
}

export function InviteModal({
    inviteToken,
    open,
    onAccept,
    onReject,
    onClose,
    isLoading,
    error
}:InviteModalProps){
    if(!open || !inviteToken) return null;

    return (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
                <div className="px-4 py-3 border-b flex justify-between items-center">
                    <h2 className="font-semibold text-lg">
                        Project Invitation
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="px-4 py-5">
                    <p className="text-sm text-gray-700">
                        You have received an invitation to participate in the project.
                        Do you wish to accept this invitation?
                    </p>
                </div>

                <div className="px-4 py-3 border-t flex justify-end gap-3">
                    <button
                        disabled={isLoading}
                        onClick={() => onReject(inviteToken)}
                        className={`px-4 py-2 text-sm rounded-lg border
                        ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
                        `}
                    >
                        {isLoading ? "Processing..." : "Reject"}
                    </button>

                    <button
                        disabled={isLoading}
                        onClick={() => onAccept(inviteToken)}
                        className={`px-4 py-2 text-sm rounded-lg bg-blue-500 text-white
                        ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}
                        `}
                    >
                        {isLoading ? "Processing..." : "Accept"}
                    </button>
                </div>
                {error && (
                <p className="text-sm text-red-500 mt-2">
                    {error}
                </p>
                )}
            </div>
        </div>
        
    );
}