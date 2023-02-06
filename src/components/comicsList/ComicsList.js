import useMarvelService from "../../services/MarvelService";
import { useState, useEffect } from "react";
import "./comicsList.scss";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [offset, setOffset] = useState(8);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { loading, error, getAllComics } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onRequest(offset, initial) {
    initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
    getAllComics(offset).then(onComicsListLoaded);
  }

  const onComicsListLoaded = (newComicsList) => {
    let ended = false;
    if (newComicsList < 8) {
      ended = true;
    }

    setComicsList((comicsList) => [...comicsList, ...newComicsList]);
    setNewItemsLoading(false);
    setOffset((offset) => offset + 8);
    setComicsEnded(ended);
  };

  const renderItems = (arr) => {
    let items = arr.map((comics, i) => {
      let { name, thumbnail, price} = comics;
      return (
        <li tabIndex={0} className="comics__item" key={i}>
          <img src={thumbnail} alt={name} className="comics__item-img" />
          <div className="comics__item-name">{name}</div>
          <div className="comics__item-price">{price}</div>
        </li>
      );
    });
    return <ul className="comics__grid">{items}</ul>;
  };

  let items = renderItems(comicsList);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemsLoading ? <Spinner /> : null;

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      {items}
      <button
        className="button button__main button__long"
        disabled={newItemsLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
