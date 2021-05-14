import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, List, Segment } from 'semantic-ui-react';
import GroupAttendee from './GroupAttendee';
import { format } from 'date-fns';
import { deleteGroupFromFs } from '../../../application/firebase/firestoreService';
import '../../../application/layout/styles.css';
import firebase from "../../../application/configuration/firebase";
import { useSelector } from 'react-redux';

const GroupListItem = (props) => {

    const {group} = props;
    const user = firebase.auth().currentUser;
    const { authenticated } = useSelector((state) => state.auth);

    return(
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size="tiny" circular src={group.hostPhotoURL}/>
                        <Item.Content>
                            <Item.Header content={group.title}/>
                            <Item.Description>
                                Hosted By <Link as={Link} to={`/profile/${group.hostId}`}>{group.hostName}</Link>
                            </Item.Description>
                            {group.isCancelled && (
                                <Label 
                                    style={{top: "-40px"}}
                                    ribbon="right"
                                    color="red"
                                    content="This group meeting has been cancelled"
                                />
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock"/>{format(group.date, "MMMM d, yyyy h:mm a")}
                </span>
            </Segment>
            <Segment secondary>
                <List horizontal>
                    {group.attendees.map(attendee => (
                        <GroupAttendee key={attendee.id} attendee={attendee}/>
                    ))}
                </List>
            </Segment>
            <Segment clearing>
                <div>{group.description}</div>
                {authenticated && user.uid === group.hostId && <Button onClick={() => deleteGroupFromFs(group.id)} color="red" floated="right" content="Delete"/>}
                <Button as={Link} to={`/groups/${group.id}`} className="btn" floated="right" content="View"/>
            </Segment>
        </Segment.Group>
    )
}

export default GroupListItem;