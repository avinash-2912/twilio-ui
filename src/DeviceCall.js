import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Device } from 'twilio-client';
import KeypadButton from './KeypadButton';
import OnCall from './OnCall';
import FakeState from './FakeState';
import states from './states';
import './Phone.css';  // Reusing the same styles, you can create a new CSS file if needed

const DeviceCall = ({ token }) => {
  const { deviceId } = useParams();
  const [state, setState] = useState(states.CONNECTING);
  const [conn, setConn] = useState(null);
  const [device, setDevice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const device = new Device();

    device.setup(token, { debug: true });

    device.on("ready", () => {
      setDevice(device);
      setState(states.READY);
    });

    device.on("connect", connection => {
      setConn(connection);
      setState(states.ON_CALL);
    });

    device.on("disconnect", () => {
      setState(states.READY);
      setConn(null);
      // Optionally navigate back to main phone page after call ends
      navigate('/');
    });

    return () => {
      device.destroy();
      setDevice(null);
      setState(states.OFFLINE);
    };
  }, [token, navigate]);

  const handleCall = () => {
    const uid = "123";
    if (device && deviceId && uid) {
      device.connect({
        uid: uid,
        deviceId: deviceId,
      });
    }
  };

  const handleHangup = () => {
    if (device) {
      device.disconnectAll();
    }
  };

  let render;
  if (conn) {
    render = <OnCall handleHangup={handleHangup} connection={conn} />;
  } else {
    render = (
      <div className="device-call">
        <p>Device ID: {deviceId}</p>
        <div className="call">
          <KeypadButton handleClick={handleCall} color="green">
            Call Device
          </KeypadButton>
        </div>
      </div>
    );
  }

  return (
    <>
      <FakeState
        currentState={state}
        setState={setState}
        setConn={setConn}
      />
      {render}
      <p className="status">{state}</p>
    </>
  );
};

export default DeviceCall;