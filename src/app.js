import React, { Component} from "react";
import AnimeList from './Components/AnimeList';
import SearchBar from './Components/SearchBar';
import ChosenAnime from './Components/ChosenAnime'
import {Switch, Route, useParams} from 'react-router-dom';
import './styles.css'
import fetch from "node-fetch";

class App extends Component{
  constructor(){
    super();
    this.state = {
      animeList: [],
      user: ''
    }
    this.animeSearch = this.animeSearch.bind(this);
    this.login = this.login.bind(this);
  }

  animeSearch(query){
    console.log('in search')
    fetch(`/anime/?search=${query}`)
    .then(res => res.json())
    .then(list => {
      console.log('talked to server', list)
      this.setState({animeList: list});
    })

  }

  login(){
    console.log('sending fetch')
    fetch('/login')
    .then(res=>res.json())
    .then()
  }


  componentDidMount(){
    fetch('/getUser')
    .then(res => res.json())
    .then(user => {
      this.setState({animeList: [], user: user.display_name});
    })
  }

  render(){

    return(
      <div className="App">
        <main>

        <Switch>


          <Route path = '/found/:id'>
            <div>
              <ChosenAnime />
            </div>
          </Route>

          <Route path = '/spotify'>
            <div>
              <h1>Hello {this.state.user}!</h1>
              <SearchBar animeSearch = {this.animeSearch}/>
              <AnimeList animeList = {this.state.animeList} chosenID = {this.chosenID}/>
            </div>
          </Route>
          
          <Route path = '/'>
            <div>
              <h1>LOGIN</h1>
              <a target = '_self' href = 'http://localhost:8080/login'>LOG IN TO SPOTIFY</a>
            </div>
            
          </Route>
          
        </Switch>
        </main>
        
      </div>
    );
  }
}

export default App;