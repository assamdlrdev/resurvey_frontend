// import InplaceAlongwith from "@/components/InplaceAlongwith";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import ApiService from "@/services/ApiService";
import StorageService from "@/services/StorageService";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

interface UserData {
    dist_code: string;
    subdiv_code: string;
    cir_code: string;

};



const LMMutation: React.FC = () => {
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);

    // const [distCode, setDistCode] = useState<string>('');
    const [districtData, setDistrictData] = useState<any>('');
    // const [subdivCode, setSubdivCode] = useState<string>('');
    // const [cirCode, setCirCode] = useState<string>('');

    const [appName, setAppName] = useState<string>('');
    const [appGuardName, setAppGuardName] = useState<string>('');
    const [appGuardRel, setAppGuardRel] = useState<string>('');
    const [appGender, setAppGender] = useState<string>('');
    const [appMobile, setAppMobile] = useState<string>('');


    const [villages, setVillages] = useState<any[]>([]);
    const [pattaTypeData, setPattaTypeData] = useState<any[]>([]);
    const [pattaNoData, setPattaNoData] = useState<any[]>([]);
    const [dagData, setDagData] = useState<any[]>([]);
    const [pattadarData, setPattadarData] = useState<any[]>([]);
    const [applicantData, setApplicantData] = useState<any[]>([]);
    const [transferTypeData, setTransferTypeData] = useState<any[]>([]);
    const [pdarInplaceAlongData, setPdarInplaceAlongData] = useState<any[]>([]);

    const [villCode, setVillCode] = useState<string>('');
    const [pattaType, setPattaType] = useState<string>('');
    const [pattaNo, setPattaNo] = useState<string>('');
    const [dagNos, setDagNos] = useState<string[]>([]);
    const [pattadars, setPattadars] = useState<string[]>([]);
    const [pdarUnique, setPdarUnique] = useState<string>('');
    const [deedNo, setDeedNo] = useState<string>('');
    const [deedDate, setDeedDate] = useState<string>('');
    const [deedValue, setDeedValue] = useState<string>('');
    const [mBigha, setMBigha] = useState<number>(0);
    const [mKatha, setMKatha] = useState<number>(0);
    const [mLessaChatak, setMLessaChatak] = useState<number>(0);
    const [mGanda, setMGanda] = useState(0);
    const [transferType, setTransferType] = useState<string>('');
    const [rajahAdalat, setRajahAdalat] = useState<string>('y');
    const [dispute, setDispute] = useState<string>('n');
    const [applicantPossession, setApplicantPossession] = useState<string>('y');
    const [remarks, setRemarks] = useState<string>('');
    const [inplaceAlongwith, setInplaceAlongwith] = useState<any[]>([]);
    const [deedCopy, setDeedCopy] = useState<File>(null);
    const [receipt, setReceipt] = useState<File>(null);
    const [selfDeclaration, setSelfDeclaration] = useState<File>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [iAModalOpen, setIAModalOpen] = useState<boolean>(false);
    const [deedRequired, setDeedRequired] = useState<boolean>(true);
    const [showButton, setShowButton] = useState<boolean>(true);

    // useEffect(() => {
    //     console.log(inplaceAlongwith);
    // }, [inplaceAlongwith]);

    
    useEffect(() => {
        if(location.pathname == '/lm-mutation') {
            initialize();
        }
    }, [location]);

    useEffect(() => {
        setPattaType('');
        setPattaNo('');
        setPattaNoData([]);


    }, [villCode]);

    useEffect(() => {
        if(pattaType == '') {
            setPattaNo('');
            setPattaNoData([]);
            // resetForm();
        }
        else {
            getPattaNos();
        }
    }, [pattaType]);

    useEffect(() => {
        if(pattaNo == '') {
            setApplicantData([]);
            setDagNos([]);
            setDagData([]);
        }
        else {
            setApplicantData([]);
            setDagNos([]);
            setDagData([]);
            getDagData();
        }
    }, [pattaNo]);

    useEffect(() => {
        if(dagData.length < 1) {
            setDagNos([]);
        }
    }, [dagData]);

    useEffect(() => {
        if(dagNos.length < 1) {
            setPattadars([]);
            setPattadarData([]);
        }
        else {
            // setPattadars([]);
            // setPattadarData([]);
            updatePattadars();
        }
    }, [dagNos]);

    useEffect(() => {
        if(pattadars.length < 1) {
            setInplaceAlongwith([]);
            setPdarInplaceAlongData([]);
        }
        else {
            updatePdarInplaceAlong();
        }
    }, [pattadars, dagNos]);

    useEffect(() => {
        if(transferType && transferType != '' && transferType != undefined) {
            const transferTypeArr = transferType.split('-');
            if(transferTypeArr[1] == 'i') {
                setDeedNo('');
                setDeedDate('');
                setDeedValue('');
                setDeedRequired(false);
            }
            else {
                setDeedRequired(true);
            }
        }
    }, [transferType]);

    //Resets
    const resetApplicant = () => {
        setAppName('');
        setAppGuardName('');
        setAppGuardRel('');
        setAppGender('');
        setAppMobile('');
    };

    const resetForm = async () => {
        setRemarks('');
        setApplicantPossession('y');
        setDispute('n');
        setRajahAdalat('y');
        setTransferType('');
        setMGanda(0);
        setMLessaChatak(0);
        setMKatha(0);
        setMBigha(0);
        setDeedValue('');
        setDeedDate('');
        setDeedNo('');
        setPdarUnique('');
        setInplaceAlongwith([]);
        setPattadars([]);
        setDagNos([]);
        setPattaNo('');
        setPattaType('');
        setVillCode('');
        setIsOpen(false);
        setDeedRequired(true);

        setPdarInplaceAlongData([]);
        setTransferTypeData([]);
        setApplicantData([]);
        setPattadarData([]);
        setDagData([]);
        setPattaNoData([]);
        setPattaTypeData([]);
        setVillages([]);
        setShowButton(true);
    
    };

    //

    const getGuardianRelation = (data: string) => {
        if(data == 'f') {
            return 'পিতৃ';
        }
        else if(data == 'm') {
            return 'মাতৃ';
        }
        else if(data == 'h') {
            return 'পতি';
        }
        else if(data == 'w') {
            return 'পত্নী';
        }
        else if(data == 'u') {
            return 'অভিভাৱক';
        }
        else {
            return '';
        }
    };

    const getGender = (data: string) => {
        if(data == 'm') {
            return 'Male';
        }
        else if (data == 'f') {
            return 'Female';
        }
        else if (data == 'o') {
            return 'Other';
        }
        else {
            return '';
        }
    };

    const updateValue = (name: string, newValue: string) => {
        setInplaceAlongwith(prevArr => {
            const exists = prevArr.some(item => item.name === name);

            if (exists) {
                // ✅ Replace value if exists
                return prevArr.map(item =>
                item.name === name ? { ...item, value: newValue } : item
                );
            } else {
                // ➕ Add new if not exists
                return [...prevArr, { name, value: newValue }];
            }

        });
    };

    const updatePdarInplaceAlong = async () => {
        setInplaceAlongwith([]);
        if(dagNos.length < 1) {
            setPdarInplaceAlongData([]);
            return;
        }
        const data = {
            // vill_townprt_code: villCode,
            // patta_type_code: pattaType,
            // patta_no: pattaNo,
            dag_nos: dagNos,
            pattadars: pattadars
        };

        setLoading(true);
        const response = await ApiService.get('get_lm_pattadar_dags', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            setPdarInplaceAlongData([]);
            toast.error(response.msg);
            return;
        }
        if(response.data.length < 1) {
            setPdarInplaceAlongData([]);
            return;
        }

        let pattadarDags = response.data;

        setPdarInplaceAlongData(pattadarDags);
    };


    const updatePattadars = async () => {
        
        const data = {
            vill_townprt_code: villCode,
            patta_type_code: pattaType,
            patta_no: pattaNo,
            dag_nos: dagNos
        };

        setLoading(true);
        const response = await ApiService.get('get_lm_pattadars', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            setPattadars([]);
            setPattadarData([]);
            toast.error(response.msg);
            return;
        }
        if(response.data.length < 1) {
            setPattadars([]);
            setPattadarData([]);
            return;
        }

        let pattadars = response.data;

        setPattadarData(pattadars);
    };

    const getDagData = async () => {
        const data = {
            vill_townprt_code: villCode,
            patta_type_code: pattaType,
            patta_no: pattaNo
        };

        setLoading(true);
        const response = await ApiService.get('get_lm_dags', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            setDagData([]);
            toast.error(response.msg);
            return;
        }
        if(response.data.length < 1) {
            setDagData([]);
            return;
        }

        let dags = response.data;

        setDagData(dags);
    };

    const getPattaNos = async() => {
        setPattaNo('');
        if(villCode == '') {
            setPattaNoData([]);
            toast.error('No village selected!');
            return;
        }
        const data = {
            vill_townprt_code: villCode,
            patta_type_code: pattaType 
        };

        setLoading(true);
        const response = await ApiService.get('get_lm_pattas', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            setPattaNoData([]);
            toast.error(response.msg);
            return;
        }
        if(response.data.length < 1) {
            setPattaNoData([]);
            return;
        }
        let pattaData = response.data;
        setPattaNoData(pattaData);
    };

    const getVillages = async() => {
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

    const getPattaTypes = async() => {
        const data = {};
        setLoading(true);
        const response = await ApiService.get('get_lm_patta_types', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }
        if(response.data.length < 1) {
            return;
        }
        let pattaTypes = response.data;
        setPattaTypeData(pattaTypes);
    };

    const getTransferTypes = async () => {
        const data = {};
        setLoading(true);
        const response = await ApiService.get('get_lm_transfer_types', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }
        if(response.data.length < 1) {
            return;
        }
        let transferTypes = response.data;
        setTransferTypeData(transferTypes);
    };

    const initialize = async() => {
        // const user = StorageService.getJwtCookie();
        // const userData = StorageService.getJwtCookieData(user);


        await getVillages();
        await getPattaTypes();
        await getTransferTypes();
    };

    //eventHandler
    const checkHandler = (e: any, dag_no: string) => {
        if(e.currentTarget.checked) {
            if(!dagNos.includes(dag_no)) {
                setDagNos((prev) => [...prev, dag_no])
            }
        }
        else {
            if(dagNos.includes(dag_no)) {
                setDagNos((prev) => prev.filter(val => val !== dag_no));
            }
        }
    };

    const checkPdarHandler = (e: any, pdar_unique_id: string) => {
         if(e.currentTarget.checked) {
            if(!pattadars.includes(pdar_unique_id)) {
                setPattadars((prev) => [...prev, pdar_unique_id])
            }
        }
        else {
            if(pattadars.includes(pdar_unique_id)) {
                setPattadars((prev) => prev.filter(val => val !== pdar_unique_id));
            }
        }
    }

    const handleRadio = (e: any) => {
        updateValue(e.currentTarget.name, e.currentTarget.value);
    };
    //

    const addApplicantModal = () => {
        resetApplicant();
        setIsOpen(true);

    };

    // const updateInplaceAlong = async (e: any) => {
    //     const unique_id = e.currentTarget.id;

    //     setPdarUnique(unique_id);
    //     setIAModalOpen(true);

    //     // console.log(unique_id);
    // };

    const submitApplicant = async () => {
        // console.log(appName, appGuardName, appGuardRel, appGender, appMobile);
        if(appName == '' || appGuardName == '' || appGuardRel == '' || appGender == '' || appMobile == '') {
            toast.error('Inputs not set!');
            return;
        }

        if(villCode == '' || pattaType == '' || pattaNo == '' || dagNos.length < 1) {
            toast.error('location not set!');
            return;
        }

        let unique_id = Date.now();

        let data = {
            // vill_code: villCode,
            // patta_type_code: pattaType,
            // patta_no: pattaNo,
            // dag_nos: dagNos,
            applicant_unique_id: unique_id,
            applicant_name: appName,
            applicant_guard_name: appGuardName,
            applicant_guard_rel: appGuardRel,
            applicant_gender: appGender,
            applicant_mobile: appMobile
        };

        

        setApplicantData(prev => [...prev, data]);

        // setLoading(true);
        // const response = await ApiService.get('submit_applicant', JSON.stringify(data));
        // setLoading(false);

        // if (response.status !== 'y') {
        //     toast.error(response.msg);
        //     return;
        // }

        // console.log(response);



        

        setIsOpen(false);
    };

    const removeApplicant = (e: any) => {
        
        const unique_id = e.currentTarget.id.split('_')[1];
        console.log(unique_id);

        setApplicantData(prev => prev.filter(obj => obj.applicant_unique_id.toString() !== unique_id));
    };

    const submitForm = async () => {
        // console.log(inplaceAlongwith, pdarInplaceAlongData, dagNos, pattadars, transferType, rajahAdalat, dispute, applicantPossession, pattaNo, pattaType, villCode, inplaceAlongwith.length, pdarInplaceAlongData.length);
        setShowButton(false);
        if(!villCode) {
            setShowButton(true);
            toast.error('Village not set!');
            return;
        }
        if(!pattaType) {
            setShowButton(true);
            toast.error('Patta Type not set!');
            return;
        }
        if(!pattaNo) {
            setShowButton(true);
            toast.error('Patta No not set!');
            return;
        }
        if(!dagNos || dagNos.length < 1) {
            setShowButton(true);
            toast.error('Dag Nos not set!');
            return;
        }
        if(pattadars.length < 1) {
             setShowButton(true);
            toast.error('Pattadars not set!');
            return;
        }
        if(inplaceAlongwith.length < 1 || inplaceAlongwith.length !== pdarInplaceAlongData.length) {
            setShowButton(true);
            toast.error('Inplace Alongwith not set!');
            return;
        }
        if(!transferType) {
            setShowButton(true);
            toast.error('Transfer Type not set!');
            return;
        }
        if(!rajahAdalat) {
            setShowButton(true);
            toast.error('Rajah Adalat not set!');
            return;
        }
        if(!dispute) {
            setShowButton(true);
            toast.error('Dispute not set!');
            return;
        }
        if(!applicantPossession) {
            setShowButton(true);
            toast.error('Applicant Possession not set!');
            return;
        }
        if(applicantData.length < 1) {
            setShowButton(true);
            toast.error('Applicant details not set!');
            return;
        }
        // if(!deedCopy) {
        //     setShowButton(true);
        //     toast.error('Deed Copy not set!');
        //     return;
        // }
        // if(!receipt) {
        //     setShowButton(true);
        //     toast.error('Land Revenue Receipt not set!');
        //     return;
        // }
        // if(!selfDeclaration) {
        //     setShowButton(true);
        //     toast.error('Self Declaration not set!');
        //     return;
        // }

        const locArr = villCode.split('-');
        const distCode = locArr[0];
        if(distCode == '21' || distCode == '22' || distCode == '23') {
            if(mBigha == 0 && mKatha == 0 && mLessaChatak == 0 && mGanda == 0) {
                setShowButton(true);
                toast.error('Area not set!');
                return;
            }
        }
        else {
            if(mBigha == 0 && mKatha == 0 && mLessaChatak == 0) {
                setShowButton(true);
                toast.error('Area not set!');
                return;
            }
        }
        const ttypeArr = transferType.split('-');
        const ttype = ttypeArr[1];

        if(ttype != 'i') {
            if(!deedNo || !deedDate || !deedValue) {
                setShowButton(true);
                toast.error('Deed Information not set!');
                return;
            }
        }


        const data = {
            location: villCode,
            patta_type_code: pattaType,
            patta_no: pattaNo,
            dag_nos: JSON.stringify(dagNos),
            pattadars: JSON.stringify(pattadars),
            inplace_alongwith: JSON.stringify(inplaceAlongwith),
            transfer_type: transferType,
            deed_date: deedDate,
            deed_no: deedNo,
            deed_value: deedValue,
            rajah_adalat: rajahAdalat,
            dispute: dispute,
            applicant_possession: applicantPossession,
            remarks: remarks,
            m_bigha: mBigha,
            m_katha: mKatha,
            m_lessa_chatak: mLessaChatak,
            m_ganda: mGanda,
            applicants: JSON.stringify(applicantData),
            deed_copy: deedCopy,
            receipt: receipt,
            self_declaration: selfDeclaration
        };

        setLoading(true);
        const response = await ApiService.upload('lm_mut_submit', data);
        setLoading(false);

        if (response.status !== 'y') {
            setShowButton(true);
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);

        resetForm();
        initialize();

        // console.log(response);
    };

    const handleDeedCopy = (e: any) => {
        // console.log(e.currentTarget.files[0]);
        setDeedCopy(e.currentTarget.files[0]);
    };

    const handleReceipt = (e: any) => {
        // console.log(e.currentTarget.files[0]);
        setReceipt(e.currentTarget.files[0]);
    };

    const handleSelfDeclaration = (e: any) => {
        setSelfDeclaration(e.currentTarget.files[0]);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <div className="sm:max-w-3xl lg:max-w-screen-2xl mx-auto space-y-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-medical-900 mb-2">Mutation</h1>
                </div>
                <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 my-4">
                        <div className="text-center">
                             <Label htmlFor="district" className="text-xl font-bold">Location</Label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <Label htmlFor="">Patta Type</Label>
                            <select
                                id="circle"
                                className="w-full border rounded px-3 py-2 mt-1"
                                value={pattaType}
                                onChange={(e: any) => setPattaType(e.currentTarget.value)}
                            >
                                <option value="">Select Patta Type</option>
                                {pattaTypeData && pattaTypeData.length > 0 && pattaTypeData.map((ptdata, index) => <option key={index} value={ptdata.type_code}>{ptdata.patta_type}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="">Patta No</Label>
                            <select
                                id="circle"
                                className="w-full border rounded px-3 py-2 mt-1"
                                value={pattaNo}
                                onChange={(e: any) => setPattaNo(e.currentTarget.value)}
                            >
                                <option value="">Select Patta No</option>
                                {pattaNoData && pattaNoData.length > 0 && pattaNoData.map((pndata, index) => <option key={index} value={pndata.patta_no}>{pndata.patta_no}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                {dagData && dagData.length > 0 && <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="w-full p-2 text-center">
                        <Label className="text-xl font-bold">Select Dag Nos</Label>
                    </div>
                    <div className="w-full h-64 overflow-y-auto border p-4">
                        <div className="w-full flex flex-row gap-4">
                            <div className="w-1/3 p-4"><strong>Dag No</strong></div>
                            <div className="w-1/3 p-4"><strong>Total Area</strong></div>
                            <div className="w-1/3 p-4"><strong>Action</strong></div>
                        </div>
                        {dagData.map((dag, index) => (
                            <div key={index} className="w-full flex flex-row gap-4">
                                <div className="w-1/3 p-4">{dag.dag_no}</div>
                                <div className="w-1/3 p-4">{['21', '22', '23'].includes(dag.dist_code) ? dag.dag_area_b + 'B-' + dag.dag_area_k + 'K-' + dag.dag_area_lc + 'C-' + dag.dag_area_g + 'G' : dag.dag_area_b + 'B-' + dag.dag_area_k + 'K-' + dag.dag_area_lc + 'L'}</div>
                                <div className="w-1/3 p-4"><input type="checkbox" onChange={(e: any) => checkHandler(e, dag.dag_no)} className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /></div>
                            </div>
                        ))}
                    </div>
                </div>}
                {dagNos && dagNos.length > 0 && <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xl font-bold" htmlFor="district">Applicants</Label>
                        </div>
                        {dagNos && dagNos.length > 0 && <div className="flex justify-end">
                            <Button onClick={addApplicantModal} className="bg-green-600 hover:bg-green-700">Add</Button>
                        </div>}
                    </div>
                    {(applicantData && applicantData.length > 0) ? (<div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                        <div className="w-full h-64 overflow-y-auto border p-4">
                            <div className="w-full flex flex-row gap-4">
                                <div className="w-1/6 p-4"><strong>Name</strong></div>
                                <div className="w-1/6 p-4"><strong>Guardian</strong></div>
                                <div className="w-1/6 p-4"><strong>Relation</strong></div>
                                <div className="w-1/6 p-4"><strong>Gender</strong></div>
                                <div className="w-1/6 p-4"><strong>Mobile</strong></div>
                                <div className="w-1/6 p-4"><strong>Action</strong></div>
                            </div>
                            
                            {applicantData.map((adata, i) => (
                                <div className="w-full flex flex-row gap-4" key={i}>
                                    <div className="w-1/6 p-4">{adata.applicant_name}</div>
                                    <div className="w-1/6 p-4">{adata.applicant_guard_name}</div>
                                    <div className="w-1/6 p-4">{getGuardianRelation(adata.applicant_guard_rel)}</div>
                                    <div className="w-1/6 p-4">{getGender(adata.applicant_gender)}</div>
                                    <div className="w-1/6 p-4">{adata.applicant_mobile}</div>
                                    <div className="w-1/6 p-4"><Button id={'applicant_' + adata.applicant_unique_id} className="bg-red-600 hover:bg-red-700 text-white" onClick={removeApplicant}>Delete</Button></div>
                                </div>
                            ))}
                        </div>
                    </div>) : (<div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                            <div className="w-full flex flex-row gap-2">
                                <div className="w-1/6 p-4"><strong>Name</strong></div>
                                <div className="w-1/6 p-4"><strong>Guardian</strong></div>
                                <div className="w-1/6 p-4"><strong>Relation</strong></div>
                                <div className="w-1/6 p-4"><strong>Gender</strong></div>
                                <div className="w-1/6 p-4"><strong>Mobile</strong></div>
                                <div className="w-1/6 p-4"><strong>Action</strong></div>
                            </div>
                            <div className="w-full flex flex-row gap-2">
                                <div className="w-1/6 p-4">No data Available</div>
                                <div className="w-1/6 p-4"></div>
                                <div className="w-1/6 p-4"></div>
                                <div className="w-1/6 p-4"></div>
                                <div className="w-1/6 p-4"></div>
                                <div className="w-1/6 p-4"></div>
                            </div>
                    </div>)}
                </div>}
                {pattadarData && pattadarData.length > 0 && <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="w-full p-2 text-center">
                        <Label className="text-xl font-bold">Select Pattadars</Label>
                    </div>
                    <div className="w-full h-64 overflow-y-auto border p-4">
                        <div className="w-full flex flex-row gap-4">
                            <div className="w-1/4 p-4"><strong>Serial No. </strong></div>
                            <div className="w-1/4 p-4"><strong>Pattadar Name</strong></div>
                            <div className="w-1/4 p-4"><strong>Pattadar Guardian</strong></div>
                            <div className="w-1/4 p-4"><strong>Action</strong></div>
                        </div>
                        {pattadarData.map((pdar, ind) => (
                            <div key={ind} className="w-full flex flex-row gap-4">
                                <div className="w-1/4 p-4">{++ind}</div>
                                <div className="w-1/4 p-4">{pdar.pdar_name}</div>
                                <div className="w-1/4 p-4">{pdar.pdar_father}</div>
                                <div className="w-1/4 p-4"><input type="checkbox" onChange={(e: any) => checkPdarHandler(e, pdar.unique_id)} className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /></div>
                                {/* <Button id={pdar.unique_id} onClick={updateInplaceAlong}>Set</Button> */}
                            </div>
                        ))}
                    </div>
                </div>}
                {pdarInplaceAlongData && pdarInplaceAlongData.length > 0 && <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="w-full p-2 text-center">
                        <Label className="text-xl font-bold">Inplace Alongwith Status</Label>
                    </div>
                    <div className="w-full h-64 overflow-y-auto border p-4">
                        <div className="w-full flex flex-row gap-4">
                            <div className="w-1/4 p-4"><strong>Serial No. </strong></div>
                            <div className="w-1/4 p-4"><strong>Pattadar Name (Pattadar Guardian)</strong></div>
                            <div className="w-1/4 p-4"><strong>Dag No.</strong></div>
                            <div className="w-1/4 p-4"><strong>Action</strong></div>
                        </div>

                        {pdarInplaceAlongData.map((pdarInplaceAlong, i) => (
                            <div className="w-full flex flex-row gap-4" key={i}>
                                <div className="w-1/4 p-4">{++i}</div>
                                <div className="w-1/4 p-4">{`${pdarInplaceAlong.pdar_name} (${pdarInplaceAlong.pdar_father})`}</div>
                                <div className="w-1/4 p-4">{`${pdarInplaceAlong.dag_no}`}</div>
                                <div className="w-1/4 p-4">
                                    <label className="mr-2"><input type="radio" name={pdarInplaceAlong.unique_id} value="inplace" onChange={handleRadio} checked={inplaceAlongwith.some(item => item.name === pdarInplaceAlong.unique_id && item.value === 'inplace')} /> Inplace</label>

                                    <label className="ml-2"><input type="radio" name={pdarInplaceAlong.unique_id} value="alongwith" onChange={handleRadio} checked={inplaceAlongwith.some(item => item.name === pdarInplaceAlong.unique_id && item.value === 'alongwith')} /> Alongwith</label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}
                <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div>
                            <Label htmlFor="">Transfer Type:</Label>
                            <select
                                id="transfer_type"
                                className="w-full border rounded px-3 py-2 mt-1"
                                value={transferType}
                                onChange={(e: any) => setTransferType(e.currentTarget.value)}
                            >
                                <option value="">Select Transfer Type</option>
                                {transferTypeData && transferTypeData.length > 0 && transferTypeData.map((tTypeData, index) => <option key={index} value={tTypeData.trans_code + '-' + tTypeData.trans_type}>{tTypeData.trans_desc_as}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="">Rajah Adalat:</Label>
                            <select
                                id="rajah_adalat"
                                className="w-full border rounded px-3 py-2 mt-1"
                                value={rajahAdalat}
                                onChange={(e: any) => setRajahAdalat(e.currentTarget.value)}
                            >
                                <option value="y">Yes</option>
                                <option value="n">No</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="">Dispute:</Label>
                            <select
                                id="dispute"
                                className="w-full border rounded px-3 py-2 mt-1"
                                value={dispute}
                                onChange={(e: any) => setDispute(e.currentTarget.value)}
                            >
                                <option value="y">Yes</option>
                                <option value="n">No</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="">Applicant has Possession:</Label>
                            <select
                                id="applicant_possession"
                                className="w-full border rounded px-3 py-2 mt-1"
                                value={applicantPossession}
                                onChange={(e: any) => setApplicantPossession(e.currentTarget.value)}
                            >
                                <option value="y">Yes</option>
                                <option value="n">No</option>
                            </select>
                        </div>
                    </div>
                    {deedRequired && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="district">Deed No.</Label>
                            <Input
                                id="deed_no"
                                className="w-full border rounded px-3 py-2 mt-1"
                                placeholder="Enter Deed No"
                                value={deedNo}
                                onChange={(e: any) => {
                                    setDeedNo(e.currentTarget.value);
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="district">Deed Date</Label>
                            <Input
                                id="deed_date"
                                type="date"
                                className="w-full border rounded px-3 py-2 mt-1"
                                placeholder="Enter Deed Date"
                                value={deedDate}
                                onChange={(e: any) => {
                                    setDeedDate(e.currentTarget.value);
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="district">Deed Value</Label>
                            <Input
                                id="deed_value"
                                className="w-full border rounded px-3 py-2 mt-1"
                                placeholder="Enter Deed Value"
                                value={deedValue}
                                onChange={(e: any) => {
                                    setDeedValue(e.currentTarget.value);
                                }}
                            />
                        </div>
                    </div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div>
                            <Label htmlFor="">Mutated Bigha</Label>
                            <Input
                                id="m_bigha"
                                type="number"
                                className="w-full border rounded px-3 py-2 mt-1"
                                placeholder="Enter Mutated Bigha"
                                value={mBigha}
                                onChange={(e: any) => {
                                    setMBigha(e.currentTarget.value);
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="">Mutated Katha</Label>
                            <Input
                                id="m_katha"
                                type="number"
                                className="w-full border rounded px-3 py-2 mt-1"
                                placeholder="Enter Mutated Katha"
                                value={mKatha}
                                onChange={(e: any) => {
                                    setMKatha(e.currentTarget.value);
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="">Mutated Lessa / Chatak</Label>
                            <Input
                                id="m_lessa_chatak"
                                type="number"
                                className="w-full border rounded px-3 py-2 mt-1"
                                placeholder="Enter Mutated Lessa / Chatak"
                                value={mLessaChatak}
                                onChange={(e: any) => {
                                    setMLessaChatak(e.currentTarget.value);
                                }}
                            />
                        </div>
                        {false && <div>
                            <Label htmlFor="">Mutated Ganda</Label>
                            <Input
                                id="m_ganda"
                                type="number"
                                className="w-full border rounded px-3 py-2 mt-1"
                                placeholder="Enter Mutated Ganda"
                                value={mGanda}
                                onChange={(e: any) => {
                                    setMGanda(e.currentTarget.value);
                                }}
                            />
                        </div>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mt-4">
                        <div>
                            <Label htmlFor="">Remarks:</Label>
                            <Textarea id="remarks" value={remarks} onChange={(e:any) => setRemarks(e.currentTarget.value)} onInput={(e:any) => setRemarks(e.currentTarget.value)}>

                            </Textarea>
                        </div>
                    </div>
                </div>
                {dagNos && dagNos.length > 0 && <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="w-full p-2 text-center">
                        <Label className="text-xl font-bold">Upload Documents</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                        <div>
                            <Label htmlFor="">Deed Copy:</Label>
                            <Input
                                id="deed_copy"
                                type="file"
                                accept=".jpg,.jpeg,.pdf"
                                className=""
                                onChange={handleDeedCopy}
                            />
                        </div>
                        <div>
                            <Label htmlFor="">Land Revenue Receipt:</Label>
                            <Input
                                id="land_revenue_receipt"
                                type="file"
                                accept=".jpg,.jpeg,.pdf"
                                className=""
                                onChange={handleReceipt}
                            />
                        </div>
                        <div>
                            <Label htmlFor="">Self Declaration:</Label>
                            <Input
                                id="self_declaration"
                                type="file"
                                accept=".jpg,.jpeg,.pdf"
                                className=""
                                onChange={handleSelfDeclaration}
                            />
                        </div>
                    </div>
                </div>}
                {dagNos && dagNos.length > 0 && <div className="w-full bg-white rounded-lg shadow p-4 mb-4 text-center">
                    {showButton && 
                    
                    (<ConfirmDialog
                        trigger={(<Button className="bg-green-600 hover:bg-green-700">Forward to CO</Button>)}
                        title="Submit"
                        description="Are you sure you want to generate and send the case to the CO?"
                        confirmText="Yes"
                        cancelText="No"
                        onConfirm={submitForm}
                        buttonStyle="green"
                    />)}

                   
                </div>}
            </div>












            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                        <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>

                            <Card className="w-full my-4">
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle className="w-full text-center">Add Applicant</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="">Applicant Name</Label>
                                            <Input
                                                id="applicant_name"
                                                type="text"
                                                placeholder="Name"
                                                value={appName}
                                                onInput={(e: any) => setAppName(e.currentTarget.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="">Guardian Name</Label>
                                            <Input
                                                id="applicant_guard_name"
                                                type="text"
                                                placeholder="Guardian Name"
                                                value={appGuardName}
                                                onInput={(e: any) => setAppGuardName(e.currentTarget.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="">Guardian Relation</Label>
                                            <select
                                                id="applicant_guard_relation"
                                               
                                                className="w-full border rounded px-3 py-2 mt-1"
                                                value={appGuardRel}
                                                onChange={(e: any) => setAppGuardRel(e.currentTarget.value)}
                                            >
                                                <option value="">Select Relation</option>
                                                <option value="f">পিতৃ</option>
                                                <option value="m">মাতৃ</option>
                                                <option value="h">পতি</option>
                                                <option value="w">পত্নী</option>
                                                <option value="u">অভিভাৱক</option>

                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="">Gender</Label>
                                            <select
                                                id="applicant_gender"
                                               
                                                className="w-full border rounded px-3 py-2 mt-1"
                                                value={appGender}
                                                onChange={(e: any) => setAppGender(e.currentTarget.value)}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="f">Female</option>
                                                <option value="m">Male</option>
                                                <option value="o">Others</option>

                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="">Mobile No.</Label>
                                            <Input
                                                id="mobile_no"
                                                type="number"
                                                placeholder="Mobile No."
                                                value={appMobile}
                                                onInput={(e: any) => setAppMobile(e.currentTarget.value)}
                                            />
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>


                            <button
                                onClick={submitApplicant}
                                className="px-4 py-2 my-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>}


                    {/* {iAModalOpen && <InplaceAlongwith setIAModalOpen={setIAModalOpen} pdarUnique={pdarUnique} dagNos={dagNos} inplaceAlongwith={inplaceAlongwith} setInplaceAlongwith={setInplaceAlongwith} />} */}

                <Loader loading={loading} />
                <Toaster position="top-center" />
                
        </div>
    );
};

export default LMMutation;