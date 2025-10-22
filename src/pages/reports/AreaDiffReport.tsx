import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ApiService from "@/services/ApiService";
import { motion, AnimatePresence } from "framer-motion";

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
}

interface DagReport {
  dist_code?: string;
  subdiv_code?: string;
  cir_code?: string;
  mouza_pargona_code?: string;
  lot_no?: string;
  vill_townprt_code?: string;
  dag_no: string;
  dag_area_sqm?: number;
  splitted_dags_area_sqm?: number;
  splitted_dags?: any[];
}

const AreaReport: React.FC = () => {
  const [level, setLevel] = useState<"district" | "circle" | "mouza" | "lot" | "village" | "report">("district");
  const [path, setPath] = useState<{ district?: string; subdiv?: string; circle?: string; mouza?: string; lot?: string; village?: string }>({});
  const [data, setData] = useState<LevelData[]>([]);
  const [report, setReport] = useState<DagReport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
        case "report": endpoint = `api/report/dag?village=${path.district}-${path.subdiv}-${path.circle}-${path.mouza}-${path.lot}-${path.village}`; break;
      }

      const res = await ApiService.get(endpoint);
      if (level === "report") setReport(res);
      else setData(res);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [level]);

  const handleSelect = (item: LevelData) => {
    switch (level) {
      case "district":
        setPath({ district: item.dist_code });
        setLevel("circle");
        break;
      case "circle":
        setPath((p) => ({ ...p, circle: item.cir_code, subdiv: item.subdiv_code }));
        setLevel("mouza");
        break;
      case "mouza":
        setPath((p) => ({ ...p, mouza: item.mouza_pargona_code }));
        setLevel("lot");
        break;
      case "lot":
        setPath((p) => ({ ...p, lot: item.lot_no }));
        setLevel("village");
        break;
      case "village":
        setPath((p) => ({ ...p, village: item.vill_townprt_code }));
        setLevel("report");
        break;
    }
  };

  const handleBack = () => {
    if (level === "report") setLevel("village");
    else if (level === "village") setLevel("lot");
    else if (level === "lot") setLevel("mouza");
    else if (level === "mouza") setLevel("circle");
    else if (level === "circle") setLevel("district");
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 capitalize">
            {level === "district" ? "Districts" :
             level === "circle" ? "Circles" :
             level === "mouza" ? "Mouzas" :
             level === "lot" ? "Lots" :
             level === "village" ? "Villages" : "Village Report"}
          </h1>
          <p className="text-gray-500 text-sm">
            Navigate step by step to view survey data summary
          </p>
        </div>

        {level !== "district" && (
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
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
                        data.map((item, index) => (
                            <motion.div
                                key={index+''+item.name}
                                layout
                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ duration: 0.18 }}
                            >
                                <Card
                                    onClick={() => handleSelect(item)}
                                    className="cursor-pointer hover:shadow-lg transition-all border border-gray-200 bg-white"
                                >
                                    <CardContent className="p-4">
                                        <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                                            {item.villages !== undefined && <p>Villages: <span className="font-medium">{item.villages}</span></p>}
                                            {item.lots_count !== undefined && <p>Lots: <span className="font-medium">{item.lots_count}</span></p>}
                                            {item.mouzas_count !== undefined && <p>Mouzas: <span className="font-medium">{item.mouzas_count}</span></p>}
                                            {item.circles_count !== undefined && <p>Circles: <span className="font-medium">{item.circles_count}</span></p>}
                                            {item.data_collection !== undefined && <p>Data Collected: <span className="font-medium">{item.data_collection}</span></p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
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
              className="overflow-auto bg-white shadow rounded-lg border border-gray-200 mt-4"
            >
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-800 text-left sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 border-b">DAG No</th>
                    <th className="px-4 py-2 border-b">Dag Area (m²)</th>
                    <th className="px-4 py-2 border-b">Total Part DAGs</th>
                    <th className="px-4 py-2 border-b">Total Part Dags Area (m²)</th>
                    <th className="px-4 py-2 border-b">Area Difference (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{r.dag_no}</td>
                      <td className="px-4 py-2 border-b">{Number(r.dag_area_sqm).toFixed(2)}</td>
                      <td className="px-4 py-2 border-b">{r.splitted_dags?.length || 0}</td>
                      <td className="px-4 py-2 border-b">{Number(r.splitted_dags_area_sqm).toFixed(2)}</td>
                      <td className="px-4 py-2 border-b">
                        {(() => {
                          const dag = Number(r.dag_area_sqm) || 0;
                          const splitted = Number(r.splitted_dags_area_sqm) || 0;
                          const diff = dag ? ((splitted - dag) / dag) * 100 : 0;
                          const abs = Math.abs(diff);
                          const badgeClass =
                            abs < 0.0001
                              ? "bg-green-100 text-green-800"
                              : abs < 5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800";
                          const sign = diff > 0 ? "+" : "";
                          return (
                            <span className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full ${badgeClass}`}>
                              {sign}{diff.toFixed(2)}%
                            </span>
                          );
                        })()}
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
        )}
    </AnimatePresence>
    </div>
  );
};

export default AreaReport;
