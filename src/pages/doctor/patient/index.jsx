import { useContext, useEffect } from "react";
import { Flex, Title } from "@mantine/core";
import AddPatient from "@/components/doctor/AddPatient";

import DoctorLayout from "@/layouts/doctorLayout";
import { patientProtocolDefinition } from "@/protocols/patient";
import { useWeb5Hook } from "@/hooks/useWeb5";
import { Web5Context } from "@/providers/web5Provider";
import Patients from '@/components/doctor/Patients';


export default function PatientHome() {
  const { web5, did} = useWeb5Hook();
  const { isProtocolConfigured } = useContext(Web5Context)

  useEffect(() => {
    const fetchPatients = async () => {
        console.log('fetching patientRecords');
        const{ records } = await web5.dwn.records.query(
          {
            message: {
              filter: {
                dataFormat: 'application/json',
              },
              dateSort: 'createdAscending'
            }
          }
        );
        console.log('fetched patients', records);
        const savedPrescriptionsList = [];
        for (let record of records) {
            const data = await record.data.json();
            const savedPrescription = {record, data, id: record.id};
            savedPrescriptionsList.push(savedPrescription);
        }
        //setPrescriptions(savedPrescriptionsList);
    }
    let intervalId;
    if(web5 && isProtocolConfigured) {
        intervalId = setInterval(async () => {
            await fetchPatients();
          }, 5000);
    }
    return () => clearInterval(intervalId)
  
  }, [web5, isProtocolConfigured]);

    return (
        <DoctorLayout>
          <Flex 
             className="w-full justify-between"
        >
            <Title order={4}>My Patients</Title>
            <AddPatient />
          </Flex>
          <Patients />
        </DoctorLayout>
    );
  }
  