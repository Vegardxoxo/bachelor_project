import React from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Grid, Typography} from '@mui/material';
import ActiveLastBreadcrumb from '../../components/dashboard/ActivateLastBreadcrumb/ActivateLastBreadcrumb';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './FAQ.css';

/* Returns a Frequently Asked Question page with Accordion buttons with filled out static information. */

/* The questions are divided itnto three specific themes. */
function FAQ() {
    return (
        <div>
            <Grid container>
                <ActiveLastBreadcrumb/>
            </Grid>
            <Grid className='Header'>
                <Typography id="Headline">Ofte stilte spørsmål</Typography>
                <p style={{fontStyle: 'italic', marginBottom: '30px'}}>
                    Nedenfor ser du en oversikt over ofte stilte spørsmål om lisensdashboardet,
                    lisensportalen, og ledertavlen.
                </p>
            </Grid>
            <Grid container id="Columns">
                {/* First theme: Lisence dashbaord*/}
                <p className='SubHeadline' data-testid='Dashboard'>Dashboard</p>
                <Grid container>
                    <Accordion className='accordions'>
                        {/* Information  shown on the accordion */}
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hva brukes lisensdashboardet til?</p>
                        </AccordionSummary>
                        {/* Information shown when accoordion is clicked. */}
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Lisensdashboardet viser en oversikt over alle lisenser eid i din
                                enhet.<br></br><br></br>
                                Lisensene blir presentert på ulike måter i lisensdashboardet:
                                <ul>
                                    <li>Totale lisenser viser hvor mange lisenser enheten eier.</li>
                                    <li>Ubrukte lisenser viser hvor mange lisenser av de enheten eier som aldri har
                                        blitt brukt eller åpnet.
                                    </li>
                                    <li>Ledige lisenser viser hvor mange lisenser av de enheten eier som ikke har blitt
                                        brukt eller åpnet innen de siste 90 dagene.
                                    </li>
                                </ul>
                                I tillegg vises en oversikt over hvor stor prosent av aktive, ledige og ubrukte lisenser
                                som enheten eier i form av en donutchart.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hvor kan jeg se hvilke lisenser enheten min eier?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Ved å trykke på boksen &quot;Totale lisenser&quot; åpnes en side med en tabelloversikt
                                over alle
                                lisenser enheten eier.<br></br><br></br>
                                Tabellen viser informasjon om hvilken bruker lisensen er tilknyttet og brukerens
                                PC-løpenummer. I tillegg vises informasjon om lisensens status som aktiv, ledig eller
                                ubrukt.
                                <br></br><br></br>
                                Ved å trykke på en spesifikk lisens i denne tabellen kan man se informasjon om når
                                programvaren tilknyttet lisensen sist ble åpnet av brukeren.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hvor kan jeg se hvilke ubrukte lisenser enheten min har?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Ved å trykke på boksen &quot;Ubrukte lisenser&quot; åpnes en side med en tabelloversikt
                                over alle
                                lisenser enheten eier som aldri er blitt tatt i bruk.<br></br><br></br>
                                Tabellen viser informasjon om hvilken bruker lisensen er tilknyttet og brukerens
                                løpenummer.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hvor kan jeg se hvilke ledige lisenser enheten min har?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Ved å trykke på boksen &quot;Ledige lisenser&quot; åpnes en side med en tabelloversikt
                                over alle
                                lisenser enheten eier som ikke har blitt bruk eller åpnet av brukeren de siste 90
                                dagene.<br></br><br></br>
                                Tabellen viser informasjon om hvilken bruker lisensen er tilknyttet og brukerens
                                løpenummer.<br></br><br></br>
                                Ved å trykke på en spesifikk lisens i denne tabellen kan man se tilleggsinformasjon om
                                når lisensen sist ble åpnet.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hvor kan jeg se hvilke lisenser jeg har tilknyttet min bruker?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Det finnes to måter å gjøre dette på.
                                <ul>
                                    <li>Gå inn på oversikten over totale lisenser i enheten og kryss av for å bare se
                                        egne lisenser i tabellen.
                                    </li>
                                    <li>Gå inn på Min Side for å se oversikt over alle lisenser tilkoblet din bruker.
                                    </li>
                                </ul>

                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hvordan regnes potensiell sparing ut?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Potensiell sparing regnes ut ved å summere prisen på alle ubrukte og ledige lisenser
                                enheten eier. <br></br><br></br>
                                I første omgang er dette tallet noe høyt ved at alle prisene på lisenser eid er satt til
                                en default. I tillegg er det ikke blitt
                                sortert ut alle lisenser for programvare som man trenger å ha på sin
                                PC. <br></br><br></br>
                                I fremtidige utgivelser vil dette tallet bli mer korrekt for hva enheten faktisk kan
                                spare ved å frigi alle sine ubrukte og ledige lisenser.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
            <Grid container id="Columns">
                {/* Second theme: Licenese pool */}
                <p className='SubHeadline'>Lisensportalen</p>
                <Grid container>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hva er lisensportalen?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Lisensportalen er en oversikt over alle lisenser som din enhet kan kjøpe fra andre
                                enheter.
                                Det er også her lisenser din enhet har lagt til salg havner. <br></br><br></br>
                                Lisensportalen skal oppfordre til gjenbruk av lisenser heller enn å kjøpe inn nye når
                                det finnes mange
                                ledige og ubrukte lisenser innenfor Trondheim Kommune. <br></br><br></br>
                                Bare lisensansvarlige innen en enhet har mulighet til å kjøpe en lisens fra
                                lisensportalen, og det er bare
                                de som kan legge til en lisens fra enheten til lisensportalen for salg. Alle brukere kan
                                velge å sende en forespørsel om å kjøpe
                                eller selge en lisens som er tilkoblet deres PC eller bruker. <br></br><br></br>
                                I første omgang kan man kjøpe en enkeltlisens fra en annen enhet til samme pris som ved
                                innkjøp. <br></br>
                                Senere er det planlagt at dette skal endres til å kunne kjøpe en lisens fra
                                lisensportalen til en billigere pris enn innkjøpspris.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hvordan legger jeg ut en lisens til salg i lisensportalen?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Lisensansvarlige kan følge disse stegene for å frigjøre en lisens:
                                <ol>
                                    <li>Gå inn på oversikten over totale lisenser i enheten.</li>
                                    <li>Finn og trykk på den lisensen som ønskes å selges gjennom lisensportalen.</li>
                                    <li>Trykk på knappen hvor det står &quot;Frigjør&quot;.</li>
                                </ol>
                                Lisensen ligger da tilgjengelig for kjøp i lisensportalen hvor andre enheter kan kjøpe
                                den.
                                <br></br><br></br>
                                Vanlige brukere kan føge de samme stegene som nevnt ovenfor.
                                <br></br>
                                Da blir en forespørsel om å frigjøre lisensen blir sendt til den lisensansvarlige i
                                enheten og de har mulighet til å godkjenne
                                eller avslå denne forespørselen. Dersom forespørselen blir godkjent, blir lisensen
                                automatisk lagt til i lisensportalen.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hvordan kjøper jeg en lisens fra lisensportalen?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Lisensansvarlige kan følge disse stegene for å kjøpe en lisens:
                                <ol>
                                    <li>Gå inn på lisensportalen og søk opp navnet på lisensen du ønsker å kjøpe.</li>
                                    <li>Trykk på lisensen du ønsker å kjøpe for å se mer informasjon om den.</li>
                                    <li>Trykk på handlekurven til den lisensen du ønsker å kjøpe.</li>
                                    <li>Du vil nå få opp en melding dersom din enhet allerede eier en ledig eller ubrukt
                                        lisens av denne typen.
                                        Da kan man velge å kjøpe lisensen uansett, eller avbryte kjøpet.
                                    </li>
                                </ol>
                                Når kjøpet gjennomføres blir lisensen lagt til i enhetens Lisensdashboard.
                                <br></br><br></br>
                                Vanlige brukere kan følge disse stegene for å kjøpe en lisens:
                                <ol>
                                    <li>Gå inn på lisensportalen og søk opp navnet på lisensen du ønsker å kjøpe.</li>
                                    <li>Trykk på lisensen du ønsker å kjøpe for å se mer informasjon om den.</li>
                                    <li>Trykk på handlekurven til den lisensen du ønsker å kjøpe.</li>
                                    <li>Du vil få opp melding om at lisensansvarlig i enheten har mottat forespørsel om
                                        kjøp av denne lisensen.
                                    </li>
                                </ol>
                                Når en slik forespørsel om kjøp blir sendt, vil lisensansvarlig godkjenne eller avslå
                                forespørselen.<br></br>
                                Dersom forespørselen godkjennes vil lisensen automatisk overføres til brukeren som
                                sendte forespørselen om kjøp.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hvordan er prisen på lisensene regnet ut?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                I første omgang kan man kjøpe en enkeltlisens fra en annen enhet til en fastsatt
                                defaultpris.Dette er basert på noe manglende data tilgjengelig om
                                lisenspris.<br></br><br></br>
                                Visse lisenser har en annen defaultpris basert på utgiveren av lisensen. Lisensene med
                                en annen defaultpris er lisenser som er Trondheim kommune har mange eksemplarer
                                av. <br></br><br></br>
                                Default priser som er fastsatt:
                                <ul>
                                    <li>Lisenser produsert av Adobe Systems Inc. har en default pris på 1500 kr.</li>
                                    <li>Lisenser produsert av Boei Comp. har en default pris på 800 kr.</li>
                                    <li>Lisenser produsert av Microsoft Corp. har en default pris på 990 kr.</li>
                                    <li>Lisenser produsert av Xensam AB. har en default pris på 1199 kr.</li>
                                    <li>Alle andre lisenser har en defaultpris på 750 kr.</li>
                                </ul>
                                <br></br>
                                Senere er det planlagt at prissettingen skal endres til å ta inn innkjøpsprisen til hver
                                enkelt lisens,
                                og disse skal kunne selges for en billigere pris i lisensportalen.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Jeg la med uhell til en lisens i lisensportalen. Hvordan får jeg den tilbake?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Du kan lett få tilbake en lisens ved å kjøpe den fra lisensportalen slik man ville gjort
                                med andre lisenser.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
            <Grid container id="Columns">
                {/* Third theme: Leaderboard */}
                <p className='SubHeadline'>Ledertavlen</p>
                <Grid container>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            data-testid='expandIcon'>
                            <p>Hva er ledertavlen?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Ledertavlen sammenligner alle enheter i Trondheim Kommune basert på hvor stor andel av
                                alle lisensene eid
                                i enheten er aktive.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className='accordions'>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <p>Hvordan kan jeg øke min enhets plassering i ledertavlen?</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="span" id="details">
                                Du kan øke din enhets plassering i ledertavlen ved å minimere antall ledige og ubrukte
                                lisenser din enhet eier. <br></br><br></br>
                                Den enkleste måten å gjøre dette på er å legge disse lisensene ut til salg i
                                lisensportalen.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </div>
    );
}

export default FAQ;