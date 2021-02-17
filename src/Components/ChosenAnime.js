import fetch from 'node-fetch';
import React, { useEffect, useState } from 'react';
import {useParams,withRouter} from 'react-router-dom';

const ChosenAnime = props => {
        const {id} = useParams();
        const [state, setState] = useState( [{id: '', url: '', image: '', title: '', opThemes: [], edThemes: []}] )
        const [hasError, setHasError] = useState(false);

        useEffect(() => {
            console.log('in useEffect')
            fetch(`/anime/${id}`)
            .then(res => res.json())
            .then(anime => {
                const animeInfo = [{
                    id: anime.mal_id,
                    url: anime.url,
                    image: anime.image_url,
                    title: anime.title_english,
                    opThemes: anime.opening_themes,
                    edThemes: anime.ending_themes,
                }]

                setState(animeInfo);

            })
                
                //console.log(opThemes);
            .catch(err => setHasError(true))
        }, [])

        

            return(
            <div className = 'SongNames'>
                {hasError? <div>Error occured</div> :
                <div>
                    <h3>{state[0].title}</h3>
                    <img src = {state[0].image}/>
                    <a href = {state[0].url}>MyAnimeList Page</a>
                    <h4>Opening Themes</h4>
                    <div>{state[0].opThemes.map(d => <li><a href = '' onClick = {(event) => {getLinks(d); event.preventDefault();}}> {d}</a></li>)}</div>
                    <h4>Ending Themes</h4>
                    <div>{state[0].edThemes.map(d => <li><a href = '' onClick = {(event) => {getLinks(d); event.preventDefault();}}> {d}</a></li>)}</div>
                    </div>}
            </div>
        )
    }

const getLinks = (title) =>{
        title = title.replace(/ *\([^)]*\) */g, "").replace('by', '').replace(new RegExp("[0-9]", "g"), '').replace('#: ', '').replace(/"/g, '').replace(/ /g, '+');

        console.log('song title: ', title)
        fetch(`/getSong/${title}`)
        .then(res => res.json())
        .then(link => {
            window.open(link, '_blank');
        })
    }



export default withRouter(ChosenAnime);
