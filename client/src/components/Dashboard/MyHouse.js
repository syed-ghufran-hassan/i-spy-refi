import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import '../../../src/App.css';
import FormChart from './FormChart';

// import '../../assets/scss/style.scss';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import style from '../../App.css';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import HomeIcon from '@material-ui/icons/Home';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  lazyImage: {
    width: '100%',
    'max-height': '300px',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    boxShadow: '10px 5px 5px 5px #437779',
  },
  block: {
    display: 'block',
  },
}));

const styles = {
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  card: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    color: 'white',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '3px',

    // backgroundColor: 'white',
  },
};

export default withRouter(function MyHouse(props) {
  const [loaded, setLoaded] = useState(false);
  const classes = useStyles();
  const biggerThanMobile = useMediaQuery('(min-width:600px)');
  // console.log(props.financeRates);
  const checkLoaded = async () => {
    const {
      imageData,
      street,
      description,
      value,
      finalhousevalue,
      formData,
    } = await props;

    if (finalhousevalue > 0) {
      //presumes value will take the longest to load
      setLoaded(true);
      // console.log(formData);
      // setUserFormData(formData);
    }
    // const { formData } = props.data;
    // console.log(formData);
    // if (formData.length > 0) {
    //   setLoaded(true);
    //   setUserFormData(formData);
    // }
  };

  useEffect(() => {
    checkLoaded();
  }, [props]);

  return loaded ? (
    <Paper className='card-radius box-shadow'>
      <Card className='card-radius-top'>
        <CardMedia component='img' image={props.imageData} title='My House' />
        <CardContent className={classes.block}>
          <h4 className='fontCinzelLgNoShadow'>
            {props.street}, {props.city}, {props.state}
          </h4>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='simple table'>
              <TableRow>
                <TableCell component='th' scope='row'></TableCell>
                <TableCell align='center'>
                  ${' '}
                  {props.value > 0
                    ? props.value.toLocaleString()
                    : props.realtorprice.toLocaleString()}
                </TableCell>
                <TableCell align='center' className='fontCinzelWhiteNoShadow'>
                  Similar Homes Calculation
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'></TableCell>
                <TableCell align='center'>
                  $ {props.reno.toLocaleString()}
                </TableCell>
                <TableCell align='center' coolor='secondary'>
                  Renovation Additions
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'></TableCell>
                <TableCell align='center' className='fontCinzelLgNoShadow'>
                  $ {props.finalhousevalue}
                </TableCell>
                <TableCell align='center' className='fontCinzelLgNoShadow'>
                  I Spi Refi Final Assessment
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography color='textSecondary' gutterBottom>
            <HomeIcon />
            View/Update renovations
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CardContent>
            {/* <Typography color='textSecondary' gutterBottom></Typography>
            <Typography variant='h5' component='h2'>
              reno data
            </Typography> */}

            <FormChart data={props} />
          </CardContent>
          <CardActions className={classes.root}>
            <Button
              style={{
                position: 'absolute',
                right: '0',
                bottom: '0',
                marginTop: '20px',
                marginRight: '70px',
              }}
              size='small'
              className='button'
              onClick={(e) => {
                e.preventDefault();
                props.history.push('/additions');
              }}
            >
              Update Renovation Info
            </Button>
          </CardActions>
        </AccordionDetails>
      </Accordion>
      <Accordion className='card-radius-bottom' align='center'>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography color='textSecondary' gutterBottom align='center'>
            <AccountBalanceIcon /> Refinance Rates in area
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='simple table'>
              <TableBody>
                <TableRow>
                  <TableCell component='th' scope='row'></TableCell>
                  <TableCell align='center'>
                    {props.financeRates.average_rate_30_year_fha} %
                  </TableCell>
                  <TableCell align='center' className='fontCinzelBlack'>
                    30 year FHA
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component='th' scope='row'></TableCell>
                  <TableCell align='center'>
                    {props.financeRates.average_rate_30_year_va} %
                  </TableCell>
                  <TableCell align='center'>30 year VA</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component='th' scope='row'></TableCell>
                  <TableCell align='center'>
                    {props.financeRates.average_rate_30_year} %
                  </TableCell>
                  <TableCell align='center'>30 year</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component='th' scope='row'></TableCell>
                  <TableCell align='center'>
                    {props.financeRates.average_rate_20_year} %
                  </TableCell>
                  <TableCell align='center'>20 year</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component='th' scope='row'></TableCell>
                  <TableCell align='center'>
                    {props.financeRates.average_rate_15_year} %
                  </TableCell>
                  <TableCell align='center'>15 year</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component='th' scope='row'></TableCell>
                  <TableCell align='center'>
                    {props.financeRates.average_rate_10_year} %
                  </TableCell>
                  <TableCell align='center'>10 year</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Paper>
  ) : (
    <Paper className='card-radius box-shadow'>
      <Card className='card-radius-top'>
        <CardActionArea>
          <CardMedia className={classes.lazyImage} title='My House'>
            <CircularProgress className={'mt-4'} />
          </CardMedia>
          <CardContent align='center'>
            <h4>Calculating House Assessment</h4>
            <LinearProgress />
          </CardContent>
        </CardActionArea>
      </Card>
      <Accordion className='card-radius-bottom'>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography color='textSecondary' gutterBottom></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CardActions className={classes.root}>
            <Button size='small' className='button'>
              Update home renovation
            </Button>
          </CardActions>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
});
