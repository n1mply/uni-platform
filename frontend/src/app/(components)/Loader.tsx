'use client'

type Loader = {
    delay?: number;
    label?: string;
    navigateTo?: string;
}

export default function Loader({delay=3000, label='Подождите...', navigateTo='/'}: Loader){

    return (
        <div className="">

        </div>
    )
}