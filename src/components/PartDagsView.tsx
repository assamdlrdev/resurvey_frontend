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
          {/* Table view for medium+ screens */}
          <table className="hidden md:table w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Part Dag</th>
                <th className="p-2 text-left">Area (sqm)</th>
                <th className="p-2 text-left">Old Dag No</th>
                <th className="p-2 text-left">Land Class</th>
                <th className="p-2 text-left">Patta Type</th>
                <th className="p-2 text-left">Patta No</th>
              </tr>
            </thead>
            <tbody>
              {getCreatedPartDags().map((dag) => (
                <tr
                  key={dag.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-2">{dag.part_dag}</td>
                  <td className="p-2">{dag.dag_area_sqmtr}</td>
                  <td className="p-2">{dag.old_dag_no}</td>
                  <td className="p-2">{dag.current_land_class_ass}</td>
                  <td className="p-2">{dag.patta_type}</td>
                  <td className="p-2">{dag.patta_no}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Card view for small screens */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {getCreatedPartDags().map((dag) => (
              <div
                key={dag.id}
                className="border border-gray-200 rounded-lg p-3 shadow-sm bg-gray-50"
              >
                <p className="font-semibold">Part Dag: {dag.part_dag}</p>
                <p className="text-sm text-gray-700">Name: {dag.name}</p>
                <p className="text-sm text-gray-700">
                  Area: {dag.dag_area_sqmtr} sqm
                </p>
                <p className="text-sm text-gray-700">Old Dag No: {dag.old_dag_no}</p>
                <p className="text-sm text-gray-700">Land Class: {dag.current_land_class_ass}</p>
                <p className="text-sm text-gray-700">Patta Type: {dag.patta_type}</p>
                <p className="text-sm text-gray-700">Patta No: {dag.patta_no}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">No part dags found.</div>
      )}
    </div>
  );
}
