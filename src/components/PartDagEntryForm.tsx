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
import { toast, Toaster } from "react-hot-toast";
import Loader from "./Loader";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";


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
    const [partDag, setPartDag] = useState<string>('');
    const [currLandClass, setCurrLandClass] = useState<string | number>('');
    const [areaSm, setAreaSm] = useState<number>(0);
    const [areaBigha, setAreaBigha] = useState<number>(0);
    const [areaKatha, setAreaKatha] = useState<number>(0);
    const [areaLc, setAreaLc] = useState<number>(0.00);
    const [dist, setDist] = useState<string>('');
    const [areaGanda, setAreaGanda] = useState<number>(0.00);
    const [originalLandClass, setOriginalLandClass] = useState<string>('');
    const [pattaNo, setPattaNo] = useState<string>('');
    const [pattaTypeCode, setPattaTypeCode] = useState<string>('');
    const [dagLandRevenue, setDagLandRevenue] = useState<number>(0);
    const [dagLocalTax, setDagLocalTax] = useState<number>(0);
    const [pattadars, setPattadars] = useState(null);
    const [originalPattaNo, setOriginalPattaNo] = useState<string>('');
    const [originalPattaTypeCode, setOriginalPattaTypeCode] = useState<string>('');
    const [triggerLandRevenue, setTriggerLandRevenue] = useState<string>('');
    const [errorTag, setErrorTag] = useState<ErrorType[]>([]);



    const [dharPattadars, setDharPattadars] = useState<OptionType[]>([
        // { value: "fox", label: "🦊 Fox" },
        // { value: "Butterfly", label: "🦋 Butterfly" },
        // { value: "Honeybee", label: "🐝 Honeybee" }
    ]);
    const [dharLandClasses, setDharLandClasses] = useState<any[]>([]);
    const [dharPattaTypes, setDharPattaTypes] = useState<any[]>([]);
    const [bhunakshaPartDags, setBhunakshaPartDags] = useState<any[]>([]);
    const [dharDagData, setDharDagData] = useState<DagDataType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
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
    // const [posTenant, setPosTenant] = useState<string>('');
    // const [posTenantName, setPosTenantName] = useState<string>('');
    // const [posTenantFatherName, setPosTenantFatherName] = useState<string>('');
    // const [posTenantAddress, setPosTenantAddress] = useState<string>('');
    const [posTenantRelation, setPosTenantRelation] = useState<string>('');
    // const [posTenantType, setPosTenantType] = useState<string>('');
    const [posRemark, setPosRemark] = useState<string>('');
    const [updateButton, setUpdateButton] = useState<boolean>(false);
    const [dharTenants, setDharTenants] = useState<any[]>([]);
    const [posTenants, setPosTenants] = useState<any[]>([]);


    useEffect(() => {
        if (dagNo != '' && vill != '') {
            getData(dagNo, vill);
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

    useEffect(() => {

    }, []);

    const resetFields = () => {
        setCurrLandClass(originalLandClass);
        setAreaSm(0);
        setPattaNo(originalPattaNo);
        setPattaTypeCode(originalPattaTypeCode);
        setDagLandRevenue(0);
        setDagLocalTax(0);
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
            setUpdateButton(true);
            setPossessors(partDagDetails.possessors);
        }
        if (partDagDetails.from_bhunaksha == 1) {
            const dag_area_sqmtr = partDagDetails.dag_area_sqmtr ? partDagDetails.dag_area_sqmtr : 0;
            setAreaSm(dag_area_sqmtr);
            setCurrLandClass(originalLandClass);
            setPattaNo(originalPattaNo);
            setPattaTypeCode(originalPattaTypeCode);
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
            setCurrLandClass(originalLandClass);
            setPattaNo(originalPattaNo);
            setPattaTypeCode(originalPattaTypeCode);
            setTriggerLandRevenue('');
            setDagLandRevenue(0);
            setDagLocalTax(0);
            setPattadars([]);
            setUpdateButton(false);
            setPossessors([])
        }
    };

    const getData = async (dagNo: string, vill: string) => {
        setDist(vill.split('-')[0]);
        const data = {
            vill_townprt_code: vill,
            dag_no: dagNo
        };

        setLoading(true);
        const response = await ApiService.get('get_dag_data', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        const resp = response.data;
        // console.log(resp);

        setBhunakshaPartDags(resp.part_dags);
        setDharLandClasses(resp.land_classes);
        setDharPattaTypes(resp.patta_types);
        setDharPattadars(resp.pattadars);
        setDharDagData(resp.dharitree_data);
        setOriginalLandClass(resp.dharitree_data.land_class_code);
        setOriginalPattaNo(resp.dharitree_data.patta_no);
        setOriginalPattaTypeCode(resp.dharitree_data.patta_type_code);
        setCurrLandClass(resp.dharitree_data.land_class_code);
        setPattaNo(resp.dharitree_data.patta_no);
        setPattaTypeCode(resp.dharitree_data.patta_type_code);

        // console.log(response);
    };

    const handlePattadarSelect = (val: any) => {
        setPattadars(val);
        console.log(val);
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
            pattadars: pattadars
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

        console.log(response);
    };



    const modalOpen = (e: any) => {
        console.log(e.currentTarget.id, dagNo, vill);
        // getTenants(vill, dagNo);
        resetPossessorAdd();
        setIsOpen(true);
    };

    const getTenants = async (vill: string, dagNo: any) => {
        const data = {
            vill_townprt_code: vill,
            dag_no: dagNo
        };

        setLoading(true);
        const response = await ApiService.get('get_tenants', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        console.log(response.data);
    };

    const handleUpdatePartDag = async () => {
        console.log('update Called');
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
            pattadars: pattadars
        };

        setLoading(true);
        const response = await ApiService.get('update_part_dag', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);
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

    const handleTenantSelect = (val: any) => {
        setPosTenants(val);
        console.log(val);
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
            possessor_remark: posRemark
        };

        setLoading(true);
        const response = await ApiService.get('submit_possessor', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        console.log(response);

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
                                <MyCombobox partDag={partDag} setPartDag={setPartDag} bhunakshaPartDags={bhunakshaPartDags} setFinalPartDag={setFinalPartDag} />
                                {/* {errors.part_dag && (
                            <p className="text-sm text-destructive">{errors.part_dag.message}</p>
                            )} */}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="o_land_class">Land Class (Existing)</Label>
                                <select
                                    id="o_land_class"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={originalLandClass}
                                    onChange={(e: any) => setOriginalLandClass(e.currentTarget.value)}
                                    disabled
                                >
                                    <option value="">Select Land Class</option>
                                    {dharLandClasses && dharLandClasses.length > 0 && dharLandClasses.map((dharLandClass, index) => <option key={index} value={dharLandClass.class_code}>{dharLandClass.land_type}</option>)}
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
                                    <option value="">Select Current Land Class use</option>
                                    {dharLandClasses && dharLandClasses.length > 0 && dharLandClasses.map((dharLandClass, index) => <option key={index} value={dharLandClass.class_code}>{dharLandClass.land_type}</option>)}
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
                                {/* {errors.area_sm && (
                            <p className="text-sm text-destructive">{errors.area_sm.message}</p>
                            )} */}
                            </div>

                            {/* <div className="space-y-2">
                            <Label htmlFor="area_b">Area in Bigha</Label>
                            <Input
                            id="area_b"
                            type="number"
                            {...register("area_b", { required: "Bigha is a required field" })}
                            placeholder="Enter Area Bigha"
                            value={areaBigha}
                            onInput={(e: any) => setAreaBigha(e.currentTarget.value)}
                            />
                            {errors.area_b && (
                            <p className="text-sm text-destructive">{errors.area_b.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="area_k">Area in Katha</Label>
                            <Input
                            id="area_k"
                            type="number"
                            {...register("area_k", { required: "Katha is a required field" })}
                            placeholder="Enter Area Katha"
                            value={areaKatha}
                            onInput={(e: any) => setAreaKatha(e.currentTarget.value)}
                            />
                            {errors.area_k && (
                            <p className="text-sm text-destructive">{errors.area_k.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="area_b">Area in Lessa</Label>
                            <Input
                            id="area_lc"
                            type="number"
                            {...register("area_lc", { required: "Lessa is a required field" })}
                            placeholder="Enter Area Lessa"
                            value={areaLc}
                            onInput={(e: any) => setAreaLc(e.currentTarget.value)}
                            />
                            {errors.area_lc && (
                            <p className="text-sm text-destructive">{errors.area_lc.message}</p>
                            )}
                        </div> */}

                            {/* {(dist == '21' || dist == '22' || dist == '23') && <div className="space-y-2">
                            <Label htmlFor="area_g">Area in Ganda</Label>
                            <Input
                            id="area_g"
                            type="number"
                            {...register("area_g", { required: "Ganda is a required field" })}
                            placeholder="Enter Area Ganda"
                            value={areaGanda}
                            onInput={(e: any) => setAreaGanda(e.currentTarget.value)}
                            />
                            {errors.area_g && (
                            <p className="text-sm text-destructive">{errors.area_g.message}</p>
                            )}
                        </div>} */}

                            <div className="space-y-2">
                                <Label htmlFor="patta_no">Patta No. (Existing)</Label>
                                <Input
                                    id="patta_no"
                                    type="text"
                                    placeholder="Enter Patta No"
                                    value={originalPattaNo}
                                    onInput={(e: any) => setOriginalPattaNo(e.currentTarget.value)}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="patta_type_code">Patta Type (Existing)</Label>
                                <select
                                    id="patta_type_code"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={originalPattaTypeCode}
                                    onChange={(e: any) => setOriginalPattaTypeCode(e.currentTarget.value)}
                                    disabled
                                >
                                    <option value="">Select Patta Type</option>
                                    {dharPattaTypes && dharPattaTypes.length > 0 && dharPattaTypes.map((dharPattaType, index) => <option key={index} value={dharPattaType.type_code}>{dharPattaType.patta_type}</option>)}

                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="patta_no">Patta No. (Current)</Label>
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
                                <Label htmlFor="patta_type_code">Patta Type (Current)</Label>
                                <select
                                    id="patta_type_code"
                                    // {...register("patta_type_code", { required: "Patta Type is a required field!" })}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={pattaTypeCode}
                                    onChange={(e: any) => setPattaTypeCode(e.currentTarget.value)}
                                    disabled
                                >
                                    <option value="">Select Patta Type</option>
                                    {dharPattaTypes && dharPattaTypes.length > 0 && dharPattaTypes.map((dharPattaType, index) => <option key={index} value={dharPattaType.type_code}>{dharPattaType.patta_type}</option>)}

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="pattadars">Pattadars</Label>

                                <Select
                                    isMultiple
                                    value={pattadars}
                                    onChange={handlePattadarSelect}
                                    options={dharPattadars}
                                    primaryColor="blue"

                                />
                                {/* <select 
                                id="pattadars"
                                {...register("pattadars", { required: "Pattadars is a required field!" })}
                                // className="w-full border rounded px-3 py-2 mt-1" 
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={pattadars} 
                                onChange={(e: any) => setPattadars(e.currentTarget.value)}
                                multiple
                            >
                                <option value="">Select Pattadars</option>
                                <option value="">Select Pattadars</option>
                                <option value="">Select Pattadars</option>

                                
                            </select> */}
                                {/* {errors.pattadars && (
                            <p className="text-sm text-destructive">{errors.pattadars.message}</p>
                            )} */}
                            </div>
                        </div>


                        {/* <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                        id="priority"
                        // {...register("priority", { required: "Priority is required" })}
                        placeholder="Enter priority (High/Medium/Low)"
                    />
                    {errors.priority && (
                        <p className="text-sm text-destructive">{errors.priority.message}</p>
                    )}
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        {...register("description", { required: "Description is required" })}
                        placeholder="Enter description"
                        rows={4}
                    />
                    {errors.description && (
                        <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                    </div> */}

                        {!updateButton && <div className="flex justify-end space-x-4">
                            <Button type="submit" className="">
                                Submit
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
                            {/* <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={handlePartDagDelete}>Delete</Button> */}
                        </div>}

                    </form>
                    {finalPartDag && finalPartDag !== '' && <div>
                        <div className="mt-4">
                            <Card className="w-full">
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle>Possessors</CardTitle>
                                    <Button type="button" id={finalPartDag} className="" onClick={modalOpen}>
                                        Add Possessor
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm text-left text-gray-700">
                                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                                <tr>
                                                    <th className="px-4 py-3">
                                                        Possessor Name
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Possessor Guardian's Name
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Possessor Relation with Guardian
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Possessor Relation with Pattadar
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Particulars of transaction/mode of acquisition by Possessor
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Remarks
                                                    </th>
                                                    <th className="px-4 py-3">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {possessors && possessors.length > 0 && possessors.map((possessor, index) => <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2">
                                                        {possessor.name}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {possessor.guard_name}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {possessor.guard_relation_name}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {possessor.pattadar_relation_name}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {possessor.mode_of_acquisition_name}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {possessor.remarks}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Button className="bg-red-500 hover:bg-red-600 text-white" value={`${possessor.dist_code}-${possessor.subdiv_code}-${possessor.cir_code}-${possessor.mouza_pargona_code}-${possessor.lot_no}-${possessor.vill_townprt_code}-${possessor.old_dag_no}-${possessor.part_dag}-${possessor.possessor_id}`} onClick={deletePossessor}>Delete</Button>
                                                    </td>
                                                </tr>)}
                                                {(!possessors || possessors.length < 1) && <tr className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2">
                                                        No data available
                                                    </td>
                                                </tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>}
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
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                        <div className="space-y-2">
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
                                        </div>
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
                                        {/* <div className="space-y-2">
                                        <Label htmlFor="possessor_tenant_name">Tenant Name</Label>
                                        <Input
                                        id="possessor_tenant_name"
                                        type="text"
                                        placeholder="Possessor Tenant Name"
                                        value={posTenantName}
                                        onInput={(e: any) => setPosTenantName(e.currentTarget.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="possessor_tenant_father_name">Tenant's Father Name</Label>
                                        <Input
                                        id="possessor_tenant_father_name"
                                        type="text"
                                        placeholder="Possessor Tenant Father Name"
                                        value={posTenantFatherName}
                                        onInput={(e: any) => setPosTenantFatherName(e.currentTarget.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="possessor_tenant_address">Tenant's Address</Label>
                                        <Input
                                        id="possessor_tenant_address"
                                        type="text"
                                        placeholder="Possessor Tenant Address"
                                        value={posTenantAddress}
                                        onInput={(e: any) => setPosTenantAddress(e.currentTarget.value)}
                                        />
                                    </div> */}
                                        {/* <div className="space-y-2">
                                        <Label htmlFor="possessor_tenant">Tenant</Label>
                                        <Select
                                            isMultiple
                                            value={posTenants}
                                            onChange={handleTenantSelect}
                                            options={dharTenants}
                                            primaryColor="blue"
                                            placeholder="Tenant Name (Tenant Father) - Tenant Type"
                                        />
                                       
                                    </div> */}
                                        {/* <div className="space-y-2">
                                        <Label htmlFor="possessor_tenant_relation">Relation of Possessor with Tenant</Label>
                                        <select 
                                            id="possessor_tenant_relation"
                                            // {...register("curr_land_use", { required: "Current Land Class Use is required" })}
                                            className="w-full border rounded px-3 py-2 mt-1" 
                                            value={posTenantRelation} 
                                            onChange={(e: any) => setPosTenantRelation(e.currentTarget.value)}
                                        >
                                            <option value="">Select Relation</option>
                                            <option value="f">পিতৃ</option>
                                            <option value="m">মাতৃ</option>
                                            <option value="h">পতি</option>
                                            <option value="w">পত্নী</option>
                                            <option value="u">অভিভাৱক</option>
                                        </select>
                                    </div> */}
                                        {/* <div className="space-y-2">
                                        <Label htmlFor="possessor_tenant_type">Tenant Type</Label>
                                        <select 
                                            id="possessor_tenant_type"
                                            // {...register("curr_land_use", { required: "Current Land Class Use is required" })}
                                            className="w-full border rounded px-3 py-2 mt-1" 
                                            value={posTenantType} 
                                            onChange={(e: any) => setPosTenantType(e.currentTarget.value)}
                                        >
                                            <option value="00">None</option>
                                            <option value="01">স্থায়ী ৰায়ত</option>
                                            <option value="02">অস্থায়ী ৰায়ত</option>
                                            <option value="03">অন্যান্য</option>
                                            
                                        </select>
                                    </div> */}
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

                            {/* <h2 className="text-lg font-bold mb-4">Modal Title</h2>
                        <p className="text-gray-600 mb-6">
                        This is a simple modal built with React + TailwindCSS.
                        </p> */}

                            <button
                                onClick={submitPossessor}
                                className="px-4 py-2 my-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>}
                </div>
                ) : (<div className="flex items-center justify-center p-7">
                    <p className="font-bold text-lg">No data available</p>
                </div>)}
            <Toaster position="top-center" />
            <Loader loading={loading} />
        </>
    );
};

export default PartDagEntryForm;