import React from 'react';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

let names = require('./resource.json');
console.log(names)
let sta = [['-','-']];
const line = names.line;
const AELsta = names.AELsta;
const TCLsta = names.TCLsta;
const WRLsta = names.WRLsta;
const TKLsta = names.TKLsta;

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    paper: {
        minWidth: 400,
        minHeight: 100,
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    table: {
        flexGrow: 1,
    },
}));

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

function changeStationList(event) {
    switch(event.target.value){
        default:
            sta = [['-','-']];
            break;
        case 'AEL':
            sta = AELsta;
            break;
        case 'TCL':
            sta = TCLsta;
            break;
        case 'WRL':
            sta = WRLsta;
            break;
        case 'TKL':
            sta = TKLsta;
            break;
    }
}

function RenderTrains(props) {
    console.log(props.trains)
    if (props.trains.length === 0) {
        return null;
    }
    if(props.trains.isdelay === 'Y'){
        return(
            <div>
                <Typography variant="h5" component="h2">
                    Trains Delay! No schedules are given
                </Typography>
            </div>
        )
    }
    let list = Object.values(props.trains.data)[0];
    console.log(list)
    return(
        <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>
            {list.hasOwnProperty('UP')
                ? <Direction list={list.UP} name={'UP'} class={props.class}/>
                : null
            }
            {list.hasOwnProperty('DOWN')
                ? <Direction list={list.DOWN} name={'DOWN'} class={props.class}/>
                : null
            }
            </Grid>
        </Grid>
    )
}

function Direction(props) {
    let list = props.list;
    let name = props.name;
    let classes = props.class;
    return(
        <div>
            <Typography variant="h5" component="h2">
                {name}:
            </Typography>
            <Grid
                container
                direction="column"
                justify="space-between"
            >
                {list.map((train) => (
                        <Paper className={classes.paper} key={train.time}>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Platform: {train.plat}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                Departs: {train.time.substring(11,16)}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                Destination: {train.dest}
                            </Typography>
                        </Paper>
                ))}
            </Grid>
        </div>
    )
}

export default function RadioButtonsGroup() {
  const [value, setValue] = React.useState('');
  const [station, setStation] = React.useState('');
  const [trains, setTrains] = React.useState('');
  const classes = useStyles();
  const handleChange = (event) => {
      setStation(event.target.value);
  }

  const handleLineChange = (event) => {
        setValue(event.target.value);
        changeStationList(event)
  };

  const buttonClick = (event) =>{
      var url = 'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?';
      url = updateQueryStringParameter(url,'line',value)
      url = updateQueryStringParameter(url,'sta',station)
      fetch(url)
          .then(response => response.json())
          .then((jsonData) => {
              // jsonData is parsed json object received from url
              setTrains(jsonData);
          })
          .catch((error) => {
              // handle your errors here
              console.error(error)
          })
  }

  return (
      <div>
          <Grid
              container
              direction="row"
              justify="center"
              alignItems="baseline"
          >
              <Box component="span">
                  <FormControl className={classes.formControl}>
                      <InputLabel id="line-select-label">Line</InputLabel>
                      <Select
                          labelId="line-select-label"
                          id="line-select"
                          value={value}
                          onChange={handleLineChange}
                      >
                          {line.map((line) => (
                              <MenuItem key={line[1]} value={line[0]}>
                                  {line[1]}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  <FormControl className={classes.formControl}>
                      <InputLabel id="station-select-label">Station</InputLabel>
                      <Select
                          labelId="station-select-label"
                          id="station-select"
                          value={station}
                          onChange={handleChange}
                      >
                          {sta.map((station) => (
                              <MenuItem key={station[1]} value={station[0]}>
                                  {station[1]}
                              </MenuItem>
                          ))}
                      </Select>
                      <Button variant="outlined" className={classes.button} onClick={buttonClick}> Search </Button>
                  </FormControl>
              </Box>
          </Grid>
          <Grid container className={classes.table} spacing={2}>
              <RenderTrains trains={trains} class={classes}/>
          </Grid>
      </div>
  );
}
