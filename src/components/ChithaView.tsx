import React from "react";

export default function ChithaView() {

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-[1200px] border border-gray-300 divide-y divide-gray-200 text-sm shadow-md rounded-lg">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
              <th className="px-3 py-2 border text-left whitespace-nowrap" rowSpan={2}>
                দাগ নং (Old)
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap" rowSpan={2}>
                মাটিৰ শ্ৰেণী
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap" rowSpan={2}>
                কালি
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                পট্টাৰ নং আৰু প্ৰকাৰ(existing)
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                পট্টাৰ নং আৰু প্ৰকাৰ (New)
                </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                ৰাজহ(টকা)
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                স্হানীয় কৰ(টকা)
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                পট্টাদাৰৰ নাম, পিতাৰ নাম আৰু ঠিকনা
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Possessor Name
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Possessor's guardian's Name
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Possessor's relation with guardian
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Relation of Possessor with pattadar
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Particulars of transaction/mode of acquisition by possessor (sale, mortgage and lease)
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                নামজাৰী হবলগীয়া দখলদাৰৰ নাম, পিতাৰ নাম, ঠিকনা
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                ৰায়ত/ আধিয়াৰৰ নাম, পিতাৰ নাম, ঠিকনা
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Relation of possessor with tenant
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                ৰায়তৰ প্ৰকাৰ/ খতিয়ন নং, খাজানা বা ফছলৰ নিৰিখ
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                মন্তব্য
              </th>
          </tr>
          <tr>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Soil Type
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Dikali
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Existing Pattadar No. and Type
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                New Pattadar No. and Type
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Revenue (in Rs.)
              </th>
              <th className="px-3 py-2 border text-left whitespace-nowrap">
                Local Tax (in Rs.)
              </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
            <tr  className="hover:bg-gray-50">
              <td className="px-3 py-2 border whitespace-nowrap">Col</td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}
