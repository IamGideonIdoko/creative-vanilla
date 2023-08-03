class Client {
  private path: string;
  constructor() {
    this.path = window.location.pathname;
    console.log('Client path: ', this.path);
  }
}

new Client();
