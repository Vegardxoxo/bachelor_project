import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {RecoilRoot} from 'recoil';
import LicensePool from "./LicensePool";
import {MemoryRouter} from 'react-router-dom';
import renderer from "react-test-renderer";
import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import {act} from 'react-dom/test-utils';

const data = [
    {
        "application_name": "APSIS Pro [Web]",
        "freed_by_organization": "IT-tjenesten",
        "details": [
            {
                "id": 71,
                "freed_by_organization": "IT-tjenesten",
                "application_name": "APSIS Pro [Web]",
                "date_added": "2023-05-02",
                "family": null,
                "family_version": null,
                "family_edition": null,
                "price": null,
                "spc_id": 147822
            }
        ]
    },
    {
        "application_name": "Anaconda Python 2022",
        "freed_by_organization": "IT-tjenesten",
        "details": [
            {
                "id": 66,
                "freed_by_organization": "IT-tjenesten",
                "application_name": "Anaconda Python 2022",
                "date_added": "2023-04-26",
                "family": null,
                "family_version": null,
                "family_edition": null,
                "price": null,
                "spc_id": 147830
            }
        ]
    },
    {
        "application_name": "EasyChair [Web]",
        "freed_by_organization": "IT-tjenesten",
        "details": [
            {
                "id": 69,
                "freed_by_organization": "IT-tjenesten",
                "application_name": "EasyChair [Web]",
                "date_added": "2023-05-02",
                "family": null,
                "family_version": null,
                "family_edition": null,
                "price": null,
                "spc_id": 147828
            }
        ]
    },
    {
        "application_name": "Microsoft 365 Family",
        "freed_by_organization": "IT-tjenesten",
        "details": [
            {
                "id": 70,
                "freed_by_organization": "IT-tjenesten",
                "application_name": "Microsoft 365 Family",
                "date_added": "2023-05-02",
                "family": null,
                "family_version": null,
                "family_edition": null,
                "price": null,
                "spc_id": 147836
            }
        ]
    },
    {
        "application_name": "Microsoft Office 2016 Access",
        "freed_by_organization": "IT-tjenesten",
        "details": [
            {
                "id": 67,
                "freed_by_organization": "IT-tjenesten",
                "application_name": "Microsoft Office 2016 Access",
                "date_added": "2023-04-26",
                "family": null,
                "family_version": null,
                "family_edition": null,
                "price": 990,
                "spc_id": 95746
            },
            {
                "id": 75,
                "freed_by_organization": "IT-tjenesten",
                "application_name": "Microsoft Office 2016 Access",
                "date_added": "2023-05-03",
                "family": null,
                "family_version": null,
                "family_edition": null,
                "price": null,
                "spc_id": 147831
            }
        ]
    },
    {
        "application_name": "Microsoft Office 2016 Excel",
        "freed_by_organization": "IT-tjenesten",
        "details": [
            {
                "id": 76,
                "freed_by_organization": "IT-tjenesten",
                "application_name": "Microsoft Office 2016 Excel",
                "date_added": "2023-05-03",
                "family": null,
                "family_version": null,
                "family_edition": null,
                "price": null,
                "spc_id": 147818
            }
        ]
    },
    {
        "application_name": "Microsoft Office 2016 OneNote",
        "freed_by_organization": "IT-tjenesten",
        "details": [
            {
                "id": 77,
                "freed_by_organization": "IT-tjenesten",
                "application_name": "Microsoft Office 2016 OneNote",
                "date_added": "2023-05-03",
                "family": null,
                "family_version": null,
                "family_edition": null,
                "price": null,
                "spc_id": 147815
            }
        ]
    },
    {
        "application_name": "Microsoft Office 2016 Outlook",
        "freed_by_organization": "IT-tjenesten",
        "details": [
            {
                "id": 78,
                "freed_by_organization": "IT-tjenesten",
                "application_name": "Microsoft Office 2016 Outlook",
                "date_added": "2023-05-03",
                "family": null,
                "family_version": null,
                "family_edition": null,
                "price": null,
                "spc_id": 147835
            }
        ]
    },
    {
        "application_name": "Microsoft Office 2016 PowerPoint",
        "freed_by_organization": "IT-tjenesten",
        "details": [
            {
                "id": 72,
                "freed_by_organization": "IT-tjenesten",
                "application_name": "Microsoft Office 2016 PowerPoint",
                "date_added": "2023-05-02",
                "family": null,
                "family_version": null,
                "family_edition": null,
                "price": null,
                "spc_id": 147820
            }
        ]
    }
]
const count = 13
const softwareNames = [
    "APSIS Pro [Web]",
    "Anaconda Python 2022",
    "EasyChair [Web]",
    "Microsoft 365 Family",
    "Microsoft Office 2016 Access",
    "Microsoft Office 2016 Excel",
    "Microsoft Office 2016 OneNote",
    "Microsoft Office 2016 Outlook",
    "Microsoft Office 2016 PowerPoint",
    "Microsoft Office 2016 Publisher",
    "Microsoft Office 2016 Word",
    "SecMaker Net iD 6"
]
describe('LicensePool', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockImplementation((url) => {
            const urlString = typeof url === 'string' ? url : url.toString();

            if (urlString.startsWith("http://127.0.0.1:8000/api/pool/get/")) {
                return Promise.resolve(
                    new Response(JSON.stringify({results: data, count}))
                );
            } else if (urlString.startsWith("http://127.0.0.1:8000/api/licenses/software/")) {
                return Promise.resolve(
                    new Response(
                        JSON.stringify(softwareNames)
                    )
                );
            } else {
                return Promise.reject(new Error("Invalid URL"));
            }
        });
    });


    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    })
    it('renders without crashing', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <RecoilRoot>
                        <LicensePool/>
                    </RecoilRoot>
                </MemoryRouter>
            );
        });
    });

    it('matches snapshot', async () => {
        const testRenderer = renderer.create(
            <MemoryRouter>
                <RecoilRoot>
                    <LicensePool/>
                </RecoilRoot>
            </MemoryRouter>
        );
        expect(testRenderer.toJSON()).toMatchSnapshot();
    })

});