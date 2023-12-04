
"use client";
import { useEffect, useState, useMemo, useContext } from 'react';
import { Card, Flex, Table, TableThead, TableTbody, TableTr, TableTh, ActionIcon} from '@mantine/core';
import { useWeb5Hook } from '@/hooks/useWeb5';
import { IconPrinter, IconEdit } from '@tabler/icons-react';
import { prescriptionProtocolDefinition } from '@/protocols/prescription';
import { Web5Context } from '@/providers/web5Provider';
import { patientProtocolDefinition } from '@/protocols/patient';
import dayjs  from 'dayjs';

const DOCTOR_NAME = "Dr. Mark Welberg";


export default function Prescriptions() {
    const {web5, did} = useWeb5Hook();
    const [patients, setPatients] = useState([]);
    const {isProtocolConfigured} = useContext(Web5Context);


    useEffect(() => {
        const fetchPatients = async () => {
            console.log('fetching patients');
            const{ records } = await web5.dwn.records.query({
                message: {
                    filter: {
                        schema: patientProtocolDefinition.types.patient.schema,
                    },
                    dateSort: 'createdAscending'
                }
            });
            console.log('fetched patients', records);
            const savedPatientsList = [{id: '1', data: {firstName: "mark", lastName: "spencer", gender: "male", dob: new Date() }}];
            for (let record of records) {
                const data = await record.data.json();
                const savedPatient = {record, data, id: record.id};
                savedPatientsList.push(savedPatient);
            }
            setPatients(savedPatientsList);
        }
        let intervalId;
        if(web5 && isProtocolConfigured) {
            intervalId = setInterval(async () => {
                await fetchPatients();
              }, 5000);
        }
        return () => clearInterval(intervalId)

    }, [web5, isProtocolConfigured]);

    const patientTableRows = useMemo(() => {
        const rows = patients.map((patient) => (
            <Table.Tr key={patient.id}>
              <Table.Td>{patient.data.firstName}</Table.Td>
              <Table.Td>{patient.data.lastName}</Table.Td>
              <Table.Td>{patient.data.gender}</Table.Td>
              <Table.Td>{dayjs(patient.data.dob).format('DD/MM/YYYY')}</Table.Td>
            </Table.Tr>
          ));
        return rows;
    }, [patients]);

    return (
    <>
      <Card shadow='md' className='mt-8'>
        <Table>
            <TableThead>
                <TableTr>
                    <TableTh>First Name</TableTh>
                    <TableTh>Last Name </TableTh>
                    <TableTh>Gender</TableTh>
                    <TableTh>Dob</TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {patientTableRows}
            </TableTbody>
        </Table>
      </Card>
    </>
    );
  }
  