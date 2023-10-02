import React from 'react';
import PoolRequestList from "./PoolRequestList";
import {OrgRequest} from "../../Interfaces";

interface UserRequestListProps {
    userRequests: OrgRequest[];
    isHistory: boolean;
}

/**
 * A component that displays a list of requests for a user
 * @param userRequests a list of requests for a user
 * @param isHistory a boolean that determines if the list is a history list or not
 */
const PoolRequestUserList: React.FC<UserRequestListProps> = ({userRequests, isHistory}) => {
    return (
        <PoolRequestList
            poolRequests={userRequests}
            isOwnRequest={true}
            isHistory={isHistory}
            onApprove={() => {
                console.log('')
            }}
            onDisapprove={() => {
                console.log('')
            }}
        />
    );
};

export default PoolRequestUserList;
