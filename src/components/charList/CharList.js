import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';
import './charList.scss';


class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 1235,
        charEnded: false
    }

    itemRefs =[];

    marvelService = new MarvelService()

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharecters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false
        if (newCharList.length < 9) {
            ended = true
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList], 
            loading: false, 
            newItemsLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    setRef = (ref) => {
        this.itemRefs.push(ref)
    }

    onFocusItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems = (arr) => {
        let items = arr.map((char, i) => {
            let {name, thumbnail, id} = char;
            let imageStyle = thumbnail.includes('image_not_available') ? {objectFit: 'unset'} : {objectFit: 'cover'};
            return (
                <li 
                    ref={this.setRef} 
                    tabIndex={0} 
                    className="char__item" 
                    key={id} 
                    onClick={()=> {
                        this.props.onCharSelected(id)
                        this.onFocusItem(i)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter'){
                            this.props.onCharSelected(id)
                            this.onFocusItem(i)
                        }
                    }}>
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
        const {charList, loading, error, newItemsLoading, offset, charEnded} = this.state;
        let items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null,
              spinner = loading ? <Spinner/> : null,
              content = !(loading || error) ? items : null;
        
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}            
                <button 
                    className="button button__main button__long" 
                    disabled={newItemsLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;