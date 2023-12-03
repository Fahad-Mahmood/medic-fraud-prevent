import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Image, Avatar, Flex, Button, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import PatientLayout from '../../layouts/patientLayout'
import PatientProfile from '@/components/patient/PatientProfile';
import { useWeb5Hook } from '@/hooks/useWeb5';
import { PATIENT_SCHEMA } from '@/constant';
import { notifications } from '@mantine/notifications';
import { patientProtocolDefinition } from '@/protocols/patient';


export default function DoctorHome() {
  const { web5, did} = useWeb5Hook();
  const [patientProfile, setPatientProfile] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);


  const router = useRouter();
  const {shareProfile, doctorDid } = router.query;
  console.log('nextRouter', router);

  useEffect(() => {
    if(shareProfile && doctorDid) {
      open();
    }
    
  }, [shareProfile])

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

const onShare = async () => {
  if(!patientProfile) {
    notifications.show({message: "Please create your profile first"});
    return;
  }

  const patientData = { patientDid: did, firstName: patientProfile.data.firstName, lastName: patientProfile.data.lastName, dob: patientProfile.data.dob, gender: patientProfile.data.gender };
 console.log(patientData, "recipient", doctorDid )
  const { record, status }  = await web5.dwn.records.create({
      data: patientData,
      store: false,
      message: {
          protocol: patientProtocolDefinition.protocol,
          published: true,
          protocolPath: 'patient',
          schema: patientProtocolDefinition.types.patient.schema,
          dataFormat: patientProtocolDefinition.types.patient.dataFormats[0],
          recipient: doctorDid,
      }
  });

  if(record && record.data) {
    console.log('success', record, 'now sending prescription to patient');
    const response = await record.send(doctorDid);
    console.log('send status', response);
    if (response.status.code !== 202) {
        notifications.show({ message: 'Unable to send prescription to the patient' });
        return;
    }
    else {
      notifications.show({message: "Succesfully shared data!"});
        console.log("Sent prescription to recipient");
        close();
        router.push('/patient');
    }
}

}
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
       <Modal opened={opened} onClose={close} title="Confirm" centered>
          <Title order={4}>Do you want to share your data with doctor?</Title>
          <Flex className='w-full justify-center mt-6'>
            <Button onClick={onShare} className="mr-4"> Yes </Button>
            <Button color='red' onClick={close}> No</Button>
          </Flex>
       </Modal>
    </PatientLayout>
    );
  }
  