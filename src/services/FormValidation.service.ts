import { toast } from "react-hot-toast";

export const validatePossessorCreateForm = (data: any) => {
    var errors = [];

    if (!data.possessor_name || data.possessor_name == '') {
        errors.push({ type: 'posName', msg: 'Possessor Name is required!' });
    }
    if (!data.possessor_guardian_name || data.possessor_guardian_name == '') {
        errors.push({ type: 'posGuardianName', msg: 'Possessor Guardian Name is required!' });
    }
    if (!data.possessor_guardian_relation || data.possessor_guardian_relation == '') {
        errors.push({ type: 'posGuardianRelation', msg: 'Possessor Guardian Relation is required!' });
    }
    if (!data.possessor_mobile_no || data.possessor_mobile_no == '') {
        errors.push({ type: 'posMobileNo', msg: 'Possessor Mobile No is required!' });
    }
    if (!data.possessor_gender || data.possessor_gender == '') {
        errors.push({ type: 'posGender', msg: 'Possessor Gender is required!' });
    }
    //validate mobile no using regex
    const mobileNoPattern = /^[6-9]\d{9}$/;
    if (data.possessor_mobile_no && !mobileNoPattern.test(data.possessor_mobile_no)) {
        errors.push({ type: 'posMobileNo', msg: 'Invalid Mobile No!' });
    }
    if (errors.length > 0) {
        var error_msg = '';
        errors.forEach((err) => {
            error_msg += err.msg + ', ';
        });
        toast.error(error_msg);
        return false;
    }
    return true;
};
