import { Flex, Title } from "@mantine/core";
import Prescriptions from "@/components/doctor/Prescriptions";

import PatientLayout from "@/layouts/patientLayout";

export default function PatientPrescription() {
    return (
        <PatientLayout>
          <Flex 
             className="w-full justify-between"
        >
            <Title order={4}>My Prescriptions</Title>
          </Flex>
          <Prescriptions />
        </PatientLayout>
    );
  }
  