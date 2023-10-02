import * as React from 'react';
import {forwardRef} from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link, {LinkProps} from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {useLocation, useNavigate} from 'react-router-dom';
import './ActivateLastBreadcrumb.css';

interface LinkRouterProps extends LinkProps {
    to: string;
    replace?: boolean;
}

const breadcrumbNameMap: { [key: string]: string } = {
    '/Totale%20Lisenser': 'Totale Lisenser',
    '/Ubrukte%20Lisenser': 'Ubrukte Lisenser',
    '/Ledige%20Lisenser': 'Ledige Lisenser',
    '/lisensportal': 'Lisensportalen',
    '/leaderboard': 'Ledertavle',
    '/FAQ': 'Ofte stilte spørsmål',
    '/minside': 'Min side'
};

/* LinkRouter  returns a Link with a href to a location set by the variable to,*/
/* Clicking the returned Link routes the user to the pathname location  */
const LinkRouter = forwardRef<HTMLAnchorElement, LinkRouterProps>((props, ref) => {

    // Set to & replace variables based on incoming props
    const {to, replace, ...rest} = props;

    // Get the function for navigating to different routes
    const navigate = useNavigate();

    // Get the current location
    const location = useLocation();

    // Defines what happens when handleClick is called
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (replace) {
            navigate(to, {replace: true});
        } else {
            navigate(to);
        }
    };

    return <Link ref={ref} href={location.pathname === to ? undefined : to} onClick={handleClick} {...rest} />;
});

LinkRouter.displayName = 'LinkRouter';


/**
 * ActiveLastBreadcrumb returns a Breadcrumbs element with a LinkRouter element for each pathname in the current location.
 */
export default function ActiveLastBreadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <Breadcrumbs aria-label="breadcrumb" id="breadcrumbs">
            <LinkRouter underline="hover" color="inherit" to="/">
                Dashboard
            </LinkRouter>
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                return last ? (
                    <Typography color="text.primary" key={to}>
                        {breadcrumbNameMap[to]}
                    </Typography>
                ) : (
                    // Every element that is not the last in the index is a LinkRouter element
                    <LinkRouter underline="hover" color="inherit" to={to} key={to}>
                        {breadcrumbNameMap[to]}
                    </LinkRouter>
                );
            })}
        </Breadcrumbs>
    );
}