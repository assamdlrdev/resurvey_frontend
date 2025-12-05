import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ApiService from "@/services/ApiService";
import Loader from "@/components/Loader";
import CommonService from "@/services/CommonService";
import { useNavigate } from "react-router-dom";


// -------------------------------------------------------------
// Main Component: Partition
// -------------------------------------------------------------
export default function CoPartitionProceed() {

    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [caseDetails, setCaseDetails] = useState([]);
    const [remarks, setRemarks] = useState("");

    const [caseNo, setCaseNo] = useState(null);
    const [nextDagNo, setNextDagNo] = useState(1);
    const [nextPattaNo, setNextPattaNo] = useState(1);

    const [files, setFiles] = useState([
        { name: "", file: null },
        { name: "", file: null },
        { name: "", file: null }
    ]);

    const handleNameChange = (index, value) => {
        const updated = [...files];
        updated[index].name = value;
        setFiles(updated);
    };

    const handleFileChange = (index, file) => {
        const updated = [...files];
        updated[index].file = file;
        setFiles(updated);
    };

    const handleUpload = async (index) => {
        // const handleUpload = (index) => {
        const item = files[index];

        if (!item.name) {
            alert("Please enter a file name!");
            return;
        }

        if (!item.file) {
            alert("Please select a file!");
            return;
        }

        const data = {
            case_no: CommonService.decrypt(caseNo),
            id: index,
            name: item.name,
            file: item.file
        };

        setLoading(true);
        const response = await ApiService.upload('submit_co_partition_supportive_docs', data);
        setLoading(false);

        if (response.status !== 'Y') {
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);
    };

    // Remove file row
    const handleRemove = async (index) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this file?");
        if (!confirmDelete) return;

        const item = files[index];

        if (!item.name) {
            alert("Please enter a file name!");
            return;
        }

        const data = {
            case_no: CommonService.decrypt(caseNo),
            id: index,
            name: item.name
        };

        setLoading(true);
        const response = await ApiService.upload('remove_co_partition_supportive_docs', data);
        setLoading(false);

        if (response.status !== 'Y') {
            toast.error(response.msg);
            return;
        } else {
            const updated = files.filter((_, i) => i !== index);
            setFiles(updated);
            toast.success(response.msg);
        }
    };


    // Add another file row
    const handleAddRow = () => {
        setFiles([...files, { name: "", file: null }]);
    };


    const goTo = (url: string) => {
        navigate(url);
    };

    useEffect(() => {
        if (location.pathname === "/co-partition-form-proceed") {
            getUrlParams();
        }
    }, [location]);


    const getUrlParams = async () => {
        const params = new URLSearchParams(window.location.search);
        const caseNum = params.get('case_no');
        if (caseNum && caseNum.length > 0) {
            setCaseNo(caseNum);
            console.log('Decrypted Text: ' + CommonService.decrypt(caseNum));
            getCaseDetails(CommonService.decrypt(caseNum));
        }
        else {
            console.log('redirect');
            goTo('/co-partition-form');
        }

    };

    // ----------------------------
    //  API Calls
    // ----------------------------
    const getCaseDetails = async (case_num) => {
        try {
            setLoading(true);
            const response = await ApiService.get("get_co_case_details", JSON.stringify({ case_num }));
            setLoading(false);

            if (response.status !== "Y") {
                toast.error(response.msg);
                setCaseDetails([]);
                return;
            }

            setCaseDetails(response.data || []);

            const mappedFiles = response.data.supportive_docs && response.data.supportive_docs.length > 0
                ? response.data.supportive_docs
                    .sort((a, b) => parseInt(a.doc_flag) - parseInt(b.doc_flag))
                    .map(doc => ({
                        name: doc.file_name,
                        file: doc.file_path,
                    }))
                : [
                    { name: "", file: null },
                    { name: "", file: null },
                    { name: "", file: null }
                ];

            console.log('✅ Mapped files:', mappedFiles);
            setFiles(mappedFiles);

        } catch {
            setLoading(false);
            toast.error("Failed to fetch Case Details!");
        }
    };


    //on change case Details
    useEffect(() => {
        const nextDagNo = caseDetails?.existing_dag_list?.length > 0
            ? Math.max(...caseDetails.existing_dag_list.map(Number)) + 1
            : 1;

        setNextDagNo(nextDagNo);

        const nextPattaNo = caseDetails?.existing_patta_no_list?.length > 0
            ? Math.max(...caseDetails.existing_patta_no_list.map(Number)) + 1
            : 1;

        setNextPattaNo(nextPattaNo);


    }, [caseDetails]);


    // ================================
    //   Submit Handler
    // ================================
    const handleSubmit = async () => {
        if (!remarks.trim()) return toast.error("Please enter remarks");

        try {
            setLoading(true);

            const response = await ApiService.postForm(
                "save_co_partition_form",
                JSON.stringify({
                    case_no: CommonService.decrypt(caseNo),
                    remarks: remarks,
                    nextDagNo,
                    nextPattaNo
                })
            );

            setLoading(false);

            if (response.status === "Y") {
                toast.success("Order submitted successfully!", { duration: 3000 });

                setTimeout(() => {
                    goTo("/co-partition-form");
                }, 3000); // wait 5 seconds before redirect
            } else {
                toast.error(response.msg || "Submission error");
            }

        } catch {
            setLoading(false);
            toast.error("Something went wrong, try again");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            {loading && <Loader loading={loading} />}

            <Toaster position="top-center" />

            <div className="sm:max-w-3xl lg:max-w-screen-2xl mx-auto space-y-4 bg-white p-5 rounded-lg shadow">
                <h4 className="text font-bold mb-6 text-center text-gray-800">
                    Circle Officer`s Order for Field Partition
                </h4>


                {/* ================= GENERAL INFORMATION ================= */}
                <table className="min-w-full table-auto rounded-lg shadow border border-gray-300 divide-y divide-gray-300">
                    <thead className="bg-emerald-100">
                        <tr>
                            <th colSpan={4} className="px-4 py-2 text-left font-large text-gray-700 font-semibold">
                                General Information
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-gray-50 divide-x divide-gray-200">
                            <td className="font-bold px-4 py-2 text-sm text-gray-700">Case No.</td>
                            <td className="px-4 py-2 text-sm font-bold">{caseDetails.case_no}</td>
                            <td className="font-bold px-4 py-2 text-sm text-gray-700">Submission Date</td>
                            <td className="px-4 py-2 text-sm font-bold">{CommonService.formatPrettyDate(caseDetails.date_entry)}</td>
                        </tr>

                        <tr className="bg-white divide-x divide-gray-200">
                            <td className="font-bold px-4 py-2 text-sm">Old Patta No.</td>
                            <td className="px-4 py-2 text-sm font-bold">{caseDetails.patta_no}</td>
                            <td className="font-bold px-4 py-2 text-sm">Patta Type</td>
                            <td className="px-4 py-2 text-sm font-bold">{caseDetails.patta_type}</td>
                        </tr>

                        <tr className="bg-gray-50 divide-x divide-gray-200">
                            <td className="font-bold px-4 py-2 text-sm">Old Dag No.</td>
                            <td className="px-4 py-2 text-sm font-bold">{caseDetails.dag_no}</td>
                            <td className="font-bold px-4 py-2 text-sm">Actual Land Area</td>
                            <td className="px-4 py-2 text-sm font-bold">
                                B:{caseDetails.total_dag_area_b},
                                K:{caseDetails.total_dag_area_k},
                                L:{caseDetails.total_dag_area_lc}
                            </td>
                        </tr>

                        <tr className="bg-white divide-x divide-gray-200">
                            <td className="font-bold px-4 py-2 text-sm">Order Type</td>
                            <td className="px-4 py-2 text-sm font-bold">Field Partition</td>
                        </tr>

                    </tbody>
                </table>


                {/* ================= BASIC DETAILS ================= */}
                <table className="min-w-full table-auto rounded-lg shadow border border-gray-300 divide-y divide-gray-300">
                    <thead className="bg-emerald-100">
                        <tr>
                            <th colSpan={4} className="px-4 py-2 text-left font-large text-gray-700 font-semibold">
                                Basic Details
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-gray-50 divide-x divide-gray-200">
                            <td className="font-bold px-4 py-2 text-sm">Land Records Assistant's Name</td>
                            <td className="px-4 py-2 text-sm font-bold">{caseDetails?.lra_name}</td>
                            <td className="font-bold px-4 py-2 text-sm">Sign Date</td>
                            <td className="px-4 py-2 text-sm font-bold">{CommonService.formatPrettyDate(caseDetails.date_entry)}</td>
                        </tr>

                        <tr className="bg-white divide-x divide-gray-200">
                            <td className="font-bold px-4 py-2 text-sm">CO Name</td>
                            <td className="px-4 py-2 text-sm font-bold">{caseDetails?.co_name}</td>
                            <td className="font-bold px-4 py-2 text-sm"></td>
                            <td className="px-4 py-2 text-sm"></td>
                        </tr>
                    </tbody>
                </table>


                {/* ================= LRA NOTE ================= */}
                <table className="min-w-full table-auto rounded-lg shadow border border-gray-300 divide-y divide-gray-300">
                    <thead className="bg-emerald-100">
                        <tr>
                            <th className="px-4 py-2 text-left font-large text-gray-700 font-semibold">Land Records Assistant Note:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white">
                            <td className="px-4 py-3 text-sm text-gray-700">
                                {caseDetails.lra_note}
                            </td>
                        </tr>
                    </tbody>
                </table>


                {/* ================= APPLICANT DETAILS ================= */}
                <table className="min-w-full table-auto rounded-lg shadow border border-gray-200 divide-y divide-gray-300">
                    <thead className="bg-emerald-100">
                        <tr>
                            <th colSpan={5} className="px-4 py-2 text-left font-semibold font-large text-gray-700">
                                Applicant Details
                            </th>
                        </tr>
                        <tr className="bg-emerald-50 text-sm divide-x divide-gray-300">
                            <th>#</th>
                            <th>Applicant</th>
                            <th>Guardian</th>
                            <th>Relation</th>
                            <th>Land Share</th>
                        </tr>
                    </thead>

                    <tbody>
                        {caseDetails?.applicant_list?.length > 0 ? (
                            caseDetails.applicant_list.map((item, index) => (
                                <tr key={item.pdar_id} className="bg-gray-50 divide-x divide-gray-300">
                                    <td className="px-3 py-2">{index + 1}</td>
                                    <td className="px-3 py-2 font-bold">{item.pdar_name}</td>
                                    <td className="px-3 py-2">{item.pdar_guardian}</td>
                                    <td className="px-3 py-2">{item.pdar_rel_guar}</td>
                                    <td className="px-3 py-2">
                                        {`B:${item.pdar_dag_por_b}, K:${item.pdar_dag_por_k}, L:${item.pdar_dag_por_lc}`}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                                    No applicants found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>



                {/* Land Details */}
                <table className="min-w-full table-auto rounded-lg shadow border border-gray-300 divide-y divide-gray-300">
                    <thead className="bg-emerald-100">
                        <tr className="divide-x divide-gray-300">
                            <th colSpan={5} className="px-4 py-2 text-left text-gray-700 font-large">
                                Land Details
                            </th>
                        </tr>
                        <tr className="divide-x divide-gray-300 bg-emerald-50">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Bigha</th>
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Katha</th>
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Lessa</th>
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Genda</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="bg-gray-50 border-b hover:bg-gray-100 divide-x divide-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-700">
                                Applied Land For Partition
                            </td>
                            <td className="px-4 py-2 text-sm font-semibold text-gray-700">{caseDetails.m_dag_area_b}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{caseDetails.m_dag_area_k}</td>
                            <td className="px-4 py-2 text-sm font-semibold text-gray-700">{caseDetails.m_dag_area_lc}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{0}</td>
                        </tr>

                        <tr className="bg-white hover:bg-gray-100 divide-x divide-gray-200">
                            <td className="px-4 py-2 text-sm font-semibold text-gray-700">
                                Land Description in Chitha
                            </td>
                            <td className="px-4 py-2 text-sm font-semibold text-gray-700">{caseDetails.total_dag_area_b}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{caseDetails.total_dag_area_k}</td>
                            <td className="px-4 py-2 text-sm font-semibold text-gray-700">{caseDetails.total_dag_area_lc}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{0}</td>
                        </tr>
                    </tbody>
                </table>



                {/* ================ NEW DAG DETAILS ================ */}
                <table className="min-w-full table-auto rounded-lg shadow border border-gray-300 divide-y divide-gray-300">
                    <thead className="bg-emerald-100">
                        <tr>
                            <th colSpan={4} className="px-4 py-2 font-semibold font-large text-gray-700 text-left">New Dag Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-gray-50 divide-x divide-gray-200">
                            <td className="font-bold px-4 py-2 text-sm">Dag Revenue</td>
                            <td className="px-4 py-2 text-sm">
                                <input className="border rounded w-full p-1" defaultValue={caseDetails.dag_revenue} />
                            </td>
                            <td className="font-bold px-4 py-2 text-sm">Dag Local Tax</td>
                            <td className="px-4 py-2 text-sm">
                                <input className="border rounded w-full p-1" defaultValue={caseDetails?.dag_local_tax} />
                            </td>
                        </tr>

                        <tr className="bg-white divide-x divide-gray-200">
                            <td className="font-bold px-4 py-2 text-sm">Suggested New Dag No.</td>
                            <td className="px-4 py-2 text-sm">
                                <input
                                    className="border rounded w-full p-1"
                                    value={nextDagNo}
                                    onChange={(e) => setNextDagNo(e.target.value)}
                                />
                            </td>

                            <td className="font-bold px-4 py-2 text-sm">Check Existing Dags</td>
                            <td className="px-4 py-2">
                                <select
                                    className="block w-full px-4 py-2 border rounded-md shadow-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" disabled>--- Verify Old Dags ---</option>
                                    {caseDetails?.existing_dag_list
                                        ?.slice()               // create copy to avoid mutating original array
                                        .sort((a, b) => Number(a) - Number(b)) // ascending (numeric + string safe)
                                        .map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                </select>
                            </td>
                        </tr>

                        <tr className="bg-white divide-x divide-gray-200">
                            <td className="font-bold px-4 py-2 text-sm">Suggested New Patta No.</td>
                            <td className="px-4 py-2 text-sm">
                                <input className="border rounded w-full p-1"
                                    value={nextPattaNo}
                                    onChange={(e) => setNextPattaNo(e.target.value)}
                                />
                            </td>
                            <td className="font-bold px-4 py-2 text-sm">Check Existing Patta</td>
                            <td className="px-4 py-2">
                                <select
                                    className="block w-full px-4 py-2 border rounded-md shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" disabled>--- Verify Old Patta ---</option>
                                    {caseDetails?.existing_patta_no_list
                                        ?.slice()               // create copy to avoid mutating original array
                                        .sort((a, b) => Number(a) - Number(b)) // ascending (numeric + string safe)
                                        .map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                </select>
                            </td>

                        </tr>

                    </tbody>
                </table>


                {/* ============ CO REMARKS ============ */}
                <table className="min-w-full table-auto rounded-lg shadow border border-gray-300 divide-y divide-gray-300">
                    <thead className="bg-emerald-100">
                        <tr><th className="px-4 py-2 font-semibold">Remarks:</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2">
                                <textarea
                                    rows={3}
                                    className="border rounded w-full p-2 text-sm"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Enter Remarks here..."
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>


                {/* -------- Upload File Section ---------*/}

                <div>
                    <table className="min-w-full table-auto rounded-lg shadow border border-gray-300 divide-y divide-gray-300 mt-4">
                        <thead className="bg-emerald-100">
                            <tr>
                                <th className="px-4 py-2 font-semibold text-center" colSpan={5}>
                                    Upload Additional Document
                                </th>
                            </tr>
                            <tr className="bg-emerald-50">
                                <th className="px-4 py-2 text-sm text-left w-10">#</th>
                                <th className="px-4 py-2 text-sm text-left">File Name</th>
                                <th className="px-4 py-2 text-sm text-left">Select File</th>
                                <th className="px-4 py-2 text-sm text-left text-center">Upload</th>
                                <th className="px-4 py-2 font-sm text-left text-center">Remove</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-300">
                            {files.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 text-sm">{index + 1}</td>

                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            placeholder="Enter file name"
                                            value={item.name}
                                            onChange={(e) => handleNameChange(index, e.target.value)}
                                            className="border rounded w-full p-2 text-sm"
                                        />
                                    </td>

                                    <td className="px-4 py-2">
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(index, e.target.files[0])}
                                            className="text-sm"
                                        />
                                    </td>

                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleUpload(index)}
                                            className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 text-sm transition"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12.75v6.75a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5v-6.75M7.5 9l4.5-4.5L16.5 9m-4.5-4.5V15"
                                                />
                                            </svg>
                                            Upload
                                        </button>

                                    </td>

                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleRemove(index)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md 
               hover:bg-red-600 text-sm shadow-sm transition"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H8V5a1 1 0 011-1z"
                                                />
                                            </svg>
                                            Remove
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Add Row Button */}
                    <div className="mt-3 text-right">
                        <button
                            onClick={handleAddRow}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            Add More
                        </button>

                    </div>

                </div>



                {/* ================= SUBMIT BUTTON ================= */}
                <div className="flex justify-center pt-3">
                    <button
                        onClick={handleSubmit}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md"
                    >
                        Submit Order
                    </button>
                </div>

            </div>
        </div>
    );
}

