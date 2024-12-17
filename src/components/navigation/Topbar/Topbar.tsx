import { Thumbnail } from "@/components/user/Thumbnail/Thumbnail";

export const Topbar = () => {
  return (
    <div className="flex items-center justify-between space-x-6 sm:ml-5">
      <div></div>
      <div>
        <Thumbnail />
      </div>
    </div>
  );
};
