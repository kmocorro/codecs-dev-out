import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/Layout';
import AppBar from '../components/AppBar';
import RecordAttendance from '../components/RecordAttendance';
import { withAuthSync, logout } from '../utils/auth';
import nextCookie from 'next-cookies';


function Index() {

  // state for Employee Number
  const [ employee_number, setEmployee_number ] = useState('');
  const handleEmployeeNumberOnChange = (e) => {
    setEmployee_number(e.target.value);
    setScan(true)
  }

  // state for User Data
  const [ userData, setUserData ] = useState('');
  console.log(userData);

  // state for recent logs
  const [ recentLogs, setRecentLogs ] = useState('');
  console.log(recentLogs);
  
  // state for image capturing
  const [imgSrc, setImgSrc] = useState(null);
  //console.log(imgSrc);
  const webcamRef = useRef(null);

  // state for new scan remove image
  const [ scan, setScan ] = useState(true);
  
  // get user data info
  useEffect(() => {
    async function fetchAccountInfo(){
      let route = 'http://dev-metaspf401.sunpowercorp.com:4848/getaccountinfo'
      
      let response = await fetch(`${route}/${employee_number}`)
  
      if(response.status === 200){
        //const imageSrc = webcamRef.current.getScreenshot();
        //setImgSrc(imageSrc);
        setUserData(await response.json());
        setScan(false)
      }
    }

    fetchAccountInfo().then(() => {
        
      if(!scan){
        async function SubmitToServer(){
          let routePOST = 'http://dev-metaspf401.sunpowercorp.com:4000/recordattendance'

          //console.log(imgSrc)
          let responsePOST = await fetch(`${routePOST}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              //token: props.token,
              employeeNumber: userData.id,
              mode: 'OUT',
              device: 'EXIT1',
              base64String: imgSrc,
              triageRes: 'PASS'
            })
          })

          if(responsePOST.status === 200){
            console.log(await responsePOST.json());
          }
        }

        SubmitToServer().then(() => {
          if(!scan){
            async function fetchAttendance(){
              let route = 'http://dev-metaspf401.sunpowercorp.com:4000/getattendancelogs'
              
              let response = await fetch(`${route}/OUT/EXIT1`)
          
              if(response.status === 200){
                setRecentLogs(await response.json())
              }
            }

            fetchAttendance();
          }
        });
      }
    })

    
  }, [employee_number]);


  useEffect(() => {
    async function fetchAttendance(){
      let route = 'http://dev-metaspf401.sunpowercorp.com:4000/getattendancelogs'
      
      let response = await fetch(`${route}/OUT/EXIT1`)
  
      if(response.status === 200){
        setRecentLogs(await response.json())
      }
    }

    fetchAttendance();
  }, [userData]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmployee_number('')
      //setUserData('')
      setScan(true)
    }, 1000);
    return () => clearTimeout(timer);
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