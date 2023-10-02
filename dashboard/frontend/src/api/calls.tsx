// This file contains all the API calls to the backend

/**
 * Fetches all distinct the organizations from the backend.
 * Data is returned as a JSON object:
 */
export const fetchOrganizations = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/licenses/organizations/');
        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

/***
 * Fetches all software within an organization that hasn't been used in 90 days from the backend.
 * @param organization - Optional parameter to filter the software recommendations by organization
 */
export const fetchSoftwareRecommendations = async (organization?: string) => {
    try {
        let url = 'http://127.0.0.1:8000/api/licenses/recommendations/';
        if (organization) {
            url = `${url}?organization=${organization}`;
        }
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
};

/***
 * Fetches software used within an organization and its users.
 * @param organization  - Optional parameter to filter on organization.
 */
export const fetchSoftwareUsers = async (organization?: string) => {
    try {
        let url = 'http://127.0.0.1:8000/api/licenses/applications/';
        if (organization) {
            url = `${url}?organization=${organization}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return [...data];
    } catch (error) {
        console.log(error);
    }
};
/***
 * Fetches software used within an organization and its users.
 * @param software - Optional parameter to filter on software.
 * @param org - Optional parameter to filter on organization.
 */
export const fetchOrgSoftwareByName = async (software?: string, org?: string) => {
    try {
        let url = 'http://127.0.0.1:8000/api/licenses/softwarebyuser/';
        if (software && org) {
            url = `${url}?application_name=${software}&organization=${org}`;
        } else if (software) {
            url = `${url}?application_name=${software}`;
        } else if (org) {
            url = `${url}?organization=${org}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return [...data];
    } catch (error) {
        console.log(error);
    }
};

/***
 * Fetches software used by a specified user.
 * @param username - Non-optional parameter to specify user.
 */
export const fetchLicensesAssociatedWithUser = async (username: string) => {
    try {
        const url = 'http://127.0.0.1:8000/api/licenses/userlicenses/' + username;
        const response = await fetch(url);
        const data = await response.json();
        console.log(url);
        return [...data];
    } catch (error) {
        console.log(error);
    }
};
/**
 * Fetches data used to populate the boxes on the dashboard.
 * @param org - Optional parameter to filter on organization.
 * @param email - Optional parameter to filter on email.
 */
export const fetchInfoBoxData = async (org?: string, email?: string) => {
    try {
        let url = 'http://127.0.0.1:8000/api/licenses/count';
        if (org) {
            url = `${url}?organization=${org}`;
        }
        if (email) {
            url += `&email=${email}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return [data];
    } catch (error) {
        console.log(error);
    }
};
/**
 * Fetches data used to populate the license pool table.
 * @param page - Page number to fetch.
 * @param sort - How to sort the data.
 * @param software - Optional parameter to filter on software.
 * @param org - Optional parameter to filter on organization.
 */
export const fetchPoolData = async (page: number, sort: string, software?: string, org?: string) => {
    try {
        let url = `http://127.0.0.1:8000/api/pool/get/?page=${page}&sort=${sort}`;
        if (software && org) {
            url = `${url}&application_name=${software}&organization=${org}`;
        } else if (software) {
            url = `${url}&application_name=${software}`;
        } else if (org) {
            url = `${url}&organization=${org}`;
        }
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return {results: [...data.results], count: data.count, error: false, message: ''};
        } else {
            const errorData = await response.json();
            return {results: [], error: true, message: errorData.error};
        }
    } catch (error) {
        console.log(error);
        return {results: [], error: true, message: 'An error occurred while fetching data.'};
    }
};

/**
 * Fetches data used to populate OwnTable.
 * @param page - Page number to fetch.
 * @param status - Status of the license.
 * @param sort - How to sort the data.
 * @param org - Optional parameter to filter on organization.
 * @param software - Optional parameter to filter on software.
 * @param email - Optional parameter to filter on email.
 */
export const fetchInfoBoxLicense = async (page: number, status: string, sort: string, org?: string, software?: string, email?: string) => {
    try {
        let url = `http://127.0.0.1:8000/api/licenses/licenseinfo/?page=${page}&status=${status}&sort=${sort}`;
        if (software) {
            url += `&application_name=${software}`;
        }
        if (org) {
            url += `&organization=${org}`;
        }
        if (email) {
            url += `&email=${email}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return {results: [...data.results], count: data.count};

    } catch (error) {
        console.log(error);
    }
};

/***
 * Fetches all distinct software used within an organization from the backend.
 * @param status - Optional parameter to filter on status.
 * @param organization - Optional parameter to filter on organization.
 * @param pool - parameter to select wether to search in pool or not.
 */
export const fetchSoftwareUsedInOrg = async (status: string, pool: string, organization?: string, email?: string) => {
    try {
        let url = `http://127.0.0.1:8000/api/licenses/software/?status=${status}&pool=${pool}`;
        if (organization) {
            url += `&organization=${organization}`;
        }
        if (email) {
            url += `&email=${email}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return [...data]
    } catch (error) {
        console.log(error);
    }
};
/**
 * Checks if the organization already has a license for the software.
 * @param software - Software to check for.
 * @param org - Organization to check for.
 */
export const checkIfOrgHasSoftware = async (software: string, org: string) => {
    try {
        const url = `http://127.0.0.1:8000/api/licenses/check/?application_name=${software}&organization=${org}`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return {unused: data.unused, count: data.count, error: false, message: ''};
        } else {
            const errorData = await response.json();
            return {unused: false, count: 0, error: true, message: errorData.error};
        }

    } catch (error) {
        console.log(error);
    }
};

/**
 * Fetches the amount of number that could potentially be saved.
 * @param org - Organization to check for.
 */
export const fetchPotentialSavings = async (org: string) => {
    try {
        const url = `http://127.0.0.1:8000/api/licenses/moneysaved/?organization=${org}`;
        const response = await fetch(url);
        const data = await response.json();
        return [data];
        console.log("GOOD TIME")
        console.log(data)

    } catch (error) {
        console.log(error);
        console.log("BAD TIME")
    }
};


export default {
    fetchOrganizations,
    fetchSoftwareRecommendations,
    fetchSoftwareUsedInOrg,
    fetchSoftwareUsers,
    fetchLicensesAssociatedWithUser,
    fetchOrgSoftwareByName,
    fetchInfoBoxData,
    fetchPoolData

};