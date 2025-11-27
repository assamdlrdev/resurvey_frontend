"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EyeIcon, PenIcon, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Constants from "@/config/Constants";

export default function PossessorsList({
  possessors,
  deletePossessor,
  onEditPossessor
}: {
  possessors: any[];
  deletePossessor: (id: string) => void;
  onEditPossessor: (possessor: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const handleDetails = (p: any) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <>
      {/* Grid View for Possessors (Mobile & Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {possessors?.length ? (
          possessors.map((p, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 p-5 flex flex-col space-y-4"
            >
              {/* Possessor Photo or Avatar */}
              <div className="flex justify-center mb-4">
                {p.photo_path ? (
                  <img
                    src={`${Constants.API_BASE_URL_ASSET}${p.photo_path}`}
                    alt={p.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white text-xl">
                    {p.name ? p.name.charAt(0) : "?"}
                  </div>
                )}
              </div>

              {/* Possessor Info */}
              <div className="text-gray-800 space-y-2">
                <p className="text-2xl font-semibold">{p.name || "N/A"}</p>
                <p className="text-sm">
                  <span className="font-medium">Guardian:</span> {p.guard_name || "N/A"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Mobile:</span> {p.mobile_no || "N/A"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Remarks:</span> {p.remarks || "N/A"}
                </p>
              </div>

              {/* Action Buttons (Always at the bottom) */}
              <div className="flex justify-end gap-3 mt-auto">
                {/* Details Button */}
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm transform hover:scale-105 transition-transform"
                  type="button"
                  onClick={() => handleDetails(p)}
                >
                  <EyeIcon className="h-5 w-5" />
                </Button>

                {/* Edit Button */}
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2 text-sm transform hover:scale-105 transition-transform"
                  type="button"
                  onClick={() => onEditPossessor(p)}
                >
                  <PenIcon className="h-5 w-5" />
                </Button>

                {/* Delete Button with Confirmation */}
                <ConfirmDialog
                  trigger={
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm transform hover:scale-105 transition-transform"
                      type="button"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  }
                  title="Delete Possessor"
                  description="This will permanently delete the possessor record. Are you sure?"
                  confirmText="Yes, delete"
                  cancelText="No, keep it"
                  onConfirm={() =>
                    deletePossessor(
                      `${p.dist_code}-${p.subdiv_code}-${p.cir_code}-${p.mouza_pargona_code}-${p.lot_no}-${p.vill_townprt_code}-${p.old_dag_no}-${p.part_dag}-${p.possessor_id}`
                    )
                  }
                />
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">📭 No possessors found</p>
        )}
      </div>



      {/* Details Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Possessor Details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              {/* Possessor Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Name:</strong> {selected.name}</div>
                <div><strong>Guardian:</strong> {selected.guard_name}</div>
                <div><strong>Relation:</strong> {selected.guard_relation_name}</div>
                <div><strong>Mode of Acquisition:</strong> {selected.mode_of_acquisition_name}</div>
                <div><strong>Mutation Name:</strong> {selected.mut_possessor_name}</div>
                <div><strong>Father for Mutation:</strong> {selected.mut_possessor_father_name}</div>
                <div><strong>Address for Mutation:</strong> {selected.mut_possessor_address}</div>
                <div><strong>Gender:</strong> {selected.gender}</div>
                <div><strong>Mobile No:</strong> {selected.mobile_no}</div>
                <div><strong>Aadhaar:</strong> {selected.aadhaar_no}</div>
                <div><strong>DOB:</strong> {selected.dob}</div>
                <div><strong>Remark:</strong> {selected.remarks}</div>
              </div>

              {/* Photo */}
              {selected.photo_path && (
                <div>
                  <strong>Photo:</strong>
                  <div className="mt-2 w-32 h-32 border rounded overflow-hidden">
                    <img
                      src={`${Constants.API_BASE_URL_ASSET}${selected.photo_path}`}
                      alt="Possessor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <strong className="block mb-2">Ownership Documents:</strong>
                {selected.ownership_documents?.length ? (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selected.ownership_documents.map((doc: any, idx: number) => (
                      <li key={idx} className="flex flex-col border rounded-md p-2">
                        <span>
                          <strong>{doc.document_name}</strong> ({doc.document_no})
                        </span>
                        <span>{doc.issuing_authority}</span>
                        <span>{doc.issuing_address}</span>
                        <span>Issued: {doc.document_issue_date}</span>
                        {doc.file_path && (
                          <a
                            href={`${Constants.API_BASE_URL_ASSET}${doc.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs"
                          >
                            View Document
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No documents uploaded.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
