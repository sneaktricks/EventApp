"use client";

import Button from "@/app/components/common/Button";
import { useState } from "react";
import { ActionResponse, deleteParticipation } from "@/app/lib/actions";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { AlertStyle, IParticipation } from "@/app/lib/definitions";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export interface ParticipationEditFormProps {
  participationData: IParticipation;
}

const ParticipationEditForm = ({
  participationData,
}: ParticipationEditFormProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteResponse, setDeleteResponse] = useState<ActionResponse | null>(
    null
  );

  const onDeleteAction = async () => {
    setIsDeleting(true);
    setDeleteResponse(null);
    const response = await deleteParticipation(participationData.id);
    setDeleteResponse(response);
    setIsDeleting(false);
  };

  return (
    <div>
      <div>First name: {participationData.firstName}</div>
      <div>Last name: {participationData.lastName}</div>
      <div>Email: {participationData.email}</div>
      <div className="grid gap-1 my-2">
        <div>
          <Button
            type="button"
            alertStyle={AlertStyle.Error}
            icon={<XMarkIcon />}
            label={isDeleting ? "Unparticipating..." : "Unparticipate"}
            onClick={onDeleteAction}
            disabled={isDeleting}
          />
        </div>
        {!!deleteResponse && (
          <div className="flex flex-row space-x-1 grow items-center text-xs text-red-600">
            <div className="h-4 w-4">
              <ExclamationCircleIcon />
            </div>
            <div>{deleteResponse.message}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipationEditForm;
