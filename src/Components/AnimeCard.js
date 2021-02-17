import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class AnimeCard extends Component{
    //properties should be:
    //id
    //url
    //english titleonClick = {() => this.props.chosenID(this.props.id)}
    //opening themes
    //ending themes
    render(){
        return(
            <div className = 'AnimeCard'>
                 <h2>{this.props.title}</h2>
                <Link to={`/found/${this.props.id}`}>
                 <img src = {this.props.image} />
                </Link>
                
                <a href = {this.props.url}>MyAnimeList Page</a>
                
            </div>
        )
    }
}

export default AnimeCard;