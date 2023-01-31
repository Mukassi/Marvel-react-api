import { useHttp } from "../hooks/http.hook";

const useMarvelService = ()=> {
    const  {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=06f0c861647a8a692ff20cf31e6d0280';
    const _baseOffset = 1235;

    const getAllCharecters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharecter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    } 

    const _transformCharacter = (data) => {
        return {
            id: data.id,
            name: data.name,
            description: data.description ? `${data.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: data.thumbnail.path + '.' + data.thumbnail.extension,
            homepage: data.urls[0].url,
            wiki: data.urls[1].url,
            comics: data.comics.items
        }
    }
    return {loading, error, getAllCharecters, getCharecter, clearError}
}


export default useMarvelService;