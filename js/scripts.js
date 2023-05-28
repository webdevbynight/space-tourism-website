'use strict';

// Let’s ensure the browser is enough modern to understand modern JavaScript
if ('matchMedia' in window && 'querySelector' in document && typeof DOMTokenList === 'function')
{
    // Breakpoints for media queries (same as in `sass/styles.scss`)
    const mediaQueriesBreakpoints =
    {
        'horizontal-menu': 600,
        'desktop': 800,
        'wide-menu': 997,
        'multicol-home-content': 1120,
        'multicol-article': 1182,
        'wide-technology-multicol-article': 1280,
        'wide-destination-multicol-article': 1327,
        'wide-multicol-stats': 1390
    };

    /**
     * Get em from px
     * @param {String|Number} breakpoint - A keyword, a number with an unit or an unitless number for the breakpoint
     * @returns {String|Boolean} - The string with the breakpoint in ems if the breakpoint is correctly assigned or false
     */
    const getEmFromPx = (breakpoint) =>
    {
        if (typeof breakpoint === 'string')
        {
            if (Object.keys(mediaQueriesBreakpoints).includes(breakpoint)) return `${mediaQueriesBreakpoints[breakpoint] / 16}em`;
            if (breakpoint.endsWith('px')) return `${Number.parseFloat(breakpoint) / 16}em`;
            if (breakpoint.endsWith('rem')) return `${Number.parseFloat(breakpoint) / 1.6}em`;
            if (breakpoint.endsWith('em')) return breakpoint;
            return false;
        }
        if (typeof breakpoint === 'number') return `${breakpoint / 16}em`;
        return false;
    };

    document.addEventListener('DOMContentLoaded', () =>
    {
        // Add the `js` class to the `body` element
        document.body.classList.add('js');
    
        // Listen to load and resize events for permanent responsive
        ['load', 'resize'].forEach(event =>
        {
            window.addEventListener(event, () =>
            {
                // Enlarge the logo on wider screens
                const logo = document.querySelector('#header h1 img');
                logo.width = (window.matchMedia(`(width >= ${getEmFromPx(mediaQueriesBreakpoints['horizontal-menu'])})`).matches)? '48' : '40';
                logo.height = logo.width;
                
                // The menu show on small screens
                const menu = document.getElementById('menu'),
                    closeButton = menu.querySelector('.close-menu');
                if (window.matchMedia(`(width < ${getEmFromPx(mediaQueriesBreakpoints['horizontal-menu'])})`).matches)
                {
                    const skipLinkMenu = document.querySelector('#skip-link a');
                    if (!closeButton)
                    {
                        const button = document.createElement('button');
                        button.setAttribute('type', 'button');
                        button.classList.add('close-menu');
                        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21"><desc>Close menu</desc><g><path d="M2.575.954l16.97 16.97-2.12 2.122L.455 3.076z"/><path d="M.454 17.925L17.424.955l2.122 2.12-16.97 16.97z"/></g></svg>';
                        button.addEventListener('click', () =>
                        {
                            menu.classList.remove('active');
                        });
                        menu.appendChild(button);
                    }
                    skipLinkMenu.addEventListener('click', e =>
                    {
                        e.preventDefault();
                        menu.classList.add('active');
                    });
                }
                else if (closeButton) closeButton.remove();

            });
        });

        // Build the sliders
        const article = document.querySelector('#content article'),
            cards = article.querySelectorAll('.card'),
            slider = document.createElement('div'),
            sliderContainer = document.createElement('div'),
            sliderNavigation = document.createElement('nav');
        slider.classList.add('cards', 'display-slide-1');
        sliderContainer.classList.add('slider-container');
        sliderContainer.appendChild(sliderNavigation);
        sliderContainer.appendChild(slider);
        sliderNavigation.classList.add('slider-navigation');
        sliderNavigation.innerHTML = '<ul></ul>';
        cards.forEach((card, index) =>
        {
            const slideItem = ++ index,
                displaySlide = (e) =>
                {
                    e.preventDefault();
                    const siblings = document.querySelectorAll('.slider-container a');
                    for (let node of siblings)
                    {
                        if (node.hash === `#${card.id}`) node.setAttribute('aria-current', 'true');
                        else node.removeAttribute('aria-current');
                    };
                    slider.classList.replace(slider.classList[1], `display-slide-${slideItem}`);
                },
                bodyClasses = document.body.classList,
                li = document.createElement('li'),
                link = document.createElement('a'),
                linkTitle = card.querySelector('h2').innerHTML.replace(/<\/?span>/g, ''),
                svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
                desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc'),
                circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('width', '10');
            svg.setAttribute('height', '10');
            svg.setAttribute('viewBox', '0 0 10 10');
            desc.textContent = linkTitle;
            circle.setAttribute('cx', '5');
            circle.setAttribute('cy', '5');
            circle.setAttribute('r', '5');
            svg.appendChild(desc);
            svg.appendChild(circle);
            li.appendChild(link);
            link.href = `#${card.id}`;
            link.addEventListener('click', displaySlide);
            if (!bodyClasses.contains('technology'))
            {
                if (bodyClasses.contains('crew'))
                {
                    link.appendChild(svg);
                    link.title = linkTitle;
                }
                else link.innerHTML = linkTitle;
            }
            else
            {
                link.innerHTML = slideItem;
                link.setAttribute('aria-label', linkTitle);
                link.title = linkTitle;
            }
            sliderNavigation.querySelector('ul').appendChild(li);
            slider.appendChild(card);
        });
        article.appendChild(sliderContainer);

        // The first slide being shown by default, simulate the click on the first anchor
        sliderNavigation.querySelector('a').click();
    });

}