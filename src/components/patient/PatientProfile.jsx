import { useEffect } from 'react';
import { Fieldset, TextInput, Textarea,  Flex, Button, CopyButton} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useWeb5Hook } from '@/hooks/useWeb5';

import { PATIENT_SCHEMA } from '@/constant';

export default function PatientProfile({isFetching, patientProfile, setPatientProfile}) {
    
    const {did, web5} = useWeb5Hook();

    const form = useForm({
        initialValues: {
          firstName: patientProfile && patientProfile?.data ? patientProfile.data.firstName : '',
          lastName: patientProfile && patientProfile?.data ?patientProfile.data.lastName : '',
          email: patientProfile && patientProfile?.data ? patientProfile.data.email : '',
          gender: patientProfile && patientProfile?.data ?patientProfile.data.gender : '',
          address: patientProfile && patientProfile?.data ? patientProfile.data.address : '',
          dob: patientProfile && patientProfile?.data ? new Date(patientProfile.data.dob) : new Date(),
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
          },
      });
      console.log(patientProfile);
      useEffect(() => {
        if(patientProfile) {
          form.setFieldValue('firstName', patientProfile.data.firstName);
          form.setFieldValue('lastName', patientProfile.data.lastName);
          form.setFieldValue('email', patientProfile.data.email);
          form.setFieldValue('gender', patientProfile.data.gender);
          form.setFieldValue('address', patientProfile.data.address);
          form.setFieldValue('dob', new Date(patientProfile.data.dob));
        }

      }, [patientProfile]);

    const onSubmit = async (values) => {
        if(!isFetching) {
          if(!patientProfile) {
            console.log('creating new profile');
          const { record } = await web5.dwn.records.create({
            data : values,
            message : {
              schema : PATIENT_SCHEMA,
              dataFormat: 'application/json'
            }
          });
          const data  = await record.data.json();
          setPatientProfile({data, record, id: record.id})
          notifications.show({ message: 'Profile Saved Successfully' });
        }
        else {
            console.log('updating profile');
          const {status} = await patientProfile.record.update({ data: values });
          if(status.code === 200 || status.code === 202) {
            notifications.show({ message: 'Profile Saved Successfully' });
          }
         else notifications.show({ message: 'Error Saving Profile' });
        }
      }
    }

    return (
        <div className='mt-4'>
        <form onSubmit={form.onSubmit(onSubmit)}>
        <Flex className='w-full justify-between pr-8 mb-8'>
          <Button type='submit' >
                Save Changes
          </Button>
          <Flex>
          <CopyButton value={did}>
            {({ copied, copy }) => (
              <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                {copied ? 'Copied DID' : 'Copy DID'}
              </Button>
            )}
            </CopyButton>
          </Flex>
       </Flex>
        <Fieldset legend="Personal information" variant="unstyled">
          <TextInput label="First Name" placeholder="First name"  {...form.getInputProps('firstName')} />
          <TextInput label="Last Name" placeholder="Last name" {...form.getInputProps('lastName')}  />
          <TextInput label="Email" placeholder="Email" {...form.getInputProps('email')}  />
          <TextInput label="Gender" placeholder="Gender" {...form.getInputProps('gender')}  />
          <DatePickerInput
            label="DOB"
            placeholder="DOB"
            {...form.getInputProps('dob')} 
          />
          <Textarea
            label="Address"
            placeholder="Address"
            {...form.getInputProps('address')} 
          />
        </Fieldset>
        </form>
       </div>
    )
}