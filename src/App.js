import React from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Grid2 from '@mui/material/Unstable_Grid2';
import {TextField, Card, CardContent, CardMedia, Typography, CardActionArea, Radio, RadioGroup, FormLabel, Checkbox, Button, Select, MenuItem, InputLabel, FormControl, FormGroup, FormControlLabel} from '@mui/material';
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
      authUsername:"cf14724ae3d4fe3f442acd8fec81c952",
      authPassword:"eiRTcSlXigayOhHdZTPD1LoQ_MdVGt_C_7_hkyHn",
      bundles: [],
      selectedBundle:[],
      craft:"crochet",
      free:false,
      loweryardage:0,
      upperyardage:0,
      yarnweight:"",
      foundbundle:[],
      selectedpattern:[],
      randomized:false,
      patterndisplay: "Choose randomize to get a pattern!"
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

  updateCraft = (e) => {
    this.setState({craft:e.target.value});
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

  weightSelect = (e) =>{
    this.setState({yarnweight: e.target.value})
  }

  findPattern = (bundle_items) =>{
    
  }

  randomize = () => {
    let bundled_items = [];
    this.setState({selectedpattern:[]});
    this.setState({randomized: false});
    const url = this.state.urlBase + "/people/"+this.state.account+"/bundles/"+this.state.selectedBundle.id+".json";
    const h = new Headers();
    h.append("Authorization", "Basic "+ (Buffer.from(this.state.authUsername+":"+this.state.authPassword).toString('base64')));
    return fetch(url, {method: 'GET', headers:h})
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
      bundled_items = responseData.bundle.bundled_items;
      let patterns = [];
      bundled_items.map(item=>{patterns.push(item.bookmark.favorited)});
      /*Search for attributes*/


      let url2 = this.state.urlBase + "/patterns.json?ids=";
      patterns.map(pattern=>{url2+=pattern.id+"+";})
      return fetch(url2, {method: 'GET', headers:h})
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
        /* have the patterns now in responseData, just have to narrow down */
        let full_patterns = [];
        console.log(responseData.patterns);
        for(var i in responseData.patterns){
          full_patterns.push(responseData.patterns[i]);
        }
        /* craft type search */        
        full_patterns = full_patterns.filter(pattern=>pattern.craft.permalink == this.state.craft);
        if(this.state.free==true){
          full_patterns = full_patterns.filter(pattern=>pattern.free==this.state.free);
        }
        if(this.state.upperyardage!=0 && this.state.loweryardage!=0){
          full_patterns = full_patterns.filter(pattern=>(pattern.yardage <= this.state.upperyardage && pattern.yardage_max >= this.state.loweryardage));
        }
        if(this.state.yarnweight!=""){
          full_patterns = full_patterns.filter(pattern=>pattern.yarn_weight.name == this.state.yarnweight);
        }
        let selected = full_patterns[Math.floor(Math.random()*(full_patterns.length))];
        if(selected==undefined){
          this.setState({patterndisplay:"No patterns found with those params!"})
        }
        else{
          this.setState({selectedpattern: selected});
          this.setState({randomized: true});
        }
      })
      .catch((error) =>{
        console.log(error);
      })


    })
    .catch((error) =>{
      console.log(error);
    })
    
  }

  render() 
  {
    const weights = ["Thread", "Cobweb", "Lace", "Light Fingering", "Fingering", "Sport", "DK", "Worseted", "Aran", "Bulky", "Super Bulky", "Jumbo"];
    let card;
    if(this.state.randomized==true){
      card= <Card sx={{maxWidth: 500}} >
              <CardMedia component="img" height="300" src={this.state.selectedpattern.photos[0].medium_url}/>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {this.state.selectedpattern.name}
                </Typography>
                <a href={"https://ravelry.com/patterns/library/"+this.state.selectedpattern.permalink}>Click to see pattern!</a>
              </CardContent>
                
            </Card>;
    }
    else{
      card=<p>{this.state.patterndisplay}</p>;
    }
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <header className="App-header">
            <h1>RavelryRandomizer</h1>
            <Grid2 container columnspacing={3} alignItems="center" marginBottom={4}>
              <Grid2 xs={8}>
                <TextField id="username-txt" label="Username" variant="outlined" onChange={this.updateAccountUsername}/>
              </Grid2>
              <Grid2 xs={4}>
                <Button variant="contained" size="medium" color="primary" onClick={this.getAccountBundles}>Find</Button>
              </Grid2>
            </Grid2>
            
            <Grid2 container>
              <Grid2 xs>
                <FormControl  component="fieldset"variant="standard">
                  <FormLabel>Craft Type</FormLabel>
                    
                  <RadioGroup defaultValue="crochet" name="craft-radios" onChange={this.updateCraft}>
                    <FormControlLabel value="crochet" control={<Radio/>} label="Crochet"/>
                    <FormControlLabel value="knitting" control={<Radio/>} label="Knitting"/>
                  </RadioGroup>
                </FormControl>
              </Grid2>

              <Grid2 xs={2} display="flex" justifyContent="center" alignItems="center">
                <FormControl sx={{m:1, minWidth:150}}>
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

            <Grid2 container >
              

              <Grid2 xs={1} display="flex" justifyContent="center" alignItems="center">
                <FormControlLabel label="Free?" control={
                  <Checkbox aame="free" checked={this.state.free} onChange={this.updateFree}/>
                }/>
              </Grid2>

              <Grid2 m={1} display="flex" justifyContent="center" alignItems="center">
                <TextField id="range-one-txt" label="Lower Limit" variant="outlined" onChange={this.updateLowerLimit}/>
                <p>-</p>
                <TextField id="range-two-txt" label="Upper Limit" variant="outlined" onChange={this.updateUpperLimit}/>
              </Grid2>

              <Grid2 m={1} display="flex" justifyContent="center" alignItems="center">
                <FormControl sx={{sm:1, minWidth:150}}>
                  <InputLabel id="weight-select-label">Yarn Weight</InputLabel>
                  <Select id="weight-select" labelId='weight-select-label' autowidth onChange={this.weightSelect} value={this.state.yarnweight} label="Weights">
                    {weights.map(weight=>(<MenuItem key={weight} value={weight}>{weight}</MenuItem>))}
                  </Select>
                </FormControl>
              </Grid2>
            </Grid2>
            <Button variant="contained" size="large" color="primary" onClick={this.randomize} display="flex" justifyContent="center" alignItems="center">Randomize!</Button>

            {card}
          </header>
        </ThemeProvider>
      </div>
    );
  }
}
export default App;
