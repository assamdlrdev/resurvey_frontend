import ApiService from "@/services/ApiService";
import StorageService from "@/services/StorageService";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LMDashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dashData, setDashData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // rows per page

    useEffect(() => {
        if (location.pathname === "/lm-dashboard") {
            const user = StorageService.getJwtCookie();
            const userData: any = StorageService.getJwtCookieData(user);
            console.log(userData);
            if (userData && userData.user_desig_code === "LM") {
                getLmDashData(currentPage);
            } else {
                console.log("Unauthorized access");
            }
        }
    }, [location]);

    const getLmDashData = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await ApiService.get(
                "get-lot-resurvey-dashboard",
                JSON.stringify({ page, pageSize })
            );
            setIsLoading(false);

            if (response.status !== "y") {
                toast.error(response.msg);
                return;
            }

            setDashData(response.data);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            toast.error("Failed to fetch Circle Report");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex flex-col items-center justify-center p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                
                {/* Location Details Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        📍 Location Details
                    </h2>

                    {dashData ? (
                        <div className="space-y-3 text-gray-700">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Circle Name:</span>
                                <span className="font-semibold">{dashData.circle_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">District Name:</span>
                                <span className="font-semibold">{dashData.dist_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Subdivision Name:</span>
                                <span className="font-semibold">{dashData.subdiv_name}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-6">
                            {isLoading ? "Loading..." : "No data available."}
                        </div>
                    )}
                </div>

                {/* Total Count Card */}
                <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 text-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-300">
                    <div className="text-lg font-medium mb-2 opacity-90">Total Records Entered</div>
                    <div className="text-5xl font-extrabold mb-4 tracking-wide drop-shadow-sm">
                        {dashData?.totalCount ?? "--"}
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/co-survey-reports");
                        }}
                        className="px-5 py-2 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all duration-200 shadow-sm"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LMDashboard;
