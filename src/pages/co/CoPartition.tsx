import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ApiService from "@/services/ApiService";
import Loader from "@/components/Loader";
import CommonService from "@/services/CommonService";

// -------------------------------------------------------------
// Main Component: Partition
// -------------------------------------------------------------
export default function CoPartition() {

    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [partitionList, setPartitionList] = useState([]);


    useEffect(() => {
        if (location.pathname === "/co-partition-form") {
            getPartitionList();
        }
    }, [location]);


    // function formatPrettyDate(dateString) {
    //     const date = new Date(dateString);

    //     const months = [
    //         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    //         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    //     ];

    //     const day = date.getDate();
    //     const month = months[date.getMonth()];
    //     const year = date.getFullYear();

    //     // Add ordinal suffix (st, nd, rd, th)
    //     const getOrdinal = (d) => {
    //         if (d > 3 && d < 21) return "th";
    //         switch (d % 10) {
    //             case 1: return "st";
    //             case 2: return "nd";
    //             case 3: return "rd";
    //             default: return "th";
    //         }
    //     };

    //     return `${month} ${day}${getOrdinal(day)}, ${year}`;
    // }



    // ----------------------------
    //  API Calls
    // ----------------------------
    const getPartitionList = async () => {
        try {
            setLoading(true);
            const response = await ApiService.get("get_co_partition_list", JSON.stringify({}));
            setLoading(false);

            if (response.status !== "Y") {
                toast.error(response.msg);
                setPartitionList([]);
                return;
            }

            setPartitionList(response.data || []);
        } catch {
            setLoading(false);
            toast.error("Failed to fetch Partition list!");
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            {loading && <Loader loading={loading} />}

            <Toaster position="top-center" />

            <div className="sm:max-w-3xl lg:max-w-screen-2xl mx-auto space-y-4 bg-white p-5 rounded-lg shadow">
                <h4 className="text font-bold mb-6 text-center text-gray-800">Partition Cases</h4>

                <table className="min-w-full table-auto rounded-lg shadow border border-gray-300 divide-y divide-gray-300">
                    <thead className="bg-emerald-100">
                        <tr className="divide-x divide-gray-300">
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-800">Case No</th>  {/* allow wrap */}
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-800 whitespace-nowrap">Petition No</th>
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-800 whitespace-nowrap">Mouza</th>
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-800 whitespace-nowrap">Lot No.</th>
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-800">Village</th> {/* allow wrap */}
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-800 whitespace-nowrap">Submitted On</th>
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-800 whitespace-nowrap">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {partitionList.length === 0 ? (
                            <tr className="divide-x divide-gray-200">
                                <td
                                    colSpan="7"
                                    className="px-4 py-4 text-center text-sm text-gray-600 bg-gray-50"
                                >
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            partitionList.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b hover:bg-gray-100 divide-x divide-gray-200`}
                                >
                                    <td className="px-4 py-2 text-sm text-gray-700">{item.case_no}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{item.petition_no}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{item.mouza_name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{item.lot_no}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{item.village_name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{CommonService.formatPrettyDate(item.report_date)}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        {/* <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                            Proceed
                                        </button> */}
                                        <Link to={`/co-partition-form-proceed?case_no=${CommonService.encrypt(item.case_no)}`} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Proceed</Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>

            </div>

        </div>
    );
};