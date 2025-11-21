import Loader from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApiService from "@/services/ApiService";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";



const LMMutationCases: React.FC = () => {

    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);
    const [mutCases, setMutCases] = useState<any[]>([]);


    useEffect(() => {
        if(location.pathname == '/lm-mutation-cases') {
            getMutCases();
        }
    }, [location]);

    const getMutCases = async () => {
        const data = {};

        setLoading(true);
        const response = await ApiService.get('get_lm_mut_cases', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }
        if(response.data.length < 1) {
            toast.error('No data Available!');
            return;
        }

        setMutCases(response.data);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <div className="sm:max-w-3xl lg:max-w-screen-2xl mx-auto space-y-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-medical-900 mb-2">Mutation Cases</h1>
                </div>
                <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>
                                
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border rounded-lg bg-white">
                                    <thead>
                                        <tr className="bg-medical-50">
                                            <th className="px-2 py-2 border">Case No</th>
                                            <th className="px-2 py-2 border">Petition No</th>
                                            <th className="px-2 py-2 border">Village</th>
                                            <th className="px-2 py-2 border">Mutated Area (B-K-L-G)</th>
                                            <th className="px-2 py-2 border">Submitted On</th>
                                            <th className="px-2 py-2 border">Status</th>
                                            {/* <th className="px-2 py-2 border">Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="overflow-y-auto">
                                        {(mutCases && mutCases.length > 0) ? (
                                            mutCases.map((mutCase, index) => <tr key={index}>
                                                <td className="px-2 py-2 border text-center">{mutCase.case_no}</td>
                                                <td className="px-2 py-2 border text-center">{mutCase.petition_no}</td>
                                                <td className="px-2 py-2 border text-center">{mutCase.vill_townprt_name}</td>
                                                <td className="px-2 py-2 border text-center">{mutCase.m_dag_area_b + 'B-' + mutCase.m_dag_area_k + 'K-' + mutCase.m_dag_area_lc + 'L'}</td>
                                                <td className="px-2 py-2 border text-center">{mutCase.date_entry_name}</td>
                                                <td className={`px-2 py-2 border text-center text-${mutCase.status_flag}-500`}><p>{mutCase.status}</p></td>
                                                {/* <td className="px-2 py-2 border text-center"></td> */}
                                            </tr>)
                                        ) : (
                                            <tr>
                                                <td className="px-2 py-2 border text-center">No data available</td>
                                                <td className="px-2 py-2 border"></td>
                                                <td className="px-2 py-2 border"></td>
                                                <td className="px-2 py-2 border"></td>
                                                <td className="px-2 py-2 border"></td>
                                                <td className="px-2 py-2 border"></td>
                                                {/* <td className="px-2 py-2 border"></td> */}
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

export default LMMutationCases;