import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import MyCombobox from "./ComboBox";
import ApiService from "@/services/ApiService";
import { toast } from "react-hot-toast";
import Loader from "./Loader";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDagStore } from "@/store/SurveyStore";
import { useMasterDataStore } from "@/store/SurveyStore";
import { Plus, Trash2, Users } from "lucide-react";
import { validatePossessorCreateForm } from "@/services/FormValidation.service";
import PossessorsList from "./PossessorList";
import TenantsList from "./TenantsList";
import PattadarsList from "./PattadarsList";


interface Props {
    dagNo: string;
    setDagNo: Dispatch<SetStateAction<string>>,
    vill: string;
    setVill: Dispatch<SetStateAction<string>>
}

interface InputFormData {
    part_dag: string;
    curr_land_use: string | number;
    area_sm: number;
    area_b: number;
    area_k: number;
    area_lc: number;
    area_g: number;
    patta_no: string;
    patta_type_code: string;
    dag_land_revenue: number;
    dag_local_tax: number;
    pattadars: any[]
}

interface OptionType {
    value: string;
    label: string;
}

interface DagDataType {
    land_class_code: string;
    patta_no: string;
    patta_type_code: string;

}

interface ErrorType {
    type: string;
    msg: string;
}

const PartDagEntryForm: React.FC<Props> = ({ dagNo, setDagNo, vill, setVill }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<InputFormData>();
    const { isLoading, getData, setLoading, partDags, dharDagData, dharPattadars, dharTenants } = useDagStore();
    const { landClasses, landGroups, pattaTypes, transferTypes } = useMasterDataStore();

    const [partDag, setPartDag] = useState<string>('');
    const [currLandClass, setCurrLandClass] = useState<string | number>('');
    const [areaSm, setAreaSm] = useState<number>(0);
    // const [surveyNo, setSurveyNo] = useState<string>('');
    const [areaBigha, setAreaBigha] = useState<number>(0);
    const [areaKatha, setAreaKatha] = useState<number>(0);
    const [areaLc, setAreaLc] = useState<number>(0.00);
    const [dist, setDist] = useState<string>('');
    const [areaGanda, setAreaGanda] = useState<number>(0.00);
    const [pattaNo, setPattaNo] = useState<string>('');
    const [pattaTypeCode, setPattaTypeCode] = useState<string>('');
    const [dagLandRevenue, setDagLandRevenue] = useState<number>(0);
    const [dagLocalTax, setDagLocalTax] = useState<number>(0);
    const [pattadars, setPattadars] = useState(null);
    const [tenants, setTenants] = useState(null);
    const [triggerLandRevenue, setTriggerLandRevenue] = useState<string>('');
    const [errorTag, setErrorTag] = useState<ErrorType[]>([]);


    const [finalPartDag, setFinalPartDag] = useState<string>('');
    const [possessors, setPossessors] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    //Modal Inputs
    const [posName, setPosName] = useState<string>('');
    const [posGuardianName, setPosGuardianName] = useState<string>('');
    const [posGuardianRelation, setPosGuardianRelation] = useState<string>('');
    const [posPattadarRelation, setPosPattadarRelation] = useState<string>('');
    const [posModeOfAcquisition, setPosModeOfAcquisition] = useState<string>('');
    const [posNameMut, setPosNameMut] = useState<string>('');
    const [posFatherNameMut, setPosFatherNameMut] = useState<string>('');
    const [posAddressMut, setPosAddressMut] = useState<string>('');
    const [posTenantRelation, setPosTenantRelation] = useState<string>('');
    const [posRemark, setPosRemark] = useState<string>('');
    const [posGender, setPosGender] = useState<string>('male');
    const [posDob, setPosDob] = useState<string>('');
    const [posMobileNo, setPosMobileNo] = useState<string>('');
    const [posAdhaar, setPosAdhaar] = useState<string>('');
    const [posEmail, setPosEmail] = useState<string>('');
    const [posPhoto, setPosPhoto] = useState<string | null>(null);
    const [documents, setDocuments] = useState<any[]>([
        { document_name: "", document_no: "", issuing_authority: "", document_issue_date: "", file: null }
    ]);
    const [updateButton, setUpdateButton] = useState<boolean>(false);


    useEffect(() => {
        if (dagNo != '' && vill != '') {
            setPattaNo(dharDagData.patta_no);
            setPattadars(dharPattadars);
        }
    }, [dagNo, vill]);

    useEffect(() => {
        if (finalPartDag && finalPartDag != '' && finalPartDag == partDag) {
            getPartDagInfo();
        }
        else {
            resetFields();
        }
    }, [finalPartDag, partDag]);

    useEffect(() => {
        if (triggerLandRevenue && currLandClass && triggerLandRevenue !== '' && currLandClass !== '') {
            getDharLandRevenue(triggerLandRevenue);
        }
    }, [triggerLandRevenue, currLandClass]);

    const showPattadars = updateButton ? pattadars : dharPattadars;
    const showTenants = updateButton ? tenants : dharTenants;

    const resetFields = () => {
        setCurrLandClass('');
        setAreaSm(0);
        setPattaNo(dharDagData.patta_no);
        setPattaTypeCode(dharDagData.patta_type_code);
        setDagLandRevenue(0);
        setDagLocalTax(0);
        setPattadars([]);
        setUpdateButton(false);
        // setSurveyNo('');
    };

    const resetPossessorAdd = () => {
        setPosName('');
        setPosGuardianName('');
        setPosGuardianRelation('');
        setPosPattadarRelation('');
        setPosModeOfAcquisition('');
        setPosNameMut('');
        setPosFatherNameMut('');
        setPosAddressMut('');
        setPosMobileNo('');
        setPosAdhaar('');
        setPosGender('male');
        setPosRemark('');
        setPosEmail('');
        setPosPhoto(null);
        setPosDob('');
    };

    const getDharLandRevenue = async (area_sm: string) => {
        const data = {
            vill_townprt_code: vill,
            land_class_code: currLandClass,
            area_sm: area_sm
        };


        setLoading(true);
        const response = await ApiService.get('get_land_revenue', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            setDagLandRevenue(0);
            setDagLocalTax(0);
            return;
        }

        const revenueDetails = response.data;

        setDagLandRevenue(revenueDetails.dag_revenue.toFixed(4));
        setDagLocalTax(revenueDetails.dag_local_tax.toFixed(4));

    };

    const getPartDagInfo = async () => {
        setTriggerLandRevenue('');
        const data = {
            dag_no: dagNo,
            vill_townprt_code: vill,
            part_dag: finalPartDag
        };

        setLoading(true);
        const response = await ApiService.get('get_partdag_data', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        const partDagDetails = response.data;
        // console.log(partDagDetails);
        if (partDagDetails.from_chitha == 1) {
            const dag_area_sqmtr = partDagDetails.dag_area_sqmtr ? partDagDetails.dag_area_sqmtr : 0;
            setAreaSm(dag_area_sqmtr);
            setCurrLandClass(partDagDetails.land_class_code);
            setPattaNo(partDagDetails.patta_no);
            setPattaTypeCode(partDagDetails.patta_type_code);
            setDagLandRevenue(partDagDetails.dag_revenue);
            setDagLocalTax(partDagDetails.dag_local_tax);
            setPattadars(partDagDetails.pattadars);
            setTenants(partDagDetails.tenants);
            // setSurveyNo(partDagDetails.survey_no2);
            setUpdateButton(true);
            setPossessors(partDagDetails.possessors);
        }
        if (partDagDetails.from_bhunaksha == 1) {
            const dag_area_sqmtr = partDagDetails.dag_area_sqmtr ? partDagDetails.dag_area_sqmtr : 0;
            setAreaSm(dag_area_sqmtr);
            setCurrLandClass('');
            setPattaNo(dharDagData.patta_no);
            setPattaTypeCode(dharDagData.patta_type_code);
            setTriggerLandRevenue(dag_area_sqmtr);
            setPattadars([]);
            setUpdateButton(false);
            setPossessors([]);
            // setDagLandRevenue(0);
            // setDagLocalTax(0);
        }
        if (partDagDetails.from_chitha == 0 && partDagDetails.from_bhunaksha == 0) {
            const dag_area_sqmtr = partDagDetails.dag_area_sqmtr ? partDagDetails.dag_area_sqmtr : 0;
            setAreaSm(dag_area_sqmtr);
            setCurrLandClass('');
            setPattaNo(dharDagData.patta_no);
            setPattaTypeCode(dharDagData.patta_type_code);
            setTriggerLandRevenue('');
            setDagLandRevenue(0);
            setDagLocalTax(0);
            setPattadars([]);
            setUpdateButton(false);
            setPossessors([])
        }
    };


    const handlePattadarSelect = (val: any) => {
        setPattadars(val);
    };

    const handleAreaSm = (e: any) => {
        setAreaSm(e.currentTarget.value);
        setTriggerLandRevenue(e.currentTarget.value);
    };

    const handleDagLandRevenue = (e: any) => {
        setDagLandRevenue(e.currentTarget.value);
        setDagLocalTax(1 / 4 * e.currentTarget.value);
    }



    const onSubmit = async (data: InputFormData) => {
        if (!finalPartDag || finalPartDag == '' || !currLandClass || currLandClass == '') {
            toast.error('Missing Part Dag or Land Class!');
            return;
        }
        // if(!areaSm || areaSm == 0) {
        //     toast.error('Missing Area!');
        //     return;
        // }
        // if(!dagLandRevenue || dagLandRevenue == 0) {
        //     toast.error('Missing Land Revenue!');
        //     return;
        // }
        // if(!dagLocalTax || dagLocalTax == 0) {
        //     toast.error('Missing Land Revenue!');
        //     return;
        // }

        const postData = {
            vill_townprt_code: vill,
            dag_no: dagNo,
            part_dag: finalPartDag,
            land_class_code: currLandClass,
            area_sm: areaSm,
            dag_land_revenue: dagLandRevenue,
            dag_local_tax: dagLocalTax,
            pattadars: dharPattadars,
            tenants: dharTenants,
            // survey_no: surveyNo
        };

        setLoading(true);
        const response = await ApiService.get('submit_part_dag', JSON.stringify(postData));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);

        getPartDagInfo();

        getData(dagNo, vill);
    };



    const modalOpen = (e: any) => {
        resetPossessorAdd();
        setIsOpen(true);
    };


    const handleUpdatePartDag = async () => {
        if (!finalPartDag || finalPartDag == '' || !currLandClass || currLandClass == '') {
            toast.error('Missing Part Dag or Land Class!');
            return;
        }
        // if (!areaSm || areaSm == 0) {
        //     toast.error('Missing Area!');
        //     return;
        // }
        // if (!dagLandRevenue || dagLandRevenue == 0 || !dagLocalTax || dagLocalTax == 0) {
        //     toast.error('Missing Land Revenue and Local Tax!');
        //     return;
        // }

        const data = {
            vill_townprt_code: vill,
            dag_no: dagNo,
            part_dag: finalPartDag,
            land_class_code: currLandClass,
            area_sm: areaSm,
            dag_land_revenue: dagLandRevenue,
            dag_local_tax: dagLocalTax,
            pattadars: dharPattadars,
            tenants: dharTenants,
            // survey_no: surveyNo
        };

        setLoading(true);
        const response = await ApiService.get('update_part_dag', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);
        getPartDagInfo();
        getData(dagNo, vill);
    };

    const handlePartDagDelete = async () => {
        if (!finalPartDag || finalPartDag == '' || !vill || vill == '' || !dagNo || dagNo == '') {
            toast.error('Missing Part Dag and location!');
            return;
        }

        const data = {
            vill_townprt_code: vill,
            dag_no: dagNo,
            part_dag: finalPartDag
        }

        setLoading(true);
        const response = await ApiService.get('delete_part_dag', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);
        setFinalPartDag('');
        setPartDag('');
        setUpdateButton(false);



        setTimeout(() => {
            getData(dagNo, vill);
        }, 500);

    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(",")[1]; // strip "data:image/jpeg;base64,"
                setPosPhoto(base64String);
            };
            reader.readAsDataURL(file);
        }
    };


    // Handle input changes
    const handleDocumentChange = (index: number, field: string, value: any) => {
        const updated = [...documents];
        updated[index][field] = value;
        setDocuments(updated);
    };

    // Handle file change
    const handleDocumentFileChange = (index: number, file: File | null) => {
        const updated = [...documents];
        updated[index].file = file;
        setDocuments(updated);
    };

    // Add new document entry
    const addDocument = () => {
        setDocuments([
            ...documents,
            { document_name: "", document_no: "", issuing_authority: "", document_issue_date: "", file: null }
        ]);
    };

    // Remove a document
    const removeDocument = (index: number) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };


    const submitPossessor = async () => {
        const formData = new FormData();

        formData.append("vill_townprt_code", vill);
        formData.append("dag_no", dagNo);
        formData.append("part_dag", finalPartDag);
        formData.append("possessor_name", posName);
        formData.append("possessor_guardian_name", posGuardianName);
        formData.append("possessor_guardian_relation", posGuardianRelation);
        formData.append("possessor_pattadar_relation", posPattadarRelation);
        formData.append("possessor_mode_of_acquisition", posModeOfAcquisition);
        formData.append("possessor_name_mut", posNameMut);
        formData.append("possessor_father_name_mut", posFatherNameMut);
        formData.append("possessor_address_mut", posAddressMut);
        formData.append("possessor_remark", posRemark);
        formData.append("possessor_gender", posGender);
        formData.append("possessor_dob", posDob);
        formData.append("possessor_mobile_no", posMobileNo);
        formData.append("possessor_aadhaar", posAdhaar);
        formData.append("possessor_email", posEmail);

        if (posPhoto) {
            formData.append("possessor_photo", posPhoto); // file
        }

        // Append dynamic documents
        documents.forEach((doc, index) => {
            // Append document metadata as a JSON string
            const docMetadata = {
                document_name: doc.document_name,
                document_no: doc.document_no,
                issuing_authority: doc.issuing_authority,
                document_issue_date: doc.document_issue_date,
            };
            formData.append(`document_metadata_${index}`, JSON.stringify(docMetadata));

            // Append the actual file
            if (doc.file) {
                formData.append(`document_file_${index}`, doc.file);
            }
        });
        setLoading(true);
        const response = await ApiService.postForm("submit_possessor", formData);
        setLoading(false);

        if (response.status !== "y") {
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);
        getPartDagInfo();
        setIsOpen(false);
    };


    const deletePossessor = async (possessor: any) => {
        // console.log(e.currentTarget.value);
        const data = {
            possessor: possessor
        };


        setLoading(true);
        const response = await ApiService.get('delete_possessor', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        console.log(response);
        toast.success(response.msg);

        getPartDagInfo();

    };





    return (
        <>
            {(dagNo && vill && dagNo != '' && vill != '') ?
                (<div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="part_dag">Dag No (Old)</Label>
                                <Input
                                    id="dag_no"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    readOnly
                                    value={dagNo}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="part_dag">Part Dag</Label>
                                <MyCombobox partDag={partDag} setPartDag={setPartDag} bhunakshaPartDags={partDags} setFinalPartDag={setFinalPartDag} />
                            </div>
                            {/* <div className="space-y-2">
                                <Label htmlFor="survey_no">Survey No</Label>
                                <Input
                                    id="survey_no"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    placeholder="Enter Survey No"
                                    value={surveyNo}
                                    onChange={(e) => setSurveyNo(e.target.value)}
                                />
                            </div> */}
                            <div className="space-y-2">
                                <Label htmlFor="o_land_class">Land Class (Existing)</Label>
                                <select
                                    id="o_land_class"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={dharDagData.land_class_code}
                                    // onChange={(e: any) => setOriginalLandClass(e.currentTarget.value)}
                                    disabled
                                >
                                    <option value="">Select Land Class</option>
                                    {landClasses && landClasses.length > 0 && landClasses.map((dharLandClass, index) => <option key={index} value={dharLandClass.class_code}>{dharLandClass.land_type}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="curr_land_use">Current Land Class use</Label>
                                <select
                                    id="curr_land_use"
                                    // {...register("curr_land_use", { required: "Current Land Class Use is required" })}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={currLandClass}
                                    onChange={(e: any) => setCurrLandClass(e.currentTarget.value)}
                                >
                                    <option value="">--Select--</option>
                                    {landGroups && landGroups.length > 0 && landGroups.map((dharLandGroup, index) => <option key={index} value={dharLandGroup.land_class_code}>{dharLandGroup.name_ass} ({dharLandGroup.name})</option>)}
                                </select>
                                {/* {errors.curr_land_use && (
                            <p className="text-sm text-destructive">{errors.curr_land_use.message}</p>
                            )} */}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="area_sm">Land Area (sq. metre)</Label>
                                <Input
                                    id="area_sm"
                                    type="number"
                                    // {...register("area_sm", { required: "Area in sq. metre is a required field" })}
                                    placeholder="Enter Land Area in sq. metre"
                                    value={areaSm}
                                    // onInput={(e: any) => setAreaSm(e.currentTarget.value)}
                                    onInput={handleAreaSm}
                                />
                            </div>



                            <div className="space-y-2">
                                <Label htmlFor="patta_no">Patta No. (Old)</Label>
                                <Input
                                    id="patta_no"
                                    type="text"
                                    placeholder="Enter Patta No"
                                    value={dharDagData.patta_no}
                                    // onInput={(e: any) => setOriginalPattaNo(e.currentTarget.value)}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="patta_type_code">Patta Type (Old)</Label>
                                <select
                                    id="patta_type_code"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={dharDagData.patta_type_code}
                                    // onChange={(e: any) => setOriginalPattaTypeCode(e.currentTarget.value)}
                                    disabled
                                >
                                    <option value="">Select Patta Type</option>
                                    {pattaTypes && pattaTypes.length > 0 && pattaTypes.map((dharPattaType, index) => <option key={index} value={dharPattaType.type_code}>{dharPattaType.patta_type}</option>)}

                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="patta_no">Patta No. (New)</Label>
                                <Input
                                    id="patta_no"
                                    type="text"
                                    // {...register("patta_no", { required: "Patta No is a required field" })}
                                    placeholder="Enter Patta No"
                                    value={pattaNo}
                                    onInput={(e: any) => setPattaNo(e.currentTarget.value)}
                                    disabled
                                />
                                {/* {errors.patta_no && (
                            <p className="text-sm text-destructive">{errors.patta_no.message}</p>
                            )} */}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="patta_type_code">Patta Type (New)</Label>
                                <select
                                    id="patta_type_code"
                                    // {...register("patta_type_code", { required: "Patta Type is a required field!" })}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={dharDagData.patta_type_code}
                                    // onChange={(e: any) => setPattaTypeCode(e.currentTarget.value)}
                                    disabled
                                >
                                    <option value="">Select Patta Type</option>
                                    {pattaTypes && pattaTypes.length > 0 && pattaTypes.map((dharPattaType, index) => <option key={index} value={dharPattaType.type_code}>{dharPattaType.patta_type}</option>)}

                                </select>
                                {/* {errors.patta_type_code && (
                            <p className="text-sm text-destructive">{errors.patta_type_code.message}</p>
                            )} */}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dag_land_revenue">Dag Land Revenue</Label>
                                <Input
                                    id="dag_land_revenue"
                                    type="number"
                                    // {...register("dag_land_revenue", { required: "Dag Land Revenue is a required field" })}
                                    placeholder="Enter Dag Land Revenue"
                                    value={dagLandRevenue}
                                    onInput={handleDagLandRevenue}
                                />

                                {/* {errors.dag_land_revenue && (
                            <p className="text-sm text-destructive">{errors.dag_land_revenue.message}</p>
                            )} */}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dag_local_tax">Dag Local Tax</Label>
                                <Input
                                    id="dag_local_tax"
                                    type="number"
                                    // {...register("dag_local_tax", { required: "Patta No is a required field" })}
                                    placeholder="Enter Dag Land Revenue"
                                    value={dagLocalTax}
                                    onInput={(e: any) => setDagLocalTax(e.currentTarget.value)}
                                />

                                {/* {errors.dag_local_tax && (
                            <p className="text-sm text-destructive">{errors.dag_local_tax.message}</p>
                            )} */}
                            </div>

                        </div>
                        {!updateButton && <div className="flex justify-end space-x-4">
                            <Button type="submit" className="">
                                Create
                            </Button>
                        </div>}
                        {updateButton && <div className="flex justify-end space-x-4">
                            <Button type="button" className="" onClick={handleUpdatePartDag}>
                                Update
                            </Button>
                            <ConfirmDialog
                                trigger={<Button type="button" className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>}
                                title="Delete DAG"
                                description="This will permanently delete the DAG record. Are you sure?"
                                confirmText="Yes, delete"
                                cancelText="No, keep it"
                                onConfirm={handlePartDagDelete}
                            />
                        </div>}

                    </form>
                    {/* Pattadars */}
                    <div className="mt-6">
                        <Card className="w-full shadow-sm border border-gray-200 rounded-xl">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    🧾 Pattadars
                                    {showPattadars && (
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Total - {showPattadars.length}</span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">

                                <PattadarsList pattadars={showPattadars} />

                            </CardContent>
                        </Card>
                    </div>

                    {/* Tenants */}
                    <div className="mt-8">
                        <Card className="w-full shadow-sm border border-gray-200 rounded-xl">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-indigo-500" />
                                    ৰায়ত/ আধিয়াৰৰ তথ্য
                                    {showTenants && (
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Total - {showTenants.length}</span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <TenantsList tenants={showTenants} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Possessors */}
                    {finalPartDag && (
                        <div className="mt-6">
                            <Card className="w-full shadow-sm border border-gray-200 rounded-xl">
                                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100">
                                    {/* Title */}
                                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <Users className="h-5 w-5 text-indigo-500" />
                                        <span>Possessors</span>
                                        {possessors && (
                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Total - {possessors.length}</span>
                                        )}
                                    </CardTitle>

                                    {/* Button */}
                                    <Button
                                        type="button"
                                        id={finalPartDag}
                                        onClick={modalOpen}
                                        className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm rounded-lg flex items-center justify-center gap-2 px-4 py-2 transition-all"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add Possessor</span>
                                    </Button>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <PossessorsList possessors={possessors} deletePossessor={deletePossessor} />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {finalPartDag && finalPartDag !== '' && isOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl md:max-w-7xl p-6 relative overflow-y-auto max-h-[90vh]">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>

                                <Card className="w-full my-4">
                                    <CardHeader className="flex-row items-center justify-between">
                                        <CardTitle className="w-full text-center">Add Possessor</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_name">Possessor Name <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="possessor_name"
                                                    type="text"
                                                    placeholder="Possessor Name"
                                                    value={posName}
                                                    onInput={(e: any) => setPosName(e.currentTarget.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_guard_name">Possessor's Guardian Name <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="possessor_guard_name"
                                                    type="text"
                                                    placeholder="Possessor's Guardian Name"
                                                    value={posGuardianName}
                                                    onInput={(e: any) => setPosGuardianName(e.currentTarget.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_guard_relation">Possessor's Guardian Relation <span className="text-red-500">*</span></Label>
                                                <select
                                                    id="possessor_guard_relation"
                                                    className="w-full border rounded px-3 py-2 mt-1"
                                                    value={posGuardianRelation}
                                                    onChange={(e: any) => setPosGuardianRelation(e.currentTarget.value)}
                                                >
                                                    <option value="">Select Relation</option>
                                                    <option value="f">পিতৃ</option>
                                                    <option value="m">মাতৃ</option>
                                                    <option value="h">পতি</option>
                                                    <option value="w">পত্নী</option>
                                                    <option value="u">অভিভাৱক</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="mode_of_acquisition">Mode of Acquisition by possessor</Label>
                                                <select
                                                    id="mode_of_acquisition"
                                                    className="w-full border rounded px-3 py-2 mt-1"
                                                    value={posModeOfAcquisition}
                                                    onChange={(e: any) => setPosModeOfAcquisition(e.currentTarget.value)}
                                                >
                                                    <option value="">Select Mode</option>
                                                    {transferTypes.map((type) => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_mut_name">Possessor Name for Mutation (Optional)</Label>
                                                <Input
                                                    id="possessor_mut_name"
                                                    type="text"
                                                    placeholder="Possessor Name for Mutation"
                                                    value={posNameMut}
                                                    onInput={(e: any) => setPosNameMut(e.currentTarget.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_father_mut_name">Possessor Father's Name for Mutation (Optional)</Label>
                                                <Input
                                                    id="possessor_father_mut_name"
                                                    type="text"
                                                    placeholder="Possessor Father Name for Mutation"
                                                    value={posFatherNameMut}
                                                    onInput={(e: any) => setPosFatherNameMut(e.currentTarget.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_address_mut">Possessor Address for Mutation (Optional)</Label>
                                                <Input
                                                    id="possessor_address_mut"
                                                    type="text"
                                                    placeholder="Possessor Address for Mutation"
                                                    value={posAddressMut}
                                                    onInput={(e: any) => setPosAddressMut(e.currentTarget.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_gender">Gender <span className="text-red-500">*</span> </Label>
                                                <select
                                                    id="possessor_gender"
                                                    value={posGender}
                                                    onChange={(e) => setPosGender(e.currentTarget.value)}
                                                    className="w-full border rounded px-3 py-2 mt-1"
                                                >
                                                    <option value="">--Select--</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_aadhaar">Aadhaar Number (optional)</Label>
                                                <Input
                                                    id="possessor_aadhaar"
                                                    type="text"
                                                    placeholder="Aadhaar Number"
                                                    value={posAdhaar}
                                                    onInput={(e: any) => setPosAdhaar(e.currentTarget.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_mobile">Mobile Number <span className="text-red-500">*</span> </Label>
                                                <Input
                                                    id="possessor_mobile"
                                                    type="text"
                                                    placeholder="Mobile Number"
                                                    value={posMobileNo}
                                                    onInput={(e: any) => setPosMobileNo(e.currentTarget.value)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_email">Email (optional)</Label>
                                                <Input
                                                    id="possessor_email"
                                                    type="email"
                                                    placeholder="Email"
                                                    value={posEmail}
                                                    onInput={(e: any) => setPosEmail(e.currentTarget.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="possessor_dob">Date of Birth (optional)</Label>
                                                <Input
                                                    id="possessor_dob"
                                                    type="date"
                                                    value={posDob}
                                                    onInput={(e: any) => setPosDob(e.currentTarget.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="possessor_photo" className="text-gray-700 font-medium">
                                                    Photo (optional)
                                                </Label>

                                                {/* Custom file input box */}
                                                <label
                                                    htmlFor="possessor_photo"
                                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50 transition p-4 text-gray-500"
                                                >
                                                    <svg
                                                        className="w-8 h-8 mb-2 text-gray-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4m0 0l-4-4m4 4l4-4" />
                                                    </svg>
                                                    <span className="text-sm">Click to upload or drag & drop</span>
                                                    <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                                                    <Input
                                                        id="possessor_photo"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handlePhotoChange}
                                                    />
                                                </label>

                                                {posPhoto && (
                                                    <div className="space-y-2">
                                                        <Label className="text-gray-700 font-medium">Photo Preview:</Label>
                                                        <div className="w-40 h-40 border rounded-2xl overflow-hidden shadow-sm">
                                                            <img
                                                                src={`data:image/jpeg;base64,${posPhoto}`}
                                                                alt="Possessor Photo"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="possessor_remark">Remark (optional)</Label>
                                                <Textarea
                                                    id="possessor_remark"
                                                    value={posRemark}
                                                    onInput={(e: any) => setPosRemark(e.currentTarget.value)}
                                                />

                                            </div>

                                            <div className="space-y-3 md:col-span-2">
                                                <Label className="text-gray-700 font-medium">Ownership / Transfer Documents</Label>

                                                {documents.map((doc, index) => (
                                                    <div
                                                        key={index}
                                                        className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-xl bg-gray-50 relative"
                                                    >
                                                        <div className="space-y-1">
                                                            <Label>Document Name</Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="e.g. Sale Deed"
                                                                value={doc.document_name}
                                                                onChange={(e) => handleDocumentChange(index, "document_name", e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label>Document No</Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Document Number"
                                                                value={doc.document_no}
                                                                onChange={(e) => handleDocumentChange(index, "document_no", e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label>Issuing Authority</Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Authority Name"
                                                                value={doc.issuing_authority}
                                                                onChange={(e) => handleDocumentChange(index, "issuing_authority", e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label>Issue Date</Label>
                                                            <Input
                                                                type="date"
                                                                value={doc.document_issue_date}
                                                                onChange={(e) => handleDocumentChange(index, "document_issue_date", e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label>Upload</Label>
                                                            <Input
                                                                type="file"
                                                                accept=".pdf,image/*"
                                                                onChange={(e) =>
                                                                    handleDocumentFileChange(index, e.target.files ? e.target.files[0] : null)
                                                                }
                                                            />
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                            onClick={() => removeDocument(index)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Add More Button */}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={addDocument}
                                                    className="mt-2 w-full md:w-auto"
                                                >
                                                    + Add Document
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={submitPossessor}
                                        className="px-4 py-2 my-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 my-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                ) : (<div className="flex items-center justify-center p-7">
                    <p className="font-bold text-lg">No data available</p>
                </div>)}
            {/* <Toaster position="top-center" /> */}
            <Loader loading={isLoading} />
        </>
    );
};

export default PartDagEntryForm;