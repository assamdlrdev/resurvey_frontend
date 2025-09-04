import React from "react";

interface Tenant {
  tenant_id: string;
  tenant_name?: string;
  tenants_father?: string;
  tenants_add1?: string;
  tenants_add2?: string;
  khatian_no?: string;
  tenant_status?: string;
  revenue_tenant?: string;
  remarks?: string;
}

interface TenantsListProps {
  tenants: Tenant[];
}

const TenantsList: React.FC<TenantsListProps> = ({ tenants }) => {
  return (
    <div className="w-full">
      {/* Table View for md+ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border rounded-lg bg-white text-sm md:text-base text-gray-800">
          <thead>
            <tr className="bg-medical-50">
              <th className="px-2 py-2 border text-start font-medium">Tenant Name</th>
              <th className="px-2 py-2 border text-start font-medium">Father&apos;s Name</th>
              <th className="px-2 py-2 border text-start font-medium">Address</th>
              <th className="px-2 py-2 border text-center font-medium">Khatian No</th>
              <th className="px-2 py-2 border text-center font-medium">Tenant Status</th>
              <th className="px-2 py-2 border text-center font-medium">Revenue Tenant</th>
              <th className="px-2 py-2 border text-center font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {tenants?.length ? (
              tenants.map((t) => (
                <tr key={t.tenant_id} className="hover:bg-medical-50">
                  <td className="px-2 py-2 border text-start">{t.tenant_name || "N/A"}</td>
                  <td className="px-2 py-2 border text-start">{t.tenants_father || "N/A"}</td>
                  <td className="px-2 py-2 border text-start">
                    {t.tenants_add1 || "N/A"}
                    {t.tenants_add2 ? `, ${t.tenants_add2}` : ""}
                  </td>
                  <td className="px-2 py-2 border text-center">{t.khatian_no || "N/A"}</td>
                  <td className="px-2 py-2 border text-center">{t.tenant_status || "N/A"}</td>
                  <td className="px-2 py-2 border text-center">{t.revenue_tenant || "N/A"}</td>
                  <td className="px-2 py-2 border text-center">{t.remarks || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-medical-500">
                  📭 No Tenant Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card View for mobile */}
      <div className="sm:hidden space-y-4">
        {tenants?.length ? (
          tenants.map((t) => (
            <div
              key={t.tenant_id}
              className="bg-white shadow rounded-lg p-2 border space-y-2"
            >
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">Tenant Name:</span>
                <span>{t.tenant_name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">Father&apos;s Name:</span>
                <span>{t.tenants_father || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">Address:</span>
                <span>
                  {t.tenants_add1 || "N/A"}
                  {t.tenants_add2 ? `, ${t.tenants_add2}` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">Khatian No:</span>
                <span>{t.khatian_no || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">Status:</span>
                <span>{t.tenant_status || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">Revenue Tenant:</span>
                <span>{t.revenue_tenant || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-medical-700">Remarks:</span>
                <span>{t.remarks || "N/A"}</span>
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
  );
};

export default TenantsList;
