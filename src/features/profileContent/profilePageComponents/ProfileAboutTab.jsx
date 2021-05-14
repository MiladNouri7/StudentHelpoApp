import React, { useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { format } from 'date-fns';
import ProfileInfoForm from './ProfileInfoForm';


const ProfileAboutTab = (props) => {

    const {profile, isCurrentUser} = props;
    const [editableMode, setEditableMode] = useState(false);
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon="user" content={`About ${profile.displayName}`}/>
                    {isCurrentUser && 
                        <Button onClick={() => setEditableMode(!editableMode)} floated="right" basic content={editableMode ?
                        "Cancel" : "Edit"}/>
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {editableMode ? (<ProfileInfoForm profile={profile}/>) : (
                        <>
                            <div style={{marginBottom: 10}}>
                                <strong>
                                    Memeber Since: {format(profile.createdAt, 'dd MMM yyyy')}
                                </strong>
                                <div>{profile.description || null}</div>
                            </div>
                        </>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default ProfileAboutTab;

