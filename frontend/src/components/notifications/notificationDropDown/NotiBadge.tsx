import { useGetUnReadNotificationsCountQuery } from '@/services/slices/notificationSlice';
import { BellIcon } from 'lucide-react';

const NotiBadge = () => {
    const { data, isLoading, isError } = useGetUnReadNotificationsCountQuery();

    if (isLoading) {
        return (
            <div className="relative outline-none w-[40px] border-none ring-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="relative outline-none w-[40px] border-none ring-0 flex items-center justify-center">
                <span className="text-red-500 text-lg">!</span>
            </div>
        );
    }

    return (
        <div className="relative outline-none w-[40px] border-none ring-0">
            <BellIcon className="cursor-pointer" />
            <div className="absolute flex items-center justify-center  bg-red-500 text-sm text-white rounded-full h-8 w-8 right-0 top-[-10px]">
                <p>{data?.data?.unread_count || 0}</p>
            </div>
        </div>
    );
}

export default NotiBadge;
