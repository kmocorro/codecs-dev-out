import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/Layout';
import AppBar from '../components/AppBar';
import RecordAttendance from '../components/RecordAttendance';
import { withAuthSync, logout } from '../utils/auth';
import nextCookie from 'next-cookies';


function Index(props) {

  // state for login profile
  const [ loginProfile, setLoginProfile ] = useState('');
  //console.log(loginProfile.username);

  // state for Employee Number
  const [ employee_number, setEmployee_number ] = useState('');
  const handleEmployeeNumberOnChange = (e) => {
    setEmployee_number(e.target.value);
    setScan(true)
  }

  // state for pause after scan
  const [ pauseAfterScan, setPauseAfterScan ] = useState(false);

  // state for RECORD ATTENDACE response message
  const [ serverResponseMessage, setServerResponseMessage ] = useState('');
  console.log(serverResponseMessage);

  // state for User Data
  const [ userData, setUserData ] = useState('');
  console.log(userData);

  // state for recent logs
  const [ recentLogs, setRecentLogs ] = useState('');
 //console.log(recentLogs);
  
  // state for image capturing
  const [imgSrc, setImgSrc] = useState(null);
  //console.log(imgSrc);
  const webcamRef = useRef(null);

  // state for new scan remove image
  const [ scan, setScan ] = useState(true);


  useEffect(() => {
    async function fetchLoginInfo(){
      let routePOST = 'http://dev-metaspf401.sunpowercorp.com:4000/getuserprofile'
      
      let responsePOST = await fetch(`${routePOST}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: props.token
        })
      })

      if(responsePOST.status === 200){
        setLoginProfile(await responsePOST.json());
      }

    }

    fetchLoginInfo();
  }, [employee_number]);

  // get user data info
  useEffect(() => {
    async function fetchAccountInfo(){
      let route = 'http://dev-metaspf401.sunpowercorp.com:4848/getaccountinfo'
      
      let response = await fetch(`${route}/${employee_number}`)
  
      if(response.status === 200){
        //const imageSrc = webcamRef.current.getScreenshot();
        //setImgSrc(imageSrc);
        setUserData(await response.json());
        setScan(false);
        
      }
    }

    fetchAccountInfo()

  }, [employee_number]);

  useEffect(() => {
    if(!scan){
      SubmitToServer().then(() => {
        if(!scan){
          fetchAttendance();
        }
       });
    }

    async function SubmitToServer(){
      let routePOST = 'http://dev-metaspf401.sunpowercorp.com:4000/recordattendance'

      //console.log(imgSrc).then(() => {
      let responsePOST = await fetch(`${routePOST}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: props.token,
          employeeNumber: userData.id,
          mode: 'OUT',
          device: 'EXIT',
          base64String: imgSrc,
          triageRes: 'PASS'
        })
      })

      if(responsePOST.status === 200){
        //console.log(await responsePOST.json());
        setServerResponseMessage(await responsePOST.json());
      }
    }
      
    async function fetchAttendance(){
      let route = 'http://dev-metaspf401.sunpowercorp.com:4000/getattendancelogs'
      
      let response = await fetch(`${route}/OUT/${loginProfile.username}`)
  
      if(response.status === 200){
        setRecentLogs(await response.json())
        setScan(true)
      }
    }
  }, [userData])

  useEffect(() => {
    async function fetchAttendance(){
      let route = 'http://dev-metaspf401.sunpowercorp.com:4000/getattendancelogs'
      
      let response = await fetch(`${route}/OUT/${loginProfile.username}`)
  
      if(response.status === 200){
        setRecentLogs(await response.json())
      }
    }

    fetchAttendance();
  }, [userData]);
  
  
  useEffect(() => {
    if(userData.id){
      setPauseAfterScan(true);
    }
    const timer = setTimeout(() => {
      setEmployee_number('')
      //setUserData('')
      setPauseAfterScan(false);
      setScan(true)
    }, 1000);
    return () => clearTimeout(timer);
  }, [userData])

  // reset 10 secs
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserData('')
    }, 10000);
    return () => clearTimeout(timer)
  }, [userData])

  return (
    <Fragment>
      {/*<AppBar />*/}
      <Layout>
        <RecordAttendance
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
          webcamRef={webcamRef}
          userDataLength={userData.length}
          userData={userData}
          employee_number={employee_number}
          recentLogs={recentLogs}
          handleEmployeeNumberOnChange={handleEmployeeNumberOnChange}
          serverResponseMessage={serverResponseMessage}
          pauseAfterScan={pauseAfterScan}
        />
      </Layout>
    </Fragment>
  );
}

export default withAuthSync(Index);

Index.getInitialProps = async (context) => {
  const {token} = nextCookie(context);
  return {token};
}