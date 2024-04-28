import AdminCodeInput from "@/app/components/common/input/AdminCodeInput";
import { submitParticipationAdminCode } from "@/app/lib/actions";

const Page = () => {
  return (
    <div className="flex justify-center">
      <div className="">
        <AdminCodeInput
          blockCount={3}
          blockLength={6}
          label="Enter Participation Code"
          explanation="When you participated the event, you were shown a code. Enter that code here!"
          name="adminCode"
          submitHandler={submitParticipationAdminCode}
        />
      </div>
    </div>
  );
};

export default Page;
