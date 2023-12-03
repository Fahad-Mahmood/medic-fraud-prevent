
"use client";
import { useState, useEffect, useContext} from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, TextInput, NumberInput, Textarea, Flex} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useWeb5Hook } from '@/hooks/useWeb5';
import { useForm } from '@mantine/form';
import { prescriptionProtocolDefinition, configurePrescriptionProtocol } from '@/protocols/prescription';
import { Web5Context } from '@/providers/web5Provider';

const DOCTOR_NAME = "Dr. Mark Welberg";


export default function AddPrescription() {
    const [opened, { open, close }] = useDisclosure(false);
    const { isProtocolConfigured } = useContext(Web5Context);
    const {web5, did} = useWeb5Hook();


    const form = useForm({
        initialValues: {
          patientName: '',
          patientDid: '',
          dosageName: '',
          dosagePerDay: '',
          dosageAmount: '',
          duration: 1,
          notes: '',
        },
      });
console.log(isProtocolConfigured);
    const onSubmit =  async(values) => {
        try {
        if(!isProtocolConfigured) {
            notifications.show({ message: 'Please wait! Configuring Protocol' });
            return;
        }
        const prescriptonData = { ...values, duration: values.duration.toString(), doctorName: DOCTOR_NAME, doctorDid: did};
        const { record, status }  = await web5.dwn.records.create({
            data: prescriptonData,
            message: {
                protocol: prescriptionProtocolDefinition.protocol,
                protocolPath: 'prescription',
                schema: prescriptionProtocolDefinition.types.prescription.schema,
                dataFormat: prescriptionProtocolDefinition.types.prescription.dataFormats[0],
                recipient: values.patientDid,
            }
        });
        console.log(record, status);
        if(record && record.data) {
            const data = await record.data.json();
            console.log('success', data, 'now sending prescription to patient', values.patientDid);
            const response = await record.send(values.patientDid);
            console.log('send status', response);
            if (response.status.code !== 202) {
                notifications.show({ message: 'Unable to send prescription to the patient' });
                return;
            }
            else {
                console.log("Sent prescription to recipient");
            }
        }

        notifications.show({ message: 'New Prescription Created' });
        form.reset();
        close();
    }
    catch(err) {
        console.log('Error adding new prescription', err);
    }
    }

    return (
    <>
       <Button onClick={open} variant="filled" color='indigo'>Create Prescription</Button>
       <Modal opened={opened} onClose={close} title="Create New Prescription" centered>
        <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput label="Patient Name" placeholder="Patient Name"  {...form.getInputProps('patientName')} />
            <TextInput label="Patient DID" placeholder="Patient DID"  {...form.getInputProps('patientDid')}/>
            <TextInput label="Dosage Name" placeholder="Dosage Name"  {...form.getInputProps('dosageName')} />
            <TextInput label="Dosage/day" placeholder="Dosage/day"  {...form.getInputProps('dosagePerDay')} />
            <TextInput label="Dosage Amount" placeholder="amount"  {...form.getInputProps('dosageAmount')} />
            <NumberInput label="Duration" placeholder="Duration" {...form.getInputProps('duration')} />
            <Textarea
                label="Prescription Notes"
                placeholder="Notes"
                {...form.getInputProps('notes')}
            />
            <Flex
                className='mt-4' 
                justify="center"
            >
                <Button type='submit'>Save Prescription</Button>
            </Flex>
            </form>
      </Modal>
    </>
    );
  }
  