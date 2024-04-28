import AdminCodeInput from "@/app/components/common/input/AdminCodeInput";
import { submitEventAdminCode } from "@/app/lib/actions";

const Page = () => {
  return (
    <div className="flex justify-center">
      <div className="">
        <AdminCodeInput
          blockCount={3}
          blockLength={6}
          label="Enter Code"
          explanation="When you created your event, you were shown a code. Enter that code here!"
          name="adminCode"
          submitHandler={submitEventAdminCode}
        />
      </div>
    </div>
  );
};

export default Page;
