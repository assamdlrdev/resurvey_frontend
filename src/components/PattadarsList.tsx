import React from "react";

interface Pattadar {
  pdar_name?: string;
  pdar_father_name?: string;
  pdar_add1?: string;
  pdar_add2?: string;
}

interface PattadarsListProps {
  pattadars: Pattadar[];
}

const PattadarsList: React.FC<PattadarsListProps> = ({ pattadars }) => {
  return (
    <div className="w-full">
      {/* Table View for md+ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border rounded-lg bg-white text-sm md:text-base text-gray-800">
          <thead>
            <tr className="bg-medical-50">
              <th className="px-2 py-2 border text-start">পট্টাদাৰৰ নাম <br /> (Pattadar Name) </th>
              <th className="px-2 py-2 border text-center">পিতাৰ নাম <br /> (Father's Name)</th>
              <th className="px-2 py-2 border text-center">ঠিকনা <br /> (Address)</th>
            </tr>
          </thead>
          <tbody>
            {pattadars?.length ? (
              pattadars.map((p, i) => (
                <tr key={i} className="hover:bg-medical-50">
                  <td className="px-2 py-2 border text-start">{p.pdar_name || "N/A"}</td>
                  <td className="px-2 py-2 border text-center">{p.pdar_father_name || "N/A"}</td>
                  <td className="px-2 py-2 border text-center">
                    {p.pdar_add1 || "N/A"}
                    {p.pdar_add2 ? `, ${p.pdar_add2}` : ""}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-6 text-center text-medical-500">
                  📭 No Pattadars Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card View for mobile */}
      <div className="sm:hidden space-y-4">
        {pattadars?.length ? (
          pattadars.map((p, i) => (
            <div
              key={i}
              className="bg-white shadow rounded-lg p-2 border space-y-2"
            >
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">পট্টাদাৰৰ নাম:</span>
                <span>{p?.pdar_name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">পিতাৰ নাম:</span>
                <span>{p?.pdar_father_name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">ঠিকনা:</span>
                <span>
                  {p?.pdar_add1 || "N/A"}
                  {p?.pdar_add2 ? `, ${p.pdar_add2}` : ""}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-6 bg-white shadow rounded-lg border">
            📭 No Pattadar Data
          </div>
        )}
      </div>
    </div>
  );
};

export default PattadarsList;
