import { useEffect, useState } from "react";
import { FilterLocationStore } from "@/store/SurveyStore";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApiService from "@/services/ApiService";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { set } from "date-fns";

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
    totalCount: number;
    chitha_basic_splitted_dags: DagItem[];
}
export default function Report() {
    const { districts, circles, mouzas, lots, villages, setCircles, setMouzas, setLots, setVillages, getDistricts, getCircles, getMouzas, getLots, getVillages } = FilterLocationStore();
    const { distCode, subdivCode, cirCode, mouzaPargonaCode, lotNo, villTownprtCode, setDistCode, setSubdivCode, setCirCode, setMouzaPargonaCode, setLotNo, setVillTownprtCode } = FilterLocationStore();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [district, setDistrict] = useState<DistrictData | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // rows per page

    useEffect(() => {
        fetchDistrictReport(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (distCode != '') {
            fetchDistrictReport(currentPage);
            if (circles.length == 0) {
                resetField('circle');
                getCircles(distCode);
            } else {
                if (circles[0].dist_code != distCode) {
                    resetField('circle');
                    getCircles(distCode);
                }
            }
        }else{
            setCircles([]);
            resetField('circle');
        }
    }, [distCode]);

    useEffect(() => {
        if (cirCode != '') {
            if (mouzas.length == 0) {
                resetField('mouza');
                getMouzas(cirCode);
            } else {
                const cir_code_parts = cirCode.split('-');
                var dist_code = cir_code_parts[0];
                var subdiv_code = cir_code_parts[1];
                var cir_code = cir_code_parts[2];
                if (mouzas[0].dist_code != dist_code || mouzas[0].subdiv_code != subdiv_code || mouzas[0].cir_code != cir_code) {
                    resetField('mouza');
                    getMouzas(cirCode);
                }
            }
        }else{
            setMouzas([]);
            resetField('mouza');
        }
        fetchDistrictReport(currentPage);
    }, [cirCode]);

    useEffect(() => {
        if (mouzaPargonaCode != '') {
            if (lots.length == 0) {
                resetField('lot');
                getLots(mouzaPargonaCode);
            }
            else {
                //check if mouza code changed
                const mouza_code_parts = mouzaPargonaCode.split('-');
                var dist_code = mouza_code_parts[0];
                var subdiv_code = mouza_code_parts[1];
                var cir_code = mouza_code_parts[2];
                var mouza_code = mouza_code_parts[3];
                if (lots[0].dist_code != dist_code || lots[0].subdiv_code != subdiv_code || lots[0].cir_code != cir_code || lots[0].mouza_code != mouza_code) {
                    resetField('lot');
                    getLots(mouzaPargonaCode);
                }
            }
        }else{
            setLots([]);
            resetField('lot');
        }
        fetchDistrictReport(currentPage);
    }, [mouzaPargonaCode]);

    useEffect(() => {
        if (lotNo) {
            if (villages.length == 0) {
                resetField('vill');
                getVillages(lotNo);
            }
            else {
                //check if lot code changed
                const lot_code_parts = lotNo.split('-');
                var dist_code = lot_code_parts[0];
                var subdiv_code = lot_code_parts[1];
                var cir_code = lot_code_parts[2];
                var mouza_code = lot_code_parts[3];
                var lot_no = lot_code_parts[4];
                if (villages[0].dist_code != dist_code || villages[0].subdiv_code != subdiv_code || villages[0].cir_code != cir_code || villages[0].mouza_code != mouza_code || villages[0].lot_no != lot_no) {
                    resetField('vill');
                    getVillages(lotNo);
                }
            }
        }else{
            setVillages([]);
            resetField('vill');
        }
        fetchDistrictReport(currentPage);
    }, [lotNo]);

    useEffect(() => {
        fetchDistrictReport(currentPage);
    }, [villTownprtCode]);

    const fetchDistrictReport = async (page: number) => {
        setIsLoading(true);
        try {
            const getCodePayload = (code: string) => {
                const codes = code.split('-');
                return {
                    dist_code: codes[0],
                    subdiv_code: codes[1],
                    cir_code: codes[2],
                    mouza_pargona_code: codes[3],
                    lot_no: codes[4],
                    vill_townprt_code: codes[5] || null // Optional for some codes
                };
            };

            let payload = { page, pageSize };

            if (villTownprtCode) {
                payload = { ...payload, ...getCodePayload(villTownprtCode) };
            } else if (lotNo) {
                payload = { ...payload, ...getCodePayload(lotNo) };
            } else if (mouzaPargonaCode) {
                payload = { ...payload, ...getCodePayload(mouzaPargonaCode) };
            } else if (cirCode) {
                payload = { ...payload, ...getCodePayload(cirCode) };
            } else if (distCode) {
                payload = { ...payload, ...getCodePayload(distCode) };  // Dist code is directly used
            } else {
                // No filter available
                setIsLoading(false);
                return;
            }

            // Make the API request
            const response = await ApiService.get("get-report", JSON.stringify(payload));

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

    const resetField = (type: string) => {
        if (type == 'circle') {
            setMouzas([]);
            setMouzaPargonaCode('');
            setLots([]);
            setLotNo('');
            setVillages([]);
            setVillTownprtCode('');
        }
        else if (type == 'mouza') {
            setLots([]);
            setLotNo('');
            setVillages([]);
            setVillTownprtCode('');
        }
        else if (type == 'lot') {
            setVillages([]);
            setVillTownprtCode('');
        }
        else if (type == 'vill') {
            setDistrict(null);
        }
        else if (type == 'dist') {
            setCircles([]);
            setCirCode('');
            setMouzas([]);
            setMouzaPargonaCode('');
            setLots([]);
            setLotNo('');
            setVillages([]);
            setVillTownprtCode('');
        }
    };

    // if (isLoading) {
    //     return <div className="text-center py-10 text-lg text-medical-600">Loading...</div>;
    // }

   

    // const { dist_name, chitha_basic_splitted_dags, totalCount } = district;
    const dist_name = district ? district.dist_name : '';
    const chitha_basic_splitted_dags = district ? district.chitha_basic_splitted_dags : [];
    const totalCount = district ? district.totalCount : 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <div className="max-w-8xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-medical-900">Resurvey Report</h1>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <Label htmlFor="district">District</Label>
                        <select
                            id="district"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={distCode}
                            onChange={(e: any) => setDistCode(e.currentTarget.value)}
                        >
                            <option value="">Select District</option>
                            {
                                districts && districts.length > 0 && districts.map((ddata, index) => <option key={index} value={ddata.key}>{ddata.value}</option>)
                            }

                        </select>

                    </div>
                    <div>
                        <Label htmlFor="circle">Circle</Label>
                        <select
                            id="circle"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={cirCode}
                            onChange={(e: any) => setCirCode(e.currentTarget.value)}
                        >
                            <option value="">Select Circle</option>
                            {circles && circles.length > 0 && circles.map((cdata, index) => <option key={index} value={`${cdata.dist_code}-${cdata.subdiv_code}-${cdata.cir_code}`}>{`${cdata.loc_name} (${cdata.locname_eng})`}</option>)}
                        </select>

                    </div>
                    <div>
                        <Label htmlFor="mouza">Mouza</Label>
                        <select
                            id="mouza"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={mouzaPargonaCode}
                            onChange={(e: any) => setMouzaPargonaCode(e.currentTarget.value)}
                        >
                            <option value="">Select Mouza</option>

                            {
                                mouzas && mouzas.length > 0 && mouzas.map((mdata, index) => <option key={index} value={`${mdata.dist_code}-${mdata.subdiv_code}-${mdata.cir_code}-${mdata.mouza_code}`}>{`${mdata.loc_name} (${mdata.locname_eng})`}</option>)
                            }
                        </select>

                    </div>
                    <div>
                        <Label htmlFor="lot">Lot</Label>
                        <select
                            id="lot"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={lotNo}
                            onChange={(e: any) => setLotNo(e.currentTarget.value)}
                        >
                            <option value="">Select Lot</option>
                            {
                                lots && lots.length > 0 && lots.map((ldata, index) => <option key={index} value={`${ldata.dist_code}-${ldata.subdiv_code}-${ldata.cir_code}-${ldata.mouza_code}-${ldata.lot_no}`}>{`${ldata.loc_name} (${ldata.locname_eng})`}</option>)
                            }
                        </select>

                    </div>
                    <div>
                        <Label htmlFor="village">Village</Label>
                        <select
                            id="village"
                            className="w-full border rounded px-3 py-2 mt-1"
                            value={villTownprtCode}
                            onChange={(e: any) => setVillTownprtCode(e.currentTarget.value)}
                        >
                            <option value="">Select Village</option>
                            {
                                villages && villages.length > 0 && villages.map((vdata, index) => <option key={index} value={`${vdata.dist_code}-${vdata.subdiv_code}-${vdata.cir_code}-${vdata.mouza_code}-${vdata.lot_no}-${vdata.village_code}-${vdata.lgd_code}`}>{`${vdata.loc_name} (${vdata.locname_eng})`}</option>)
                            }
                        </select>

                    </div>
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
                                    {!district && chitha_basic_splitted_dags.length === 0 ? (
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
                                                    <Button type="button" id={`${dag.dag_no}-${dag.old_dag_no}`} onClick={() => navigate(`/chitha-view?id=${dag.dist_code + '-' + dag.subdiv_code + '-' + dag.cir_code + '-' + dag.mouza_pargona_code + '-' + dag.lot_no + '-' + dag.vill_townprt_code + '-' + 'lgd' + '-' + dag.old_dag_no + '-' + dag.dag_no}`)}>View Chitha</Button>
                                                    <Button variant="secondary" type="button" id={`${dag.dag_no}-${dag.old_dag_no}`} onClick={() => navigate(`/part-dag-view?id=${dag.dist_code + '-' + dag.subdiv_code + '-' + dag.cir_code + '-' + dag.mouza_pargona_code + '-' + dag.lot_no + '-' + dag.vill_townprt_code + '-' + 'lgd' + '-' + dag.old_dag_no + '-' + dag.dag_no}`)}>View Part Dag</Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {isLoading && (
                                        <tr>
                                            <td colSpan={10} className="text-center py-4 text-medical-500">
                                                Loading...
                                            </td>
                                        </tr>
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