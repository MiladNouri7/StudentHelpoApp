import React from 'react';
import {Segment, Grid, Icon} from 'semantic-ui-react';
import {format} from 'date-fns';

const GroupInfo = (props) => {
    const {group} = props;
    return(
        <Segment.Group>
            <Segment attached="top">
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size="large" style={{color: "#ed1165"}} name="info"/>
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>{group.description}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign="middle">
                    <Grid.Column width={1}>
                        <Icon name="calendar" size="large" style={{color: "#ed1165"}}/>
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <span>{format(group.date, "MMMM d, yyyy h:mm a")}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
}

export default GroupInfo;