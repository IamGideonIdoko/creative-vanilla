class Client {
  private pathname: string;
  public constructor() {
    this.pathname = window.location.pathname;

    console.log('Client path: ', this.pathname);

    this.createCanvas();
    this.createPreloader();
    this.createTransition();
    this.createNavigation();
    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();

    this.onResize();

    this.update();
  }

  private createNavigation() {
    //
  }

  private createPreloader() {
    //
  }

  private createCanvas() {
    //
  }

  private createTransition() {
    //
  }

  private createPages() {
    //
  }

  // EVENTS
  private onPreloaded() {
    this.onResize();
  }

  private onPopState() {
    //
  }

  // private async onChange({ url, push = true }: { url: string; push: boolean }) {
  //   //
  // }

  private onResize() {
    //
  }

  private onTouchDown() {
    //
  }

  private onTouchMove() {
    //
  }

  private onTouchUp() {
    //
  }

  private onWheel() {
    //
  }

  // LOOP
  private update() {
    // if (this.page?.update) {
    //   this.page.update();
    // }
    // if (this.canvas?.update) {
    //   this.canvas.update(this.page.scroll);
    // }
    // this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  // Listeners
  private addEventListeners() {
    window.addEventListener('popstate', this.onPopState.bind(this));
    window.addEventListener('mousewheel', this.onWheel.bind(this));

    window.addEventListener('mousedown', this.onTouchDown.bind(this));
    window.addEventListener('mousemove', this.onTouchMove.bind(this));
    window.addEventListener('mouseup', this.onTouchUp.bind(this));

    window.addEventListener('touchstart', this.onTouchDown.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('touchend', this.onTouchUp.bind(this));

    window.addEventListener('resize', this.onResize.bind(this));
  }

  private addLinkListeners() {
    const links = document.querySelectorAll('a');

    links.forEach((link) => {
      const isLocal = link.href.indexOf(window.location.origin) > -1;

      const isNotEmail = link.href.indexOf('mailto') === -1;
      const isNotPhone = link.href.indexOf('tel') === -1;

      if (isLocal) {
        link.onclick = (event) => {
          event.preventDefault();

          // this.onChange({
          //   url: link.href,
          // });
        };

        // link.onmouseenter = (event) => this.onLinkMouseEnter(link);
        // link.onmouseleave = (event) => this.onLinkMouseLeave(link);
      } else if (isNotEmail && isNotPhone) {
        link.rel = 'noopener';
        link.target = '_blank';
      }
    });
  }
}

new Client();
