const patientProtocolDefinition = {
    protocol: "https://bc15-103-159-75-74.ngrok-free.app/api/v11/protocol/patient",
    published: true,
    types: {
      patient: {
        schema: "https://bc15-103-159-75-74.ngrok-free.app/api/patient",
        dataFormats: ["application/json"],
      },
    },
    structure: {
      patient: {
        $actions: [
          { who: "anyone", can: "read"},
          { who: "anyone", can: "write"},
        ],
      }
    }
}

const configurePatientProtocol = async (web5, did) => {
  try {
    
    // query the list of existing protocols on the DWN
    const { protocols, status } = await web5.dwn.protocols.query({
        message: {
            filter: {
                protocol: patientProtocolDefinition.protocol,
            }
        }
    });

    if(status.code !== 200) {
        alert('Error querying protocols');
        console.error('Error querying protocols', status);
        return;
    }

    // if the protocol already exists, we return
    if(protocols.length > 0) {
        console.log('Protocol already exists', protocols);
        return;
    }
    

    // configure protocol on local DWN
    const { status: configureStatus, protocol } = await web5.dwn.protocols.configure({
        message: {
            definition: patientProtocolDefinition,
        }
    });

    console.log('Protocol configured', configureStatus, protocol);

    const { status: configureRemoteStatus } = await protocol.send(did);
    console.log(
      "Did the protocol install on the remote DWN?",
      configureRemoteStatus);
    }
    catch(err) {
      console.log('error configuring protocol');
    }
}

export { patientProtocolDefinition, configurePatientProtocol};