import React from 'react';
import { Link } from 'react-router-dom';
import {Segment, Item, Label} from 'semantic-ui-react';

const GroupSidebar = (props) => {
    const {attendees, hostId} = props;
    return(
        <>
            <Segment
                textAlign="center"
                style={{border: 'none', backgroundColor: "#ed1165"}}
                attached="top"
                inverted
            >
                {attendees.length} {attendees.length > 1 ? "People" : "Person"} Going
            </Segment>
            <Segment attached>
                <Item.Group relaxed divided>
                    {attendees.map(attendee => (
                    <Item as={Link} to={`/profile/${attendee.id}`} key={attendee.id} style={{position: 'relative'}}>
                        {hostId === attendee.id && (
                            <Label style={{position: "absolute"}} className="pink-label" ribbon="right" content="host"/>
                        )}
                        <Item.Image size="tiny" src={attendee.photoURL || '/assets/user.png'}/>
                        <Item.Content verticalAlign="middle">
                            <Item.Header as="h3">
                                <span>{attendee.displayName}</span>
                            </Item.Header>
                        </Item.Content>
                    </Item>
                    ))}
                </Item.Group>
            </Segment>
        </>
    )
}

export default GroupSidebar;