import { toast } from "react-hot-toast";

export const validatePossessorForm = (possessor: any, pos_no = 1) => {
    console.log(possessor);
    const errors: { type: string; msg: string }[] = [];

    // Validate possessor name
    if (!possessor.name || possessor.name.trim() === "") {
        errors.push({ type: "name", msg: "Possessor name is required for possessor " + pos_no });
    }

    // Validate guardian name
    if (!possessor.guardianName || possessor.guardianName.trim() === "") {
        errors.push({ type: "guardianName", msg: "Guardian name is required for possessor " + pos_no });
    }

    // Validate guardian relation
    if (!possessor.guardianRelation || possessor.guardianRelation.trim() === "") {
        errors.push({ type: "guardianRelation", msg: "Guardian relation is required for possessor " + pos_no });
    }

    // Validate gender
    if (!possessor.gender || possessor.gender.trim() === "") {
        errors.push({ type: "gender", msg: "Gender is required for possessor " + pos_no });
    }

    // Validate mobile number (10 digits, no country code)
    const mobileRegex = /^[0-9]{10}$/;
    if (!possessor.mobileNo || possessor.mobileNo.trim() === "" || !mobileRegex.test(possessor.mobileNo)) {
        errors.push({ type: "mobileNo", msg: "Mobile number must be 10 digits for possessor " + pos_no });
    }

    // Validate email (optional, but valid format if provided)
    if (possessor.email && !/\S+@\S+\.\S+/.test(possessor.email)) {
        errors.push({ type: "email", msg: "Please enter a valid email address for possessor " + pos_no });
    }

    // Validate Aadhaar number (12 digits)
    const aadhaarRegex = /^[0-9]{12}$/;
    if (possessor.adhaar && !aadhaarRegex.test(possessor.adhaar)) {
        errors.push({ type: "adhaar", msg: "Aadhaar number must be 12 digits for possessor " + pos_no });
    }

    // Document Validation
    if (possessor.documents && possessor.documents.length > 0) {
        possessor.documents.forEach((doc: any, docIndex: number) => {
            // Validate document name
            if (!doc.document_name || doc.document_name.trim() === "") {
                errors.push({ type: `document_name_${docIndex}`, msg: `Document name is required for document ${docIndex + 1} for possessor ${pos_no}` });
            }

            // Validate document number
            if (!doc.document_no || doc.document_no.trim() === "") {
                errors.push({ type: `document_no_${docIndex}`, msg: `Document number is required for document ${docIndex + 1} for possessor ${pos_no}` });
            }

            // Validate document issue date
            if (!doc.document_issue_date || doc.document_issue_date.trim() === "") {
                errors.push({ type: `document_issue_date_${docIndex}`, msg: `Document issue date is required for document ${docIndex + 1} for possessor ${pos_no}` });
            }

            // Validate document file upload
            if (!doc.file) {
                errors.push({ type: `document_file_${docIndex}`, msg: `Document file is required for document ${docIndex + 1} for possessor ${pos_no}` });
            }
        });
    } 

    // If there are any validation errors, show them via toast
    if (errors.length > 0) {
        errors.forEach((err) => toast.error(err.msg));
        return false;
    }

    // If everything is valid, return true
    return true;
};




export const validatePartDagSubmitForm = (formData: FormData) => {
    const errors: { type: string; msg: string }[] = [];

    // Get form field values
    const finalPartDag = formData.get("part_dag");
    const currLandClass = formData.get("land_class_code");

    // Validate finalPartDag field
    if (!finalPartDag || finalPartDag === "") {
        errors.push({ type: "part_dag", msg: "Please set part dag no" });
    }

    // Validate currLandClass field
    if (!currLandClass || currLandClass === "") {
        errors.push({ type: "land_class", msg: "Land Class is required" });
    }

    // If there are any validation errors, show them via toast
    if (errors.length > 0) {
        errors.forEach((err) => toast.error(err.msg));
        return false;
    }

    // If everything is valid, return true
    return true;
};
