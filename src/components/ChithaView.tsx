import React, { useEffect } from "react";
import { useDagStore } from "@/store/SurveyStore";

export default function ChithaView() {
  const {dagNo, dharDagData, pattadars, isLoading } = useDagStore();
  useEffect(() => {
    // This effect can be used to fetch or update data when the component mounts
    // For now, we will just log the dagData to see if it's available
    console.log("ChithaView mounted with dagData:", dharDagData);
  }, [dharDagData]);
  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-3xl mx-auto mt-4">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : dagNo ?  (
        <>
          {/* Dag Data Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <span className="font-medium">দাগ নং:</span>{" "}
              {dharDagData?.dag_no || "N/A"}
            </div>
            <div>
              <span className="font-medium">কালি( বি-ক-লে ): </span>
              {dharDagData ? (dharDagData.dag_area_b + '-' + dharDagData.dag_area_k + '-' + dharDagData.dag_area_lc) : "N/A"}
            </div>
            <div>
              <span className="font-medium">মাটিৰ শ্ৰেণী:</span>{" "}
              {dharDagData?.land_type || "N/A"}
            </div>
            <div>
              <span className="font-medium">পট্টাৰ নং:</span>{" "}
              {dharDagData?.patta_no || "N/A"}
            </div>
            <div>
              <span className="font-medium">পট্টাৰ প্ৰকাৰ:</span>{" "}
              {dharDagData?.patta_type || "N/A"}
            </div>
            <div>
              <span className="font-medium">ৰাজহ (টকা):</span>{" "}
              {dharDagData?.dag_revenue || "N/A"}
            </div>
            <div>
              <span className="font-medium">স্হানীয় কৰ (টকা):</span>{" "}
              {dharDagData?.dag_local_tax || "N/A"}
            </div>
          </div>

          {/* Pattadar Section */}
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mt-6 mb-4">
            পট্টাদাৰৰ নাম, পিতাৰ নাম আৰু ঠিকনা
          </h2>
          <div className="space-y-4">
            {pattadars && pattadars.length > 0 ? (
              pattadars.map((pattadar, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">পট্টাদাৰৰ নাম:</span>{" "}
                    <span className="text-gray-900">
                      {pattadar?.pdar_name || "N/A"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">পিতাৰ নাম:</span>{" "}
                    <span className="text-gray-900">
                      {pattadar?.pdar_father_name || "N/A"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium text-gray-700">ঠিকনা:</span>{" "}
                    <span className="text-gray-900">
                      {pattadar?.pdar_add1 || "N/A"}
                      {pattadar?.pdar_add2 ? `, ${pattadar.pdar_add2}` : ""}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">No Pattadar Data</div>
            )}
          </div>
        </>
      )  : (
        <div className="text-center text-gray-500">
          Please select a Dag to view details.
        </div>
      )}
    </div>


  );
}
