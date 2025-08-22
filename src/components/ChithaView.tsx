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
    <div className="p-6 bg-white max-w-6xl mx-auto mt-4 rounded-lg shadow-sm">
      {isLoading ? (
      <div className="text-center text-gray-500 text-lg">Loading...</div>
      ) : dagNo ? (
      <>
        {/* Dag Data Section */}
        <div>
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
          🗂️ দাগৰ তথ্য
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-base text-gray-700">
          <div>
          <dt className="font-medium">দাগ নং:</dt>
          <dd>{dharDagData?.dag_no || "N/A"}</dd>
          </div>
          <div>
          <dt className="font-medium">কালি (বি-ক-লে):</dt>
          <dd>
            {dharDagData
            ? `${dharDagData.dag_area_b}-${dharDagData.dag_area_k}-${dharDagData.dag_area_lc}`
            : "N/A"}
          </dd>
          </div>
          <div>
          <dt className="font-medium">মাটিৰ শ্ৰেণী:</dt>
          <dd>{dharDagData?.land_type || "N/A"}</dd>
          </div>
          <div>
          <dt className="font-medium">পট্টাৰ নং:</dt>
          <dd>{dharDagData?.patta_no || "N/A"}</dd>
          </div>
          <div>
          <dt className="font-medium">পট্টাৰ প্ৰকাৰ:</dt>
          <dd>{dharDagData?.patta_type || "N/A"}</dd>
          </div>
          <div>
          <dt className="font-medium">ৰাজহ (টকা):</dt>
          <dd>{dharDagData?.dag_revenue || "N/A"}</dd>
          </div>
          <div>
          <dt className="font-medium">স্হানীয় কৰ (টকা):</dt>
          <dd>{dharDagData?.dag_local_tax || "N/A"}</dd>
          </div>
        </dl>
        </div>

        {/* Pattadar Section */}
        <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-500" />
          পট্টাদাৰৰ তথ্য
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-base text-gray-800">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
            <tr>
            <th className="px-4 py-3 text-left font-medium">পট্টাদাৰৰ নাম</th>
            <th className="px-4 py-3 text-left font-medium">পিতাৰ নাম</th>
            <th className="px-4 py-3 text-left font-medium">ঠিকনা</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dharPattadars?.length ? (
            dharPattadars.map((p, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50 transition-colors">
              <td className="px-4 py-3">{p?.pdar_name || "N/A"}</td>
              <td className="px-4 py-3">{p?.pdar_father_name || "N/A"}</td>
              <td className="px-4 py-3">
                {p?.pdar_add1 || "N/A"}{p?.pdar_add2 ? `, ${p.pdar_add2}` : ""}
              </td>
              </tr>
            ))
            ) : (
            <tr>
              <td colSpan={3} className="px-4 py-10 text-center text-gray-500 text-lg">
              📭 No Pattadar Data
              </td>
            </tr>
            )}
          </tbody>
          </table>
        </div>
        </div>

        {/* Tenant Section */}
        <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-500" />
          ৰায়ত/ আধিয়াৰৰ তথ্য
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-base text-gray-800">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
            <tr>
            <th className="px-4 py-3 text-left font-medium">Tenant Name</th>
            <th className="px-4 py-3 text-left font-medium">Father&apos;s Name</th>
            <th className="px-4 py-3 text-left font-medium">Address</th>
            <th className="px-4 py-3 text-left font-medium">Khatian No</th>
            <th className="px-4 py-3 text-left font-medium">Tenant Status</th>
            <th className="px-4 py-3 text-left font-medium">Revenue Tenant</th>
            <th className="px-4 py-3 text-left font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dharTenants?.length ? (
            dharTenants.map((t) => (
              <tr key={t.tenant_id} className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50 transition-colors">
              <td className="px-4 py-3">{t.tenant_name}</td>
              <td className="px-4 py-3">{t.tenants_father}</td>
              <td className="px-4 py-3">
                {t.tenants_add1}{t.tenants_add2 ? `, ${t.tenants_add2}` : ""}
              </td>
              <td className="px-4 py-3">{t.khatian_no}</td>
              <td className="px-4 py-3">{t.tenant_status}</td>
              <td className="px-4 py-3">{t.revenue_tenant}</td>
              <td className="px-4 py-3">{t.remarks}</td>
              </tr>
            ))
            ) : (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-gray-500 text-lg">
              📭 No Tenant Data
              </td>
            </tr>
            )}
          </tbody>
          </table>
        </div>
        </div>
      </>
      ) : (
      <div className="text-center text-gray-500 text-lg">
        Please select a Dag to view details.
      </div>
      )}
    </div>
  );
}
