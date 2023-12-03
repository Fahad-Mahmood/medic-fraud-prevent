import { Flex, Title } from "@mantine/core";
import AddPatient from "@/components/doctor/AddPatient";

import DoctorLayout from "@/layouts/doctorLayout";

export default function PatientHome() {
    return (
        <DoctorLayout>
          <Flex 
             className="w-full justify-between"
        >
            <Title order={4}>My Patients</Title>
            <AddPatient />
          </Flex>
        </DoctorLayout>
    );
  }
  