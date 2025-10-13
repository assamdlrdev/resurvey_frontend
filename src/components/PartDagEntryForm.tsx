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
import { Plus, Users } from "lucide-react";
import { validatePossessorCreateForm } from "@/services/FormValidation.service";
import PossessorsList from "./PossessorList";
import TenantsList from "./TenantsList";
import PattadarsList from "./PattadarsList";
import { calculateAreaByKide } from "@/lib/utils";
import SelectFromMapComp from "./SelectFromMapComp";
import Constants from "@/config/Constants";
import { set } from "date-fns";

interface Props {
    dagNo: string;
    setDagNo: Dispatch<SetStateAction<string>>,
    vill: string;
    setVill: Dispatch<SetStateAction<string>>,
    mapdata: any
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

const PartDagEntryForm: React.FC<Props> = ({ dagNo, setDagNo, vill, mapdata, setVill }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<InputFormData>();
    const { isLoading, getData, setLoading, partDags, dharDagData, dharPattadars, dharTenants } = useDagStore();
    const { landClasses, landGroups, pattaTypes, transferTypes } = useMasterDataStore();

    const [partDag, setPartDag] = useState<string>('');
    const [bhunaksaSurveyNo, setBhunaksaSurveyNo] = useState<string>('');
    const [matchedFeatureWithArea, setMatchedFeatureWithArea] = useState<any>('');

    useEffect(() => {
        nextPartDag();
    }, []);

    const nextPartDag = () => {
        if (!dagNo) return;

        // Extract all part_dag values for the current dagNo
        const existingPartDags = partDags
            .filter((d: any) => d.part_dag?.startsWith(`${dagNo}/`))
            .map((d: any) => d.part_dag);

        // Find the next available serial number
        let serial = 1;
        while (existingPartDags.includes(`${dagNo}/${serial}`)) {
            serial++;
        }

        // Set the new partDag
        setPartDag(`${dagNo}/${serial}`);
        setFinalPartDag(`${dagNo}/${serial}`);
    }

    const [currLandClass, setCurrLandClass] = useState<string | number>('');
    const [areaSm, setAreaSm] = useState<number>(0);
    // const [surveyNo, setSurveyNo] = useState<string>('');
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
    const [documents, setDocuments] = useState<any[]>([]);
    const [updateButton, setUpdateButton] = useState<boolean>(false);

    //edit possessor
    const [selectedEditPossessor, setSelectedEditPossessor] = useState<any | null>(null);
    const [isEditPosOpen, setIsEditPosOpen] = useState<boolean>(false);
    const [editPosPhoto, setEditPosPhoto] = useState<string | null>(null);
    const [updatingPhoto, setUpdatingPhoto] = useState<boolean>(false);
    const [removingPossessorPhoto, setRemovingPossessorPhoto] = useState<boolean>(false);
    const [newDocuments, setNewDocuments] = useState<any[]>([]);


    useEffect(() => {
        if (dagNo != '' && vill != '') {
            setPattaNo(dharDagData.patta_no);
            setPattadars(dharPattadars);
        }
    }, [dagNo, vill]);

    useEffect(() => {
        if (bhunaksaSurveyNo && mapdata?.features) {
            const featureWithArea = calculateAreaByKide(mapdata, bhunaksaSurveyNo);
            if (featureWithArea) {
                setMatchedFeatureWithArea(featureWithArea);
                setAreaSm(featureWithArea.properties.area_sqm);
                setTriggerLandRevenue(featureWithArea.properties.area_sqm);
                toast.success("Area fectched from draft Bhunaksa successfully");
            } else {
                setMatchedFeatureWithArea('');
                setAreaSm(0);
                toast.error('Survey number does not exist in draft Bhunaksa');
            }
        }
    }, [bhunaksaSurveyNo, mapdata]);


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
        setBhunaksaSurveyNo('');
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
            setUpdateButton(true);
            setPossessors(partDagDetails.possessors);
            setBhunaksaSurveyNo(partDagDetails.bhunaksha_survey_no);
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
            setPossessors([]);
            setBhunaksaSurveyNo('');
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
            bhunaksha_survey_no: bhunaksaSurveyNo
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
            bhunaksha_survey_no: bhunaksaSurveyNo
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

        // validate before appending
        const mobileRegex = /^[6-9]\d{9}$/;   // 10 digits, starts with 6-9
        const aadhaarRegex = /^\d{12}$/;      // exactly 12 digits
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // simple email check

        if (posMobileNo) {
            if (!mobileRegex.test(posMobileNo)) {
                alert("Invalid Mobile Number");
                return;
            }
            formData.append("possessor_mobile_no", posMobileNo);
        }

        if (posAdhaar) {
            if (!aadhaarRegex.test(posAdhaar)) {
                alert("Invalid Aadhaar Number");
                return;
            }
            formData.append("possessor_aadhaar", posAdhaar);
        }

        if (posEmail) {
            if (!emailRegex.test(posEmail)) {
                alert("Invalid Email Address");
                return;
            }
            formData.append("possessor_email", posEmail);
        }

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

        toast.success(response.msg);

        getPartDagInfo();

    };

    const handleSelectedFrmMap = (e) => {
        setBhunaksaSurveyNo(e);
    }

    const onEditPossessor = (possessor) => {
        setSelectedEditPossessor(possessor);
        setNewDocuments([]);
        setEditPosPhoto(null);
        setIsEditPosOpen(true);
        console.log(possessor);
    }

    const handleEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(",")[1]; // strip "data:image/jpeg;base64,"
                setEditPosPhoto(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const updatePossessorPhoto = async () => {
        if (!selectedEditPossessor) {
            toast.error("No possessor selected for photo update");
            return;
        }
        // Save the new photo
        const formData = new FormData();
        formData.append("dist_code", selectedEditPossessor.dist_code);
        formData.append("possessor_u_id", selectedEditPossessor.possessor_u_id);
        formData.append("possessor_photo", editPosPhoto);
        setUpdatingPhoto(true);
        const response = await ApiService.postForm("update_possessor_photo", formData);
        setUpdatingPhoto(false);

        if (response.status !== "y") {
            toast.error(response.msg);
            return;
        }
        toast.success(response.msg);
        setEditPosPhoto(null); // Remove selected photo after saving
        getPartDagInfo();
        setSelectedEditPossessor(response.possessor);
    }

    const removePossessorPhoto = async () => {
        if (!selectedEditPossessor) {
            toast.error("No possessor selected for photo removal");
            return;
        }
        if (!window.confirm("Are you sure you want to remove the possessor photo?")) {
            return;
        }
        const formdata = new FormData();
        formdata.append("dist_code", selectedEditPossessor.dist_code);
        formdata.append("possessor_u_id", selectedEditPossessor.possessor_u_id);
        setRemovingPossessorPhoto(true);
        const response = await ApiService.postForm("remove_possessor_photo", formdata);
        setRemovingPossessorPhoto(false);

        if (response.status !== "y") {
            toast.error(response.msg);
            return;
        }
        toast.success(response.msg);
        setEditPosPhoto(null);
        getPartDagInfo();
    }

    const deletePossessorDocument = async (docId: any) => {
        if (!selectedEditPossessor) {
            toast.error("No possessor selected for document deletion");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this document?")) {
            return;
        }
        const formData = new FormData();
        formData.append("possessor_u_id", selectedEditPossessor.possessor_u_id);
        formData.append("document_id", docId);
        formData.append("dist_code", selectedEditPossessor.dist_code);
        setLoading(true);
        const response = await ApiService.postForm("delete_possessor_ownership_document", formData);
        setLoading(false);
        if (response.status !== "y") {
            toast.error(response.msg);
            return;
        }
        toast.success(response.msg);
        setSelectedEditPossessor(response.possessor);
        getPartDagInfo();
    }

    const addNewDocument = () => {
        setNewDocuments([
            ...newDocuments,
            { document_name: "", document_no: "", issuing_authority: "", document_issue_date: "", file: null }
        ]);
    }

    const removeNewDocument = (index: number) => {
        setNewDocuments(newDocuments.filter((_, i) => i !== index));
    }

    // Handle file change
    const handleNewDocumentFileChange = (index: number, file: File | null) => {
        const updated = [...newDocuments];
        updated[index].file = file;
        setNewDocuments(updated);
    };
    const handleNewDocumentChange = (index: number, field: string, value: any) => {
        const updated = [...newDocuments];
        updated[index][field] = value;
        setNewDocuments(updated);
    };

    const updatePossessorDetails = async () => {
        // Prepare data for update
        const formData = new FormData();
        formData.append("dist_code", selectedEditPossessor.dist_code);
        formData.append("possessor_u_id", selectedEditPossessor.possessor_u_id);
        formData.append("possessor_name", selectedEditPossessor.name);
        formData.append("possessor_guardian_name", selectedEditPossessor.guard_name || '');
        formData.append("possessor_guardian_relation", selectedEditPossessor.guard_relation || '');
        // formData.append("possessor_pattadar_relation", selectedEditPossessor.pattadar_relation);
        formData.append("possessor_mode_of_acquisition", selectedEditPossessor.mode_of_acquisition || '');
        formData.append("possessor_name_mut", selectedEditPossessor.mut_possessor_name || '');
        formData.append("possessor_father_name_mut", selectedEditPossessor.mut_possessor_father_name || '');
        formData.append("possessor_address_mut", selectedEditPossessor.mut_possessor_address || '');
        formData.append("possessor_remark", selectedEditPossessor.remarks || '');
        formData.append("possessor_gender", selectedEditPossessor.gender || '');
        formData.append("possessor_dob", selectedEditPossessor.dob || '');
        formData.append("possessor_mobile_no", selectedEditPossessor.mobile_no || '');
        formData.append("possessor_aadhaar", selectedEditPossessor.aadhaar_no || '');
        formData.append("possessor_email", selectedEditPossessor.email || '');
        // Append dynamic new documents
        newDocuments.forEach((doc, index) => {
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
        const response = await ApiService.postForm("update_possessor", formData);
        setLoading(false);

        if (response.status !== "y") {
            toast.error(response.msg);
            return;
        }
        toast.success(response.msg);
        getPartDagInfo();
        setIsEditPosOpen(false);

    }

    const closeAddPosModal = () => {
        setIsOpen(false);
        resetPossessorAdd();
        setDocuments([]);
    }

    return (
        <>
            {(dagNo && vill && dagNo != '' && vill != '') ?
                (<div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="dag_no">পুৰণি দাগ নং (Old Dag No)</Label>
                                <Input
                                    id="dag_no"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    readOnly
                                    value={dagNo}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="part_dag">
                                    অংশিক দাগ নং(Part Dag No) <span className="text-red-500" title="This field is required">*</span>
                                </Label>
                                <MyCombobox
                                    partDag={partDag}
                                    setPartDag={setPartDag}
                                    bhunakshaPartDags={partDags}
                                    setFinalPartDag={setFinalPartDag}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="part_dag">জৰীপ নম্বৰ(Survey Number) <span className="text-red-500" title="This field is required">*</span>
                                    <SelectFromMapComp mapdata={mapdata} partDag={finalPartDag} villCode={vill} onSelect={(e) => handleSelectedFrmMap(e)} />
                                </Label>
                                <Input
                                    id="dag_no"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    placeholder="Enter Survey Number"
                                    value={bhunaksaSurveyNo}
                                    onChange={(e: any) => {
                                        setBhunaksaSurveyNo(e.currentTarget.value);
                                    }}
                                />

                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="o_land_class">পুৰণি মাটিৰ শ্ৰেণী (Old Land Class)</Label>
                                <select
                                    id="o_land_class"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={dharDagData?.land_class_code}
                                    disabled
                                >
                                    <option value="">Select Land Class</option>
                                    {landClasses &&
                                        landClasses.length > 0 &&
                                        landClasses.map((dharLandClass, index) => (
                                            <option key={index} value={dharLandClass.class_code}>
                                                {dharLandClass.land_type}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="curr_land_use">বৰ্তমান মাটিৰ ব্যৱহাৰ (Current Land Use as) <span className="text-red-500" title="This field is required">*</span></Label>
                                <select
                                    id="curr_land_use"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={currLandClass}
                                    onChange={(e: any) => setCurrLandClass(e.currentTarget.value)}
                                >
                                    <option value="">--Select--</option>
                                    {landGroups &&
                                        landGroups.length > 0 &&
                                        landGroups.map((dharLandGroup, index) => (
                                            <option key={index} value={dharLandGroup.land_class_code}>
                                                {dharLandGroup.name_ass} ({dharLandGroup.name})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="area_sm">কালি (Land Area - sq. metre)</Label>
                                <Input
                                    id="area_sm"
                                    type="number"
                                    placeholder="Enter Land Area"
                                    readOnly
                                    value={areaSm}
                                    onInput={handleAreaSm}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="patta_no">পুৰণি পট্টাৰ নং (Old Patta No)</Label>
                                <Input
                                    id="patta_no"
                                    type="text"
                                    value={dharDagData?.patta_no}
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="patta_type_code">পুৰণি পট্টাৰ প্ৰকাৰ (Old Patta Type)</Label>
                                <select
                                    id="patta_type_code"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={dharDagData?.patta_type_code}
                                    disabled
                                >
                                    <option value="">Select Patta Type</option>
                                    {pattaTypes &&
                                        pattaTypes.length > 0 &&
                                        pattaTypes.map((dharPattaType, index) => (
                                            <option key={index} value={dharPattaType.type_code}>
                                                {dharPattaType.patta_type}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="patta_no_new">নতুন পট্টাৰ নং (New Patta No)</Label>
                                <Input
                                    id="patta_no_new"
                                    type="text"
                                    value={pattaNo}
                                    onInput={(e: any) => setPattaNo(e.currentTarget.value)}
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="patta_type_code_new">নতুন পট্টাৰ প্ৰকাৰ (New Patta Type)</Label>
                                <select
                                    id="patta_type_code_new"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={dharDagData?.patta_type_code}
                                    disabled
                                >
                                    <option value="">Select Patta Type</option>
                                    {pattaTypes &&
                                        pattaTypes.length > 0 &&
                                        pattaTypes.map((dharPattaType, index) => (
                                            <option key={index} value={dharPattaType.type_code}>
                                                {dharPattaType.patta_type}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dag_land_revenue">ৰাজহ (টকা) (Dag Land Revenue)</Label>
                                <Input
                                    id="dag_land_revenue"
                                    type="number"
                                    placeholder="Enter Dag Land Revenue"
                                    value={dagLandRevenue}
                                    onInput={handleDagLandRevenue}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dag_local_tax">স্হানীয় কৰ (টকা) (Dag Local Tax)</Label>
                                <Input
                                    id="dag_local_tax"
                                    type="number"
                                    placeholder="Enter Dag Local Tax"
                                    value={dagLocalTax}
                                    onInput={(e: any) => setDagLocalTax(e.currentTarget.value)}
                                />
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
                            <Button type="button" className="" onClick={() => nextPartDag()}>
                                Next Dag
                            </Button>
                        </div>}
                    </form>

                    {/* Pattadars */}
                    <div className="mt-6">
                        <Card className="w-full shadow-sm border border-gray-200 rounded-xl">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    🧾পট্টাদাৰৰ তথ্য
                                    (Pattadars)
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
                                    ৰায়ত/ আধিয়াৰৰ তথ্য (Tenants)
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
                                    <PossessorsList possessors={possessors} onEditPossessor={onEditPossessor} deletePossessor={deletePossessor} />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {finalPartDag && finalPartDag !== '' && isEditPosOpen && selectedEditPossessor && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl md:max-w-7xl p-6 relative overflow-y-auto max-h-[90vh]">
                                <button
                                    onClick={() => setIsEditPosOpen(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                                <Card className="w-full my-4">
                                    <CardHeader className="flex-row items-center justify-between">
                                        <CardTitle className="w-full text-center">Edit Possessor</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_name">Possessor Name <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="edit_possessor_name"
                                                    type="text"
                                                    placeholder="Possessor Name"
                                                    value={selectedEditPossessor.name || ''}
                                                    onInput={e => setSelectedEditPossessor({ ...selectedEditPossessor, name: e.currentTarget.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_guard_name">Possessor's Guardian Name <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="edit_possessor_guard_name"
                                                    type="text"
                                                    placeholder="Possessor's Guardian Name"
                                                    value={selectedEditPossessor.guard_name || ''}
                                                    onInput={e => setSelectedEditPossessor({ ...selectedEditPossessor, guard_name: e.currentTarget.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_guard_relation">Possessor's Guardian Relation <span className="text-red-500">*</span></Label>
                                                <select
                                                    id="edit_possessor_guard_relation"
                                                    className="w-full border rounded px-3 py-2 mt-1"
                                                    value={selectedEditPossessor.guard_relation || ''}
                                                    onChange={e => setSelectedEditPossessor({ ...selectedEditPossessor, guard_relation: e.currentTarget.value })}
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
                                                <Label htmlFor="edit_mode_of_acquisition">Mode of Acquisition by possessor</Label>
                                                <select
                                                    id="edit_mode_of_acquisition"
                                                    className="w-full border rounded px-3 py-2 mt-1"
                                                    value={selectedEditPossessor.mode_of_acquisition || ''}
                                                    onChange={e => setSelectedEditPossessor({ ...selectedEditPossessor, mode_of_acquisition: e.currentTarget.value })}
                                                >
                                                    <option value="">Select Mode</option>
                                                    {transferTypes.map(type => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_mut_name">Possessor Name for Mutation (Optional)</Label>
                                                <Input
                                                    id="edit_possessor_mut_name"
                                                    type="text"
                                                    placeholder="Possessor Name for Mutation"
                                                    value={selectedEditPossessor.mut_possessor_name || ''}
                                                    onInput={e => setSelectedEditPossessor({ ...selectedEditPossessor, mut_possessor_name: e.currentTarget.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_father_mut_name">Possessor Father's Name for Mutation (Optional)</Label>
                                                <Input
                                                    id="edit_possessor_father_mut_name"
                                                    type="text"
                                                    placeholder="Possessor Father Name for Mutation"
                                                    value={selectedEditPossessor.mut_possessor_father_name || ''}
                                                    onInput={e => setSelectedEditPossessor({ ...selectedEditPossessor, mut_possessor_father_name: e.currentTarget.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_address_mut">Possessor Address for Mutation (Optional)</Label>
                                                <Input
                                                    id="edit_possessor_address_mut"
                                                    type="text"
                                                    placeholder="Possessor Address for Mutation"
                                                    value={selectedEditPossessor.mut_possessor_address || ''}
                                                    onInput={e => setSelectedEditPossessor({ ...selectedEditPossessor, mut_possessor_address: e.currentTarget.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_gender">Gender <span className="text-red-500">*</span> </Label>
                                                <select
                                                    id="edit_possessor_gender"
                                                    value={selectedEditPossessor.gender || ''}
                                                    onChange={e => setSelectedEditPossessor({ ...selectedEditPossessor, gender: e.currentTarget.value })}
                                                    className="w-full border rounded px-3 py-2 mt-1"
                                                >
                                                    <option value="">--Select--</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_aadhaar">Aadhaar Number (optional)</Label>
                                                <Input
                                                    id="edit_possessor_aadhaar"
                                                    type="text"
                                                    placeholder="Aadhaar Number"
                                                    value={selectedEditPossessor.aadhaar_no || ''}
                                                    onInput={e => setSelectedEditPossessor({ ...selectedEditPossessor, aadhaar_no: e.currentTarget.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_mobile">Mobile Number <span className="text-red-500">*</span> </Label>
                                                <Input
                                                    id="edit_possessor_mobile"
                                                    type="text"
                                                    placeholder="Mobile Number"
                                                    value={selectedEditPossessor.mobile_no || ''}
                                                    onInput={e => setSelectedEditPossessor({ ...selectedEditPossessor, mobile_no: e.currentTarget.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_email">Email (optional)</Label>
                                                <Input
                                                    id="edit_possessor_email"
                                                    type="email"
                                                    placeholder="Email"
                                                    value={selectedEditPossessor.email || ''}
                                                    onInput={e => setSelectedEditPossessor({ ...selectedEditPossessor, email: e.currentTarget.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="edit_possessor_dob">Date of Birth (optional)</Label>
                                                <Input
                                                    id="edit_possessor_dob"
                                                    type="date"
                                                    value={selectedEditPossessor.dob || ''}
                                                    onInput={e => setSelectedEditPossessor({ ...selectedEditPossessor, dob: e.currentTarget.value })}
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="edit_possessor_remark">Remark (optional)</Label>
                                                <Textarea
                                                    id="edit_possessor_remark"
                                                    value={selectedEditPossessor.remarks || ''}
                                                    onInput={e => setSelectedEditPossessor({ ...selectedEditPossessor, remarks: e.currentTarget.value })}
                                                />
                                            </div>
                                            {/* Edit Possessor Photo */}
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="edit_possessor_photo" className="text-gray-700 font-medium">
                                                    Possessor Photo (optional)
                                                </Label>
                                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                                    {/* Photo Preview */}
                                                    <div className="flex flex-col items-center gap-2">
                                                        {editPosPhoto ? (
                                                            <>
                                                                <div className="w-40 h-40 border rounded-2xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                                                                    <img
                                                                        src={`data:image/jpeg;base64,${editPosPhoto}`}
                                                                        alt="Possessor Photo"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex gap-2 mt-2">
                                                                    <Button
                                                                        type="button"
                                                                        className="bg-blue-600 text-white"
                                                                        onClick={() => updatePossessorPhoto()}
                                                                        disabled={updatingPhoto}
                                                                    >
                                                                        {updatingPhoto ? "Saving..." : "Save Photo"}
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        className="border-red-500 text-red-600"
                                                                        onClick={() => setEditPosPhoto(null)}
                                                                    >
                                                                        Remove Photo
                                                                    </Button>
                                                                </div>
                                                            </>
                                                        ) : selectedEditPossessor.photo_path ? (
                                                            <>
                                                                <div className="w-40 h-40 border rounded-2xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                                                                    <img
                                                                        src={`${Constants.API_BASE_URL_ASSET}${selectedEditPossessor.photo_path}`}
                                                                        alt="Possessor Photo"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex gap-2 mt-2">

                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        className="border-red-500 text-red-600"
                                                                        disabled={removingPossessorPhoto || updatingPhoto}
                                                                        onClick={() => removePossessorPhoto()}
                                                                    >
                                                                        Remove Photo
                                                                    </Button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="w-40 h-40 border rounded-2xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center text-gray-400">
                                                                No Photo
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* File Input */}
                                                    <div className="flex flex-col gap-2 w-full max-w-xs">
                                                        <label
                                                            htmlFor="edit_possessor_photo"
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
                                                            <span className="text-xs text-gray-400">JPG/JPEG up to 5MB</span>
                                                            <Input
                                                                id="edit_possessor_photo"
                                                                type="file"
                                                                accept=".jpg,.jpeg"
                                                                className="hidden"
                                                                onChange={handleEditPhotoChange}
                                                            />
                                                        </label>
                                                        <span className="text-xs text-gray-400">Only JPG/JPEG allowed</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Edit Ownership / Transfer Documents */}
                                            <div className="space-y-3 md:col-span-2">
                                                <Label className="text-gray-700 font-medium">Ownership / Transfer Documents</Label>
                                                {Array.isArray(selectedEditPossessor.ownership_documents) && selectedEditPossessor.ownership_documents.length > 0 ? (
                                                    selectedEditPossessor.ownership_documents.map((doc, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-xl bg-gray-50 relative"
                                                        >
                                                            <div className="space-y-1">
                                                                <Label>Document Name</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={doc.document_name || ""}
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label>Document No</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={doc.document_no || ""}
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label>Issuing Authority</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={doc.issuing_authority || ""}
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label>Issue Date</Label>
                                                                <Input
                                                                    type="date"
                                                                    value={doc.document_issue_date || ""}
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="space-y-1 flex flex-col justify-center">
                                                                <Label>File</Label>
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
                                                                    <span className="text-gray-400">No file</span>
                                                                )}
                                                            </div>
                                                            <div className="space-y-1 flex flex-col justify-center">

                                                                {/* Delete Document Button */}
                                                                <button
                                                                    type="button"
                                                                    className="text-red-500 hover:text-red-700"
                                                                    onClick={() => deletePossessorDocument(doc.id)}
                                                                    title="Delete Document"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-gray-500">No documents uploaded.</div>
                                                )}
                                                {newDocuments.map((doc, index) => (
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
                                                                onChange={(e) => handleNewDocumentChange(index, "document_name", e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label>Document No</Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Document Number"
                                                                value={doc.document_no}
                                                                onChange={(e) => handleNewDocumentChange(index, "document_no", e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label>Issuing Authority</Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="Authority Name"
                                                                value={doc.issuing_authority}
                                                                onChange={(e) => handleNewDocumentChange(index, "issuing_authority", e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label>Issue Date</Label>
                                                            <Input
                                                                type="date"
                                                                value={doc.document_issue_date}
                                                                onChange={(e) => handleNewDocumentChange(index, "document_issue_date", e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label>Upload</Label>
                                                            <Input
                                                                type="file"
                                                                accept=".pdf,image/*"
                                                                onChange={(e) =>
                                                                    handleNewDocumentFileChange(index, e.target.files ? e.target.files[0] : null)
                                                                }
                                                            />
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                            onClick={() => removeNewDocument(index)}
                                                            title="Remove Document"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => addNewDocument()}
                                                    className="mt-2 w-full md:w-auto"
                                                >
                                                    + Add New Document
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => updatePossessorDetails()}
                                        className="px-4 py-2 my-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => setIsEditPosOpen(false)}
                                        className="px-4 py-2 my-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {finalPartDag && finalPartDag !== '' && isOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl md:max-w-7xl p-6 relative overflow-y-auto max-h-[90vh]">
                                <button
                                    onClick={() => closeAddPosModal()}
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
                                                    Possessor Photo (optional)
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
                                                        accept=".jpg,.jpeg"
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
                                                            title="Remove Document"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Add More Button */}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => addDocument()}
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
                                        onClick={() => closeAddPosModal()}
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