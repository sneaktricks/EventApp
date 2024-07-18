"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import TextField from "@/app/components/common/input/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ActionResponse, submitParticipation } from "@/app/lib/actions";
import { participationCreateSchema } from "@/app/lib/schemas";
import { IParticipationCreate } from "@/app/lib/definitions";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import WideButton from "@/app/components/common/input/WideButton";

export interface ParticipationFormProps {
  eventId: string;
}

const ParticipationForm = (props: ParticipationFormProps) => {
  const form = useForm<IParticipationCreate>({
    mode: "all",
    resolver: zodResolver(participationCreateSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResponse, setSubmitResponse] = useState<ActionResponse | null>(
    null
  );

  const onSubmitAction: SubmitHandler<IParticipationCreate> = async (data) => {
    setIsSubmitting(true);
    setSubmitResponse(null);
    const response = await submitParticipation(props.eventId, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });
    window.alert(response.message);
    setSubmitResponse(response);
    setIsSubmitting(false);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmitAction)}>
        <div className="grid gap-2">
          <TextField
            label="First Name"
            maxLength={50}
            placeholder="Enter your first name here"
            error={form.formState.errors.firstName}
            {...form.register("firstName", { maxLength: 50 })}
          />
          <TextField
            label="Last Name"
            maxLength={50}
            placeholder="Enter your last name here"
            error={form.formState.errors.lastName}
            {...form.register("lastName", { maxLength: 50 })}
          />
          <TextField
            label="Email"
            maxLength={100}
            placeholder="Enter your email here"
            error={form.formState.errors.email}
            {...form.register("email", { maxLength: 100 })}
          />
          <div className="grid gap-1 my-2">
            <WideButton
              type="submit"
              label={isSubmitting ? "Submitting..." : "Submit"}
              disabled={isSubmitting}
            />
            {!!submitResponse && (
              <div className="flex flex-row space-x-1 grow items-center text-xs text-red-600">
                <div className="h-4 w-4">
                  <ExclamationCircleIcon />
                </div>
                <div>{submitResponse.message}</div>
              </div>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ParticipationForm;
