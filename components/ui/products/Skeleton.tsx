export default function Skeleton() {
    return (
        <div className="border border-gray-200 p-4 rounded-lg">
            <div className="animate-pulse flex flex-col gap-4">
                <div className="bg-gray-200 h-48 w-full rounded-md"></div>
                <div className="space-y-2">
                    <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-200 h-4 w-full rounded"></div>
                    <div className="bg-gray-200 h-6 w-1/4 rounded"></div>
                </div>
            </div>
        </div>
    );
}