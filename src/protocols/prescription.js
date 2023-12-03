const prescriptionProtocolDefinition = {
    protocol: "https://hilarious-meerkat-30b6c6.netlify.app/api/protocol/prescription",
    published: true,
    types: {
      prescription: {
        schema: "https://hilarious-meerkat-30b6c6.netlify.app/api/prescription",
        dataFormats: ["application/json"],
      },
    },
    structure: {
      prescription: {
        $actions: [
          { who: "author", of: "prescription", can: "write"},
          { who: "author", of: "prescription", can: "read" },
          { who: "recipient", of: "prescription", can: "read" },
        ],
      }
    }
}

const configurePrescriptionProtocol = async (web5) => {
    // query the list of existing protocols on the DWN
    const { protocols, status } = await web5.dwn.protocols.query({
        message: {
            filter: {
                protocol: prescriptionProtocolDefinition.protocol,
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
        console.log('Protocol already exists');
        return;
    }

    // configure protocol on local DWN
    const { status: configureStatus, protocol } = await web5.dwn.protocols.configure({
        message: {
            definition: prescriptionProtocolDefinition,
        }
    });

    console.log('Protocol configured', configureStatus, protocol);
}

export { prescriptionProtocolDefinition, configurePrescriptionProtocol};