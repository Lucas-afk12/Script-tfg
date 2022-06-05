import axios, { AxiosRequestConfig } from 'axios';

class QuerysToAPI {
  private user = {
    username: 'Lucasc12',
    password: 'Salmeron1-',
  };

  private token : string = '';

  private hash: string = '';

  private imageUrl : string | undefined = '';

  private baseURL : string = '';

  private data : any[] = []

  private config : AxiosRequestConfig = {
    headers: {
      authorization: '',
    },
  };

  private session : boolean = false;

  async login() {
    await axios.post('https://api.mangadex.org/auth/login', this.user).then((res) => this.token = `${res.data.token.session}`).catch((err) => console.log(err.response.data));
    if (this.config.headers !== undefined) {
      this.config.headers.authorization = `bearer ${this.token}`;
      return true;
    }
    return false;
  }

  async checkSession() {
    await axios.get('https://api.mangadex.org/auth/check', this.config).then((res) => { if (res.data.isAuthenticated) { this.session = true; } });
  }

  async URL(id:string) {
    if (this.session) {
      await axios.get(`https://api.mangadex.org/at-home/server/${id}`, this.config).then((res) => {this.baseURL = res.data.baseUrl; this.hash = res.data.chapter.hash; this.data=res.data.chapter.data});
      return this.data
    }
    await axios.get(`https://api.mangadex.org/at-home/server/${id}`, this.config).then((res) => {this.baseURL = res.data.baseUrl; this.hash = res.data.chapter.hash; this.data=res.data.chapter.data});
    console.log(this.data)
    return this.data;
  }

  async getIMAGE(image:string) {
      await axios.get(`${this.baseURL}/data/${this.hash}/${image}`, this.config).then((res) => this.imageUrl= res.config.url);
      return this.imageUrl;
  }
}

export const querysToapi = new QuerysToAPI();
