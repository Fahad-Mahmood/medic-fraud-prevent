import { useEffect } from 'react';
import { Image, Fieldset, TextInput, Textarea, Text, Card, Flex, Button, CopyButton, Modal, Title} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconQrcode } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useWeb5Hook } from '@/hooks/useWeb5';
import QRCode from "react-qr-code";

import { DOCTOR_SCHEMA } from '@/constant';

export default function DoctorProfile({isFetching, doctorProfile, setDoctorProfile}) {
    
    const {did, web5} = useWeb5Hook();
    const [openedQRModal, { open: openQRModal, close: closeQRModal }] = useDisclosure(false);


    const form = useForm({
        initialValues: {
          firstName: doctorProfile && doctorProfile?.data ? doctorProfile.data.firstName : '',
          lastName: doctorProfile && doctorProfile?.data ?doctorProfile.data.lastName : '',
          email: doctorProfile && doctorProfile?.data ? doctorProfile.data.email : '',
          speciality: doctorProfile && doctorProfile?.data ?doctorProfile.data.speciality : '',
          summary: doctorProfile && doctorProfile?.data ? doctorProfile.data.summary : '',
          dob: doctorProfile && doctorProfile?.data ? new Date(doctorProfile.data.dob) : new Date(),
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
          },
      });

      useEffect(() => {
        if(doctorProfile) {
          form.setFieldValue('firstName', doctorProfile.data.firstName);
          form.setFieldValue('lastName', doctorProfile.data.lastName);
          form.setFieldValue('email', doctorProfile.data.email);
          form.setFieldValue('speciality', doctorProfile.data.speciality);
          form.setFieldValue('summary', doctorProfile.data.summary);
          form.setFieldValue('dob', new Date(doctorProfile.data.dob));
        }

      }, [doctorProfile]);

    const onSubmit = async (values) => {
        if(!isFetching) {
          if(!doctorProfile) {
          const { record } = await web5.dwn.records.create({
            data : values,
            message : {
              schema : DOCTOR_SCHEMA,
              dataFormat: 'application/json'
            }
          });
          const data  = await record.data.json();
          setDoctorProfile({data, record, id: record.id})
          notifications.show({ message: 'Profile Saved Successfully' });
        }
        else {
          const {status} = await doctorProfile.record.update({ data: values });
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
            <Button onClick={openQRModal} className="ml-4" leftSection={<IconQrcode size={14} />} variant="default">
                Generate QRCode For Patients
            </Button>
            <Modal opened={openedQRModal} title={""} onClose={closeQRModal} centered>
              <div className='flex justify-center mb-4'>
              <Title order={3}>QRCode For New Patients</Title>
            </div>
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`${process.env.NEXT_PUBLIC_BASE_URI}/patient?shareProfile=true&doctorDid=${did}`}
              viewBox={`0 0 256 256`}
            />
            </Modal>
          </Flex>
       </Flex>
        <Fieldset legend="Personal information" variant="unstyled">
          <TextInput label="First Name" placeholder="First name"  {...form.getInputProps('firstName')} />
          <TextInput label="Last Name" placeholder="Last name" {...form.getInputProps('lastName')}  />
          <TextInput label="Email" placeholder="Email" {...form.getInputProps('email')}  />
          <DatePickerInput
            label="DOB"
            placeholder="DOB"
            {...form.getInputProps('dob')} 
          />
        </Fieldset>
        <Fieldset className='mt-4' legend="Professional Information" variant="unstyled">
          <TextInput label="Speciality" placeholder="Speciality" {...form.getInputProps('speciality')} />
          <Textarea
            label="Professional Summary"
            placeholder="Summary"
            {...form.getInputProps('summary')} 
          />
         <Text className='mt-8' size='sm' fw='500'> License and Certificiations </Text>
         <Flex wrap='wrap'>
          <Card shadow='lg'radius={'md'}>
            <Image h={200} w={200} alt='certificate' src='/certificate/physician.webp' />
          </Card>
          <Card shadow='lg'radius={'md'}>
            <Image h={200} w={200} alt='certificate' src='/certificate/physician.webp' />
          </Card>
          <Card shadow='lg'radius={'md'}>
            <Image h={200} w={200} alt='certificate' src='/certificate/physician.webp' />
          </Card>
          <Card shadow='lg'radius={'md'}>
            <Image h={200} w={200} alt='certificate' src='/certificate/physician.webp' />
          </Card>
          <Card shadow='lg'radius={'md'}>
            <Image h={200} w={200} alt='certificate' src='/certificate/physician.webp' />
          </Card>
         </Flex>
        </Fieldset>
        </form>
       </div>
    )
}