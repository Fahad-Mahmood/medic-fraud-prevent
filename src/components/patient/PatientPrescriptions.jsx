
"use client";
import { useEffect, useState, useMemo, useContext } from 'react';
import { Card, Table, TableThead, TableTbody, TableTr, TableTh, ActionIcon} from '@mantine/core';
import { useWeb5Hook } from '@/hooks/useWeb5';
import { IconPrinter, IconEdit } from '@tabler/icons-react';
import { prescriptionProtocolDefinition } from '@/protocols/prescription';
import { Web5Context } from '@/providers/web5Provider';


export default function PatientPrescriptions() {
    const {web5} = useWeb5Hook();
    const [prescriptions, setPrescriptions] = useState([]);
    const {isProtocolConfigured} = useContext(Web5Context);


    useEffect(() => {
        const fetchPrescriptions = async () => {
            console.log('fetching patient prescriptions');
            const{ records } = await web5.dwn.records.query({
                from: 'did:ion:EiC3l63_alKu3iSGI683akT-BcKj3Y1HT9xzftrbJ4dz7g:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiaEtvWmZxZVBRWC1BS05RZmFqYlZYZndzQmdtVzByc0Q0d0RxcnRYTmxLMCJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifSx7ImlkIjoiZHduLWVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJwcHo2VVVqTThhTXRpaUd1MXVGZ2FIajZWdDZRSFlOYmNpYmx1V0VyeDFvIiwieSI6InBHOVJLaUk5aFR0RXYzLXNpVFRVaHJPVVdxS0NxRm9sYVhCWmJSOVJDeW8ifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7ImVuY3J5cHRpb25LZXlzIjpbIiNkd24tZW5jIl0sIm5vZGVzIjpbImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduNiIsImh0dHBzOi8vZHduLnRiZGRldi5vcmcvZHduNSJdLCJzaWduaW5nS2V5cyI6WyIjZHduLXNpZyJdfSwidHlwZSI6IkRlY2VudHJhbGl6ZWRXZWJOb2RlIn1dfX1dLCJ1cGRhdGVDb21taXRtZW50IjoiRWlDM19yMW0wVnFHT256c0llaE4tQkk5SDNyendTYVZ5Ykw4X1lsVkZWUGFIZyJ9LCJzdWZmaXhEYXRhIjp7ImRlbHRhSGFzaCI6IkVpQi1neTBFNVJDUU9RMFR4UDdJTGJRM05MbXBCNHBjMVZjak4xMG1NS0NhMFEiLCJyZWNvdmVyeUNvbW1pdG1lbnQiOiJFaUJ2a2dWSjJKTVZQa2U5azNXQjRndk4zRzlIQ0ktVzg0WFcwaXlTTE9GUzlRIn19',
                message: {
                    filter: {
                        protocol: prescriptionProtocolDefinition.protocol,
                        schema: prescriptionProtocolDefinition.types.prescription.schema,
                   
                    },
                    dateSort: 'createdAscending'
                }
            });
            console.log('result', records);
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
  