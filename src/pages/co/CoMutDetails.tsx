import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import ApiService from "@/services/ApiService";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";


// interface CaseDataType {
//     case_details: any;
//     case_status: any;
//     dag_details: any[];
//     pattadars: any[];
//     petitioners: any[];
// };

interface CaseDetailsType {
    add_off_desig: string;
    add_off_name: string | null;
    case_no: string;
    cir_code: string;
    co_flag_date: null;
    co_flag_for_fresh_mut: null;
    date_entry: string;
    date_of_order: null;
    deed_value: string | null;
    dispose_reason: null;
    dispute_yn: string;
    dist_code: string;
    fee_collection: null;
    if_dispose_date: null;
    is_dispose: null;
    lot_name: string;
    lot_no: string;
    min_revenue: null;
    mouza_pargona_code: string;
    mouza_pargona_name: string;
    mut_type: string;
    noc_date: null;
    noc_no: null;
    operation: string;
    order_passed: null;
    p_consent: null;
    petition_no: string;
    possession_yn: string;
    rajah_adalat: string;
    reg_deed_date: string;
    reg_deed_no: string;
    report_date: string;
    sk_flag: null;
    sk_id: null;
    sk_note: null;
    sk_note_date: null;
    subdiv_code: string;
    trans_code: string;
    user_code: string;
    vill_townprt_code: string; 
    vill_townprt_name: string;
    year_no: string;
    patta_no: string;
    patta_type_code: string;
    patta_type_name: string;
    transfer_type: string;
}

interface CaseStatusType {
    case_no: string;
    co_order: string | null;
    date_of_hearing: string;
    note_on_order: string;
    status: string;
};

interface DagDetailsType {
    dag_area_b: string;
    dag_area_g: string;
    dag_area_k: string;
    dag_area_lc: string;
    dag_no: string;
    deed_date: string;
    deed_reg_no: string;
    deed_value: string;
    m_dag_area_b: string;
    m_dag_area_g: string;
    m_dag_area_k: string;
    m_dag_area_lc: string;
};

interface PetitionerType {
    pet_id: string;
    pet_name: string;
    guard_name: string;
    pdar_mobile: string;
    guard_rel: string;
    pet_gender: string;
    add1: string | null;
    add2: string | null;
    guard_rel_name: string;
    pet_gender_name: string;
};

interface PattadarType {
    dag_no: string;
    patta_no: string;
    patta_type_code: string;
    pdar_gender: string | null;
    pdar_guardian: string;
    pdar_id: string;
    pdar_name: string;
    pdar_rel_guar: string;
    striked_out: string;
};



const CoMutDetails: React.FC = () => {

    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);
    const [caseNo, setCaseNo] = useState<string>('');
    // const [caseData, setCaseData] = useState<CaseDataType>(null);
    const [caseDetails, setCaseDetails] = useState<CaseDetailsType>(null);
    const [caseStatus, setCaseStatus] = useState<CaseStatusType>(null);
    const [dagDetails, setDagDetails] = useState<DagDetailsType[]>([]);
    const [pattadars, setPattadars] = useState<any[]>([]);
    const [petitioners, setPetitioners] = useState<PetitionerType[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(location.pathname == '/co-mut-details') {
            getUrlParams();
        }
    }, [location]);

    useEffect(() => {
        if(caseNo != '') {
            getCaseData();
        }
        
    }, [caseNo]);

    const goTo = (url: string) => {
        navigate(url);
    };

    // useEffect(() => {
    //     console.log(caseData);
    // }, [caseData]);

    const getUrlParams = async() => {
        const params = new URLSearchParams(window.location.search);
        const case_no = params.get('case_no');
        if(case_no) {
            setCaseNo(case_no);
        }
        else {
            goTo('/co-mutation');
        }
        
    };

    const getCaseData = async () => {
        const data = {
            case_no: caseNo
        };

        setLoading(true);
        const response = await ApiService.get('get_co_case', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        if(!response.data) {
            toast.error("Data Not Found");
            return;
        }

        console.log(response.data.case_details);

        setCaseDetails(response.data.case_details);
        setCaseStatus(response.data.case_status);
        setDagDetails(response.data.dag_details);
        setPattadars(response.data.pattadars);
        setPetitioners(response.data.petitioners);
    };

    const submitCase = async () => {
        const data = {
            case_no: caseNo
        };

        setLoading(true);
        const response = await ApiService.get('submit_co_case', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);

        console.log(response);

        goTo('/co-mutation');

        
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 p-4">
            <div className="sm:max-w-3xl lg:max-w-screen-2xl mx-auto space-y-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-medical-900 mb-2">Case No: {caseNo}</h1>
                </div>
                <div className="w-full bg-white rounded-lg shadow p-4 mb-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border rounded-lg bg-white">
                            <thead>
                                {/* <tr className="bg-medical-50">
                                    <th className="px-2 py-2 border">Case No</th>
                                    
                                </tr> */}
                            </thead>
                            {(caseDetails && caseStatus && dagDetails && pattadars && petitioners) ? (<tbody>
                                <tr>
                                    <td colSpan={5} className="px-2 py-4 border text-center"><strong><p>Location</p></strong></td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border text-center"><strong>Mouza </strong></td>
                                    <td className="px-2 py-2 border text-center"><strong>Lot </strong></td>
                                    <td className="px-2 py-2 border text-center"><strong>Village </strong></td>
                                    <td className="px-2 py-2 border text-center"><strong>Patta Type </strong></td>
                                    <td className="px-2 py-2 border text-center"><strong>Patta No </strong></td>
                                </tr>
                                <tr>
                                    <td className="px-2 py-2 border text-center">{caseDetails.mouza_pargona_name}</td>
                                    <td className="px-2 py-2 border text-center">{caseDetails.lot_name}</td>
                                    <td className="px-2 py-2 border text-center">{caseDetails.vill_townprt_name}</td>
                                    <td className="px-2 py-2 border text-center">{caseDetails.patta_type_name}</td>
                                    <td className="px-2 py-2 border text-center">{caseDetails.patta_no}</td>
                                </tr>
                                {dagDetails && dagDetails.length > 0 && <tr>
                                    <td colSpan={5} className="px-2 py-4 border text-center"><strong><p>Dag Details</p></strong></td>
                                </tr>}
                                {dagDetails && dagDetails.length > 0 && <tr>
                                    <td className="px-2 py-2 border text-center"><strong>Dag No </strong></td>
                                    <td colSpan={2} className="px-2 py-2 border text-center"><strong>Mutated Area </strong></td>
                                    <td colSpan={2} className="px-2 py-2 border text-center"><strong>Dag Area </strong></td>
                                </tr>}
                                {dagDetails && dagDetails.length > 0 && dagDetails.map((dagDetail, index) => (<tr key={index}>
                                    <td className="px-2 py-2 border text-center">{dagDetail.dag_no}</td>
                                    <td colSpan={2} className="px-2 py-2 border text-center">{`${dagDetail.m_dag_area_b}B - ${dagDetail.m_dag_area_k}K - ${dagDetail.m_dag_area_lc}L`}</td>
                                    <td colSpan={2} className="px-2 py-2 border text-center">{`${dagDetail.dag_area_b}B - ${dagDetail.dag_area_k}K - ${dagDetail.dag_area_lc}L`}</td>
                                </tr>))}
                                {petitioners && petitioners.length > 0 && <tr>
                                    <td colSpan={5} className="px-2 py-4 border text-center"><strong><p>Applicants</p></strong></td>
                                </tr>}
                                {petitioners && petitioners.length > 0 && <tr>
                                    <td className="px-2 py-2 border text-center"><strong>Name </strong></td>
                                    <td className="px-2 py-2 border text-center"><strong>Guardian Name </strong></td>
                                    <td className="px-2 py-2 border text-center"><strong>Mobile No </strong></td>
                                    <td className="px-2 py-2 border text-center"><strong>Guardian Relation </strong></td>
                                    <td className="px-2 py-2 border text-center"><strong>Gender </strong></td>
                                </tr>}
                                {petitioners && petitioners.length > 0 && petitioners.map((petitioner, index) => (
                                    <tr key={index}>
                                        <td className="px-2 py-2 border text-center">{petitioner.pet_name}</td>
                                        <td className="px-2 py-2 border text-center">{petitioner.guard_name}</td>
                                        <td className="px-2 py-2 border text-center">{petitioner.pdar_mobile}</td>
                                        <td className="px-2 py-2 border text-center">{petitioner.guard_rel_name}</td>
                                        <td className="px-2 py-2 border text-center">{petitioner.pet_gender_name}</td>
                                    </tr>
                                ))}
                                {pattadars && pattadars.length > 0 && <tr>
                                    <td colSpan={5} className="px-2 py-4 border text-center"><strong><p>Pattadars</p></strong></td>
                                </tr>}
                                {pattadars && pattadars.length > 0 && <tr>
                                        <td colSpan={2} className="px-2 py-2 border text-center"><strong>Name </strong></td>
                                        <td colSpan={2} className="px-2 py-2 border text-center"><strong>Guardian Name </strong></td>
                                        <td colSpan={1} className="px-2 py-2 border text-center"><strong>Inplace/Alongwith </strong></td>
                                </tr>}
                                {pattadars && pattadars.length > 0 && pattadars.map((pattadar, index) => (
                                    <tr key={index}>
                                        <td colSpan={2} className="px-2 py-2 border text-center">{pattadar.pdar_name}</td>
                                        <td colSpan={2} className="px-2 py-2 border text-center">{pattadar.pdar_guardian}</td>
                                        <td colSpan={1} className="px-2 py-2 border text-center">{(pattadar.striked_out == '1') ? 'Inplace' : 'Alongwith'}</td>
                                        {/* <td className="px-2 py-2 border text-center"><strong>Guardian Relation: </strong>{petitioner.guard_rel_name}</td>
                                        <td className="px-2 py-2 border text-center"><strong>Gender: </strong>{petitioner.pet_gender_name}</td> */}
                                    </tr>
                                ))}
                                {caseDetails && <tr>
                                    <td colSpan={5} className="px-2 py-4 border text-center"><strong><p>Other Details</p></strong></td>
                                </tr>
                                }
                                {caseDetails && <tr>
                                    <td colSpan={2} className="px-2 py-4 border text-center"><strong>Transfer Type: </strong>{caseDetails.transfer_type}</td>
                                    <td colSpan={1} className="px-2 py-4 border text-center"><strong>Rajah Adalat: </strong>{caseDetails.rajah_adalat == 'y' ? 'Yes' : 'No'}</td>
                                    <td colSpan={1} className="px-2 py-4 border text-center"><strong>Dispute: </strong>{caseDetails.dispute_yn == '0' ? 'No' : 'Yes'}</td>
                                    <td colSpan={1} className="px-2 py-4 border text-center"><strong>Applicant has Possession: </strong>{caseDetails.possession_yn == 'y' ? 'Yes' : 'No'}</td>
                                </tr>
                                }
                                {caseDetails && <tr>
                                    <td colSpan={2} className="px-2 py-4 border text-center"><strong>Deed No: </strong>{caseDetails.reg_deed_no}</td>
                                    <td colSpan={2} className="px-2 py-4 border text-center"><strong>Deed Date: </strong>{caseDetails.reg_deed_date}</td>
                                    <td colSpan={1} className="px-2 py-4 border text-center"><strong>Deed Value: </strong> {caseDetails.deed_value}</td>
                                </tr>
                                }
                            </tbody>) : (
                                <tbody>
                                    <tr>
                                        <td className="px-2 py-2 border text-center"><strong>No Data Available </strong></td>
                                    </tr>
                                </tbody>
                            )}

                        </table>
                    </div>
                    <div className="py-2">
                        <ConfirmDialog
                            trigger={<Button>Submit</Button>}
                            title="Submit"
                            description="Are you sure you want to proceed to the Auto updation of the mutation process?"
                            confirmText="Yes"
                            cancelText="No"
                            onConfirm={submitCase}
                        />
                        {/* <Button onClick={submitCase}>Submit</Button> */}
                    </div>
                    
                </div>
            </div>
            <Loader loading={loading} />
            <Toaster position="top-center" />
        </div>
    );
};

export default CoMutDetails;