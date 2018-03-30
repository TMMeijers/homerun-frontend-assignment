function getCalcHeightForEl(el) {
    return () => {
        const currentState = el.getAttribute('aria-expanded');

        el.classList.add('u-no-transition');
        el.removeAttribute('aria-expanded');
        el.style.height = null;
        el.style.height = `${el.clientHeight}px`;
        el.setAttribute('aria-expanded', currentState);

        setTimeout(() => {
            el.classList.remove('u-no-transition');
        });
    };
}


export default {
    install(Vue) {
        /**
         * Transition directive to go from 0 height to auto
         * https://codepen.io/sebj54/pen/eveZQr
         */
        Vue.directive('expand', {
            inserted(el, binding) {
                if (binding.value !== null) {
                    el.classList.add('expand');
                    el.setAttribute('aria-expanded', binding.value ? 'true' : 'false');
                    const curriedCalcHeight = getCalcHeightForEl(el);
                    curriedCalcHeight();
                    window.addEventListener('resize', curriedCalcHeight);
                }
            },
            update(el, binding) {
                if (el.style.height && binding.value !== null) {
                    el.setAttribute('aria-expanded', (binding.value) ? 'true' : 'false');
                }
            },
        });
    },
};
