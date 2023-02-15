import { useState, useEffect, useRef, useMemo } from "react";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PropTypes from "prop-types";
import "./charList.scss";

const setContent = (process, Component, newItemsLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;
    case "loading":
      return newItemsLoading ? <Component /> : <Spinner />;
    case "confirmed":
      return <Component />;
    case "error":
      return <ErrorMessage />;
    default:
      throw new Error("Unexpected process state");
  }
};

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(1235);
  const [charEnded, setCharEnded] = useState(false);

  const { getAllCharacters, process, setProcess } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onRequest(offset, initial) {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
      .then(onCharListLoaded)
      .then(() => setProcess("confirmed"));
  }

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList((charList) => [...charList, ...newCharList]);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const itemRefs = useRef([]);

  const onFocusItem = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  const renderItems = (arr) => {
    let items = arr.map((char, i) => {
      let { name, thumbnail, id } = char;
      let imageStyle = thumbnail.includes("image_not_available")
        ? { objectFit: "unset" }
        : { objectFit: "cover" };
      return (
        <li
          ref={(el) => (itemRefs.current[i] = el)}
          tabIndex={0}
          className="char__item"
          key={id}
          onClick={() => {
            props.onCharSelected(id);
            onFocusItem(i);
          }}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              props.onCharSelected(id);
              onFocusItem(i);
            }
          }}
        >
          <img src={thumbnail} alt={name} style={imageStyle} />
          <div className="char__name">{name}</div>
        </li>
      );
    });
    return <ul className="char__grid">{items}</ul>;
  };

  const elements = useMemo(() => {
    return setContent(process, () => renderItems(charList), newItemLoading)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [process])
  return (
    <div className="char__list">
      {elements}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
