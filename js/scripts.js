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
    });

}