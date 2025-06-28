import { ReactNode, Children } from "react";
import { useUniversityForm } from "@/app/(context)/UniversityFormContext";

export default function WrapperForm({ children }: { children: ReactNode }) {
    const { xPer, setXPer } = useUniversityForm();

    return (
        <main className="w-[100%] min-h-[100vh] overflow-x-hidden overflow-y-auto relative">
        <div className={` w-[400%] min-h-[100vh] flex overflow-x-hidden mt-6 transition-transform duration-500 ease-in-out`}
            style={{ transform: `translateX(${-(xPer)*25}%)` }}>
            {children}
        </div>
        </main>
    )
}