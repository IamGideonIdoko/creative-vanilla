class Detection {
  public isPhoneChecked = false;
  public isPhoneCheck = false;
  public isTabletChecked = false;
  public isTabletCheck = false;
  public isWebPChecked = false;
  public isWebPCheck = false;

  public isPhone() {
    if (!this.isPhoneChecked) {
      this.isPhoneChecked = true;

      this.isPhoneCheck = document.documentElement.classList.contains('phone');
    }

    return this.isPhoneCheck;
  }

  public isTablet() {
    if (!this.isTabletChecked) {
      this.isTabletChecked = true;

      this.isTabletCheck = document.documentElement.classList.contains('phone');
    }

    return this.isTabletCheck;
  }

  public isDesktop() {
    return !this.isPhone();
  }

  public isWebPSupported() {
    if (!this.isWebPChecked) {
      this.isWebPChecked = true;

      const element = document.createElement('canvas');

      if (element?.getContext('2d')) {
        this.isWebPCheck = element.toDataURL('image/webp').startsWith('data:image/webp');
      }
    }

    return this.isWebPCheck;
  }
}

const DetectionManager = new Detection();

export default DetectionManager;
