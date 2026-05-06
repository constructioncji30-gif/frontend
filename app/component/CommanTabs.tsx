"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface cardprops{
dataList:any
}
const CommonTab:React.FC<cardprops>=({dataList}) =>{



  const path = usePathname() || "/";

  return (
    <div className="  p-2 grid md:grid-cols-3 sm:grid-cols-2 ">
      {dataList.map((link:any) => {
        const isActive = link.href === path;
        return (
          <Link key={link.href} href={link.href}>
            <div
              className={`flex m-2 border-cardBorder border-2 rounded-md  h-16 
                 shadow-sm font-medium 
                 cursor-pointer transition-colors ${
                 " bg-primary hover:bg-primary text-white"
              }`}
            >
              <div className="mr-2 flex items-center justify-center h-full w-20 text-center bg-header">{link.icon}</div>
              <div className="flex items-center">{link.label}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
export default CommonTab