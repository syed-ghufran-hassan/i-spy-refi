import React, { setState, useState, useEffect, useContext } from 'react';
import { makeStyles, Container } from '@material-ui/core';
import clsx from 'clsx';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from '@material-ui/core';
import { Form } from 'react-bootstrap';
import { zillow } from '../api/zillow.js';
import { firestore as db } from '../firebase.js';
import { DB } from '../api/firestore';
import { AuthContext } from '../providers/AuthProvider';
import { v4 as uuidv4 } from 'uuid';
// import { AuthContext } from '../providers/HouseProvider';
// import { Redirect } from 'react-router-dom';

// const handleSubmit = (event) => {
//   event.preventDefault();
//   const data = new FormData(event.target);
//   fetch(
//     `https://zillow-com.p/rapidapi.com/search/address?address=${event.target}`
//   );
// };

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '50%',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
  group: {
    width: 'auto',
    height: 'auto',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    width: '50',
  },
}));

function StyledRadio(props) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.group}
      disableRipple
      color='default'
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}
export default function HouseAdditions() {
  const { user } = useContext(AuthContext);
  const classes = useStyles();
  const houseCreds = {
    address: '',
    city: '',
    zip: '',
    state: '',
  };
  let nationalAverages = [
    {
      id: 0,
      name: 'Minor Kitchen Remodel',
      value: '14600',
    },
    {
      id: 1,
      name: 'Major Kitchen Remodel',
      value: '39900',
    },
    {
      id: 2,
      name: 'Asphalt Shingles',
      value: '12777',
    },
    {
      id: 3,
      name: 'Metal Roof',
      value: '21731',
    },
    {
      id: 4,
      name: 'Minor Bathroom Remodel',
      value: '10700',
    },
    {
      id: 5,
      name: 'Major Bathroom Remodel',
      value: '24300',
    },
    {
      id: 6,
      name: 'Attic Bedroom Conversion',
      value: '36700',
    },
    {
      id: 7,
      name: 'Landscaping',
      value: '4900',
    },
    {
      id: 8,
      name: 'Entry Door Replacement',
      value: '1280',
    },
    {
      id: 9,
      name: 'Deck/Patio/Porch',
      value: '10000',
    },
  ];

  const [userHouse, setUserHouse] = useState(houseCreds);
  const [value, setValue] = useState(nationalAverages);
  const [newValue, setNewValue] = useState([]);
  const [userZpid, setUserZpid] = useState('');

  const handleOnClick = (event) => {
    setValue({
      ...value,
      [event.target.name]: event.target.value,
    });
    console.log(event.target.value);
    newValue.push({
      room: event.target.name,
      value: parseFloat(event.target.value),
    });
    console.log(newValue);
    setNewValue(newValue);
  };
  const handleSubmitCalc = async (event) => {
    event.preventDefault();
    console.log(event);
    let theSum = 0;
    for (let i = 0, numb = newValue.length; i < numb; i++) {
      theSum += newValue[i].value;
    }
    newValue.push({ renovationValue: theSum });
    console.log(theSum);
    setNewValue(theSum);
    // console.log(value);
    console.log(newValue);
    const data = {
      // hid: toBeDeleted,
      zpid: userZpid,
      // state: houseData,
      // latitude: null,
      // longitude,
      // zip,
      // city,
      // street,
      // comps,
      formData: newValue,
      // lastUpdated
    };
    const house = async () => await DB.updateHouse(data);
    const updatedHouse = await house().then((res) => {
      console.log(res.updatedHouse);
    });

    // DB.updateHouse(updatedHouse);
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setUserHouse({
      ...userHouse,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const inputHouseCreds = {
      city: userHouse.city,
      street: userHouse.street,
      zip: userHouse.zip,
      state: userHouse.state,
    };
    console.log(inputHouseCreds);
    setUserHouse(inputHouseCreds);
    afterSubmit();
  };

  const afterSubmit = () => {
    // const url = 'http:localhost:5000/GetSearchResults';
    const params = {
      street: userHouse.street.toLowerCase(),
      city: userHouse.city.toLowerCase(),
      state: userHouse.state.toLowerCase(),
      zip: userHouse.zip.toLowerCase(),
      // citystatezip: encodeURIComponent(
      //   userHouse.city,
      //   userHouse.state,
      //   userHouse.zip
      // ),
    };
    zillow.getaddress(params).then((response) => {
      console.log(response);
      // console.log(response[0].address);
      // console.log(response[0].zpid);
      // let address = response[0].address;
      // let zpid = response[0].zpid;

      let houseData = {
        hid: uuidv4(),
        zpid: response[0].zpid,
        latitude: response[0].address.latitude,
        longitude: response[0].address.longitude,
        zip: response[0].address.zipcode,
        state: response[0].address.state,
        city: response[0].address.city,
        street: response[0].address.street,
        comps: '',
        formData: '',
        lastUpdated: '',
      };
      // console.log(houseData[0].address);
      // console.log(houseData[1].zpid);
      console.log(houseData);
      DB.createHouse(user.user.uid, houseData);
      // handleSubmitCalc(houseData);
      console.log(houseData.zpid);
      setUserZpid(houseData.zpid);
    });
  };
  return (
    <div
      className={(classes.root, classes.group)}
      noValidate
      autoComplete='off'
      style={{
        minWidth: 500,
        maxHeight: 500,
        overflow: 'auto',
        flexWrap: 'wrap',
      }}
    >
      <h1 style={{ marginTop: 10, flexWrap: 'nowrap' }}>
        {' '}
        Add Your House to Get Started
      </h1>
      <Container>
        <FormGroup id='initInput'>
          <FormLabel>
            <TextField
              required
              id='outlined-required'
              label='Street'
              placeholder='Street'
              variant='outlined'
              name='street'
              value={userHouse.street}
              onChange={handleInputChange}
            />
            <TextField
              required
              id='outlined-required'
              label='City'
              placeholder='City'
              variant='outlined'
              name='city'
              value={userHouse.city}
              onChange={handleInputChange}
            />
            <TextField
              required
              id='outlined-required'
              label='Zip'
              placeholder='Zip'
              variant='outlined'
              name='zip'
              value={userHouse.zip}
              onChange={handleInputChange}
            />
            <TextField
              required
              id='outlined-required'
              label='State'
              placeholder='State'
              variant='outlined'
              name='state'
              value={userHouse.state}
              onChange={handleInputChange}
            />
            <br />
          </FormLabel>
          <FormGroup />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            onClick={handleSubmit}
            className={classes.button}
          >
            Submit
          </Button>
          <br />

          <FormGroup>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Kitchen Renovations:</FormLabel>
              <br />
              <RadioGroup
                className={classes.group}
                aria-label='renovations'
                name='customized-radios'
              >
                <FormControlLabel
                  value='Yes'
                  control={<StyledRadio />}
                  label='Yes'
                />
                <FormControlLabel
                  value='No'
                  control={<StyledRadio />}
                  label='No'
                />
              </RadioGroup>
            </FormControl>
            <br />
            <FormControl component='fieldset'>
              <FormLabel component='legend'>What have you renovated?</FormLabel>
              <br />
              <RadioGroup
                className={classes.group}
                aria-label='renovations'
                name='customized-radios'
              >
                <FormControlLabel
                  onClick={handleOnClick}
                  value={value[0].value}
                  control={<StyledRadio />}
                  label={value[0].name}
                  name={value[0].name}
                />
                <FormControlLabel
                  onClick={handleOnClick}
                  value={value[1].value}
                  control={<StyledRadio />}
                  label={value[1].name}
                  name={value[1].name}
                />
              </RadioGroup>
            </FormControl>
            <br />
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Roof Renovations:</FormLabel>
              <br />
              <RadioGroup
                className={classes.group}
                defaultValue='no'
                aria-label='renovations'
                name='customized-radios'
              >
                <FormControlLabel
                  value='Yes'
                  control={<StyledRadio />}
                  label='Yes'
                />
                <FormControlLabel
                  value='No'
                  control={<StyledRadio />}
                  label='No'
                />
              </RadioGroup>
            </FormControl>
            <br />
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Pick your Roof Style: </FormLabel>
              <br />
              <RadioGroup
                className={classes.group}
                aria-label='renovations'
                name='customized-radios'
              >
                <FormControlLabel
                  onClick={handleOnClick}
                  value={value[2].value}
                  control={<StyledRadio />}
                  label={value[2].name}
                  name={value[2].name}
                />
                <FormControlLabel
                  onClick={handleOnClick}
                  value={value[3].value}
                  control={<StyledRadio />}
                  label={value[3].name}
                  name={value[3].name}
                />
              </RadioGroup>
            </FormControl>
          </FormGroup>
          <br />
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Bathroom Remodel:</FormLabel>
            <br />
            <RadioGroup
              className={classes.group}
              defaultValue='no'
              aria-label='renovations'
              name='customized-radios'
            >
              <FormControlLabel
                onClick={handleOnClick}
                value={value[4].value}
                control={<StyledRadio />}
                label={value[4].name}
                name={value[4].name}
              />
              <FormControlLabel
                onClick={handleOnClick}
                value={value[5].value}
                control={<StyledRadio />}
                label={value[5].name}
                name={value[5].name}
              />
            </RadioGroup>
          </FormControl>
          <br />
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Attic Bedroom Conversion:</FormLabel>
            <br />
            <RadioGroup
              className={classes.group}
              defaultValue='no'
              aria-label='renovations'
              name='customized-radios'
            >
              <FormControlLabel
                onClick={handleOnClick}
                value={value[6].value}
                control={<StyledRadio />}
                label='Yes'
                name={value[6].name}
              />
              <FormControlLabel
                onClick={handleOnClick}
                value='No'
                control={<StyledRadio />}
                label='No'
              />
            </RadioGroup>
          </FormControl>
          <br />
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Landscaping:</FormLabel>
            <br />
            <RadioGroup
              className={classes.group}
              defaultValue='no'
              aria-label='renovations'
              name='customized-radios'
            >
              <FormControlLabel
                onClick={handleOnClick}
                value={value[7].value}
                control={<StyledRadio />}
                label='Yes'
                name={value[7].name}
              />
              <FormControlLabel
                onClick={handleOnClick}
                value='No'
                control={<StyledRadio />}
                label='No'
              />
            </RadioGroup>
          </FormControl>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Entry Door Replacement:</FormLabel>
            <br />
            <RadioGroup
              className={classes.group}
              defaultValue='no'
              aria-label='renovations'
              name='customized-radios'
            >
              <FormControlLabel
                onClick={handleOnClick}
                value={value[8].value}
                control={<StyledRadio />}
                label='Yes'
                name={value[8].name}
              />
              <FormControlLabel
                onClick={handleOnClick}
                value='No'
                control={<StyledRadio />}
                label='No'
              />
            </RadioGroup>
          </FormControl>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>
              Deck/Patio/Porch Addition :
            </FormLabel>
            <br />
            <RadioGroup
              className={classes.group}
              defaultValue='no'
              aria-label='renovations'
              name='customized-radios'
            >
              <FormControlLabel
                onClick={handleOnClick}
                value={value[9].value}
                control={<StyledRadio />}
                label='Yes'
                name={value[9].name}
              />
              <FormControlLabel
                onClick={handleOnClick}
                value='No'
                control={<StyledRadio />}
                label='No'
              />
            </RadioGroup>
          </FormControl>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            onClick={handleSubmitCalc}
            className={classes.button}
          >
            Calculate
          </Button>
        </FormGroup>
      </Container>
    </div>
  );
}
