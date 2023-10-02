// Interfaces used for the application
export interface LicensePoolData {
    application_name: string;
    freed_by_organization: string;
    details: Array<{
        id: number;
        freed_by_organization: string;
        application_name: string;
        date_added: string;
        family: string | null;
        family_version: string | null;
        family_edition: string | null;
        price: number;
        spc_id: number;
    }>;
}

export interface OwnOrgData {
    application_name: string;
    primary_user_full_name: string;
    primary_user_email: string;
    organization: string;
    computer_name: string;
    details: Array<{
        id: number;
        last_used: string;
        status: string;
        price: number;
    }>
}


export interface SoftwareData {
    id: number;
    application_name: string;
    computer_name: string;
    primary_user_full_name: string;
    primary_user_email: string;
    last_used: string;
    total_minutes: number;
    active_minutes: number;

}

export interface Count {
    total_licenses: number,
    active_licenses: number,
    never_used: number,
    unused_licenses: number,
    available_licenses: number,

}

export interface UserInformation {
    primary_user_email: string;
    primary_user_full_name: string;
    computer_name: string;
    organization: string;
    is_unit_head: boolean;
}

export interface OrgRequest {
    id: number;
    contact_organization: string;
    application_name: string;
    family: string | null;
    family_version: string | null;
    family_edition: string | null;
    request: "add" | "remove";
    request_date: string;
    approved: boolean;
    completed: boolean;
    reviewed_by: string | null;
    reviewed_date: string | null;
    spc_id: number;
    requested_by: string;
}