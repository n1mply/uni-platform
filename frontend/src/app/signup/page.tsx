'use client'

import WrapperForm from '@/app/(components)/WrapperForm';
import ContactsForm from '@/app/(components)/ContactsForm';
import BaseForm from '@/app/(components)/BaseForm';
import UniversityFinalForm from '../(components)/UniversityFinalForm';
import WaitUp from '../(components)/WaitUp';
import { UniversityFormProvider } from "@/app/(context)/UniversityFormContext";



export default function Signup() {
    return (
        <UniversityFormProvider>
            <WrapperForm>
                <WaitUp />
                <BaseForm />
                <ContactsForm />
                <UniversityFinalForm />
            </WrapperForm>
        </UniversityFormProvider>
    );
}