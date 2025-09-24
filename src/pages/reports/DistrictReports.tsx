import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApiService from "@/services/ApiService";
import toast from "react-hot-toast";

interface DagItem {
    dist_code: string;
    subdiv_code: string;
    cir_code: string;
    mouza_pargona_code: string;
    lot_no: string;
    vill_townprt_code: string;
    dag_no: string;
    old_dag_no: string | null;
    patta_no: string;
    patta_type: string;
    land_class: string | null;
    circle_name: string;
    village_name: string;
    date_entry: string;
    user_code: string;
}

interface DistrictData {
    dist_code: string | number;
    dist_name: string;
    totalCount: number; // 👈 must come from API
    chitha_basic_splitted_dags: DagItem[];
}

export default function DistrictReport() {
    const { dist_code } = useParams<{ dist_code: string }>();
    const navigate = useNavigate();

    const [district, setDistrict] = useState<DistrictData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // rows per page

    useEffect(() => {
        fetchDistrictReport(currentPage);
    }, [dist_code, currentPage]);

    const fetchDistrictReport = async (page: number) => {
        setIsLoading(true);
        try {
            
            const response = await ApiService.get("get-district-report", JSON.stringify({
                dist_code,
                page,
                pageSize
            }));

            setIsLoading(false);

            if (response.status !== "y") {
                toast.error(response.msg);
                return;
            }

            setDistrict(response.data);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            toast.error("Failed to fetch District Report");
        }
    };

    if (isLoading) {
        return <div className="text-center py-10 text-lg text-medical-600">Loading...</div>;
    }

    if (!district) {
        return <div className="text-center py-10 text-lg text-medical-600">No data found.</div>;
    }

    const { dist_name, chitha_basic_splitted_dags, totalCount } = district;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-medical-900">{dist_name} Report</h1>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </div>

                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>
                            Total DAGs: {totalCount} (Page {currentPage} of {totalPages})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border rounded-lg bg-white">
                                <thead>
                                    <tr className="bg-medical-50">
                                        <th className="px-2 py-2 border">Dag No</th>
                                        <th className="px-2 py-2 border">Old Dag No</th>
                                        <th className="px-2 py-2 border">Patta No</th>
                                        <th className="px-2 py-2 border">Patta Type</th>
                                        <th className="px-2 py-2 border">Land Class</th>
                                        <th className="px-2 py-2 border">Circle</th>
                                        <th className="px-2 py-2 border">Village</th>
                                        <th className="px-2 py-2 border">Entry Date</th>
                                        <th className="px-2 py-2 border">User</th>
                                        <th className="px-2 py-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chitha_basic_splitted_dags.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-4 text-medical-500">
                                                No DAGs found.
                                            </td>
                                        </tr>
                                    ) : (
                                        chitha_basic_splitted_dags.map((dag, idx) => (
                                            <tr key={idx} className="hover:bg-medical-50">
                                                <td className="px-2 py-2 border">{dag.dag_no}</td>
                                                <td className="px-2 py-2 border">{dag.old_dag_no || "-"}</td>
                                                <td className="px-2 py-2 border">{dag.patta_no}</td>
                                                <td className="px-2 py-2 border">{dag.patta_type}</td>
                                                <td className="px-2 py-2 border">{dag.land_class || "-"}</td>
                                                <td className="px-2 py-2 border">{dag.circle_name}</td>
                                                <td className="px-2 py-2 border">{dag.village_name}</td>
                                                <td className="px-2 py-2 border">
                                                    {dag.date_entry
                                                        ? new Date(dag.date_entry).toLocaleDateString("en-IN", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })
                                                        : "-"}
                                                </td>
                                                <td className="px-2 py-2 border">{dag.user_code}</td>
                                                <td className="px-2 py-2 border text-center">
                                                    <Button type="button" id={`${dag.dag_no}-${dag.old_dag_no}`} onClick={() => navigate(`/chitha-view?id=${dag.dist_code+'-'+dag.subdiv_code+'-'+dag.cir_code+'-'+dag.mouza_pargona_code+'-'+dag.lot_no+'-'+dag.vill_townprt_code+'-'+'lgd'+'-'+dag.old_dag_no+'-'+dag.dag_no}`)}>View Chitha</Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination controls */}
                        <div className="flex justify-between items-center mt-4">
                            <Button
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
