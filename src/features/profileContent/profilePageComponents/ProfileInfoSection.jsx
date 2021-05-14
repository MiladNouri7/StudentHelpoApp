import React, { useState } from 'react';
import { Tab } from 'semantic-ui-react';
import ProfileAboutTab from './ProfileAboutTab';
import ProfileGroupsTab from './ProfileGroupsTab';
import UserFollowingTab from './UserFollowingTab';
import UserImagesTab from './UserImagesTab';

const ProfileInfoSection = (props) => {

    const {profile, isCurrentUser} = props;
    const [activatedTab, setActiveTab] = useState(0);
    const ProfileTabOptions = [
        {menuItem: "About", render: () => <ProfileAboutTab profile={profile} isCurrentUser={isCurrentUser}/>},
        {menuItem: "Photos", render: () => <UserImagesTab profile={profile} 
            isCurrentUser={isCurrentUser}
        />},
        {menuItem: "Groups", render: () => <ProfileGroupsTab profile={profile}/>},
        {menuItem: "Followers", render: () => <UserFollowingTab key={profile.id} profile={profile} activatedTab={activatedTab}/>},
        {menuItem: "Following", render: () => <UserFollowingTab key={profile.id} profile={profile} activatedTab={activatedTab}/>},
    ];
    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition="right"
            panes={ProfileTabOptions}
            onTabChange={(e, data) => setActiveTab(data.activeIndex)}
        />
    )
}

export default ProfileInfoSection;