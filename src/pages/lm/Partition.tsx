import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import ApiService from "@/services/ApiService";
import Loader from "@/components/Loader";

// -------------------------------------------------------------
// Main Component: Partition
// -------------------------------------------------------------
export default function Partition() {
    // ----------------------------
    //  State Definitions
    // ----------------------------
    const [loading, setLoading] = useState(false);
    const [villages, setVillages] = useState([]);
    const [selectedVillage, setSelectedVillage] = useState("");

    const [pattaTypes, setPattaTypes] = useState([]);
    const [selectedPatta, setSelectedPatta] = useState("");

    const [pattaNumbers, setPattaNumbers] = useState([]);
    const [selectedPattaNumber, setSelectedPattaNumber] = useState("");

    const [dagNumbers, setDagNumbers] = useState([]);
    const [selectedDagNumber, setSelectedDagNumber] = useState("");

    const [dagPattadarInfo, setDagPattadarInfo] = useState([]);
    const [selectedApplicantsIds, setSelectedApplicantsIds] = useState([]);

    const [landAreaInfo, setLandAreaInfo] = useState({
        bigha: 0,
        katha: 0,
        lessa: 0,
        totalBigha: 0,
        totalKatha: 0,
        totalLessa: 0,
    });

    const location = useLocation();
    const selectedPattaType = pattaTypes.find((p) => p.type_code === selectedPatta);

    // ----------------------------
    //  Handlers
    // ----------------------------
    const handleLandAreaInfoChange = (e) => {
        const { name, value } = e.target;
        setLandAreaInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onToggleApplicantSelect = (index) => {
        setSelectedApplicantsIds((prev) => {
            const isSelected = prev.includes(index);
            return isSelected
                ? prev.filter((id) => id !== index)
                : [...prev, index];
        });
    };

    // ----------------------------
    //  Derived Values
    // ----------------------------
    const bighaOptions = Array.from(
        { length: Number(landAreaInfo.totalBigha) + 1 },
        (_, i) => i
    );
    const kathaOptions = Array.from(
        { length: Number(landAreaInfo.totalKatha) + 1 },
        (_, i) => i
    );
    const lessaOptions = Array.from(
        { length: Number(landAreaInfo.totalLessa) + 1 },
        (_, i) => i
    );

    // ----------------------------
    //  API Calls
    // ----------------------------
    const getVillages = async () => {
        try {
            setLoading(true);
            const res = await ApiService.get("get_lm_villages", JSON.stringify({}));
            setLoading(false);

            if (res.status !== "y") {
                toast.error(res.msg);
                setVillages([]);
                return;
            }

            setVillages(res.data || []);
        } catch {
            setLoading(false);
            toast.error("Failed to fetch villages");
        }
    };

    const getPattaTypes = async () => {
        try {
            setLoading(true);
            const res = await ApiService.get("get_patta_types", JSON.stringify({}));
            setLoading(false);

            if (res.status !== "y") return toast.error(res.msg);
            setPattaTypes(res.data || []);
        } catch {
            setLoading(false);
            toast.error("Failed to fetch patta types");
        }
    };

    const getPattaNumbers = async () => {
        if (!selectedVillage || !selectedPatta) return;

        const payload = {
            data: selectedVillage,
            patta_type_code: selectedPatta,
        };

        const res = await ApiService.get("get_patta_numbers", JSON.stringify(payload));
        if (res.status !== "y") {
            toast.error(res.msg);
            setPattaNumbers([]);
            return;
        }

        const sorted = res.data.sort((a, b) => Number(a.patta_no) - Number(b.patta_no));
        setPattaNumbers(sorted || []);
    };

    const getDagNumbers = async () => {
        if (!selectedVillage || !selectedPatta || !selectedPattaNumber) return;

        const payload = {
            data: selectedVillage,
            patta_type_code: selectedPatta,
            patta_no: selectedPattaNumber,
        };

        const res = await ApiService.get("get_dag_numbers", JSON.stringify(payload));
        if (res.status !== "y") {
            toast.error(res.msg);
            setDagNumbers([]);
            return;
        }

        const sorted = res.data.sort((a, b) => Number(a.dag_no) - Number(b.dag_no));
        setDagNumbers(sorted || []);
    };

    const getDagPattadarInfo = async () => {
        if (!selectedVillage || !selectedPatta || !selectedPattaNumber || !selectedDagNumber)
            return;

        const payload = {
            data: selectedVillage,
            patta_type_code: selectedPatta,
            patta_no: selectedPattaNumber,
            dag_no: selectedDagNumber,
        };

        const res = await ApiService.get("get_dag_pattadar_info", JSON.stringify(payload));
        if (res.status !== "y") {
            toast.error(res.msg);
            setDagPattadarInfo([]);
            return;
        }

        setDagPattadarInfo(res.data || []);
    };

    const getLandAreaInfo = async () => {
        if (!selectedVillage || !selectedPatta || !selectedPattaNumber) return;

        const payload = {
            data: selectedVillage,
            patta_type_code: selectedPatta,
            patta_no: selectedPattaNumber,
            dag_no: selectedDagNumber,
        };

        const res = await ApiService.get("get_land_area_info", JSON.stringify(payload));
        if (res.status !== "y") {
            toast.error(res.msg);
            return;
        }

        const data = res.data[0];
        setLandAreaInfo({
            bigha: 0,
            katha: 0,
            lessa: 0,
            totalBigha: Number(data.total_bigha || 0),
            totalKatha: Number(data.total_katha || 0),
            totalLessa: Number(data.total_lessa || 0),
        });
    };

    // ----------------------------
    //  Lifecycle Effects
    // ----------------------------
    useEffect(() => {
        if (location.pathname === "/partition-form") {
            getVillages();
            getPattaTypes();
        }
    }, [location]);

    useEffect(() => {
        if (selectedVillage && selectedPatta) getPattaNumbers();
        if (selectedVillage && selectedPatta && selectedPattaNumber) getDagNumbers();
        if (selectedVillage && selectedPatta && selectedPattaNumber && selectedDagNumber) {
            getDagPattadarInfo();
            getLandAreaInfo();
        }
    }, [selectedVillage, selectedPatta, selectedPattaNumber, selectedDagNumber]);

    // ----------------------------
    //  Render
    // ----------------------------
    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            {loading && <Loader loading={loading} />}

            <div className="sm:max-w-3xl lg:max-w-screen-2xl mx-auto space-y-4">
                <h4 className="text font-bold mb-6 text-center text-gray-800">Partition Form</h4>

                {/* --------- Village, Patta Type & Number --------- */}
                <div className="grid grid-cols-4 gap-4 mb-4 bg-white p-6 rounded-lg shadow">
                    {/* Village */}
                    <Dropdown
                        id="village"
                        label="Village"
                        value={selectedVillage}
                        onChange={setSelectedVillage}
                        options={villages.map((v) => ({
                            value: JSON.stringify({
                                dist_code: v.dist_code,
                                subdiv_code: v.subdiv_code,
                                cir_code: v.cir_code,
                                mouza_pargona_code: v.mouza_pargona_code,
                                lot_no: v.lot_no,
                                vill_townprt_code: v.vill_townprt_code,
                            }),
                            label: `${v.loc_name} (${v.locname_eng})`,
                        }))}
                    />

                    {/* Patta Type */}
                    <Dropdown
                        id="pattaType"
                        label="Patta Type"
                        value={selectedPatta}
                        onChange={setSelectedPatta}
                        options={pattaTypes.map((pt) => ({
                            value: pt.type_code,
                            label: pt.patta_type,
                        }))}
                    />

                    {/* Patta Number */}
                    <Dropdown
                        id="pattaNum"
                        label="Patta Number"
                        value={selectedPattaNumber}
                        onChange={setSelectedPattaNumber}
                        options={pattaNumbers.map((pt) => ({
                            value: pt.patta_no,
                            label: pt.patta_no,
                        }))}
                    />

                    {/* Dag Number */}
                    <Dropdown
                        id="dagNum"
                        label="Dag Number"
                        value={selectedDagNumber}
                        onChange={setSelectedDagNumber}
                        options={dagNumbers.map((dag) => ({
                            value: dag.dag_no,
                            label: dag.dag_no,
                        }))}
                    />
                </div>

                {/* --------- Applicant List --------- */}
                <ApplicantList
                    dagPattadarInfo={dagPattadarInfo}
                    selectedApplicantsIds={selectedApplicantsIds}
                    onToggleApplicantSelect={onToggleApplicantSelect}
                />

                {/* --------- Land Area Info --------- */}
                {selectedApplicantsIds?.length > 0 && (
                    <LandAreaTable
                        landAreaInfo={landAreaInfo}
                        handleLandAreaInfoChange={handleLandAreaInfoChange}
                        bighaOptions={bighaOptions}
                        kathaOptions={kathaOptions}
                        lessaOptions={lessaOptions}
                        selectedDagNumber={selectedDagNumber}
                        selectedPattaType={selectedPattaType}
                        selectedPattaNumber={selectedPattaNumber}
                    />
                )}

                {/* remarks */}
                {selectedApplicantsIds?.length > 0 && (

                    <div className="w-full bg-white p-6 rounded-lg shadow">

                        <label className="block mb-2 text-sm font-medium text-gray-900">
                            Remarks
                        </label>

                        <textarea
                            // value={value}
                            // onChange={(e) => onRemarksChangeHandler(e.target.value)}
                            placeholder="Enter Remarks here..."
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                        />

                        <div className="flex justify-center">
                            <button
                                // onClick={handleSubmit}
                                className="mt-3 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                            >
                                Submit
                            </button>
                        </div>
                    </div>

                )};

            </div>
        </div>
    );
}

// -------------------------------------------------------------
// Reusable Subcomponents
// -------------------------------------------------------------

function Dropdown({ id, label, value, onChange, options }) {
    return (
        <div>
            <label htmlFor={id} className="block text-gray-600 font-medium mb-1">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">Select {label}</option>
                {options.map((opt, i) => (
                    <option key={i} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function ApplicantList({ dagPattadarInfo, selectedApplicantsIds, onToggleApplicantSelect }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text font-bold mb-6 text-center text-gray-800">Applicant List</h4>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-300 text-gray-700 text-left">
                            <th className="px-4 py-2">Select</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Father</th>
                            <th className="px-4 py-2">Mobile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dagPattadarInfo.length > 0 ? (
                            dagPattadarInfo.map((pattadar, i) => {
                                const isSelected = selectedApplicantsIds.includes(i);
                                return (
                                    <tr key={i} className={`border-t hover:bg-gray-50 ${isSelected ? "bg-gray-200" : ""}`}>
                                        <td className="px-4 py-2">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => onToggleApplicantSelect(i)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">{pattadar.pdar_name}</td>
                                        <td className="px-4 py-2">{pattadar.pdar_father}</td>
                                        <td className="px-4 py-2">{pattadar.pdar_mobile}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-gray-500 py-4 italic">
                                    No applicants yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function LandAreaTable({
    landAreaInfo,
    handleLandAreaInfoChange,
    bighaOptions,
    kathaOptions,
    lessaOptions,
    selectedDagNumber,
    selectedPattaType,
    selectedPattaNumber,
}) {
    return (
        <div className="gap-4 mb-4 bg-white p-4 rounded-md shadow">
            <h4 className="text font-bold mb-6 text-center text-gray-800">Land Area Information</h4>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider" style={{ width: "200px" }}>
                                Dag Number
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                Patta Type
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                Patta Number
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                                Total Area
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {selectedDagNumber || "Not Selected"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {selectedPattaType?.patta_type || "Not Selected"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {selectedPattaNumber || "Not Selected"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {Number(landAreaInfo.totalBigha)} Bigha{" "}
                                {Number(landAreaInfo.totalKatha)} Katha{" "}
                                {Number(landAreaInfo.totalLessa)} Lessa
                            </td>
                        </tr>

                        {/* Mutated Area */}
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-500">Mutated Area</td>
                            {[["bigha", "Bigha", bighaOptions], ["katha", "Katha", kathaOptions], ["lessa", "Lessa", lessaOptions]].map(([name, label, options]) => (
                                <td key={name} className="px-6 py-4 text-sm text-gray-700">
                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            id={name}
                                            name={name}
                                            value={landAreaInfo[name]}
                                            onChange={handleLandAreaInfoChange}
                                            className="block w-full rounded-lg border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500 text-gray-700 text-sm p-2.5 transition duration-200"
                                        >
                                            <option value="">-- Select {label} --</option>
                                            {options.map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-gray-800 font-semibold text-blue-600">{label}</p>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
