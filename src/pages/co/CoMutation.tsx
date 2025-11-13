import Loader from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApiService from "@/services/ApiService";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";


const CoMutation: React.FC = () => {
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);
    const [caseData, setCaseData] = useState<any[]>([]);

    useEffect(() => {
        if(location.pathname == '/co-mutation') {
            getCaseData();
        }
    }, [location]);

    const getCaseData = async () => {
        const data = {};

        setLoading(true);
        const response = await ApiService.get('get_co_mut_cases', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            setCaseData([]);
            toast.error(response.msg);
            return;
        }
        if(response.data.length < 1) {
            setCaseData([]);
            toast.error('No data Available!');
            return;
        }

        setCaseData(response.data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <div className="sm:max-w-3xl lg:max-w-screen-2xl mx-auto space-y-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-medical-900 mb-2">Mutation</h1>
                </div>
                <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>
                                Mutation Cases
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border rounded-lg bg-white">
                                    <thead>
                                        <tr className="bg-medical-50">
                                            <th className="px-2 py-2 border">Case No</th>
                                            <th className="px-2 py-2 border">Petition No</th>
                                            <th className="px-2 py-2 border">Mouza</th>
                                            <th className="px-2 py-2 border">Lot</th>
                                            <th className="px-2 py-2 border">Village</th>
                                            <th className="px-2 py-2 border">Submitted On</th>
                                            <th className="px-2 py-2 border">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(caseData && caseData.length > 0) ? (
                                           caseData.map((cdata, index) => <tr key={index}>
                                            <td className="px-2 py-2 border text-center">{cdata.case_no}</td>
                                            <td className="px-2 py-2 border text-center">{cdata.petition_no}</td>
                                            <td className="px-2 py-2 border text-center">{cdata.mouza_pargona_name}</td>
                                            <td className="px-2 py-2 border text-center">{cdata.lot_name}</td>
                                            <td className="px-2 py-2 border text-center">{cdata.vill_townprt_name}</td>
                                            <td className="px-2 py-2 border text-center">{cdata.date_entry_name}</td>
                                            <td className="px-2 py-2 border text-center">
                                                {cdata.status == 0 ? (<Link to={`/co-mut-details?case_no=${cdata.case_no}`} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Proceed</Link>) : `Order Passed`}
                                            </td>
                                           </tr>)
                                        ) : (
                                            <tr>
                                                <td className="px-2 py-2 border text-center">No data available</td>
                                                <td className="px-2 py-2 border text-center"></td>
                                                <td className="px-2 py-2 border text-center"></td>
                                                <td className="px-2 py-2 border text-center"></td>
                                                <td className="px-2 py-2 border text-center"></td>
                                                <td className="px-2 py-2 border text-center"></td>
                                                <td className="px-2 py-2 border text-center"></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Loader loading={loading} />
            <Toaster position="top-center" />
        </div>
    );
};

export default CoMutation;