import NormalizeWheel from 'normalize-wheel';
import Navigation from './components/Navigation.ts';
import Preloader from './components/Preloader';
import Transition from './components/Transition';
import Home from './pages/Home';
import About from './pages/About';

class Client {
  private pathname: string;
  private navigation!: Navigation;
  private preloader!: Preloader;
  private transition!: Transition;
  private page!: Home | About;
  private pages!: { '/': Home; '/about': About };

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
    this.navigation = new Navigation({
      pathname: this.pathname,
    });
  }

  private createPreloader() {
    this.preloader = new Preloader();

    // this.preloader.once('completed', this.onPreloaded.bind(this));
  }

  private createCanvas() {
    //
  }

  private createTransition() {
    this.transition = new Transition();
  }

  private createPages() {
    const home = new Home();
    const about = new About();

    this.pages = {
      '/': home,
      '/about': about,
    };

    this.page = this.pages[this.pathname as keyof typeof this.pages];
  }

  // EVENTS
  private onPreloaded() {
    this.onResize();

    this.page.show();
  }

  private onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  private async onChange({ url, push = true }: { url: string; push?: boolean }) {
    url = url.replace(window.location.origin, '');

    const page = this.pages[url as keyof typeof this.pages];

    await this.transition.show({
      color: page.element!.getAttribute('data-color')!,
    });

    if (push) {
      window.history.pushState({}, '', url);
    }

    this.pathname = window.location.pathname;

    this.page.hide();

    this.navigation.onChange(this.pathname);

    this.page = page;

    this.page.show();

    this.onResize();

    this.transition.hide();
  }

  private onResize() {
    this.page.onResize();

    // window.requestAnimationFrame((_) => {
    //   if (this.canvas?.onResize) {
    //     this.canvas.onResize();
    //   }
    // });
  }

  private onTouchDown(event: TouchEvent | MouseEvent) {
    this.page.onTouchDown(event);
  }

  private onTouchMove(event: TouchEvent | MouseEvent) {
    this.page.onTouchMove(event);
  }

  private onTouchUp() {
    this.page.onTouchUp();
  }

  private onWheel() {
    const normalizedWheel = NormalizeWheel(event);
    this.page.onWheel(normalizedWheel);
  }

  // LOOP
  private update() {
    this.page.update();
    window.requestAnimationFrame(this.update.bind(this));
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

          this.onChange({
            url: link.href,
          });
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
