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
        'multicol-home-content': 1120
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
                logo.width = (window.matchMedia(`(min-width: ${getEmFromPx(mediaQueriesBreakpoints['horizontal-menu'])})`).matches)? '48' : '40';
                logo.height = logo.width;
            });
        });
    });

}