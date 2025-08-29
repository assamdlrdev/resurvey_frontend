import React, { useEffect } from "react";
import { useDagStore } from "@/store/SurveyStore";

export default function PartDagsView() {
  const { getCreatedPartDags, isLoading } = useDagStore();

  useEffect(() => {
  }, [getCreatedPartDags]);

  return (
    <div className="px-4 max-w-6xl mx-auto">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : getCreatedPartDags() && getCreatedPartDags().length > 0 ? (
        <div className="overflow-x-auto">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border rounded-lg bg-white">
              <thead>
                <tr className="bg-medical-50">
                  <th className="px-2 py-2 border text-start">Part Dag</th>
                  <th className="px-2 py-2 border text-center">Area (sqm)</th>
                  <th className="px-2 py-2 border text-center">Old Dag No</th>
                  <th className="px-2 py-2 border text-center">Current Land Class</th>
                  <th className="px-2 py-2 border text-center">Patta Type</th>
                  <th className="px-2 py-2 border text-center">Patta No</th>
                </tr>
              </thead>
              <tbody>
                {getCreatedPartDags().length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 text-medical-500"
                    >
                      No Part Dags found.
                    </td>
                  </tr>
                ) : (
                  getCreatedPartDags().map((dag) => (
                    <tr key={dag.id} className="hover:bg-medical-50 transition">
                      <td className="px-2 py-2 border text-start">{dag.part_dag}</td>
                      <td className="px-2 py-2 border text-center">{dag.dag_area_sqmtr}</td>
                      <td className="px-2 py-2 border text-center">{dag.old_dag_no || "-"}</td>
                      <td className="px-2 py-2 border text-center">{dag.current_land_class_ass || "-"}</td>
                      <td className="px-2 py-2 border text-center">{dag.patta_type}</td>
                      <td className="px-2 py-2 border text-center">{dag.patta_no}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card view for small screens */}
          <div className="sm:hidden space-y-4">
            {getCreatedPartDags()?.length ? (
              getCreatedPartDags().map((dag) => (
                <div
                  key={dag.id}
                  className="bg-white shadow rounded-lg p-3 border space-y-2"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-medical-700">Part Dag:</span>
                    <span>{dag.part_dag || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-medical-700">Area (sqm):</span>
                    <span>{dag.dag_area_sqmtr || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-medical-700">Old Dag No:</span>
                    <span>{dag.old_dag_no || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-medical-700">Land Class:</span>
                    <span>{dag.current_land_class_ass || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-medical-700">Patta Type:</span>
                    <span>{dag.patta_type || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-medical-700">Patta No:</span>
                    <span>{dag.patta_no || "N/A"}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-6 bg-white shadow rounded-lg border">
                📭 No Part Dag Data
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="text-center text-gray-500">No part dags found.</div>
      )}
    </div>
  );
}
