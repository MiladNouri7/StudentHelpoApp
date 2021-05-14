import React from 'react';
import GroupListItem from './GroupListItem';

const GroupList = (props) => {
    const {groups} = props;
    return(
        <>
            {groups.map(group => (
                <GroupListItem group={group} key={group.id}/>
            ))}
        </>
    )
}

export default GroupList;