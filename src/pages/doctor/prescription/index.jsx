import { Flex, Title } from "@mantine/core";
import AddPrescription from "@/components/doctor/AddPrescription";
import Prescriptions from "@/components/doctor/Prescriptions";

import DoctorLayout from "@/layouts/doctorLayout";

export default function Prescription() {
    return (
        <DoctorLayout>
          <Flex 
             className="w-full justify-between"
        >
            <Title order={4}>My Prescriptions</Title>
            <AddPrescription />
          </Flex>
          <Prescriptions />
        </DoctorLayout>
    );
  }
  