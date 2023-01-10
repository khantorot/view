const body = document.body;
let mob = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;

const MathUtils = {
    map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,
    lerp: (a, b, n) => (1 - n) * a + n * b,
    getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
};



let winsize;


const calcWinsize = () => winsize = { width: window.innerWidth, height: window.innerHeight };
calcWinsize();

window.addEventListener('resize', calcWinsize);


let docScroll;
let lastScroll;
let scrollingSpeed = 0;

const getPageYScroll = () => docScroll = window.pageYOffset || document.documentElement.scrollTop;


let last_scroll_top = 0;
let scroll_checker = 0;
let preloader = document.querySelector('.preloader');
window.addEventListener('scroll', function () {

    getPageYScroll();

    last_scroll_top = docScroll;
    scroll_checker = 1;
});

class SmoothScroll {
    constructor() {
        this.DOM = { main: document.querySelector('main') };
        this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]');

        this.renderedStyles = {
            translationY: {
                previous: 0,
                current: 0,
                ease: 0.1,
                setValue: () => docScroll
            }
        };
        this.setSize();
        this.update();
        this.style();
        this.initEvents();
        requestAnimationFrame(() => this.render());
    }
    update() {
        for (const key in this.renderedStyles) {
            this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
        }
        this.layout();
    }
    layout() {
        this.DOM.scrollable.style.transform = `translate3d(0,${-1 * this.renderedStyles.translationY.previous}px,0)`;
    }
    setSize() {
        body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
    }
    style() {
        this.DOM.main.style.position = 'fixed';
        this.DOM.main.style.width = this.DOM.main.style.height = '100%';
        this.DOM.main.style.top = this.DOM.main.style.left = 0;
        this.DOM.main.style.overflow = 'hidden';
    }
    initEvents() {
        window.addEventListener('resize', () => this.setSize());
    }
    render() {

        scrollingSpeed = Math.abs(docScroll - lastScroll);
        lastScroll = docScroll;


        if (docScroll == 0) {
            document.querySelector('.preloader').classList.remove('hide_prelaoder');
        } else if (docScroll + winsize.height == document.body.scrollHeight) {
            document.querySelector('footer').classList.add('show_footer');
        } else {
            document.querySelector('.preloader').classList.add('hide_prelaoder');
            document.querySelector('footer').classList.remove('show_footer');
        }

        for (const key in this.renderedStyles) {
            this.renderedStyles[key].current = this.renderedStyles[key].setValue();
            this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
        }
        this.layout();

        requestAnimationFrame(() => this.render());
    }
}

function scrollSmooth() {
    getPageYScroll();
    lastScroll = docScroll;

    new SmoothScroll();
}





function scrollTo(element, to, duration) {
    let start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    let animateScroll = function () {
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};


window.addEventListener('load', function () {
    const prelaoder = document.querySelector('.preloader');

    setTimeout(function () {
        if (mob == false) { 
            scrollSmooth() 
        }
        prelaoder.classList.add('showPreloader');
        body.style.overflowY = 'scroll';
    }, 300);

    setTimeout(function () {
        getPageYScroll();
        if (docScroll == 0 && mob == false && scroll_checker == 0) {
            scrollTo(document.documentElement, winsize.height, 1000);
        }
    }, 10000);

})



const links = document.querySelectorAll('a');
const main = document.querySelector('main');

links.forEach(function (link) {
    link.addEventListener('click', onLinkClicked);

    function onLinkClicked(event) {
        if (this.getAttribute('target') != '_blank') {
            event.preventDefault();
            main.classList.remove('fade_out_active')
            setTimeout(onAnimationComplete, 1000);
        }
    }

    function onAnimationComplete() {
        window.location = link.href;
    }
});