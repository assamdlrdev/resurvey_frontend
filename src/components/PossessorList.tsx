"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import {ConfirmDialog} from "@/components/ui/confirm-dialog"; 
import Constants from "@/config/Constants";

export default function PossessorsList({
  possessors,
  deletePossessor,
}: {
  possessors: any[];
  deletePossessor: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const handleDetails = (p: any) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <>
      {/* Table View (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border rounded-lg bg-white text-sm md:text-base text-gray-800">
          <thead>
            <tr className="bg-medical-50">
              <th className="px-2 py-2 border text-start font-medium">Possessor Name</th>
              <th className="px-2 py-2 border text-start font-medium">Mobile No</th>
              <th className="px-2 py-2 border text-start font-medium">Guardian&apos;s Name</th>
              <th className="px-2 py-2 border text-start font-medium">Remarks</th>
              <th className="px-2 py-2 border text-end font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {possessors?.length ? (
              possessors.map((p, i) => (
                <tr key={i} className="hover:bg-medical-50 transition-colors">
                  <td className="px-2 py-2 border text-start">{p.name || "N/A"}</td>
                  <td className="px-2 py-2 border text-start">{p.mobile_no || "N/A"}</td>
                  <td className="px-2 py-2 border text-start">{p.guard_name || "N/A"}</td>
                  <td className="px-2 py-2 border text-start">{p.remarks || "N/A"}</td>
                  <td className="px-2 py-2 border">
                    <div className="flex justify-end gap-2">
                      {/* Details Button */}
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1"
                        type="button"
                        onClick={() => handleDetails(p)}
                      >
                        Details
                      </Button>

                      {/* Delete Button with confirm */}
                      <ConfirmDialog
                        trigger={
                          <Button type="button" className="bg-red-600 hover:bg-red-700 text-white">
                            Delete
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-medical-500">
                  📭 No possessors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card View (Mobile) */}
      <div className="md:hidden space-y-3">
        {possessors?.length ? (
          possessors.map((p, i) => (
            <div key={i} className="border rounded-lg p-3 shadow-sm bg-white space-y-1">
              <p>
                <span className="font-semibold">Possessor:</span> {p.name}
              </p>
              <p>
                <span className="font-semibold">Guardian:</span> {p.guard_name}
              </p>
              <p>
                <span className="font-semibold">Remarks:</span> {p.remarks || "N/A"}
              </p>

              <div className="flex justify-end gap-2 pt-2">
                {/* Details Button */}
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1"
                  type="button"
                  onClick={() => handleDetails(p)}
                >
                  Details
                </Button>

                {/* Delete Button */}
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1 flex items-center gap-1"
                  value={`${p.dist_code}-${p.subdiv_code}-${p.cir_code}-${p.mouza_pargona_code}-${p.lot_no}-${p.vill_townprt_code}-${p.old_dag_no}-${p.part_dag}-${p.possessor_id}`}
                  onClick={(e) => deletePossessor(e.currentTarget.value)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">📭 No possessors found</p>
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
