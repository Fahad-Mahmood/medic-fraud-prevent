
"use client";
import { useEffect, useState, useMemo, useContext } from 'react';
import { Card, Flex, Table, TableThead, TableTbody, TableTr, TableTh, ActionIcon} from '@mantine/core';
import { useWeb5Hook } from '@/hooks/useWeb5';
import { IconPrinter, IconEdit } from '@tabler/icons-react';
import { prescriptionProtocolDefinition } from '@/protocols/prescription';
import { Web5Context } from '@/providers/web5Provider';

const DOCTOR_NAME = "Dr. Mark Welberg";


export default function Prescriptions() {
    const {web5, did} = useWeb5Hook();
    const [prescriptions, setPrescriptions] = useState([]);
    const {isProtocolConfigured} = useContext(Web5Context);


    useEffect(() => {
        const fetchPrescriptions = async () => {
            console.log('fetching prescriptions');
            const{ records } = await web5.dwn.records.query({
                message: {
                    filter: {
                        schema: prescriptionProtocolDefinition.types.prescription.schema,
                    },
                    dateSort: 'createdAscending'
                }
            });
            console.log('fetching prescriptions', records);
            const savedPrescriptionsList = [];
            for (let record of records) {
                const data = await record.data.json();
                const savedPrescription = {record, data, id: record.id};
                savedPrescriptionsList.push(savedPrescription);
            }
            setPrescriptions(savedPrescriptionsList);
        }
        let intervalId;
        if(web5 && isProtocolConfigured) {
            intervalId = setInterval(async () => {
                await fetchPrescriptions();
              }, 5000);
        }
        return () => clearInterval(intervalId)

    }, [web5, isProtocolConfigured]);

    const prescriptionTableRows = useMemo(() => {
        const rows = prescriptions.map((prescription) => (
            <Table.Tr key={prescription.id}>
              <Table.Td>{prescription.data.dosageName}</Table.Td>
              <Table.Td>{prescription.data.dosagePerDay}</Table.Td>
              <Table.Td>{prescription.data.dosageAmount}</Table.Td>
              <Table.Td>{prescription.data.duration}</Table.Td>
              <Table.Td>{prescription.data.duration}</Table.Td>
              <Table.Td>{prescription.data.patientName}</Table.Td>
              <Table.Td> 
                <ActionIcon variant="filled" color="gray"  aria-label="Settings">
                    <IconPrinter style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
                <ActionIcon className='ml-2' variant="filled" aria-label="Settings">
                    <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ));
        return rows;
    }, [prescriptions]);

    return (
    <>
      <Card shadow='md' className='mt-8'>
        <Table>
            <TableThead>
                <TableTr>
                    <TableTh>Prescription Name</TableTh>
                    <TableTh>Dosage Per Day</TableTh>
                    <TableTh>Dosage Amount</TableTh>
                    <TableTh>Duration in Days</TableTh>
                    <TableTh>Prescription Date</TableTh>
                    <TableTh>Patient Name</TableTh>
                    <TableTh>Actions</TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {prescriptionTableRows}
            </TableTbody>
        </Table>
      </Card>
    </>
    );
  }
  