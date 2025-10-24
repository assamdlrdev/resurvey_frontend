// components/PartDagDetails.tsx
import { Users } from "lucide-react";

export default function PartDagDetailsComp({
  dagData,
  pattadars,
  tenants,
}: {
  dagData: any;
  pattadars: any[];
  tenants: any[];
}) {
  return (
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
              <td className="px-4 py-3">{dagData?.dag_no || "N/A"}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-medical-700">
                কালি (বি-ক-লে) (Area B-K-LC):
              </td>
              <td className="px-4 py-3">
                {dagData
                  ? `${dagData.dag_area_b}-${dagData.dag_area_k}-${dagData.dag_area_lc}`
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-medical-700">
                মাটিৰ শ্ৰেণী (Land Class):
              </td>
              <td className="px-4 py-3">{dagData?.land_type || "N/A"}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-medical-700">
                পট্টাৰ নং (Patta No):
              </td>
              <td className="px-4 py-3">{dagData?.patta_no || "N/A"}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-medical-700">
                পট্টাৰ প্ৰকাৰ (Patta Type):
              </td>
              <td className="px-4 py-3">{dagData?.patta_type || "N/A"}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-medical-700">
                ৰাজহ (Revenue ₹):
              </td>
              <td className="px-4 py-3">{dagData?.dag_revenue || "N/A"}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-medical-700">
                স্হানীয় কৰ (Local Tax ₹):
              </td>
              <td className="px-4 py-3">{dagData?.dag_local_tax || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="sm:hidden space-y-4">
        <div className="bg-white shadow rounded-lg p-2 border space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold text-medical-700">দাগ নং:</span>
            <span>{dagData?.dag_no || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-medical-700">কালি (বি-ক-লে):</span>
            <span>
              {dagData
                ? `${dagData.dag_area_b}-${dagData.dag_area_k}-${dagData.dag_area_lc}`
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-medical-700">মাটিৰ শ্ৰেণী:</span>
            <span>{dagData?.land_type || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-medical-700">পট্টাৰ নং:</span>
            <span>{dagData?.patta_no || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-medical-700">পট্টাৰ প্ৰকাৰ:</span>
            <span>{dagData?.patta_type || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-medical-700">ৰাজহ (টকা):</span>
            <span>{dagData?.dag_revenue || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-medical-700">স্হানীয় কৰ (টকা):</span>
            <span>{dagData?.dag_local_tax || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Pattadar Section */}
      <div className="mt-8 sm:mt-12">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 pb-2 mb-2 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-500" />
          পট্টাদাৰৰ তথ্য
        </h2>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border rounded-lg bg-white">
            <thead>
              <tr className="bg-medical-50">
                <th className="px-2 py-2 border text-start">
                  পট্টাদাৰৰ নাম
                </th>
                <th className="px-2 py-2 border text-center">
                  পিতাৰ নাম
                </th>
                <th className="px-2 py-2 border text-center">
                  ঠিকনা
                </th>
              </tr>
            </thead>
            <tbody>
              {pattadars?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-medical-500">
                    📭 No Pattadar Data
                  </td>
                </tr>
              ) : (
                pattadars.map((p, i) => (
                  <tr key={i} className="hover:bg-medical-50">
                    <td className="px-2 py-2 border text-start">{p?.pdar_name || "N/A"}</td>
                    <td className="px-2 py-2 border text-center">{p?.pdar_father_name || "N/A"}</td>
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

        {/* Mobile cards */}
        <div className="sm:hidden space-y-4">
          {pattadars?.length ? (
            pattadars.map((p, i) => (
              <div key={i} className="bg-white shadow rounded-lg p-2 border space-y-2">
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

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border rounded-lg bg-white">
            <thead>
              <tr className="bg-medical-50">
                <th className="px-2 py-2 border text-start">নাম</th>
                <th className="px-2 py-2 border text-start">পিতাৰ নাম</th>
                <th className="px-2 py-2 border text-start">ঠিকনা</th>
                <th className="px-2 py-2 border text-center">খতিয়ান নং</th>
                <th className="px-2 py-2 border text-center">স্থিতি</th>
                <th className="px-2 py-2 border text-center">আয়</th>
                <th className="px-2 py-2 border text-center">মন্তব্য</th>
              </tr>
            </thead>
            <tbody>
              {tenants?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-medical-500">
                    📭 No Tenant Data
                  </td>
                </tr>
              ) : (
                tenants.map((t, i) => (
                  <tr key={i} className="hover:bg-medical-50">
                    <td className="px-2 py-2 border text-start">{t.tenant_name || "N/A"}</td>
                    <td className="px-2 py-2 border text-center">{t.tenants_father || "N/A"}</td>
                    <td className="px-2 py-2 border text-center">
                      {t.tenants_add1 || "N/A"}
                      {t.tenants_add2 ? `, ${t.tenants_add2}` : ""}
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

        {/* Mobile cards */}
        <div className="sm:hidden space-y-4">
          {tenants?.length ? (
            tenants.map((t, i) => (
              <div key={i} className="bg-white shadow rounded-lg p-2 border space-y-2">
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
  );
}
