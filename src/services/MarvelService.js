import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiKey = "apikey=06f0c861647a8a692ff20cf31e6d0280";
  const _baseOffset = 1235;

  const getAllCharecters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getAllComics = async (offset = 14) => {
    const res = await request(
      `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformComics);
  };

  const getCharecter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  };

  const _transformComics = (data) => {
    return {
      id: data.id,
      name: data.title,
      description: data.description
        ? `${data.description.slice(0, 210)}...`
        : "There is no description for this comics",
      pageCount: data.pageCount
        ? `${data.pageCount} p.`
        : "No information about the number of pages",
      thumbnail: data.thumbnail.path + "." + data.thumbnail.extension,
      language: data.textObjects[0]?.language || "en-us",
      price: data.prices[0].price
        ? `${data.prices[0].price}$`
        : "not available",
    };
  };

  const _transformCharacter = (data) => {
    return {
      id: data.id,
      name: data.name,
      description: data.description
        ? `${data.description.slice(0, 210)}...`
        : "There is no description for this character",
      thumbnail: data.thumbnail.path + "." + data.thumbnail.extension,
      homepage: data.urls[0].url,
      wiki: data.urls[1].url,
      comics: data.comics.items,
    };
  };
  return {
    loading,
    error,
    getAllCharecters,
    getCharecter,
    getAllComics,
    getComic,
    clearError,
  };
};

export default useMarvelService;
