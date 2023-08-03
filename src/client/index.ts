class Client {
  private pathname: string;
  constructor() {
    this.pathname = window.location.pathname;
    console.log('Client path: ', this.pathname);
  }
}

new Client();
