// src/components/CardSkeleton.jsx
const CardSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse border border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="mt-4 flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
        </div>
    </div>
);

export default CardSkeleton;
