import { ReactNode, Children } from "react";
import { useUniversityForm } from "@/app/(context)/UniversityFormContext";

export default function WrapperForm({ children }: { children: ReactNode }) {
    const { xPer, setXPer } = useUniversityForm();
    const pagePer: number = 200

    return (
        <div className={`w-[${pagePer}%] flex overflow-x-hidden mt-6 transition-transform duration-500 ease-in-out`}
            style={{ transform: `translateX(${xPer}%)` }}>
            {children}
        </div>
    )
}