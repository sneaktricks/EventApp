"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import TextField from "@/app/components/common/input/TextField";
import TextArea from "@/app/components/common/input/TextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimeField from "@/app/components/common/input/DateTimeField";
import Button from "@/app/components/common/Button";
import { useEffect, useState } from "react";
import { ActionResponse, createEvent } from "@/app/lib/actions";
import Checkbox from "@/app/components/common/input/Checkbox";
import NumberInput from "@/app/components/common/input/NumberInput";
import RadioGroup from "@/app/components/common/input/RadioGroup";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { eventCreateFormSchema } from "@/app/lib/schemas";
import { IEventInputs } from "@/app/lib/definitions";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

const EventForm = () => {
  const form = useForm<IEventInputs>({
    mode: "all",
    resolver: zodResolver(eventCreateFormSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResponse, setSubmitResponse] = useState<ActionResponse | null>(
    null
  );

  const onSubmitAction: SubmitHandler<IEventInputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitResponse(null);
    console.log(data);
    const response = await createEvent({
      name: data.name,
      description: data.description,
      location: data.location,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      participationEndsAt: data.participationEndsAt,
      participationStartsAt: data.participationStartsAt,
      participantLimit: data.hasParticipantLimit ? data.participantLimit : null,
      visibility: data.visibility,
      expiresAt: data.expiresAt,
    });
    setSubmitResponse(response);
    setIsSubmitting(false);
  };
  const hasParticipantLimitValue = form.watch("hasParticipantLimit", false);
  useEffect(() => {
    if (!hasParticipantLimitValue) form.unregister("participantLimit");
    else form.register("participantLimit");
  }, [hasParticipantLimitValue]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmitAction)}>
        <div className="grid gap-5">
          <TextField
            label="What shall we call your event? Enter a title."
            maxLength={50}
            placeholder="Enter a title"
            error={form.formState.errors.name}
            {...form.register("name", { maxLength: 50 })}
          />
          <TextArea
            label="Describe your event."
            maxLength={3000}
            placeholder="Type a description here"
            error={form.formState.errors.description}
            {...form.register("description", { maxLength: 3000 })}
          />
          <TextField
            label="Where is your event organized? Enter a location."
            maxLength={100}
            placeholder="Enter a location"
            error={form.formState.errors.location}
            {...form.register("location", { maxLength: 100 })}
          />
          <DateTimeField
            label="When does your event start? Enter a date and time."
            error={form.formState.errors.startsAt}
            {...form.register("startsAt")}
          />
          <DateTimeField
            label="When does your event end? Enter a date and time."
            error={form.formState.errors.endsAt}
            {...form.register("endsAt")}
          />
          <div className="grid p-3 gap-3 border rounded-lg border-gray-700">
            <Checkbox
              label="Limit participants"
              error={form.formState.errors.hasParticipantLimit}
              {...form.register("hasParticipantLimit")}
            />
            {hasParticipantLimitValue && (
              <NumberInput
                defaultValue={10}
                step={1}
                unit={{
                  singularForm: "participant",
                  pluralForm: "participants",
                }}
                error={form.formState.errors.participantLimit}
                {...form.register("participantLimit", { valueAsNumber: true })}
              />
            )}
          </div>
          <DateTimeField
            label="When should your event open for participation? Enter a date and time."
            error={form.formState.errors.participationStartsAt}
            {...form.register("participationStartsAt")}
          />
          <DateTimeField
            label="When should participation end? Enter a date and time."
            error={form.formState.errors.participationEndsAt}
            {...form.register("participationEndsAt")}
          />
          <RadioGroup
            label="Should your event be publicly visible?"
            error={form.formState.errors.visibility}
            options={{
              public: {
                displayedText: "Public",
                helperText: "Your event will be publicly listed",
              },
              private: {
                displayedText: "Private",
                helperText:
                  "Your event will not be publicly listed and can only be accessed by its ID",
              },
            }}
            {...form.register("visibility")}
          />
          <div className="grid gap-1">
            <DateTimeField
              label="For security, set an expiration date and time for your event."
              error={form.formState.errors.participationEndsAt}
              {...form.register("expiresAt")}
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              After expiration, the event can no longer be edited. Your event
              can still be viewed.
            </p>
          </div>
          <div className="grid gap-1 my-2">
            <Button
              type="submit"
              icon={<SparklesIcon />}
              label={isSubmitting ? "Creating..." : "Create Event"}
              disabled={isSubmitting}
            />
            {/* TODO: Refine the submit response to an alert. */}
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

export default EventForm;
