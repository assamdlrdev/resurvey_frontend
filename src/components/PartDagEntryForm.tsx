import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import Select from 'react-tailwindcss-select';
import { Combobox } from "@headlessui/react";
import MyCombobox from "./ComboBox";
import ApiService from "@/services/ApiService";
import { toast } from "react-hot-toast";
import Loader from "./Loader";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDagStore } from "@/store/SurveyStore";
import { useMasterDataStore } from "@/store/SurveyStore";
import { Plus, Trash2, Users } from "lucide-react";


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
    const { landClasses, landGroups, pattaTypes } = useMasterDataStore();

    const [partDag, setPartDag] = useState<string>('');
    const [currLandClass, setCurrLandClass] = useState<string | number>('');
    const [areaSm, setAreaSm] = useState<number>(0);
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
            tenants: dharTenants
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
        console.log(e.currentTarget.id, dagNo, vill);
        resetPossessorAdd();
        setIsOpen(true);
    };


    const handleUpdatePartDag = async () => {
        if (!finalPartDag || finalPartDag == '' || !currLandClass || currLandClass == '') {
            toast.error('Missing Part Dag or Land Class!');
            return;
        }
        if (!areaSm || areaSm == 0) {
            toast.error('Missing Area!');
            return;
        }
        if (!dagLandRevenue || dagLandRevenue == 0 || !dagLocalTax || dagLocalTax == 0) {
            toast.error('Missing Land Revenue and Local Tax!');
            return;
        }

        const data = {
            vill_townprt_code: vill,
            dag_no: dagNo,
            part_dag: finalPartDag,
            land_class_code: currLandClass,
            area_sm: areaSm,
            dag_land_revenue: dagLandRevenue,
            dag_local_tax: dagLocalTax,
            pattadars: dharPattadars,
            tenants: dharTenants
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


    const submitPossessor = async () => {
        if (!posName || !posGuardianName || !posGuardianRelation || posName == '' || posGuardianName == '' || posGuardianRelation == '') {
            toast.error('Input fields missing!');
            return;
        }

        const data = {
            vill_townprt_code: vill,
            dag_no: dagNo,
            part_dag: finalPartDag,
            possessor_name: posName,
            possessor_guardian_name: posGuardianName,
            possessor_guardian_relation: posGuardianRelation,
            possessor_pattadar_relation: posPattadarRelation,
            possessor_mode_of_acquisition: posModeOfAcquisition,
            possessor_name_mut: posNameMut,
            possessor_father_name_mut: posFatherNameMut,
            possessor_address_mut: posAddressMut,
            possessor_remark: posRemark,
            possessor_gender: posGender,
            possessor_dob: posDob
        };

        setLoading(true);
        const response = await ApiService.get('submit_possessor', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);
        getPartDagInfo();
        setIsOpen(false);
    };

    const deletePossessor = async (e: any) => {
        // console.log(e.currentTarget.value);
        const data = {
            possessor: e.currentTarget.value
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
                                {/* {errors.part_dag && (
                            <p className="text-sm text-destructive">{errors.part_dag.message}</p>
                            )} */}
                            </div>
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
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-gray-800">
                                        <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium flex justify-start">পট্টাদাৰৰ নাম</th>
                                                <th className="px-4 py-3 text-left font-medium text-center">পিতাৰ নাম</th>
                                                <th className="px-4 py-3 text-left font-medium flex justify-end">ঠিকনা</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {showPattadars?.length ? (
                                                showPattadars.map((p, i) => (
                                                    <tr key={i} className="hover:bg-indigo-50 transition-colors">
                                                        <td className="px-4 py-3 flex justify-start">{p.pdar_name}</td>
                                                        <td className="px-4 py-3">{p.pdar_father_name || "N/A"}</td>
                                                        <td className="px-4 py-3 flex justify-end">
                                                            {p.pdar_add1}
                                                            {p.pdar_add2 ? `, ${p.pdar_add2}` : ""}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-10 text-center text-gray-500">
                                                        📭 No pattadars found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
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
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-gray-800">
                                        <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium flex justify-start">Tenant Name</th>
                                                <th className="px-4 py-3 text-left font-medium">Father&apos;s Name</th>
                                                <th className="px-4 py-3 text-left font-medium">Address</th>
                                                <th className="px-4 py-3 text-left font-medium">Khatian No</th>
                                                <th className="px-4 py-3 text-left font-medium">Tenant Status</th>
                                                <th className="px-4 py-3 text-left font-medium">Revenue Tenant</th>
                                                <th className="px-4 py-3 text-left font-medium flex justify-end">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {showTenants?.length ? (
                                                showTenants.map((t) => (
                                                    <tr key={t.tenant_id} className="hover:bg-indigo-50 transition-colors">
                                                        <td className="px-4 py-3 flex justify-start">{t.tenant_name}</td>
                                                        <td className="px-4 py-3">{t.tenants_father}</td>
                                                        <td className="px-4 py-3">{t.tenants_add1}{t.tenants_add2 ? `, ${t.tenants_add2}` : ""}</td>
                                                        <td className="px-4 py-3">{t.khatian_no}</td>
                                                        <td className="px-4 py-3">{t.tenant_status}</td>
                                                        <td className="px-4 py-3">{t.revenue_tenant}</td>
                                                        <td className="px-4 py-3 flex justify-end">{t.remarks}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                                                        📭 No Tenant Data
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Possessors */}
                    {finalPartDag && (
                        <div className="mt-6">
                            <Card className="w-full shadow-sm border border-gray-200 rounded-xl">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100">
                                    <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <Users className="h-5 w-5 text-indigo-500" />
                                        Possessors
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        id={finalPartDag}
                                        onClick={modalOpen}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm rounded-lg flex items-center gap-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Possessor
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm text-gray-800">
                                            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-medium flex justify-start">Possessor Name</th>
                                                    <th className="px-4 py-3 text-left font-medium">Guardian&apos;s Name</th>
                                                    <th className="px-4 py-3 text-left font-medium">Remarks</th>
                                                    <th className="px-4 py-3 text-left font-medium flex justify-end">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {possessors?.length ? (
                                                    possessors.map((p, i) => (
                                                        <tr key={i} className="hover:bg-indigo-50 transition-colors">
                                                            <td className="px-4 py-3 flex justify-start">{p.name}</td>
                                                            <td className="px-4 py-3">{p.guard_name}</td>
                                                            <td className="px-4 py-3">{p.remarks}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1 flex items-center gap-1"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            toast.dismiss(); // Dismiss all existing toasts
                                                                            toast(
                                                                                (t) => (
                                                                                    <div className="text-left">
                                                                                        <div className="flex justify-between items-center mb-2">
                                                                                            <span className="font-bold">Possessor Details</span>
                                                                                            <button
                                                                                                className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                                                                                                onClick={() => toast.dismiss(t.id)}
                                                                                            >
                                                                                                Close
                                                                                            </button>
                                                                                        </div>
                                                                                        <div><strong>Name:</strong> {p.name}</div>
                                                                                        <div><strong>Guardian Name:</strong> {p.guard_name}</div>
                                                                                        <div><strong>Guardian Relation:</strong> {p.guard_relation_name}</div>
                                                                                        {/* <div><strong>Pattadar Relation:</strong> {p.pattadar_relation}</div> */}
                                                                                        <div><strong>Mode of Acquisition:</strong> {p.mode_of_acquisition_name}</div>
                                                                                        <div><strong>Possessor Name for Mutation:</strong> {p.mut_possessor_name}</div>
                                                                                        <div><strong>Possessor Father's Name for Mutation:</strong> {p.mut_possessor_father_name}</div>
                                                                                        <div><strong>Address for Mutation:</strong> {p.mut_possessor_address}</div>
                                                                                        <div><strong>Gender:</strong> {p.gender}</div>
                                                                                        <div><strong>Date of Birth:</strong> {p.dob}</div>
                                                                                        <div><strong>Remark:</strong> {p.remarks}</div>
                                                                                    </div>
                                                                                ),
                                                                                {
                                                                                    duration: 30000,
                                                                                    position: "top-center",
                                                                                    style: { minWidth: "350px", maxWidth: "90vw", fontSize: "14px" }
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        Details
                                                                    </Button>
                                                                    <Button
                                                                        className="bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1 flex items-center gap-1"
                                                                        value={`${p.dist_code}-${p.subdiv_code}-${p.cir_code}-${p.mouza_pargona_code}-${p.lot_no}-${p.vill_townprt_code}-${p.old_dag_no}-${p.part_dag}-${p.possessor_id}`}
                                                                        onClick={deletePossessor}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                                                            📭 No possessors found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {finalPartDag && finalPartDag !== '' && isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                        <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 relative">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="possessor_name">Possessor Name</Label>
                                            <Input
                                                id="possessor_name"
                                                type="text"
                                                placeholder="Possessor Name"
                                                value={posName}
                                                onInput={(e: any) => setPosName(e.currentTarget.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="possessor_guard_name">Possessor's Guardian Name</Label>
                                            <Input
                                                id="possessor_guard_name"
                                                type="text"
                                                placeholder="Possessor's Guardian Name"
                                                value={posGuardianName}
                                                onInput={(e: any) => setPosGuardianName(e.currentTarget.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="possessor_guard_relation">Possessor's Guardian Relation</Label>
                                            <select
                                                id="possessor_guard_relation"
                                                // {...register("curr_land_use", { required: "Current Land Class Use is required" })}
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
                                        {/* <div className="space-y-2">
                                            <Label htmlFor="possessor_pattadar_relation">Possessor's Relation with Pattadar</Label>
                                            <select
                                                id="possessor_pattadar_relation"
                                                // {...register("curr_land_use", { required: "Current Land Class Use is required" })}
                                                className="w-full border rounded px-3 py-2 mt-1"
                                                value={posPattadarRelation}
                                                onChange={(e: any) => setPosPattadarRelation(e.currentTarget.value)}
                                            >
                                                <option value="">Select Relation</option>
                                                <option value="f">পিতৃ</option>
                                                <option value="m">মাতৃ</option>
                                                <option value="h">পতি</option>
                                                <option value="w">পত্নী</option>
                                                <option value="u">অভিভাৱক</option>
                                            </select>
                                        </div> */}
                                        <div className="space-y-2">
                                            <Label htmlFor="mode_of_acquisition">Mode of Acquisition by possessor</Label>
                                            <select
                                                id="mode_of_acquisition"
                                                // {...register("curr_land_use", { required: "Current Land Class Use is required" })}
                                                className="w-full border rounded px-3 py-2 mt-1"
                                                value={posModeOfAcquisition}
                                                onChange={(e: any) => setPosModeOfAcquisition(e.currentTarget.value)}
                                            >
                                                <option value="">Select Mode</option>
                                                <option value="s">Sale</option>
                                                <option value="m">Mortgage</option>
                                                <option value="l">Lease</option>

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

                                        {/* add here for gender and dob */}
                                        <div className="space-y-2">
                                            <Label htmlFor="possessor_gender">Gender</Label>
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
                                            <Label htmlFor="possessor_dob">Date of Birth</Label>
                                            <Input
                                                id="possessor_dob"
                                                type="date"
                                                value={posDob}
                                                onInput={(e: any) => setPosDob(e.currentTarget.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="possessor_remark">Remark</Label>
                                            <Input
                                                id="possessor_remark"
                                                type="text"
                                                placeholder="Remark"
                                                value={posRemark}
                                                onInput={(e: any) => setPosRemark(e.currentTarget.value)}
                                            />
                                        </div>

                                    </div>

                                </CardContent>
                            </Card>


                            <button
                                onClick={submitPossessor}
                                className="px-4 py-2 my-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 ml-3 py-2 my-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>}
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