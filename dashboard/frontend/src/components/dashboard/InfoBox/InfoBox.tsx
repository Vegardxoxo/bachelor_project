import {useNavigate} from 'react-router-dom';
import * as React from 'react';
import {ButtonBase, Card, CardActionArea, CardContent, Stack, Tooltip, Typography} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

interface InfoBoxProps {
    title: string,
    numberOfLicenses: number,
}

/**
 * The InfoBox component is a clickable card that shows information about the number of licenses in the organization.
 * @param title the title of the InfoBox.
 * @param numberOfLicenses the number of licenses in the organization.
 */
function InfoBox({title, numberOfLicenses}: InfoBoxProps) {

    // Get the function for navigating to different routes
    const navigate = useNavigate();

    // OnClick navigates to other pages based on the InfoBox title
    const handleCardClick = () => {
        navigate(`/${title}`);
        navigate(`/${title}`);
    };

    // Information shown when the HelpIcon is hovered over. 
    let info = "";
    {
        {
            title == "Totale Lisenser" ? info = 'Totale lisenser er alle lisenser du har tilgjengelig i enheten din.' :
                title == "Ubrukte Lisenser" ? info = 'Ubrukte lisenser er lisenser for programvare som aldri har blitt åpnet.' :
                    info = 'Ledige lisenser er lisenser for programvare som ikke har blitt åpnet på 90 dager.'
        }
    }

    /* The function returns a clickable card with information gathered from incoming props. */
    return (
        <Card sx={{width: 300, height: 180, borderRadius: 5, ':hover': {boxShadow: 20}}} data-testid="infoBox-test">
            <CardActionArea sx={{paddingBottom: 4}} onClick={handleCardClick}>
                <CardContent>
                    <Stack direction={'row'}>
                        <Typography gutterBottom component="div" id="cardTitle">
                            {title}
                        </Typography>
                        <Tooltip title={<h2 style={{fontSize: 15, fontWeight: 'lighter'}}>{info}</h2>} placement='top'
                                 arrow>
                            <HelpIcon sx={{position: 'absolute', top: 28, right: 15, color: 'grey', fontSize: 25}}
                                      data-testid="helpIcon"></HelpIcon>
                        </Tooltip>
                    </Stack>
                    <Typography style={{fontSize: 50}} color="text.secondary" id="numbersBoxes">
                        {numberOfLicenses}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <ButtonBase onClick={handleCardClick}/>
        </Card>
    )
}

export default InfoBox;