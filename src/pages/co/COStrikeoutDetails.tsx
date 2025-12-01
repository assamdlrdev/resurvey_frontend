import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Textarea } from "@/components/ui/textarea";
import Constants from "@/config/Constants";
import ApiService from "@/services/ApiService";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

interface CaseDetailsType {
    mouza_pargona_name: string;
    lot_name: string;
    vill_townprt_name: string;
    patta_type_name: string;
    patta_no: string;
};


const COStrikeoutDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(false);

    const [caseNo, setCaseNo] = useState<string>('');
    const [caseDetails, setCaseDetails] = useState<CaseDetailsType>(null);
    const [casePattadars, setCasePattadars] = useState<any[]>([]);
    const [casePetitioners, setCasePetitioners] = useState<any[]>([]);
    const [caseDocs, setCaseDocs] = useState<any[]>([]);
    const [remarks, setRemarks] = useState<string>('');

    useEffect(() => {
        getUrlParams();
    }, [location]);

    useEffect(() => {
        if(caseNo && caseNo != '') {
            getCaseData();
        }
    }, [caseNo]);


    const goTo = (url: string) => {
        navigate(url);
    };

    const getCaseData = async () => {
        const data = {
            case_no: caseNo
        };

        setLoading(true);
        const response = await ApiService.get('get_co_strikeout_case', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        if(!response.data) {
            toast.error("Data Not Found");
            return;
        }

        setCaseDetails(response.data.strikeout_details);
        setCasePattadars(response.data.strikeout_pattadars);
        setCasePetitioners(response.data.strikeout_petitioners);
        setCaseDocs(response.data.strikeout_docs);
        

        console.log(response);
    };



    const getUrlParams = async () => {
        const params = new URLSearchParams(window.location.search);
        const case_no = params.get('case_no');
        if(case_no) {
            setCaseNo(case_no);
        }
        else {
            goTo('/co-strikeout');
        }
    };

    const submitCase = async () => {
        const data = {
            case_no: caseNo,
            remarks: remarks
        };

        setLoading(true);
        const response = await ApiService.get('co_strikeout_submit', JSON.stringify(data));
        setLoading(false);

        if (response.status !== 'y') {
            toast.error(response.msg);
            return;
        }

        toast.success(response.msg);

        // console.log(response);

        goTo('/co-strikeout');

        // console.log(response);
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
                                
                            </thead>
                            {(caseDetails && casePattadars && casePetitioners) ? (<tbody>
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
                                {casePetitioners && casePetitioners.length > 0 && <tr>
                                    <td colSpan={5} className="px-2 py-4 border text-center"><strong><p>Applicants</p></strong></td>
                                </tr>}
                                {casePetitioners && casePetitioners.length > 0 && <tr>
                                    <td colSpan={2} className="px-2 py-2 border text-center"><strong>Name </strong></td>
                                    <td colSpan={2} className="px-2 py-2 border text-center"><strong>Guardian Name </strong></td>
                                    <td colSpan={1} className="px-2 py-2 border text-center"><strong>Dag No </strong></td>
                                </tr>}
                                {casePetitioners && casePetitioners.length > 0 && casePetitioners.map((casePetition, index) => (<tr key={index}>
                                    <td colSpan={2} className="px-2 py-2 border text-center">{casePetition.pdar_name}</td>
                                    <td colSpan={2} className="px-2 py-2 border text-center">{casePetition.pdar_father}</td>
                                    <td colSpan={2} className="px-2 py-2 border text-center">{casePetition.dag_no}</td>
                                </tr>))}
                                {casePattadars && casePattadars.length > 0 && <tr>
                                    <td colSpan={5} className="px-2 py-4 border text-center"><strong><p>Pattadar to be Striked out</p></strong></td>
                                </tr>}
                                {casePattadars && casePattadars.length > 0 && <tr>
                                    <td colSpan={2} className="px-2 py-2 border text-center"><strong>Name </strong></td>
                                    <td colSpan={2} className="px-2 py-2 border text-center"><strong>Guardian Name </strong></td>
                                    <td colSpan={1} className="px-2 py-2 border text-center"><strong>Dag No </strong></td>
                                </tr>}
                                {casePattadars && casePattadars.length > 0 && casePattadars.map((casePattadar, index) => (<tr key={index}>
                                    <td colSpan={2} className="px-2 py-2 border text-center">{casePattadar.pdar_name}</td>
                                    <td colSpan={2} className="px-2 py-2 border text-center">{casePattadar.pdar_father}</td>
                                    <td colSpan={2} className="px-2 py-2 border text-center">{casePattadar.dag_no}</td>
                                </tr>))}
                                {caseDocs && caseDocs.length > 0 && <tr>
                                    <td colSpan={5} className="px-2 py-4 border text-center"><strong><p>Uploaded Documents</p></strong></td>
                                </tr>}
                                {caseDocs && caseDocs.length > 0 && caseDocs.map((caseDoc, index) => (
                                    <tr key={index}>
                                        <td colSpan={1} className="px-2 py-2 border text-center"><strong>{caseDoc.file_name == 'ID_PROOF' ? 'ID Proof' : caseDoc.file_name == 'RECEIPT' ? 'Land Revenue Receipt' : caseDoc.file_name == 'SELF_DECLARATION' ? 'Self Declaration' : 'Uploaded Docs'}</strong></td>
                                        <td colSpan={4} className="px-2 py-4 border text-center"><a className="bg-green-600 hover:bg-green-700 border-round p-2 text-white rounded-md" href={Constants.API_BASE_URL_ASSET + caseDoc.full_path} target="_blank">View</a></td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={5} className="px-2 py-4 border text-center"><strong><p>CO Remark</p></strong></td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="px-2 py-2 border text-center">
                                        <Textarea placeholder="Give a note..." id="remarks" value={remarks} onInput={(e: any) => setRemarks(e.currentTarget.value)} />
                                    </td>
                                </tr>
                            </tbody>) : (
                                <tbody>
                                    <tr>
                                        <td className="px-2 py-2 border text-center"><strong>No Data Available </strong></td>
                                    </tr>
                                </tbody>
                            )}
                            {/* <tbody>
                                {(caseDetails && casePattadars && casePetitioners) ? 
                                (<tr>

                                </tr>) : 
                                (<tr>
                                    <td className="px-2 py-2 border text-center"><strong>No Data Available </strong></td>
                                </tr>)}
                            </tbody> */}
                        </table>
                    </div>
                    {(caseDetails && casePattadars && casePetitioners) && <div className="py-3 text-center">
                        <ConfirmDialog
                            trigger={<Button className="bg-green-600 hover:bg-green-700">Submit</Button>}
                            title="Submit"
                            description="Are you sure you want to proceed to the updation of Chitha for Striking out Name?"
                            confirmText="Yes"
                            cancelText="No"
                            onConfirm={submitCase}
                            buttonStyle="green"
                        />
                    </div>}
                </div>
            </div>
            <Loader loading={loading} />
            <Toaster position="top-center" />
        </div>
    );
};

export default COStrikeoutDetails;