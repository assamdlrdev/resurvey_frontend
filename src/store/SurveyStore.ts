import { create } from "zustand";
import ApiService from "@/services/ApiService"; // adjust path
import { toast, Toaster } from "react-hot-toast";

interface Pattadar {
    pdar_name: string;
    pdar_father_name: string;
    pdar_add1: string;
    pdar_add2: string;
}

interface PartDag {
    part_dag: string;
    name: string;
    id: string;
    dag_area_sqmtr: number;
}

interface LandClass {
    class_code: string;
    land_type: string;
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
    landClasses: LandClass[];
    pattaTypes: PattaType[];
    pattadars: Pattadar[];
    dharDagData: DharitreeData | null;
    getData: (dagNo: string, vill: string) => Promise<void>;
    resetDagData: () => void;
    setDagNo: (dagNo: string) => void;
}

export const useDagStore = create<DagState>((set) => ({
    isLoading: false,
    vill: null,
    dagNo: null,

    partDags: [],
    landClasses: [],
    pattaTypes: [],
    pattadars: [],
    dharDagData: null,

    getData: async (dagNo: string, vill: string) => {
        set({ vill: vill, dagNo: dagNo, isLoading: true });

        try {
            const data = {
                vill_townprt_code: vill,
                dag_no: dagNo,
            };

            const response = await ApiService.get("get_dag_data", JSON.stringify(data));
            set({ isLoading: false });

            if (response.status !== "y") {
                toast.error(response.msg);
                return;
            }

            const resp = response.data;

            set({
                partDags: resp.part_dags || [],
                landClasses: resp.land_classes || [],
                pattaTypes: resp.patta_types || [],
                pattadars: resp.pattadars || [],
                dharDagData: resp.dharitree_data || null,
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch DAG data");
            set({ isLoading: false });
        }
    },
    resetDagData: () => set({ vill: null, dagNo: null, partDags: [], landClasses: [], pattaTypes: [], pattadars: [], dharDagData: null }),
    setDagNo: (dagNo: string) => set({ dagNo: dagNo })
}));
