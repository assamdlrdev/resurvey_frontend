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
import { Users } from "lucide-react";
import { validatePartDagSubmitForm, validatePossessorForm } from "@/services/FormValidation.service";
import PossessorsList from "./PossessorList";
import { calculateAreaByKide } from "@/lib/utils";
import SelectFromMapComp from "./SelectFromMapComp";
import DeedList from "./DeedList";
import Constants from "@/config/Constants";
import { useNavigate } from "react-router-dom";
import { getOrdinal } from "@/services/HelperService";
import DisplayFeatureComp from "./DisplayFeatureComp";


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


const PartDagEntryForm: React.FC<Props> = ({ dagNo, setDagNo, vill, mapdata, setVill }) => {
    const { formState: { errors } } = useForm<InputFormData>();
    const { isLoading, getData, setLoading, partDags, dharDagData, dharPattadars, dharTenants, dharDeeds } = useDagStore();
    const { landGroups, transferTypes } = useMasterDataStore();
    const [isPartDagInfoLoading, setIsPartDagInfoLoading] = useState<boolean>(false);
    const [isPartDagExists, setIsPartDagExists] = useState<boolean>(false);

    const [partDag, setPartDag] = useState<string>('');
    const [bhunaksaSurveyNo, setBhunaksaSurveyNo] = useState<string>('');
    const [matchedFeatureWithArea, setMatchedFeatureWithArea] = useState<any>('');
    const [selectedFeature, setSelectedFeature] = useState<any>(null);


    // useEffect(() => {
    //     nextPartDag();
    // }, []);

    useEffect(() => {
        nextPartDag();
    }, [partDags]);

    const goToNext = async () => {
        await setTimeout(() => {
            getData(dagNo, vill);
        }, 500);
        nextPartDag();
    }





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
    const [dagLandRevenue, setDagLandRevenue] = useState<number>(0);
    const [dagLocalTax, setDagLocalTax] = useState<number>(0);
    const [pattadars, setPattadars] = useState(null);
    const [deeds, setDeeds] = useState(null);
    const [tenants, setTenants] = useState(null);
    const [possessors, setPossessors] = useState<any[]>([]);
    const [triggerLandRevenue, setTriggerLandRevenue] = useState<string>('');

    const [finalPartDag, setFinalPartDag] = useState<string>('');
    const [updateButton, setUpdateButton] = useState<boolean>(false);


    const [otp, setOtp] = useState(""); // OTP input field state
    const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sent status
    const [isOtpVerified, setIsOtpVerified] = useState(false); // Track OTP verification status



    //possessor fields start
    const [showPossesorForm, setShowPossessorForm] = useState(false);
    const [possessor, setPossessor] = useState({
        name: "",
        guardianName: "",
        guardianRelation: "",
        pattadarRelation: "",
        modeOfAcquisition: "",
        nameMut: "",
        fatherNameMut: "",
        addressMut: "",
        remark: "",
        gender: "male",
        dob: "",
        mobileNo: "",
        adhaar: "",
        email: "",
        photo: null,
        photo_preview: null,
        documents: [],
    });
    const handlePossessorChange = (field, value) => {
        setPossessor(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        setShowPossessorForm(false);
        setSelectedFeature('');
    }, [finalPartDag]);

    const handleDocumentChange = (
        docIndex: number,
        field: string,
        value: string
    ) => {
        setPossessor(prev => {
            const updatedDocuments = [...prev.documents];
            updatedDocuments[docIndex] = {
                ...updatedDocuments[docIndex],
                [field]: value, // Update the specific field of the document
            };
            return { ...prev, documents: updatedDocuments };
        });
    };
    // const handleSendOtp = () => {
    //     console.log(`Sending OTP to mobile number: ${otp}`);
    //     setIsOtpSent(true); // Mark OTP as sent
    // };

    // const handleVerifyOtp = () => {
    //     console.log(`Verifying OTP: ${otp}`);
    //     if (otp === "123456") {  // This should be replaced with actual OTP validation logic
    //         setIsOtpVerified(true);
    //         alert("OTP Verified Successfully");
    //     } else {
    //         alert("Invalid OTP, please try again");
    //     }
    // };


    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPossessor(prev => ({
                    ...prev,
                    photo: (reader.result as string).split(",")[1],// strip "data:image/jpeg;base64,"
                    photo_preview: URL.createObjectURL(file), // Preview URL for the photo
                }));
            };
            reader.readAsDataURL(file); // Convert file to Base64
        }
    };

    const handleDocumentFileChange = (docIndex: number, file: File | null) => {
        if (file) {
            setPossessor(prev => {
                const updatedDocuments = [...prev.documents];
                updatedDocuments[docIndex] = {
                    ...updatedDocuments[docIndex],
                    file: file, // Store the file object directly
                };
                return { ...prev, documents: updatedDocuments };
            });
        }
    };


    const addDocument = () => {
        setPossessor(prev => ({
            ...prev,
            documents: [
                ...prev.documents,
                {
                    document_name: "",
                    document_no: "",
                    issuing_authority: "",
                    document_issue_date: "",
                    file: null, // To handle file input
                },
            ],
        }));
    };

    const removeDocument = (docIndex: number) => {
        setPossessor(prev => ({
            ...prev,
            documents: prev.documents.filter((_, index) => index !== docIndex),
        }));
    };

    const submitPossessor = async () => {
        const formData = new FormData();

        formData.append("vill_townprt_code", vill);
        formData.append("dag_no", dagNo);
        formData.append("part_dag", finalPartDag);
        formData.append("possessor_name", possessor.name);
        formData.append("possessor_guardian_name", possessor.guardianName);
        formData.append("possessor_guardian_relation", possessor.guardianRelation);
        formData.append("possessor_mode_of_acquisition", possessor.modeOfAcquisition);
        formData.append("possessor_name_mut", possessor.nameMut);
        formData.append("possessor_father_name_mut", possessor.fatherNameMut);
        formData.append("possessor_address_mut", possessor.addressMut);
        formData.append("possessor_remark", possessor.remark);
        formData.append("possessor_gender", possessor.gender);
        formData.append("possessor_dob", possessor.dob);
        formData.append("possessor_mobile_no", possessor.mobileNo);
        formData.append("possessor_aadhaar", possessor.adhaar);
        formData.append("possessor_email", possessor.email);

        if (possessor.photo) {
            formData.append("possessor_photo", possessor.photo); // file
        }

        // Append dynamic documents
        possessor.documents.forEach((doc, index) => {
            const docMetadata = {
                document_name: doc.document_name,
                document_no: doc.document_no,
                issuing_authority: doc.issuing_authority,
                document_issue_date: doc.document_issue_date,
            };
            formData.append(`document_metadata_${index}`, JSON.stringify(docMetadata));
            formData.append(`document_file_${index}`, doc.file);
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
        resetPossessorAdd();
        setShowPossessorForm(false);
    };

    const getSaveButtonText = () => {
        if (showPossesorForm) {
            return 'Save Part Dag & Possessor';
        } else {
            if (possessors.length == 0) {
                return 'Add Possessor';
            } else {
                return 'Add More Possessor';
            }
        }
    }

    const addMorePossessor = async () => {
        if (!isPartDagExists) {
            // create the part dag first
            const formData = new FormData();

            // Append all the necessary fields
            formData.append("vill_townprt_code", vill);
            formData.append("dag_no", dagNo);
            formData.append("part_dag", finalPartDag);
            formData.append("bhunaksha_survey_no", bhunaksaSurveyNo);
            formData.append("land_class_code", currLandClass.toString());
            formData.append("area_sm", areaSm.toString());
            formData.append("dag_land_revenue", dagLandRevenue.toString());
            formData.append("dag_local_tax", dagLocalTax.toString());
            formData.append("feature_geojson", JSON.stringify(selectedFeature));

            // If these arrays exist, append them as JSON
            if (dharPattadars?.length) formData.append("pattadars", JSON.stringify(dharPattadars));
            if (dharTenants?.length) formData.append("tenants", JSON.stringify(dharTenants));

            // Check if formData is not empty or undefined
            if (!formData || formData.entries().next().done) {
                toast.error("Form data is invalid or empty");
                return;
            }

            // Validate form data
            if (!validatePartDagSubmitForm(formData)) {
                return; // Exit if validation fails
            }

            // Send the form data after validation
            setLoading(true);
            try {
                const response = await ApiService.postForm("submit_part_dag", formData);
                setLoading(false);

                if (response.status !== 'y') {
                    toast.error(response.msg);
                    return;
                } else {
                    toast.success(response.msg);
                    setIsPartDagExists(true);
                    setShowPossessorForm(true);
                }
            } catch (error) {
                setLoading(false);
                toast.error("An error occurred while submitting the form.");
            }

        } else {
            if (!showPossesorForm) {
                //show form for first possessor
                setShowPossessorForm(true);
            } else {
                if (!validatePossessorForm(possessor, possessors.length + 1)) {
                    return;
                } else {
                    submitPossessor();
                }
            }
        }
    };



    //edit possessor
    const [selectedEditPossessor, setSelectedEditPossessor] = useState<any | null>(null);
    const [isEditPosOpen, setIsEditPosOpen] = useState<boolean>(false);
    const [editPosPhoto, setEditPosPhoto] = useState<string | null>(null);
    const [updatingPhoto, setUpdatingPhoto] = useState<boolean>(false);
    const [removingPossessorPhoto, setRemovingPossessorPhoto] = useState<boolean>(false);
    const [newDocuments, setNewDocuments] = useState<any[]>([]);
    const navigate = useNavigate();


    useEffect(() => {
        if (dagNo != '' && vill != '') {
            setPattadars(dharPattadars);
            setDeeds(dharDeeds);
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
    const showDeeds = updateButton ? deeds : dharDeeds;

    const resetFields = () => {
        setCurrLandClass('');
        setAreaSm(0);
        setDagLandRevenue(0);
        setDagLocalTax(0);
        setPattadars([]);
        setDeeds([]);
        setUpdateButton(false);
        setBhunaksaSurveyNo('');
    };

    const resetPossessorAdd = () => {
        setPossessor({
            name: "",
            guardianName: "",
            guardianRelation: "",
            pattadarRelation: "",
            modeOfAcquisition: "",
            nameMut: "",
            fatherNameMut: "",
            addressMut: "",
            remark: "",
            gender: "male",
            dob: "",
            mobileNo: "",
            adhaar: "",
            email: "",
            photo: null,
            photo_preview: null,
            documents: [],
        });
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
            // toast.error(response.msg);
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

        setIsPartDagInfoLoading(true);
        const response = await ApiService.get('get_partdag_data', JSON.stringify(data));

        if (response.status !== 'y') {
            toast.error(response.msg);
            setIsPartDagInfoLoading(false);
            return;
        }

        const partDagDetails = response.data;
        // console.log(partDagDetails);
        if (partDagDetails.is_exists == 'Y') {
            const dag_area_sqmtr = partDagDetails.dag_area_sqmtr ? partDagDetails.dag_area_sqmtr : 0;
            setAreaSm(dag_area_sqmtr);
            setCurrLandClass(partDagDetails.land_class_code);
            setDagLandRevenue(partDagDetails.dag_revenue);
            setDagLocalTax(partDagDetails.dag_local_tax);
            setPattadars(partDagDetails.pattadars);
            setDeeds(dharDeeds);
            setTenants(partDagDetails.tenants);
            setUpdateButton(true);
            setPossessors(partDagDetails.possessors);
            setBhunaksaSurveyNo(partDagDetails.bhunaksha_survey_no);
            setIsPartDagExists(true);
        } else {
            setAreaSm(0);
            setCurrLandClass('');
            setTriggerLandRevenue('');
            setDagLandRevenue(0);
            setDagLocalTax(0);
            setPattadars([]);
            setDeeds(dharDeeds);
            setUpdateButton(false);
            setPossessors([]);
            setBhunaksaSurveyNo('');
            setIsPartDagExists(false);
        }
        setIsPartDagInfoLoading(false);
    };

    const handleAreaSm = (e: any) => {
        setAreaSm(e.currentTarget.value);
        setTriggerLandRevenue(e.currentTarget.value);
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
        setPossessors([]);
        setAreaSm(0);
        setCurrLandClass('');
        setTriggerLandRevenue('');
        setDagLandRevenue(0);
        setDagLocalTax(0);
        setPattadars([]);
        setBhunaksaSurveyNo('');
        setIsPartDagExists(false);

        await setTimeout(() => {
            getData(dagNo, vill);
        }, 500);
        nextPartDag();
        setShowPossessorForm(false);
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

    const handleSelectedFrmMap = (feature) => {
        setBhunaksaSurveyNo(feature.properties?.kide);
        setSelectedFeature(feature);
    }

    const onEditPossessor = (possessor) => {
        setSelectedEditPossessor(possessor);
        setNewDocuments([]);
        setEditPosPhoto(null);
        setIsEditPosOpen(true);
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
        selectedEditPossessor.documents = newDocuments;
        selectedEditPossessor.guardianName = selectedEditPossessor.guard_name;
        selectedEditPossessor.guardianRelation = selectedEditPossessor.guard_relation;
        selectedEditPossessor.mobileNo = selectedEditPossessor.mobile_no;
        selectedEditPossessor.adhaar = (selectedEditPossessor.aadhaar_no || '').trim();
        if (!validatePossessorForm(selectedEditPossessor)) {
            return;
        }
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

    const viewDoc = (e: any) => {
        navigate(`/deedDoc?id=${e.currentTarget.id}`);
    }

    return (
        <>
            {(dagNo && vill && dagNo != '' && vill != '') ?
                (<div>
                    {/* Pattadars */}
                    <div className="mt-6">
                        <Card className="w-full shadow-lg border border-gray-200 rounded-xl">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-between">
                                    পট্টাদাৰৰ তথ্য (Pattadars)
                                    {showPattadars && (
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            Total - {showPattadars.length}
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Card Grid for Possessors */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {showPattadars?.length ? (
                                        showPattadars.map((p, i) => (
                                            <div
                                                key={i}
                                                className="bg-white shadow-lg rounded-xl border border-gray-200 p-4 space-y-4 hover:shadow-xl transition-all duration-300"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">পট্টাদাৰৰ নাম:</span>
                                                    <span className="text-gray-600">{p?.pdar_name || ""}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">পিতাৰ নাম:</span>
                                                    <span className="text-gray-600">{p?.pdar_father_name || ""}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">ঠিকনা:</span>
                                                    <span className="text-gray-600">
                                                        {p?.pdar_add1 || ""}
                                                        {p?.pdar_add2 ? `, ${p.pdar_add2}` : ""}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center text-gray-500 py-6">
                                            📭 No Pattadar Data
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tenants */}
                    <div className="mt-6">
                        <Card className="w-full shadow-lg border border-gray-200 rounded-xl">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-between">
                                    ৰায়ত/ আধিয়াৰৰ তথ্য (Tenants)
                                    {tenants && (
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            Total - {tenants.length}
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Card Grid for Tenants */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {tenants?.length ? (
                                        tenants.map((t, i) => (
                                            <div
                                                key={i}
                                                className="bg-white shadow-lg rounded-xl border border-gray-200 p-4 space-y-4 hover:shadow-xl transition-all duration-300"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">ভাড়াতীয়ৰ নাম:</span>
                                                    <span className="text-gray-600">{t?.tenant_name || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">পিতাৰ নাম:</span>
                                                    <span className="text-gray-600">{t?.tenants_father || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">ঠিকনা:</span>
                                                    <span className="text-gray-600">
                                                        {t?.tenants_add1 || "N/A"}
                                                        {t?.tenants_add2 ? `, ${t.tenants_add2}` : ""}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">খাতিয়ান নম্বৰ:</span>
                                                    <span className="text-gray-600">{t?.khatian_no || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">ভাড়াতীয়া অৱস্থা:</span>
                                                    <span className="text-gray-600">{t?.tenant_status || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">আয়তন:</span>
                                                    <span className="text-gray-600">{t?.revenue_tenant || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">মন্তব্য:</span>
                                                    <span className="text-gray-600">{t?.remarks || "N/A"}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center text-gray-500 py-6">
                                            No Tenant Data
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {deeds && <div className="mt-6">
                        <Card className="w-full shadow-sm border border-gray-200 rounded-xl">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    Uploaded Deeds

                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">

                                <DeedList deeds={showDeeds} viewDoc={viewDoc} />

                            </CardContent>
                        </Card>
                    </div>}
                    <div className="p-5 sm:p-8 border-sm bg-white mt-5 rounded-lg shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

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
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="part_dag">জৰীপ নম্বৰ(Survey Number) <span className="text-red-500" title="This field is required">*</span>
                                    <SelectFromMapComp mapdata={mapdata} partDag={finalPartDag} villCode={vill} onSelect={(feature) => handleSelectedFrmMap(feature)} />
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

                            <div className="space-y-2 md:col-span-2">
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
                        </div>
                        {selectedFeature &&
                            <DisplayFeatureComp geoJsonData={selectedFeature} />
                        }
                        <div className="flex items-center gap-2 mt-10 mb-3">
                            <Users className="h-5 w-5 text-indigo-500" />
                            <p className="text-md font-semibold text-medical-700">দখলদাৰ (Possessor)</p>

                        </div>
                        {possessors && possessors.length > 0 &&
                            <PossessorsList possessors={possessors} onEditPossessor={(possessor) => onEditPossessor(possessor)} deletePossessor={deletePossessor} />
                        }
                        {showPossesorForm && (<>
                            <p className="text-red-500 text-sm font-bold mt-2">
                                (*) Fields are mandatory
                            </p>

                            <Card id="possessor-card" className="w-full my-4 bg-gray-100">
                                <CardHeader className="flex-row items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const el = document.getElementById("possessor-card");
                                            if (el) {
                                                el.classList.add("possessor-exit");
                                                setTimeout(() => setShowPossessorForm(false), 260);
                                            }
                                        }}
                                        className="text-white bg-red-500 hover:bg-red-700 px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                    <CardTitle className="w-full text-center">
                                        {`${getOrdinal(possessors.length + 1)} Possessor Details Form`}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                                        {/* NAME */}
                                        <div className="space-y-2">
                                            <Label>Possessor Name *</Label>
                                            <Input
                                                type="text"
                                                placeholder="Enter Possessor Name"
                                                value={possessor.name}
                                                onInput={(e) => handlePossessorChange("name", e.currentTarget.value)}
                                            />
                                        </div>

                                        {/* GUARDIAN NAME */}
                                        <div className="space-y-2">
                                            <Label>Guardian Name *</Label>
                                            <Input
                                                type="text"
                                                value={possessor.guardianName}
                                                placeholder="Enter Guardian Name"
                                                onInput={(e) => handlePossessorChange("guardianName", e.currentTarget.value)}
                                            />
                                        </div>

                                        {/* GUARDIAN RELATION */}
                                        <div className="space-y-2">
                                            <Label>Guardian Relation *</Label>
                                            <select
                                                className="w-full border rounded px-3 py-2"
                                                value={possessor.guardianRelation}
                                                onChange={(e) => handlePossessorChange("guardianRelation", e.currentTarget.value)}
                                            >
                                                <option value="">Select Relation</option>
                                                <option value="f">পিতৃ</option>
                                                <option value="m">মাতৃ</option>
                                                <option value="h">পতি</option>
                                                <option value="w">পত্নী</option>
                                                <option value="u">অভিভাৱক</option>
                                            </select>
                                        </div>

                                        {/* MODE OF ACQUISITION */}
                                        <div className="space-y-2">
                                            <Label>Mode of Acquisition *</Label>
                                            <select
                                                className="w-full border rounded px-3 py-2"
                                                value={possessor.modeOfAcquisition}
                                                onChange={(e) => handlePossessorChange("modeOfAcquisition", e.currentTarget.value)}
                                            >
                                                <option value="">Select Mode</option>
                                                {transferTypes.map((type) => (
                                                    <option key={type.value} value={type.value}>{type.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* MUTATION NAME */}
                                        <div className="space-y-2">
                                            <Label>Possessor Name for Mutation</Label>
                                            <Input
                                                type="text"
                                                value={possessor.nameMut}
                                                placeholder="Possessor Name for Mutation"
                                                onInput={(e) => handlePossessorChange("nameMut", e.currentTarget.value)}
                                            />
                                        </div>

                                        {/* MUTATION FATHER */}
                                        <div className="space-y-2">
                                            <Label>Father Name for Mutation</Label>
                                            <Input
                                                type="text"
                                                value={possessor.fatherNameMut}
                                                placeholder="Father Name for Mutation"
                                                onInput={(e) => handlePossessorChange("fatherNameMut", e.currentTarget.value)}
                                            />
                                        </div>

                                        {/* MUTATION ADDRESS */}
                                        <div className="space-y-2">
                                            <Label>Address for Mutation</Label>
                                            <Input
                                                type="text"
                                                value={possessor.addressMut}
                                                placeholder="Address for Mutation"
                                                onInput={(e) => handlePossessorChange("addressMut", e.currentTarget.value)}
                                            />
                                        </div>

                                        {/* GENDER */}
                                        <div className="space-y-2">
                                            <Label>Gender *</Label>
                                            <select
                                                className="w-full border rounded px-3 py-2"
                                                value={possessor.gender}
                                                onChange={(e) => handlePossessorChange("gender", e.currentTarget.value)}
                                            >
                                                <option value="">--Select--</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="third gender">Third Gender</option>
                                                <option value="institute">Institute</option>
                                            </select>
                                        </div>

                                        {/* AADHAAR */}
                                        <div className="space-y-2">
                                            <Label>Aadhaar Number</Label>
                                            <Input
                                                type="text"
                                                value={possessor.adhaar}
                                                placeholder="Enter Aadhaar Number"
                                                onInput={(e) => handlePossessorChange("adhaar", e.currentTarget.value)}
                                            />
                                        </div>

                                        {/* MOBILE + OTP */}
                                        <div className="space-y-2">
                                            <Label>Mobile *</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    value={possessor.mobileNo}
                                                    placeholder="Enter Mobile"
                                                    onInput={(e) => handlePossessorChange("mobileNo", e.currentTarget.value)}
                                                />
                                                {/* <Button type="button" onClick={handleSendOtp}>
                                                            {isOtpSent ? "OTP Sent" : "Send OTP"}
                                                        </Button> */}
                                            </div>

                                            {/* {isOtpSent && !isOtpVerified && (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Input
                                                                type="text"
                                                                placeholder="Enter OTP"
                                                                value={otp}
                                                                onInput={(e) => setOtp(e.currentTarget.value)}
                                                            />
                                                            <Button onClick={handleVerifyOtp}>Verify</Button>
                                                        </div>
                                                    )} */}
                                        </div>

                                        {/* EMAIL */}
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input
                                                type="email"
                                                value={possessor.email}
                                                placeholder="Enter Email"
                                                onInput={(e) => handlePossessorChange("email", e.currentTarget.value)}
                                            />
                                        </div>

                                        {/* DOB */}
                                        <div className="space-y-2">
                                            <Label>Date of Birth</Label>
                                            <Input
                                                type="date"
                                                value={possessor.dob}
                                                onInput={(e) => handlePossessorChange("dob", e.currentTarget.value)}
                                            />
                                        </div>

                                        {/* PHOTO UPLOAD */}
                                        <div className="space-y-3">
                                            <Label>Possessor Photo</Label>
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer">
                                                <Input
                                                    type="file"
                                                    accept=".jpg,.jpeg"
                                                    className="hidden"
                                                    onChange={(e) => handlePhotoChange(e)}
                                                />
                                                <span className="text-sm text-gray-500">Upload Photo</span>
                                            </label>

                                            {possessor.photo_preview && (
                                                <div className="w-40 h-40 border rounded-xl overflow-hidden">
                                                    <img
                                                        src={possessor.photo_preview}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* REMARK */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Remark</Label>
                                            <Textarea
                                                value={possessor.remark}
                                                onInput={(e) => handlePossessorChange("remark", e.currentTarget.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* DOCUMENTS */}
                                    <div className="space-y-3 mt-10">
                                        <Label>Ownership / Transfer Documents</Label>

                                        {possessor.documents.map((doc, docIndex) => (
                                            <div key={docIndex} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-xl bg-gray-50 relative">

                                                <div className="space-y-1">
                                                    <Label>Document Name *</Label>
                                                    <Input
                                                        type="text"
                                                        value={doc.document_name}
                                                        onChange={(e) =>
                                                            handleDocumentChange(docIndex, "document_name", e.target.value)
                                                        }
                                                        placeholder="Enter Document Name"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label>Document No *</Label>
                                                    <Input
                                                        type="text"
                                                        value={doc.document_no}
                                                        onChange={(e) =>
                                                            handleDocumentChange(docIndex, "document_no", e.target.value)
                                                        }
                                                        placeholder="Enter Document No"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label>Issuing Authority</Label>
                                                    <Input
                                                        type="text"
                                                        value={doc.issuing_authority}
                                                        placeholder="Issuing Authority"
                                                        onChange={(e) =>
                                                            handleDocumentChange(docIndex, "issuing_authority", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label>Issue Date *</Label>
                                                    <Input
                                                        type="date"
                                                        value={doc.document_issue_date}
                                                        onChange={(e) =>
                                                            handleDocumentChange(docIndex, "document_issue_date", e.target.value)
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label>Upload *</Label>
                                                    <Input
                                                        type="file"
                                                        accept=".pdf,image/*"
                                                        onChange={(e) =>
                                                            handleDocumentFileChange(docIndex, e.target.files?.[0] || null)
                                                        }
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    className="absolute top-2 right-2 text-red-500"
                                                    onClick={() => removeDocument(docIndex)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}

                                        <Button type="button" variant="outline" onClick={addDocument}>
                                            + Add Document
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                        )}

                        <div className="mt-4">
                            <Button type="button" className={showPossesorForm ? 'bg-green-600 hover:bg-green-700 text-white' : ''} onClick={() => addMorePossessor()}>
                                {getSaveButtonText()}
                            </Button>
                        </div>

                        {isPartDagExists && <div className="flex justify-end space-x-4">
                            <ConfirmDialog
                                trigger={<Button type="button" className="bg-red-600 hover:bg-red-700 text-white">Delete Part Dag</Button>}
                                title="Delete DAG"
                                description="This will permanently delete the DAG record. Are you sure?"
                                confirmText="Yes, delete"
                                cancelText="No, keep it"
                                onConfirm={handlePartDagDelete}
                            />
                            <Button type="button" className="" onClick={() => goToNext()}>
                                Next Part Dag
                            </Button>
                        </div>}
                    </div>
                </div>
                ) : (<div className="flex items-center justify-center p-7">
                    {(!dagNo || dagNo.trim() === '') && (
                        <p className="text-sm text-gray-500 mt-2">Please select a valid Dag No to proceed.</p>
                    )}
                </div>)}
            {/* <Toaster position="top-center" /> */}
            <Loader loading={isLoading || isPartDagInfoLoading} />
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
                                            <option value="third gender">Third Gender</option>
                                            <option value="institute">Institute</option>
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
        </>
    );
};

export default PartDagEntryForm;