import { create } from "zustand";

import ApiService from "@/services/ApiService"; // adjust path
import { toast, Toaster } from "react-hot-toast";
import { persist } from "zustand/middleware"

interface Pattadar {
    pdar_name: string;
    pdar_father_name: string;
    pdar_add1: string;
    pdar_add2: string;
    value: string;
    label: string;
}

interface Tenant {
    dist_code: string;
    subdiv_code: string;
    cir_code: string;
    mouza_pargona_code: string;
    lot_no: string;
    vill_townprt_code: string;
    dag_no: string;

    tenant_name: string;
    tenants_father: string;
    tenants_add1: string;
    tenants_add2?: string | null;
    tenants_add3?: string | null;

    type_of_tenant: string;
    khatian_no: string;
    revenue_tenant: string; // looks numeric but API returns as string
    crop_rate?: string | null;

    user_code: string;
    date_entry: string; // ISO date string
    operation: string;
    tenant_id: string;

    duration?: string | null;
    paid_cash_kind: string;
    payable_cash_kind: string;
    special_conditions: string;
    status?: string | null;
    tenant_status: string;
    remarks: string;

    bigha: string;
    katha: string;
    lessa: string;
    ganda: string;
    kranti: string;

    uuid: string;
    updated_date?: string | null;
    old_khatian_no?: string | null;
    p_flag?: string | null;
}


interface PartDag {
    part_dag: string;
    survey_no: string;
    name: string;
    id: string;
    dag_area_sqmtr: number;
    old_dag_no: string;
    current_land_class: string;
    current_land_class_ass: string;
    patta_type: string;
    patta_no: string;
    from_bhunaksha: number;
    location: string;
}

interface LandClass {
    class_code: string;
    land_type: string;
}

interface LandGroup {
    id: string;
    name: string;
    name_ass: string;
    sort_id: number;
    land_class_code: string;
    landclass_category_id: string;
}

interface PattaType {
    type_code: string;
    patta_type: string;
}

interface DharitreeData {
    dist_code: string;
    subdiv_code: string;
    cir_code: string;
    mouza_pargana_code: string;
    lot_no: string;
    vill_townprt_code: string;
    dag_no: string;
    dag_no_int: number;
    land_class_code: string;
    land_type: string;
    patta_no: string;
    patta_type_code: string;
    patta_type: string;
    dag_revenue: string;
    dag_local_tax: string;
    dag_area_b: string;
    dag_area_k: string;
    dag_area_lc: string;
    dag_area_g: string;
    dag_area_kr: string;
}

interface DagState {
    isLoading: boolean;
    vill: string | null;
    dagNo: string | null;
    partDags: PartDag[];
    dharPattadars: Pattadar[];
    dharTenants: Tenant[];
    dharDagData: DharitreeData | null;
    getData: (dagNo: string, vill: string) => Promise<void>;
    resetDagData: () => void;
    setDagNo: (dagNo: string) => void;
    getCreatedPartDags: () => PartDag[];
    setLoading: (loading: boolean) => void;
}

interface TransferType { value: string; label: string }

interface FilterLocationState{
    distCode: string;
    subdivCode: string;
    cirCode: string;
    mouzaPargonaCode: string;
    lotNo: string;
    villTownprtCode: string;
    surveyFormMode: string;
    districts: any[];
    circles: any[];
    mouzas: any[];
    lots: any[];
    villages: any[];
    setDistCode: (code: string) => void;
    setSubdivCode: (code: string) => void;
    setCirCode: (code: string) => void;
    setMouzaPargonaCode: (code: string) => void;
    setLotNo: (lot: string) => void;
    setVillTownprtCode: (vill: string) => void;
    setSurveyFormMode: (mode: string) => void;
    setDistricts: (districts: any[]) => void;
    setCircles: (circles: any[]) => void;
    setMouzas: (mouzas: any[]) => void;
    setLots: (lots: any[]) => void;
    setVillages: (villages: any[]) => void;
}

export const useDagStore = create<DagState>()(
    persist(
        (set, get) => ({
            isLoading: false,
            vill: '',
            dagNo: '',
            partDags: [],
            dharPattadars: [],
            dharTenants: [],
            dharDagData: null,
            getCreatedPartDags: () => {
                return get().partDags.filter(dag => dag.from_bhunaksha !== 1);
            },
            getData: async (dagNo: string, vill: string) => {
                set({ vill: vill, dagNo: dagNo, isLoading: true });

                try {
                    const data = {
                        vill_townprt_code: vill,
                        dag_no: dagNo,
                    };

                    const response = await ApiService.get("get-dag-data", JSON.stringify(data));
                    set({ isLoading: false });

                    if (response.status !== "y") {
                        toast.error(response.msg);
                        return;
                    }

                    const resp = response.data;

                    set({
                        partDags: resp.part_dags || [],
                        dharPattadars: resp.dhar_pattadars || [],
                        dharTenants: resp.dhar_tenants || [],
                        dharDagData: resp.dhar_dag || null,
                    });
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to fetch DAG data");
                    set({ isLoading: false });
                }
            },
            resetDagData: () => set({ vill: '', dagNo: '', partDags: [], dharPattadars: [], dharTenants: [], dharDagData: null }),
            setDagNo: (dagNo: string) => set({ dagNo: dagNo }),
            setLoading: (loading: boolean) => set({ isLoading: loading })
        }),
        {
            name: 'dag-data-storage', // key in localStorage
        }
    )
);

interface MasterDataState {
    isLoadingMaster: boolean,
    distCode: string | null,
    landClasses: LandClass[];
    landGroups: LandGroup[];
    pattaTypes: PattaType[];
    transferTypes: TransferType[];
    getMasterData: (distCode: string) => Promise<void>;
}

export const useMasterDataStore = create<MasterDataState>()(
    persist(
        (set, get) => ({
            isLoadingMaster: false,
            distCode: '',
            landClasses: [],
            landGroups: [],
            pattaTypes: [],
            transferTypes: [],
            clearMasterStore: () =>
                set({
                    landClasses: [],
                    landGroups: [],
                    pattaTypes: [],
                    transferTypes: [],
                }),
            getMasterData: async (distCode: string) => {
                set({ distCode: distCode, isLoadingMaster: true });

                try {
                    const data = {
                        dist_code: distCode
                    };

                    const response = await ApiService.get("get-master-data", JSON.stringify(data));
                    set({ isLoadingMaster: false });

                    if (response.status !== "y") {
                        toast.error(response.msg);
                        return;
                    }

                    const resp = response.data;

                    set({
                        landClasses: resp.land_classes || [],
                        landGroups: resp.land_groups || [],
                        pattaTypes: resp.patta_types || [],
                        transferTypes: resp.transfer_types || [],
                    });
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to fetch master data");
                    set({ isLoadingMaster: false });
                }
            },
        }),
        {
            name: 'master-data-storage', // key in localStorage
        }
    )
);


export const FilterLocationStore = create<FilterLocationState>()(
    persist(
        (set) => ({
            distCode: '',
            subdivCode: '',
            cirCode: '',
            mouzaPargonaCode: '',
            lotNo: '',
            villTownprtCode: '',
            districts: [],
            circles: [],
            mouzas: [],
            lots: [],
            villages: [],
            surveyFormMode: 'reference',
            setDistCode: (code: string) => set({ distCode: code }),
            setSubdivCode: (code: string) => set({ subdivCode: code }),
            setCirCode: (code: string) => set({ cirCode: code }),
            setMouzaPargonaCode: (code: string) => set({ mouzaPargonaCode: code }),
            setLotNo: (lot: string) => set({ lotNo: lot }),
            setVillTownprtCode: (vill: string) => set({ villTownprtCode: vill }),
            setSurveyFormMode: (mode: string) => set({ surveyFormMode: mode }),
            setDistricts: (districts: any[]) => set({ districts }),
            setCircles: (circles: any[]) => set({ circles }),
            setMouzas: (mouzas: any[]) => set({ mouzas }),
            setLots: (lots: any[]) => set({ lots }),
            setVillages: (villages: any[]) => set({ villages }),
        }),
        {
            name: 'filter-location-storage', // key in localStorage
        }
    )
);
