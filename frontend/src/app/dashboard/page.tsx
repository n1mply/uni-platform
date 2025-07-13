'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

type universityData = {
    baseInfo: {
        id: string;
        fullName: string;
        shortName: string;
        description: string;
        address: string;
        universityImage: string;
        universityTag: string;
        contact: string;
    },
    structure: {
        faculties: [],
        departments: []
    },
    employees: [],
};

export default function Dashboard({ }) {
    const [fullInfo, setFullInfo] = useState()
    const router = useRouter();

    useEffect(() => {
        const getMe = async () => {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json()
                setFullInfo(data)
                console.log(data)
            }
            else {
                router.push("/")
            }
        }
        getMe()
    }, [])


    return (
        <div>
            {fullInfo?.fullName}
        </div>
    )
}