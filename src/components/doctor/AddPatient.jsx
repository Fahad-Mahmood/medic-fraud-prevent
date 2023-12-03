
"use client";
import { useState, useEffect} from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, TextInput, NumberInput, Textarea, Flex, Tabs} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useWeb5Hook } from '@/hooks/useWeb5';
import { useForm } from '@mantine/form';
import { prescriptionProtocolDefinition, configurePrescriptionProtocol } from '@/protocols/prescription';

const DOCTOR_NAME = "Dr. Mark Welberg";


export default function AddPatient() {
    const [opened, { open, close }] = useDisclosure(false);
    const [isProtocolConfigured, setIsProtocolConfigured] = useState(false);
    const {web5, did} = useWeb5Hook();


    useEffect(() => {
        const setUpProtocol = async ()  => {
            await configurePrescriptionProtocol(web5);
            setIsProtocolConfigured(true);
        }
        if(web5) {
            setUpProtocol();
        }

    }, [web5])

    const form = useForm({
        initialValues: {
          patientName: '',
          patientDID: '',
          dosageName: '',
          dosagePerDay: '',
          dosageAmount: '',
          duration: 1,
          notes: '',
        },
      });

    console.log("my did", did);

    const onSubmit =  async(values) => {
        if(!isProtocolConfigured) {
            notifications.show({ message: 'Please wait! Configuring Protocol' });
            return;
        }
        console.log(values);
        const prescriptonData = { "@type": "prescription", ...values, doctorName: DOCTOR_NAME, doctorDID: did};
        const { record }  = await web5.dwn.records.create({
            data: prescriptonData,
            message: {
                protocol: prescriptionProtocolDefinition.protocol,
                protocolPath: 'prescription',
                schema: prescriptionProtocolDefinition.types.prescription.schema,
                dataFormat: prescriptionProtocolDefinition.types.prescription.dataFormats[0],
                recipient: values.patientDID,
            }
        });
        if(record && record.data) {
            const data = await record.data.json();
            console.log('success', data);
        }
        notifications.show({ message: 'New Prescription Created' });
        form.reset();
        close();
    }

    return (
    <>
       <Button onClick={open} variant="filled" color='indigo'>Create Patient</Button>
       <Modal opened={opened} onClose={close} title="Create New Patient" centered>
        <Flex className='justify-center'>
       <Tabs variant="pills" defaultValue="qrcode">
      <Tabs.List>
        <Tabs.Tab value="qrcode" >
          Scan QRCode
        </Tabs.Tab>
        <Tabs.Tab value="manual">
          Add Manual
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="qrcode">
      <Flex className='h-[300px]'>

      </Flex>
      </Tabs.Panel>

      <Tabs.Panel value="manual">
        <Flex className='h-[300px] w-full bg-red-200' justify="center" align="center">
      <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput label="Patient Name" placeholder="Patient Name"  {...form.getInputProps('patientName')} />
            <TextInput label="Patient DID" placeholder="Patient DID"  {...form.getInputProps('patientDID')}/>
            <Flex
                className='mt-4' 
                justify="center"
            >
                <Button type='submit'>Save Prescription</Button>
            </Flex>
            </form>
            </Flex>
      </Tabs.Panel>
    </Tabs>
    </Flex>

      </Modal>
    </>
    );
  }
  