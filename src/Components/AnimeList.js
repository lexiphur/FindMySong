import React, {Component} from 'react';
import AnimeCard from './AnimeCard.js';
          // const animeInfo = {
        //     id: anime.mal_id,
        //     url: anime.url,
        //     title_english: anime.title_english,
        //     opening_themes: anime.opening_themes,
        //     ending_themes: anime.ending_themes
        // }

class AnimeList extends Component {
    render(){
        const animeArray = [];
        for (let i = 0; i < this.props.animeList.length; i++){
          animeArray.push(
            <AnimeCard 
            title = {this.props.animeList[i].title}
            id = {this.props.animeList[i].mal_id}
            image = {this.props.animeList[i].image_url}
            url = {this.props.animeList[i].url}/>)
        }

        return(
            <div className = "AnimeContainer">
                {animeArray}
            </div>
        )
    }
}

export default AnimeList;
