import React, { Component} from "react";

class SearchBar extends Component{
    constructor(){
        super();
        this.state = {
            search: ''
        }
    }


    render(){
        const textInput = <input type = 'text' defaultValue = 'Search' onChange = {(event) => this.setState({search: event.target.value})}></input>;
        const button = <button onClick = {(event) => {this.props.animeSearch(this.state.search); event.preventDefault();}}>Search</button>
        return(
            <div className = 'search'>
                {textInput} {button}
                
            </div>
        )
    }
}

export default SearchBar;