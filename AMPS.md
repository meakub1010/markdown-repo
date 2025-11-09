### AMPS Configuration
  
  <AMPSConfig>
    <Name>test-AMPS-1</Name>

    <Transports>
      <Transport>
          <Name>any-tcp</Name>
          <Type>tcp</Type>
          <InetAddr>9007</InetAddr>
          <MessageType>json</MessageType>
          <Protocol>amps</Protocol>
      </Transport>

      <Transport>
          <Name>any-websocket</Name>
          <Type>tcp</Type>
          <InetAddr>9008</InetAddr>
          <MessageType>json</MessageType>
          <Protocol>websocket</Protocol>
      </Transport>
    </Transports>

    <Admin>
        <InetAddr>8085</InetAddr>
        <SQLTransport>any-ws</SQLTransport>
    </Admin> 

    <Logging>
      <Target>
          <Protocol>stdout</Protocol>
          <Level>warning</Level>
      </Target>
    </Logging>

  </AMPSConfig>