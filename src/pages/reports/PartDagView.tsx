import Constants from '@/config/Constants';
import ApiService from '@/services/ApiService';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PartDagView() {
    const [loading, setLoading] = React.useState(false);
    const [partDagDetails, setPartDagDetails] = React.useState(null);
    useEffect(() => {
        if (location.pathname == '/part-dag-view' || location.pathname == '/resurvey/part-dag-view') {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (!id) {
                toast.error('Invalid parameters');
                return;
            }
            const parts = id.split('-');
            if (parts.length < 8) {
                toast.error('Invalid parameters');
                return;
            }
            const dist_code = parts[0];
            const subdiv = parts[1];
            const cir = parts[2];
            const mouza = parts[3];
            const lot = parts[4];
            const vill_code = parts[5];
            const lgd = parts[6]; // not used
            const old_dag = parts[7]; // not used
            const dag_no = parts[8];

            const vill = `${dist_code}-${subdiv}-${cir}-${mouza}-${lot}-${vill_code}-${lgd}`;
            getPartDagInfo(old_dag, vill, dag_no);
        }

    }, []);
    const getPartDagInfo = async (oldDag, vill, dagNo) => {
        const data = {
            dag_no: oldDag,
            vill_townprt_code: vill,
            part_dag: dagNo
        };

        setLoading(true);
        const response = await ApiService.get('get_partdag_data_preview', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        const partDagDetails = response.data;
        console.log(partDagDetails);
        setPartDagDetails(partDagDetails);

    };
    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg my-8">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">Part Dag View</h1>
            {loading && (
            <div className="flex justify-center items-center py-8">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </div>
            )}
            {!loading && partDagDetails && (
            <>
                {/* Dag Details */}
                <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Dag Details</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-600">
                    <div><span className="font-medium">District </span> {partDagDetails.dist_name}</div>
                    <div><span className="font-medium">Subdiv </span> {partDagDetails.subdiv_name}</div>
                    <div><span className="font-medium">Circle </span> {partDagDetails.cir_name}</div>
                    <div><span className="font-medium">Mouza </span> {partDagDetails.mouza_name}</div>
                    <div><span className="font-medium">Lot No:</span> {partDagDetails.lot_name}</div>
                    <div><span className="font-medium">Village </span> {partDagDetails.village_name}</div>
                    <div><span className="font-medium">Old Dag No:</span> {partDagDetails.dag_no}</div>
                    <div><span className="font-medium">Part Dag No:</span> {partDagDetails.survey_no}</div>
                    <div><span className="font-medium">Patta No:</span> {partDagDetails.patta_no}</div>
                    <div><span className="font-medium">Current Land Use:</span> {partDagDetails.current_landclass_name}</div>
                    <div><span className="font-medium">Survey No:</span> {partDagDetails.bhunaksha_survey_no}</div>
                    <div><span className="font-medium">Area (B-K-L):</span> {partDagDetails.dag_area_b}B-{partDagDetails.dag_area_k}K-{Number(partDagDetails.dag_area_lc).toFixed(2)}L</div>
                    <div><span className="font-medium">Area (Sqm):</span> {partDagDetails.dag_area_sqmtr} m²</div>
                </div>
                </div>

                {/* Pattadars */}
                <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Pattadars</h2>
                {partDagDetails.pattadars && partDagDetails.pattadars.length > 0 ? (
                    <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded">
                        <thead>
                        <tr className="bg-blue-50">
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Father/Guardian</th>
                            <th className="px-4 py-2 border">Patta No</th>
                            <th className="px-4 py-2 border">Dag No</th>
                        </tr>
                        </thead>
                        <tbody>
                        {partDagDetails.pattadars.map((p, idx) => (
                            <tr key={idx} className="hover:bg-blue-50">
                            <td className="px-4 py-2 border">{p.pdar_name}</td>
                            <td className="px-4 py-2 border">{p.pdar_father || '-'}</td>
                            <td className="px-4 py-2 border">{p.patta_no}</td>
                            <td className="px-4 py-2 border">{p.dag_no}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                ) : (
                    <div className="text-gray-500">No pattadars found.</div>
                )}
                </div>

                {/* Possessors */}
                <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Possessors</h2>
                {partDagDetails.possessors && partDagDetails.possessors.length > 0 ? (
                    partDagDetails.possessors.map((poss, idx) => (
                    <div key={idx} className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4">
                        {poss.photo_path && (
                            <img
                            src={`${Constants.API_BASE_URL_ASSET}${poss.photo_path}`}
                            alt={poss.name}
                            className="w-24 h-24 object-cover rounded border"
                            />
                        )}
                        <div className="flex-1 grid grid-cols-2 gap-2 text-gray-700">
                            <div><span className="font-medium">Name:</span> {poss.name}</div>
                            <div><span className="font-medium">Father/Guardian:</span> {poss.guard_name} ({poss.guard_relation_name})</div>
                            <div><span className="font-medium">Gender:</span> {poss.gender}</div>
                            <div><span className="font-medium">DOB:</span> {poss.dob}</div>
                            <div><span className="font-medium">Mobile:</span> {poss.mobile_no}</div>
                            <div><span className="font-medium">Aadhaar:</span> {poss.aadhaar_no}</div>
                            <div><span className="font-medium">Email:</span> {poss.email}</div>
                            <div><span className="font-medium">Mode of Acquisition:</span> {poss.mode_of_acquisition_name}</div>
                            <div className="col-span-2"><span className="font-medium">Remarks:</span> {poss.remarks}</div>
                        </div>
                        </div>
                        {/* Ownership Documents */}
                        {poss.ownership_documents && poss.ownership_documents.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-600 mb-2">Ownership Documents</h3>
                            <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded">
                                <thead>
                                <tr className="bg-blue-100">
                                    <th className="px-3 py-1 border">Document Name</th>
                                    <th className="px-3 py-1 border">Document No</th>
                                    <th className="px-3 py-1 border">Issuing Authority</th>
                                    <th className="px-3 py-1 border">Issue Date</th>
                                    <th className="px-3 py-1 border">File</th>
                                </tr>
                                </thead>
                                <tbody>
                                {poss.ownership_documents.map((doc, dIdx) => (
                                    <tr key={dIdx} className="hover:bg-blue-50">
                                    <td className="px-3 py-1 border">{doc.document_name}</td>
                                    <td className="px-3 py-1 border">{doc.document_no}</td>
                                    <td className="px-3 py-1 border">{doc.issuing_authority}</td>
                                    <td className="px-3 py-1 border">{doc.document_issue_date}</td>
                                    <td className="px-3 py-1 border">
                                        {doc.file_path ? (
                                        <a
                                            href={`${Constants.API_BASE_URL_ASSET}${doc.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            View
                                        </a>
                                        ) : (
                                        '-'
                                        )}
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                        )}
                    </div>
                    ))
                ) : (
                    <div className="text-gray-500">No possessors found.</div>
                )}
                </div>

                {/* Tenants */}
                <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Tenants</h2>
                {partDagDetails.tenants && partDagDetails.tenants.length > 0 ? (
                    <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded">
                        <thead>
                        <tr className="bg-blue-50">
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Details</th>
                        </tr>
                        </thead>
                        <tbody>
                        {partDagDetails.tenants.map((t, idx) => (
                            <tr key={idx} className="hover:bg-blue-50">
                            <td className="px-4 py-2 border">{t.name}</td>
                            <td className="px-4 py-2 border">{/* Add more tenant details here */}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                ) : (
                    <div className="text-gray-500">No tenants found.</div>
                )}
                </div>
            </>
            )}
            {!loading && !partDagDetails && (
            <div className="text-gray-500 text-center py-8">No data to display.</div>
            )}
        </div>
    );
}
