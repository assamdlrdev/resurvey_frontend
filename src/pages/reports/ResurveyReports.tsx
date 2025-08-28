import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApiService from "@/services/ApiService";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface DagItem {
  dist_code: string;
  subdiv_code: string;
  cir_code: string;
  mouza_pargona_code: string;
  lot_no: string;
  vill_townprt_code: string;
  dag_no: string;
  old_dag_no: string;
  patta_no: string;
  patta_type_code: string;
  land_class_code: string;
  date_entry: string;
  user_code: string;
  patta_type: string;
  land_class: string | null;
  village_name: string;
  circle_name: string;
}

interface DistrictData {
  dist_code: string | number;
  dist_name: string;
  chitha_basic_splitted_dags: DagItem[];
}

type ApiResponse = {
  status: string;
  msg: string;
  data: {
    entered_splitted_dags: {
      [district: string]: DistrictData;
    };
  };
};

export default function ResurveyReports() {
  const [districts, setDistricts] = useState<{ [district: string]: DistrictData }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const response: ApiResponse = await ApiService.get("get-resurvey-report", null);
      setIsLoading(false);
      if (response.status !== "y") {
        toast.error(response.msg);
        return;
      }
      setDistricts(response.data.entered_splitted_dags);
    } catch (error) {
      toast.error("Failed to fetch Resurvey Report Data");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-medical-900 mb-2">Resurvey Report (Latest Entry)</h1>
          <p className="text-medical-600">Survey DAGs grouped by district</p>
        </div>
        {isLoading ? (
          <div className="text-center py-10 text-lg text-medical-600">Loading...</div>
        ) : (
          Object.entries(districts).map(([districtKey, district]) => {
            const { chitha_basic_splitted_dags, dist_name } = district;

            return (
              <Card key={districtKey} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">{dist_name}</CardTitle>
                  <div className="text-sm text-medical-600">
                    Total DAGs: {chitha_basic_splitted_dags.length}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Table for medium+ screens */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full border rounded-lg bg-white">
                      <thead>
                        <tr className="bg-medical-50">
                          <th className="px-2 py-2 border text-start">Dag No</th>
                          <th className="px-2 py-2 border">Old Dag No</th>
                          <th className="px-2 py-2 border">Patta No</th>
                          <th className="px-2 py-2 border">Patta Type</th>
                          <th className="px-2 py-2 border">Land Class</th>
                          <th className="px-2 py-2 border">Circle</th>
                          <th className="px-2 py-2 border">Village</th>
                          <th className="px-2 py-2 border">Entry Date</th>
                          <th className="px-2 py-2 border text-end">User</th>
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
                              <td className="px-2 py-2 border text-start">{dag.dag_no}</td>
                              <td className="px-2 py-2 border text-center">{dag.old_dag_no || "-"}</td>
                              <td className="px-2 py-2 border text-center">{dag.patta_no}</td>
                              <td className="px-2 py-2 border text-center">{dag.patta_type}</td>
                              <td className="px-2 py-2 border text-center">{dag.land_class || "-"}</td>
                              <td className="px-2 py-2 border text-center">{dag.circle_name}</td>
                              <td className="px-2 py-2 border text-center">{dag.village_name}</td>
                              <td className="px-2 py-2 border text-center">
                                {dag.date_entry
                                  ? new Date(dag.date_entry).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                  : "-"}
                              </td>
                              <td className="px-2 py-2 border text-end">{dag.user_code}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Card view for small screens */}
                  <div className="block md:hidden space-y-4">
                    {chitha_basic_splitted_dags.length === 0 ? (
                      <div className="text-center py-4 text-medical-500 bg-white rounded-lg shadow">
                        No DAGs found.
                      </div>
                    ) : (
                      chitha_basic_splitted_dags.map((dag, idx) => (
                        <div
                          key={idx}
                          className="bg-white shadow rounded-lg p-4 border space-y-2"
                        >
                          <div className="flex justify-between">
                            <span className="font-semibold text-medical-700">Dag No:</span>
                            <span>{dag.dag_no}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-medical-700">Old Dag No:</span>
                            <span>{dag.old_dag_no || "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-medical-700">Patta No:</span>
                            <span>{dag.patta_no}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-medical-700">Patta Type:</span>
                            <span>{dag.patta_type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-medical-700">Land Class:</span>
                            <span>{dag.land_class || "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-medical-700">Circle:</span>
                            <span>{dag.circle_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-medical-700">Village:</span>
                            <span>{dag.village_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-medical-700">Entry Date:</span>
                            <span>
                              {dag.date_entry
                                ? new Date(dag.date_entry).toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                                : "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-medical-700">User:</span>
                            <span>{dag.user_code}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
