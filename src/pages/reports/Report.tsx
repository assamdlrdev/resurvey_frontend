import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ApiService from "@/services/ApiService";
import { motion, AnimatePresence } from "framer-motion";
import area from "@turf/area";
import proj4 from "proj4";
import { useNavigate } from "react-router-dom";

interface LevelData {
    dist_code?: string;
    subdiv_code?: string;
    cir_code?: string;
    mouza_pargona_code?: string;
    lot_no?: string;
    vill_townprt_code?: string;
    name: string;
    name_eng?: string;
    villages?: number;
    data_collection?: number;
    lots_count?: number;
    circles_count?: number;
    mouzas_count?: number;
    villages_count?: number;
}

interface DagReport {
    dist_code?: string;
    subdiv_code?: string;
    cir_code?: string;
    mouza_pargona_code?: string;
    lot_no?: string;
    vill_townprt_code?: string;
    dag_no: string;
    survey_no: string | null;
    bhunaksha_survey_no: string | null;
    patta_no: string;
    patta_type: string;
    land_class: string | null;
    created_on: string;
    updated_on: string;
    user_code: string;
    area_sqm: number | null;
    current_land_class: any | null;
}

const AreaReport: React.FC = () => {
    const [level, setLevel] = useState<"district" | "circle" | "mouza" | "lot" | "village" | "report">("district");
    const [path, setPath] = useState<{ district?: string; subdiv?: string; circle?: string; mouza?: string; lot?: string; village?: string, district_name?: string, circle_name?: string, mouza_name?: string, lot_name?: string, village_name?: string }>({});
    const [data, setData] = useState<LevelData[]>([]);
    const [report, setReport] = useState<DagReport[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [map_geojson, setMapGeojson] = useState<any>(null);
    const [total_dags_area_sqm, setTotalDagArea] = useState<number>(0);
    const [total_splitted_dags_area_sqm, setTotalSplittedDagsAreaSqm] = useState<number>(0);
    const [total_part_dags_entered, setTotalPartDagsEntered] = useState<number>(0);
    const [total_area_bhunaksha, setTotalAreaBhunaksha] = useState<number>(0);
    const navigate = useNavigate();

    // Example: API fetch simulation
    const fetchData = async () => {
        setLoading(true);
        try {
            let endpoint = "";
            switch (level) {
                case "district": endpoint = "api/report/districts"; break;
                case "circle": endpoint = `api/report/circles?district=${path.district}`; break;
                case "mouza": endpoint = `api/report/mouzas?circle=${path.district}-${path.subdiv}-${path.circle}`; break;
                case "lot": endpoint = `api/report/lots?mouza=${path.district}-${path.subdiv}-${path.circle}-${path.mouza}`; break;
                case "village": endpoint = `api/report/villages?lot=${path.district}-${path.subdiv}-${path.circle}-${path.mouza}-${path.lot}`; break;
                case "report": endpoint = `api/report/collection?village=${path.district}-${path.subdiv}-${path.circle}-${path.mouza}-${path.lot}-${path.village}`; break;
            }

            const res = await ApiService.get(endpoint);
            if (level === "report") {
                setReport(res.dags);
                setMapGeojson(res.map_geojson);
                setTotalDagArea(res.total_dags_area_sqm);
                setTotalSplittedDagsAreaSqm(res.total_splitted_dags_area_sqm);
                setTotalPartDagsEntered(res.total_part_dags_entered);
                if (res.map_geojson) {
                    calculateBhunakshaArea(res.map_geojson);
                }
            } else setData(res);
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [level]);


    function reprojectCoords(coords: any): any {
        if (typeof coords[0] === "number") {
            const [x, y] = coords;
            return proj4("EPSG:32646", "EPSG:4326", [x, y]);
        }
        return coords.map(reprojectCoords);
    }

    function calculateBhunakshaArea(data: any) {
        if (!data) return null;
        var total_area = 0;
        data.map((f: any) => {
            if (!f.geometry) return f;

            const reprojectedFeature = {
                ...f,
                geometry: {
                    ...f.geometry,
                    coordinates: reprojectCoords(f.geometry.coordinates),
                },
            };

            try {
                // Calculate area in square metres
                const polygonArea = area(reprojectedFeature);
                total_area += polygonArea;
            } catch (err) {
                console.error("Area calc failed:", err);
            }
        });
        setTotalAreaBhunaksha(total_area);
    }

    const handleSelect = (item: LevelData) => {
        switch (level) {
            case "district":
                setPath({ district: item.dist_code, district_name: item.name, circle_name: '', mouza_name: '', lot_name: '', village_name: '' });
                setLevel("circle");
                break;
            case "circle":
                setPath((p) => ({ ...p, circle: item.cir_code, subdiv: item.subdiv_code, circle_name: item.name, mouza_name: '', lot_name: '', village_name: '' }));
                setLevel("mouza");
                break;
            case "mouza":
                setPath((p) => ({ ...p, mouza: item.mouza_pargona_code, mouza_name: item.name, lot_name: '', village_name: '' }));
                setLevel("lot");
                break;
            case "lot":
                setPath((p) => ({ ...p, lot: item.lot_no, lot_name: item.name, village_name: '' }));
                setLevel("village");
                break;
            case "village":
                setPath((p) => ({ ...p, village: item.vill_townprt_code, village_name: item.name }));
                setLevel("report");
                break;
        }
    };

    const handleBack = () => {
        if (level === "report") {
            setLevel("village");
            setPath((p) => {
                const newPath = { ...p };
                delete newPath.village;
                delete newPath.village_name;
                return newPath;
            });
        } else if (level === "village") {
            setLevel("lot");
            setPath((p) => {
                const newPath = { ...p };
                delete newPath.lot;
                delete newPath.lot_name;
                return newPath;
            });
        } else if (level === "lot") {
            setLevel("mouza");
            setPath((p) => {
                const newPath = { ...p };
                delete newPath.lot;
                delete newPath.lot_name;
                delete newPath.mouza;
                delete newPath.mouza_name;
                return newPath;
            });
        } else if (level === "mouza") {
            setLevel("circle");
            setPath((p) => {
                const newPath = { ...p };
                delete newPath.mouza;
                delete newPath.mouza_name;
                delete newPath.circle;
                delete newPath.circle_name;
                return newPath;
            });
        } else if (level === "circle") {
            setLevel("district");
            setPath((p) => {
                const newPath = { ...p };
                delete newPath.circle;
                delete newPath.circle_name;
                delete newPath.subdiv;
                delete newPath.district;
                delete newPath.district_name;
                return newPath;
            });
        }
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-600 to-yellow-500 capitalize">
                        {level === "district" ? "Districts" :
                            level === "circle" ? "Circles" :
                                level === "mouza" ? "Mouzas" :
                                    level === "lot" ? "Lots" :
                                        level === "village" ? "Villages" : "Village Report"}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Navigate step by step to view survey data summary
                    </p>

                    {/* Path pills */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {path.district_name && <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">District: {path.district_name}</span>}
                        {path.circle_name && <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-100">Circle: {path.circle_name}</span>}
                        {path.mouza_name && <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Mouza: {path.mouza_name}</span>}
                        {path.lot_name && <span className="text-xs px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">Lot: {path.lot_name}</span>}
                        {path.village_name && <span className="text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">Village: {path.village_name}</span>}
                    </div>
                </div>

                {level !== "district" && (
                    <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center space-x-2 border border-gray-200 bg-white hover:bg-gray-50">
                        <ArrowLeft className="w-4 h-4 text-gray-600" /> <span className="text-sm">Back</span>
                    </Button>
                )}
            </div>

            {/* Loading State */}
            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                    >
                        <div className="text-center text-gray-500">Loading...</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cards Grid */}
            <AnimatePresence>
                {!loading && level !== "report" && (
                    <motion.div
                        key="cards-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        <AnimatePresence>
                            {data &&
                                data.map((item, index) => {
                                    const gradientList = [
                                        "bg-gradient-to-r from-indigo-500 to-purple-500",
                                        "bg-gradient-to-r from-rose-400 to-orange-400",
                                        "bg-gradient-to-r from-emerald-400 to-teal-500",
                                        "bg-gradient-to-r from-sky-400 to-indigo-400",
                                        "bg-gradient-to-r from-yellow-400 to-amber-500",
                                        "bg-gradient-to-r from-pink-400 to-violet-500",
                                    ];
                                    const gradient = gradientList[index % gradientList.length];
                                    return (
                                        <motion.div
                                            key={index + '' + item.name}
                                            layout
                                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            <Card
                                                onClick={() => handleSelect(item)}
                                                className="cursor-pointer hover:shadow-xl transition-transform transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                                            >
                                                <div className={`${gradient} h-2 w-full`} />
                                                <CardContent className="p-4">
                                                    <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                                                        <span>{item.name}</span>
                                                        <span className="text-xs font-medium text-gray-600">{item.name_eng ? item.name_eng : null}</span>
                                                    </h2>

                                                    <div className="mt-3 text-sm text-gray-700 grid grid-cols-1 gap-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs text-gray-500">Villages</div>
                                                            <div className="px-2 py-0.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">{item.villages_count ?? "-"}</div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs text-gray-500">Lots</div>
                                                            <div className="px-2 py-0.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">{item.lots_count ?? "-"}</div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs text-gray-500">Mouzas</div>
                                                            <div className="px-2 py-0.5 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">{item.mouzas_count ?? "-"}</div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs text-gray-500">Circles</div>
                                                            <div className="px-2 py-0.5 rounded-full text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">{item.circles_count ?? "-"}</div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs text-gray-500">Data Collected</div>
                                                            <div className="px-2 py-0.5 rounded-full text-sm font-medium bg-sky-50 text-sky-700 border border-sky-100">{item.data_collection ?? "-"}</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!loading && level === "report" && (
                    <motion.div
                        key="report-table"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        // make container take available viewport height minus header space and allow scrolling
                        style={{ height: "calc(100vh - 10rem)" }}
                        className="overflow-auto bg-white shadow-lg rounded-lg border border-gray-200 mt-4"
                    >
                        {/* Totals / Summary */}
                        <div className="p-4 border-b bg-gradient-to-r from-slate-50 to-white">
                            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
                                <div className="p-3 rounded-md border-l-4 border-indigo-400 bg-indigo-50">
                                    <div className="text-xs text-indigo-700">Total DAGs in Dharitree</div>
                                    <div className="mt-1 text-lg font-bold text-indigo-900">{report.length}</div>
                                </div>
                                <div className="p-3 rounded-md border-l-4 border-pink-400 bg-pink-50">
                                    <div className="text-xs text-pink-700">Total DAG Area in Dharitree (m²)</div>
                                    <div className="mt-1 text-lg font-bold text-pink-900">{Number(total_dags_area_sqm || 0).toFixed(2)}</div>
                                </div>
                                <div className="p-3 rounded-md border-l-4 border-emerald-400 bg-emerald-50">
                                    <div className="text-xs text-emerald-700">Total Part Dags Entered</div>
                                    <div className="mt-1 text-lg font-bold text-emerald-900">{total_part_dags_entered}</div>
                                </div>
                                <div className="p-3 rounded-md border-l-4 border-amber-400 bg-amber-50">
                                    <div className="text-xs text-amber-700">Total Entered Part DAGs Area (m²)</div>
                                    <div className="mt-1 text-lg font-bold text-amber-900">{Number(total_splitted_dags_area_sqm || 0).toFixed(2)}</div>
                                </div>

                                <div className="p-3 rounded-md border-l-4 border-sky-400 bg-sky-50 col-span-2">
                                    <div className="text-xs text-sky-700">Total Area according to Bhunaksha (m²)</div>
                                    <div className="mt-1 text-lg font-bold text-sky-900">{Number(total_area_bhunaksha || 0).toFixed(2)}</div>
                                </div>
                            </div>

                           
                        </div>

                        <table className="min-w-full text-sm text-gray-700">
                            <thead className="sticky top-[0px] z-10">
                                <tr className="bg-gradient-to-r from-indigo-50 via-white to-amber-50 text-left">
                                    <th className="px-4 py-3 border-b text-gray-700">Part DAG No</th>
                                    <th className="px-4 py-3 border-b text-gray-700">Old DAG No</th>
                                    <th className="px-4 py-3 border-b text-gray-700">Survey Number</th>
                                    <th className="px-4 py-3 border-b text-gray-700">Part Dag Area (m²)</th>
                                    <th className="px-4 py-3 border-b text-gray-700">Current Land Use</th>
                                    <th className="px-4 py-3 border-b text-gray-700">Entered By</th>
                                    <th className="px-4 py-3 border-b text-gray-700">Entered At</th>
                                    <th className="px-4 py-3 border-b text-gray-700">Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.map((r, i) => {

                                    return (
                                        <tr key={i} className={`hover:opacity-95 cursor-default`}>
                                            <td className="px-4 py-3 border-b font-medium text-gray-800">{r.survey_no}</td>
                                            <td className="px-4 py-3 border-b">{r.dag_no}</td>
                                            <td className="px-4 py-3 border-b">{r.bhunaksha_survey_no}</td>
                                            <td className="px-4 py-3 border-b">{Number(r.area_sqm).toFixed(2)}</td>
                                            <td className="px-4 py-3 border-b">{r.current_land_class.land_class_name}</td>
                                            <td className="px-4 py-3 border-b">{r.user_code}</td>
                                            <td className="px-4 py-3 border-b">
                                                {r.created_on ? (() => {
                                                    const d = new Date(r.created_on);
                                                    return isNaN(d.getTime())
                                                        ? "-"
                                                        : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
                                                })() : "-"}
                                            </td>
                                            <td className="px-4 py-3 border-b">
                                                {r.updated_on ? (() => {
                                                    const d = new Date(r.updated_on);
                                                    return isNaN(d.getTime())
                                                        ? "-"
                                                        : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
                                                })() : "-"}
                                            </td>
                                            <td className="px-2 py-2 border text-center">
                                                <Button
                                                    type="button"
                                                    id={`${r.survey_no}-${r.dag_no}`}
                                                    onClick={() => {
                                                        const url = `/resurvey/chitha-view?id=${r.dist_code}-${r.subdiv_code}-${r.cir_code}-${r.mouza_pargona_code}-${r.lot_no}-${r.vill_townprt_code}-lgd-${r.dag_no}-${r.survey_no}`;
                                                        const w = window.open(url, "_blank");
                                                        if (w) w.opener = null;
                                                    }}
                                                >
                                                    View Chitha
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    type="button"
                                                    id={`${r.survey_no}-${r.dag_no}`}
                                                    onClick={() => {
                                                        const url = `/resurvey/part-dag-view?id=${r.dist_code}-${r.subdiv_code}-${r.cir_code}-${r.mouza_pargona_code}-${r.lot_no}-${r.vill_townprt_code}-lgd-${r.dag_no}-${r.survey_no}`;
                                                        const w = window.open(url, "_blank");
                                                        if (w) w.opener = null;
                                                    }}
                                                >
                                                    View Part Dag
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AreaReport;
