import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';


class CharList extends Component{
    state = {
        charList: [],
        loading: true,
        error: false
    }
    marvelService = new MarvelService()

    componentDidMount() {
        this.marvelService.getAllCharecters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }
    onCharListLoaded = (charList) => {
        this.setState({charList, loading: false})
    }
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    renderItems = (arr) => {
        let items = arr.map(char => {
            let {name, thumbnail, id} = char;
            let imageStyle = thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : {objectFit: 'cover'};
            return (
                <li className="char__item" key={id} onClick={()=> this.props.onCharSelected(id)}>
                    <img src={thumbnail} alt={name} style={imageStyle}/>
                    <div className="char__name" >{name}</div>
                </li>
            ) 
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    render() {
        const {charList, loading, error} = this.state;
        let items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null,
              spinner = loading ? <Spinner/> : null,
              content = !(loading || error) ? items : null;
        
        return (
        
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}            
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;