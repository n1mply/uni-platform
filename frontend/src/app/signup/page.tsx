'use client'

import WrapperForm from '@/app/(components)/WrapperForm';
import ContactsForm from '@/app/(components)/ContactsForm';
import BaseForm from '@/app/(components)/BaseForm';
import FacultyForm from '@/app/(components)/FacultyForm';
import DepartmentForm from '../(components)/DepartmentForm';
import EmployeeForm from '../(components)/EmployeeForm';
import { UniversityFormProvider } from "@/app/(context)/UniversityFormContext";



export default function Signup() {
    return (
        <UniversityFormProvider>
            <WrapperForm>
                <BaseForm />
                <ContactsForm />
                <FacultyForm />
                <DepartmentForm />
                <EmployeeForm />
            </WrapperForm>
        </UniversityFormProvider>
    );
}