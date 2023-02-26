import React from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Grid2 from '@mui/material/Unstable_Grid2';
import {TextField, FormLabel, Checkbox, Button, Select, MenuItem, InputLabel, FormControl, FormGroup, FormControlLabel} from '@mui/material';
import {createTheme,ThemeProvider} from '@mui/material/styles';
import { Buffer } from 'buffer';

const theme = createTheme({
  palette:{
    background:{
      main: "#f7e8e6",
    },
    primary:{
      main: "#bf8a8e",
    },
    secondary:{
      main: "#A49393",
    },
    text:{
      main:"#67595E",
    },
  },
});

class App extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      account: "",
      urlBase: "https://api.ravelry.com",
      authUsername:"read-b7db3ad6732334c74999b6c7f38cb0b5",
      authPassword:"BMy/6ZUx4XslJ6tg3VvpCkbOtJWVMb+18mXMkkOt",
      bundles: [],
      selectedBundle:[],
      locationsSelected:{
        favorites: false,
        bundles: false,
        library: false,
        queue: false
      },
      craft:{
        crochet: false,
        knitting: false
      },
      free:false,
      loweryardage:0,
      upperyardage:0,
      yarnweight:""
    }
  }

  getAccountBundles = () => {
    const h = new Headers();
    h.append("Authorization", "Basic "+ (Buffer.from(this.state.authUsername+":"+this.state.authPassword).toString('base64')));
    const url = this.state.urlBase + '/people/'+this.state.account+'/bundles/list.json';
    return fetch(url, { method: 'GET', headers: h})
    .then(
      (response) => 
      {
        if(response.ok){
          return (response.json());
        } 
        else{
          console.log("HTTP error:" + response.status + ":" +  response.statusText);
          return ([ ["status ", response.status]]);
        }
      })
      .then(responseData => {
        this.setState({bundles: responseData.bundles})
      })
      .catch((error) =>{
        console.log(error);
      })
  }

  updateAccountUsername = (e) => {
    this.setState({account: e.target.value});
  }

  bundleSelect = (e) => {
    this.setState({selectedBundle: e.target.value});
  }

  updateFavoritesLocation = (e) => {
    const locations = this.state.locationsSelected;
    locations.favorites=e.target.checked;
    this.setState({locationsSelected: locations});
  }

  updateBundlesLocation = (e) => {
    const locations = this.state.locationsSelected;
    locations.bundles=e.target.checked;
    this.setState({locationsSelected: locations});
  }

  updateLibraryLocation = (e) => {
    const locations = this.state.locationsSelected;
    locations.library=e.target.checked;
    this.setState({locationsSelected:locations});
  }

  updateQueueLocation = (e) => {
    const locations = this.state.locationsSelected;
    locations.queue=e.target.checked;
    this.setState({locationsSelected:locations});
  }

  updateCrochetCraft = (e) => {
    const craft = this.state.craft;
    craft.crochet=e.target.checked;
    this.setState({craft:craft});
  }

  updateKnittingCraft = (e) => {
    const craft = this.state.craft;
    craft.knitting=e.target.checked;
    this.setState({craft:craft});
  }

  updateFree = (e) => {
    this.setState({free:e.target.checked})
  }

  updateLowerLimit = (e) => {
    this.setState({loweryardage: e.target.value});
  }

  updateUpperLimit = (e) => {
    this.setState({upperyardage: e.target.value});
  }

  render() 
  {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <header className="App-header">
            <h1>RavelryRandomizer</h1>
            <Grid2 container columnspacing={3} alignItems="center">
              <Grid2 xs={8}>
                <TextField id="username-txt" label="Username" variant="outlined" onChange={this.updateAccountUsername}/>
              </Grid2>
              <Grid2 xs={4}>
                <Button variant="contained" size="medium" color="primary" onClick={this.getAccountBundles}>Find</Button>
              </Grid2>
            </Grid2>
            
            <Grid2 container>
              <Grid2 xs>
                <FormControl sx={{m:4}} component="fieldset"variant="standard">
                <FormLabel>Location of pattern</FormLabel>
                  <FormGroup>
                    <FormControlLabel label="Favorites" control={
                      <Checkbox name="favorites" checked={this.state.locationsSelected.favorites} onChange={this.updateFavoritesLocation}/>
                    }/>
                    <FormControlLabel label="Bundles" control={
                      <Checkbox name="bundles" checked={this.state.locationsSelected.bundles} onChange={this.updateBundlesLocation}/>
                    }/>
                    <FormControlLabel label="Library" control={
                      <Checkbox name="library" checked={this.state.locationsSelected.library} onChange={this.updateLibraryLocation}/>
                    }/>
                    <FormControlLabel label="Queue" control={
                      <Checkbox name="queue" checked={this.state.locationsSelected.queue} onChange={this.updateQueueLocation}/>
                    }/>
                  </FormGroup>
                </FormControl>
              </Grid2>
              <Grid2 xs display="flex" justifyContent="center" alignItems="center">
                <FormControl sx={{m:1, minWidth:150}} disabled={!this.state.locationsSelected.bundles}>
                  <InputLabel id="bundle-select-label">Bundles</InputLabel>
                  <Select id="bundle-select" labelId='bundle-select-label' autowidth onChange={this.bundleSelect} value={this.state.selectedBundle.name} label="Bundle">
                    {this.state.bundles.map(bundle=>(<MenuItem key={bundle.id} value={bundle}>{bundle.name}</MenuItem>))}
                  </Select>
                </FormControl>
                {/*<FormControl sx={{m:3}} component="fieldset" variant="standard">
                  <FormLabel>Bundles</FormLabel>
                  <FormGroup>
                    {this.state.bundles.map(bundles=>(<Checkbox name={bundle.name} checked))}
                  </FormGroup>
                  </FormControl>*/}
              </Grid2>
            </Grid2>

            <Grid2 container>
              <Grid2 xs>
              <FormControl sx={{m:3}} component="fieldset"variant="standard">
                <FormLabel>Craft Type</FormLabel>
                  <FormGroup>
                    <FormControlLabel label="Crochet" control={
                      <Checkbox name="crochet" checked={this.state.craft.crochet} onChange={this.updateCrochetCraft}/>
                    }/>
                    <FormControlLabel label="Knitting" control={
                      <Checkbox name="knitting" checked={this.state.craft.knitting} onChange={this.updateKnittingCraft}/>
                    }/>
                  </FormGroup>
                </FormControl>
              </Grid2>

              <Grid2 sm display="flex" justifyContent="center" alignItems="center">
                <FormControlLabel label="Free?" control={
                  <Checkbox aame="free" checked={this.state.free} onChange={this.updateFree}/>
                }/>
              </Grid2>

              <Grid2 m display="flex" justifyContent="center" alignItems="center">
                <TextField id="range-one-txt" label="Lower Limit" variant="outlined" onChange={this.updateLowerLimit}/>
                <p>-</p>
                <TextField id="range-two-txt" label="Upper Limit" variant="outlined" onChange={this.updateUpperLimit}/>
              </Grid2>
            </Grid2>
          </header>
        </ThemeProvider>
      </div>
    );
  }
}
export default App;
