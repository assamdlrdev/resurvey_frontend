import React, { useEffect } from "react";
import { useDagStore } from "@/store/SurveyStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User, Users } from "lucide-react";

export default function ChithaView() {
  const { dagNo, dharDagData, dharPattadars, dharTenants, isLoading } = useDagStore();
  useEffect(() => {
    // This effect can be used to fetch or update data when the component mounts
    // For now, we will just log the dagData to see if it's available
  }, [dharDagData]);
  return (
    <div className="sm:p-6 bg-white max-w-6xl mx-auto mt-4 rounded-lg shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="text-center text-gray-500 text-base sm:text-lg">Loading...</div>
      ) : dagNo ? (
        <>
          {/* Dag Details Section */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 pb-2 mb-2">
            🗂️ দাগৰ তথ্য
          </h2>
          {/* Table for larger screens */}
          <div className="hidden sm:block overflow-x-auto w-full rounded-lg border border-gray-200 bg-white shadow">
            <table className="w-full table-auto text-sm md:text-base text-gray-800">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-semibold text-medical-700">
                    দাগ নং (Dag No):
                  </td>
                  <td className="px-4 py-3">{dharDagData?.dag_no || "N/A"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-medical-700">
                    কালি (বি-ক-লে) (Area B-K-LC):
                  </td>
                  <td className="px-4 py-3">
                    {dharDagData
                      ? `${dharDagData.dag_area_b}-${dharDagData.dag_area_k}-${dharDagData.dag_area_lc}`
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-medical-700">
                    মাটিৰ শ্ৰেণী (Land Class):
                  </td>
                  <td className="px-4 py-3">{dharDagData?.land_type || "N/A"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-medical-700">
                    পট্টাৰ নং (Patta No):
                  </td>
                  <td className="px-4 py-3">{dharDagData?.patta_no || "N/A"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-medical-700">
                    পট্টাৰ প্ৰকাৰ (Patta Type):
                  </td>
                  <td className="px-4 py-3">{dharDagData?.patta_type || "N/A"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-medical-700">
                    ৰাজহ (Revenue ₹):
                  </td>
                  <td className="px-4 py-3">{dharDagData?.dag_revenue || "N/A"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-medical-700">
                    স্হানীয় কৰ (Local Tax ₹):
                  </td>
                  <td className="px-4 py-3">{dharDagData?.dag_local_tax || "N/A"}</td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Card view for mobile */}
          <div className="sm:hidden space-y-4">
            <div className="bg-white shadow rounded-lg p-2 border space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">দাগ নং:</span>
                <span>{dharDagData?.dag_no || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">কালি (বি-ক-লে):</span>
                <span>
                  {dharDagData
                    ? `${dharDagData.dag_area_b}-${dharDagData.dag_area_k}-${dharDagData.dag_area_lc}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">মাটিৰ শ্ৰেণী:</span>
                <span>{dharDagData?.land_type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">পট্টাৰ নং:</span>
                <span>{dharDagData?.patta_no || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">পট্টাৰ প্ৰকাৰ:</span>
                <span>{dharDagData?.patta_type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">ৰাজহ (টকা):</span>
                <span>{dharDagData?.dag_revenue || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">স্হানীয় কৰ (টকা):</span>
                <span>{dharDagData?.dag_local_tax || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Pattadar Section */}
          <div className="mt-8 sm:mt-12">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 pb-2 mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              পট্টাদাৰৰ তথ্য
            </h2>

            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border rounded-lg bg-white">
                <thead>
                  <tr className="bg-medical-50">
                    <th className="px-2 py-2 border text-start">
                      পট্টাদাৰৰ নাম (Pattadar Name)
                    </th>
                    <th className="px-2 py-2 border text-center">
                      পিতাৰ নাম (Father's Name)
                    </th>
                    <th className="px-2 py-2 border text-center">
                      ঠিকনা (Address)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dharPattadars?.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-medical-500">
                        📭 No Pattadar Data
                      </td>
                    </tr>
                  ) : (
                    dharPattadars.map((p, i) => (
                      <tr key={i} className="hover:bg-medical-50">
                        <td className="px-2 py-2 border text-start">
                          {p?.pdar_name || "N/A"}
                        </td>
                        <td className="px-2 py-2 border text-center">
                          {p?.pdar_father_name || "N/A"}
                        </td>
                        <td className="px-2 py-2 border text-center">
                          {p?.pdar_add1 || "N/A"}
                          {p?.pdar_add2 ? `, ${p.pdar_add2}` : ""}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>


            {/* Card view for mobile */}
            <div className="sm:hidden space-y-4">
              {dharPattadars?.length ? (
                dharPattadars.map((p, i) => (
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
                      <span>{p?.pdar_add1 || "N/A"}{p?.pdar_add2 ? `, ${p.pdar_add2}` : ""}</span>
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

          {/* Tenant Section */}
          <div className="mt-8 sm:mt-12">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 pb-2 mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              ৰায়ত/ আধিয়াৰৰ তথ্য
            </h2>

            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border rounded-lg bg-white">
                <thead>
                  <tr className="bg-medical-50">
                    <th className="px-2 py-2 border text-start font-medium">
                      ৰায়ত/ আধিয়াৰৰ নাম (Tenant Name)
                    </th>
                    <th className="px-2 py-2 border text-start font-medium">
                      পিতাৰ নাম (Father's Name)
                    </th>
                    <th className="px-2 py-2 border text-start font-medium">
                      ঠিকনা (Address)
                    </th>
                    <th className="px-2 py-2 border text-center font-medium">
                      খতিয়ান নং (Khatian No)
                    </th>
                    <th className="px-2 py-2 border text-center font-medium">
                      ৰায়ত/ আধিয়াৰৰ স্থিতি (Tenant Status)
                    </th>
                    <th className="px-2 py-2 border text-center font-medium">
                      ৰায়ত/আধিয়াৰ আয় (Revenue Tenant)
                    </th>
                    <th className="px-2 py-2 border text-center font-medium">
                      মন্তব্য (Remarks)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dharTenants?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-medical-500">
                        📭 No Tenant Data
                      </td>
                    </tr>
                  ) : (
                    dharTenants.map((t) => (
                      <tr key={t.tenant_id} className="hover:bg-medical-50">
                        <td className="px-2 py-2 border text-start">{t.tenant_name || "N/A"}</td>
                        <td className="px-2 py-2 border text-center">{t.tenants_father || "N/A"}</td>
                        <td className="px-2 py-2 border text-center">
                          {t.tenants_add1 || "N/A"}{t.tenants_add2 ? `, ${t.tenants_add2}` : ""}
                        </td>
                        <td className="px-2 py-2 border text-center">{t.khatian_no || "-"}</td>
                        <td className="px-2 py-2 border text-center">{t.tenant_status || "-"}</td>
                        <td className="px-2 py-2 border text-center">{t.revenue_tenant || "-"}</td>
                        <td className="px-2 py-2 border text-center">{t.remarks || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>


            {/* Card view for mobile */}
            <div className="sm:hidden space-y-4">
              {dharTenants?.length ? (
                dharTenants.map((t) => (
                  <div
                    key={t.tenant_id}
                    className="bg-white shadow rounded-lg p-2 border space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-medical-700">Tenant Name:</span>
                      <span>{t.tenant_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-medical-700">Father&apos;s Name:</span>
                      <span>{t.tenants_father}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-medical-700">Address:</span>
                      <span>{t.tenants_add1}{t.tenants_add2 ? `, ${t.tenants_add2}` : ""}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-medical-700">Khatian No:</span>
                      <span>{t.khatian_no}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-medical-700">Tenant Status:</span>
                      <span>{t.tenant_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-medical-700">Revenue Tenant:</span>
                      <span>{t.revenue_tenant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-medical-700">Remarks:</span>
                      <span>{t.remarks}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-6 bg-white shadow rounded-lg border">
                  📭 No Tenant Data
                </div>
              )}
            </div>

          </div>

        </>
      ) : (
        <div className="text-center text-gray-500 text-base sm:text-lg">
          Please select a Dag to view details.
        </div>
      )}
    </div>
  );
}
