import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ApiService from "@/services/ApiService";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

interface DagDataType {
    dist_code: string;
    subdiv_code: string;
    cir_code: string;
    mouza_pargona_code: string;
    lot_no: string;
    vill_townprt_code: string;
    dag_no: string;
    patta_no: string;
    patta_type_code: string;
    patta_type_name: string;
    dag_area_b: string;
    dag_area_k: string;
    dag_area_lc: string;
    dag_area_g: string;
}

interface PattadarType {
    dist_code: string;
    subdiv_code: string;
    cir_code: string;
    mouza_pargona_code: string;
    lot_no: string;
    vill_townprt_code: string;
    dag_no: string;
    patta_no: string;
    patta_type_code: string;
    pdar_id: string;
    pdar_name: string;
    pdar_father: string;
}


const LMStrikeout: React.FC = () => {
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);
    const [showButton, setShowButton] = useState<boolean>(true);

    const [villages, setVillages] = useState<any[]>([]);
    const [dags, setDags] = useState<any[]>([]);
    const [dagDetails, setDagDetails] = useState<DagDataType>(null);
    const [pattadars, setPattadars] = useState<PattadarType[]>([]);
    
    const [villCode, setVillCode] = useState('');
    const [dagNo, setDagNo] = useState('');
    const [applicant, setApplicant] = useState<string>('');
    const [selectedPattadars, setSelectedPattadars] = useState<string[]>([]);
    const [idProof, setIdProof] = useState<File>(null);
    const [receipt, setReceipt] = useState<File>(null);
    const [selfDeclaration, setSelfDeclaration] = useState<File>(null);
    const [remarks, setRemarks] = useState<string>('');


    useEffect(() => {
        if(location.pathname == '/lm-strikeout') {
            initialize();
        }
    }, [location]);

    useEffect(() => {
        setDagNo('');
        setDags([]);
        if(villCode != '') {
            getDags();
        }
    }, [villCode]);

    useEffect(() => {
        setDagDetails(null);
        setPattadars([]);
        setApplicant('');
        if(dagNo != '') {
            getDagData();
        }
    }, [dagNo]);


    const initialize = async () => {
        await getVillages();
    };

    const resetForm = () => {
        setVillCode('');
        setVillages([]);
        setDagNo('');
        setApplicant('');
        setSelectedPattadars([]);
        setIdProof(null);
        setReceipt(null);
        setSelfDeclaration(null);
        setDags([]);
        setDagDetails(null);
        setPattadars([]);
    };

    const getDagData = async () => {
        const data = {
            dag_no: dagNo
        };

        setLoading(true);
        const response = await ApiService.get('get_lm_strike_dag_data', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        // if(response.data.length < 1) {
        //     return;
        // }

        const resp = response.data;

        console.log(resp);

        setDagDetails(resp.dag_data);
        setPattadars(resp.dag_pattadars);
    };


    const getDags = async () => {
        const data = {
            vill_townprt_code: villCode
        };

        setLoading(true);
        const response = await ApiService.get('get_lm_strike_dags', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }
        if(response.data.length < 1) {
            return;
        }

        let dagData = response.data;

        // console.log(dagData);

        setDags(dagData);

        
    };

    const getVillages = async () => {
        const data = {};
        setLoading(true);
        const response = await ApiService.get('get_lm_villages', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }
        if(response.data.length < 1) {
            return;
        }
        let villageData = response.data;
        setVillages(villageData);
    };


    //events
    const checkPdarHandler = (e: any) => {
        // console.log(e.currentTarget.id, e.currentTarget.checked);
        const unique_id = e.currentTarget.id;
        if(e.currentTarget.checked) {
            if(!selectedPattadars.includes(unique_id)) {
                setSelectedPattadars((prev) => [...prev, unique_id])
            }
        }
        else {
            if(selectedPattadars.includes(unique_id)) {
                setSelectedPattadars((prev) => prev.filter(val => val !== unique_id));
            }
        }
    };

    const handleIdProof = (e: any) => {
        setIdProof(e.currentTarget.files[0]);
    };

    const handleReceipt = (e:any) => {
        setReceipt(e.currentTarget.files[0]);
    };

    const handleSelfDeclaration = (e: any) => {
        setSelfDeclaration(e.currentTarget.files[0]);
    };

    const submitForm = async () => {
        setShowButton(false);
        if(!dagNo || dagNo == '') {
            setShowButton(true);
            toast.error("Dag No is missing!");
            return;
        }
        if(!villCode || villCode == '') {
            setShowButton(true);
            toast.error("Village is missing!");
            return;
        }
        if(!applicant || applicant == '') {
            setShowButton(true);
            toast.error("Please Select the applicant!");
            return;
        }
        if(selectedPattadars.length < 1) {
            setShowButton(true);
            toast.error("Please select the pattadar to be striked out!");
            return;
        }
        if(selectedPattadars.includes(applicant)) {
            setShowButton(true);
            toast.error("Applicant cannot be in the selected pattadars list!");
            return;
        }
        const data = {
            vill_townprt_code: villCode,
            dag_no: dagNo,
            applicant: applicant,
            selectedPattadars: JSON.stringify(selectedPattadars),
            id_proof: idProof,
            receipt: receipt,
            self_declaration: selfDeclaration,
            remarks: remarks
        };

        // console.log(data);

        setLoading(true);
        const response = await ApiService.upload('lm_strikeout_submit', data);
        setLoading(false);

        if (response.status !== 'y') {
            setShowButton(true);
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);
        resetForm();
        initialize();
    };
    



    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <div className="sm:max-w-3xl lg:max-w-screen-2xl mx-auto space-y-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-medical-900 mb-2">Strike Out Name</h1>
                </div>

                <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 my-4">
                        <div className="text-center">
                             <Label htmlFor="district" className="text-xl font-bold">Location</Label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="district">Villages</Label>
                            <select
                                id="district"
                                className="w-full border rounded px-3 py-2 mt-1"
                                value={villCode}
                                onChange={(e: any) => setVillCode(e.currentTarget.value)}
                            >
                                <option value="">Select Villages</option>
                                {
                                villages && villages.length > 0 && villages.map((vdata, index) => <option key={index} value={vdata.dist_code + '-' + vdata.subdiv_code + '-' + vdata.cir_code + '-' + vdata.mouza_pargona_code + '-' + vdata.lot_no + '-' + vdata.vill_townprt_code}>{vdata.loc_name + ' (' + vdata.locname_eng + ')'}</option>)
                                }
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="">Dag No</Label>
                            <select
                                id="circle"
                                className="w-full border rounded px-3 py-2 mt-1"
                                value={dagNo}
                                onChange={(e: any) => setDagNo(e.currentTarget.value)}
                            >
                                <option value="">Select Dag no.</option>
                                {dags && dags.length > 0 && dags.map((ddata, index) => <option key={index} value={ddata.dist_code + '-' + ddata.subdiv_code + '-' + ddata.cir_code + '-' + ddata.mouza_pargona_code + '-' + ddata.lot_no + '-' + ddata.vill_townprt_code + '-' + ddata.dag_no}>{ddata.dag_no}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="">Applicant</Label>
                            <select
                                id="circle"
                                className="w-full border rounded px-3 py-2 mt-1"
                                value={applicant}
                                onChange={(e: any) => setApplicant(e.currentTarget.value)}
                            >
                                <option value="">Select Applicant</option>
                                {pattadars && pattadars.length > 0 && pattadars.map((pdata, index) => <option key={index} value={pdata.dist_code + '-' + pdata.subdiv_code + '-' + pdata.cir_code + '-' + pdata.mouza_pargona_code + '-' + pdata.lot_no + '-' + pdata.vill_townprt_code + '-' + pdata.dag_no + '-' + pdata.patta_no + '-' + pdata.patta_type_code + '-' + pdata.pdar_id}>{pdata.pdar_name + ' (' + pdata.pdar_father + ')'}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow p-4 mb-2">
                    <div className="w-full p-2 text-center">
                        <Label className="text-xl font-bold">Dag Details</Label>
                    </div>
                    <div className="w-full h-64 overflow-y-auto border p-4">
                        <div className="w-full flex flex-row gap-4">
                            <div className="w-1/4 p-4"><strong>Dag No. </strong></div>
                            <div className="w-1/4 p-4"><strong>Patta No</strong></div>
                            <div className="w-1/4 p-4"><strong>Patta Type</strong></div>
                            <div className="w-1/4 p-4"><strong>Land Area</strong></div>
                        </div>
                        <div className="w-full flex flex-row gap-4">
                            <div className="w-1/4 p-4">{(dagDetails && dagDetails.dag_no) ? dagDetails.dag_no : 'No Dag Details'}</div>
                            <div className="w-1/4 p-4">{(dagDetails && dagDetails.patta_no) ? dagDetails.patta_no : ''}</div>
                            <div className="w-1/4 p-4">{(dagDetails && dagDetails.patta_type_name) ? dagDetails.patta_type_name : ''}</div>
                            {(dagDetails && ['21', '22', '23'].includes(dagDetails.dist_code)) ? (<div className="w-1/4 p-4">{(dagDetails && dagDetails.dag_area_b && dagDetails.dag_area_k && dagDetails.dag_area_lc) ? dagDetails.dag_area_b + 'B - ' + dagDetails.dag_area_k + 'K - ' + dagDetails.dag_area_lc + 'C - ' + dagDetails.dag_area_g + 'G' : ''}</div>) : (dagDetails && !['21', '22', '23'].includes(dagDetails.dist_code)) ? (
                                <div className="w-1/4 p-4">{(dagDetails && dagDetails.dag_area_b && dagDetails.dag_area_k && dagDetails.dag_area_lc) ? dagDetails.dag_area_b + 'B - ' + dagDetails.dag_area_k + 'K - ' + dagDetails.dag_area_lc + 'L' : ''}</div>
                            ) : ''}
                        </div>
                    </div>
                </div>


                <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="w-full p-2 text-center">
                        <Label className="text-xl font-bold">Select Pattadar to Strike Out</Label>
                    </div>
                    <div className="w-full h-64 overflow-y-auto border p-4">
                        <div className="w-full flex flex-row gap-4">
                            <div className="w-1/4 p-4"><strong>Serial No. </strong></div>
                            <div className="w-1/4 p-4"><strong>Pattadar Name</strong></div>
                            <div className="w-1/4 p-4"><strong>Pattadar Guardian</strong></div>
                            <div className="w-1/4 p-4"><strong>Action</strong></div>
                        </div>
                        {(pattadars && pattadars.length > 0) ? pattadars.map((pdar, index) => (
                            <div key={index} className="w-full flex flex-row gap-4">
                                <div className="w-1/4 p-4">{++index}</div>
                                <div className="w-1/4 p-4">{pdar.pdar_name}</div>
                                <div className="w-1/4 p-4">{pdar.pdar_father}</div>
                                <div className="w-1/4 p-4"><input type="checkbox" id={pdar.dist_code + '-' + pdar.subdiv_code + '-' + pdar.cir_code + '-' + pdar.mouza_pargona_code + '-' + pdar.lot_no + '-' + pdar.vill_townprt_code + '-' + pdar.dag_no + '-' + pdar.patta_no + '-' + pdar.patta_type_code + '-' + pdar.pdar_id} onChange={checkPdarHandler} className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /></div>
                            </div>
                        )) : (
                            <div className="w-full flex flex-row gap-4">
                                <div className="w-1/4 p-4">No data available.</div>
                                <div className="w-1/4 p-4"></div>
                                <div className="w-1/4 p-4"></div>
                                <div className="w-1/4 p-4"></div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="w-full p-2 text-center">
                        <Label className="text-xl font-bold">Upload Documents</Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                        <div>
                            <Label htmlFor="">Identity proof of the applicant:</Label>
                            <Input
                                id="id_proof"
                                type="file"
                                accept=".jpg,.jpeg,.pdf"
                                className=""
                                onChange={handleIdProof}
                            />
                        </div>
                        <div>
                            <Label htmlFor="">Up-to-date Land Revenue receipt:</Label>
                            <Input
                                id="land_revenue_receipt"
                                type="file"
                                accept=".jpg,.jpeg,.pdf"
                                className=""
                                onChange={handleReceipt}
                            />
                        </div>
                        <div>
                            <Label htmlFor="">Self declaration:</Label>
                            <Input
                                id="self_declaration"
                                type="file"
                                accept=".jpg,.jpeg,.pdf"
                                className=""
                                onChange={handleSelfDeclaration}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="w-full p-2 text-center">
                        <Label className="text-xl font-bold">Remarks</Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mt-4">
                        <div>
                            <Textarea placeholder="Give a note..." id="remarks" value={remarks} onInput={(e: any) => setRemarks(e.currentTarget.value)} />
                        </div>
                    </div>
                </div>

                {showButton && <div className="w-full bg-white rounded-lg shadow p-4 mb-4 text-center">
                    <ConfirmDialog
                        trigger={(<Button className="bg-green-600 hover:bg-green-700">Forward to CO</Button>)}
                        title="Submit"
                        description="Are you sure you want to generate and send the case to the CO?"
                        confirmText="Yes"
                        cancelText="No"
                        onConfirm={submitForm}
                        buttonStyle="green"
                    />
                </div>}

            </div>

            <Loader loading={loading} />
            <Toaster position="top-center" />
        </div>
    );
};

export default LMStrikeout;