

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=06f0c861647a8a692ff20cf31e6d0280';
    getResource = async (url) => {
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }
        return await res.json()
    }

    getAllCharecters = async () => {
        const res = this.getResource(`${this._apiBase}characters?limit=9&offset=1235&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharecter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    } 

    _transformCharacter = (data) => {
        return {
            name: data.name,
            description: data.description ? `${data.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: data.thumbnail.path + '.' + data.thumbnail.extension,
            homepage: data.urls[0].url,
            wiki: data.urls[1].url
        }
    }
}


export default MarvelService;