import { useEffect, useState } from 'react';
import { Image, Avatar, Flex, Button } from '@mantine/core';
import PatientLayout from '../../layouts/patientLayout'
import PatientProfile from '@/components/patient/PatientProfile';
import { useWeb5Hook } from '@/hooks/useWeb5';
import { PATIENT_SCHEMA } from '@/constant';


export default function DoctorHome() {
  const { web5, did} = useWeb5Hook();
  const [patientProfile, setPatientProfile] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchPatientProfile = async () => {
        const{ records } = await web5.dwn.records.query({
            message: {
                filter: {
                    schema: PATIENT_SCHEMA,
                },
                dateSort: 'createdAscending'
            }
        });
        if(records && records.length > 0) {
          const data = await records[0].data.json();
          const savedProfile = {record: records[0], data, id: records[0].id};
          setPatientProfile(savedProfile);
        }
        setIsFetching(false);
    }

    if(web5) {
        fetchPatientProfile();
    }

}, [web5]);
    return (
    <PatientLayout> 
    <div>
     <div className='relative'>
      <Image
        radius="md"
         h={200}
         alt='profile banner'
         src="https://images.unsplash.com/photo-1688920556232-321bd176d0b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
      />
       <Avatar className='absolute bottom-14 left-4' variant="filled" radius="200" size="140px" src="/doctor.jpg" />
       </div>
       <PatientProfile isFetching={isFetching} patientProfile={patientProfile} setPatientProfile={setPatientProfile} />
       </div>
    </PatientLayout>
    );
  }
  