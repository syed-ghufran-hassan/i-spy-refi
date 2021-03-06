import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import FormChart from './FormChart';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import AddIcon from '@material-ui/icons/Add';
import TableRow from '@material-ui/core/TableRow';
import Modal from '@material-ui/core/Modal';

import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import '../../../src/App.css';
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
  },
  block: {
    display: 'block',
  },
  button: {
    border: 'groove',
    backgroundColor: '#437779',
    fontFamily: 'Cinzel',
    color: 'white',
  },
}));

export default withRouter(function MyHouse(props) {
  const [loaded, setLoaded] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkLoaded = () => {
    const { imageData, street, description, value, finalhousevalue } = props;

    if (finalhousevalue > 0) {
      setLoaded(true);
    }
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
              <tbody>
                <TableRow>
                  <TableCell component='th' scope='row'></TableCell>
                  <TableCell
                    align='center'
                    className='fontCinzelLgNoShadow'
                  ></TableCell>
                  <TableCell align='center'>
                    ${' '}
                    {props.value > 0
                      ? props.value.toLocaleString()
                      : props.realtorprice.toLocaleString()}
                  </TableCell>
                  <TableCell align='center'>
                    Similar Homes Calculation
                  </TableCell>
                </TableRow>
                <TableRow style={{ borderBottom: '0' }}>
                  <TableCell component='th' scope='row'></TableCell>
                  <TableCell align='center'>
                    <AddIcon />
                  </TableCell>
                  <TableCell align='center'>
                    $ {props.reno.toLocaleString()}
                  </TableCell>
                  <TableCell align='center' color='secondary'>
                    Renovation Additions
                  </TableCell>
                </TableRow>

                <TableRow style={{ backgroundColor: '#437779' }}>
                  <TableCell component='th' scope='row'></TableCell>
                  <TableCell align='center'></TableCell>
                  <TableCell align='center'>
                    $ {props.finalhousevalue.toLocaleString()}
                  </TableCell>
                  <TableCell align='center'>
                    I SPY REFI Final Assessment
                  </TableCell>
                </TableRow>
              </tbody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Accordion align='center'>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <AccountBalanceIcon className='fontCinzelLgNoShadow' />
          <Typography
            className='paddingleft'
            color='textSecondary'
            gutterBottom
            align='center'
          >
            Home Reno Chart
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Grid item xs={12}>
            <Button
              type='button'
              size='small'
              variant='contained'
              className={classes.button}
              onClick={handleOpen}
            >
              Renovation Data
            </Button>
          </Grid>
          <Modal open={open} onClose={handleClose}>
            <Paper className='card-radius box-shadow'>
              <FormChart data={props} />
            </Paper>
          </Modal>
        </AccordionDetails>
        <AccordionDetails>
          <Grid item xs={12}>
            <Button
              type='button'
              size='small'
              variant='contained'
              className={classes.button}
              onClick={(e) => {
                e.preventDefault();
                props.history.push('/additions');
              }}
            >
              Add Renovations
            </Button>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion className='card-radius-bottom' align='center'>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <AccountBalanceIcon className='fontCinzelLgNoShadow' />
          <Typography
            className='paddingleft'
            color='textSecondary'
            gutterBottom
            align='center'
          >
            Refinance Rates in area
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
            <Button size='small' className={classes.button}>
              Update home renovation
            </Button>
          </CardActions>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
});
