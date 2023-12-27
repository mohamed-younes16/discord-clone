import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const layout = async ({
  children,
}: {
  children: React.ReactNode;
  params: { friendId: string };
}) => {
  return (
    <div
      className=" min-h-screen dark:bg-[url(/assets/magicdark.svg)] transition-all 
    bg-cover  bg-[url(/assets/light-bg.svg)] dark:bg-transparent bg-[#3e3e3efc]"
    >
      <Suspense
        fallback={
          <div className="fixed inset-0 flexcenter">
            <Loader2 className=" h-20 w-20 animate-spin " />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
};

export default layout;
