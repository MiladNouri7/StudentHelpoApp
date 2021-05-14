import React from 'react';
import Calendar  from 'react-calendar';
import { useSelector } from 'react-redux';
import { Header, Menu } from 'semantic-ui-react';

const GroupsFilter = (props) => {
    const {setPredicate, predicate, loading} = props;
    const {authenticated} = useSelector(state => state.auth);
    return (
        <>
        {authenticated &&
            <Menu vertical size="large" style={{width: "100%"}}>
                <Header icon="filter" attached style={{color: "#ed1165"}} content="Filters"/>
                <Menu.Item 
                    content="All Groups"
                    active={predicate.get("filter") === "all"}
                    onClick={() => setPredicate("filter", "all")}
                    disabled={loading}
                />
                <Menu.Item 
                    content="I'm Joining"
                    active={predicate.get("filter") === "isJoining"}
                    onClick={() => setPredicate("filter", "isJoining")}
                    disabled={loading}
                />
                <Menu.Item 
                    content="I'm hosting"
                    active={predicate.get("filter") === "isGroupHost"}
                    onClick={() => setPredicate("filter", "isGroupHost")}
                    disabled={loading}
                />
            </Menu>}
            <Header icon="calendar" attached style={{color: "#ed1165"}} content="Select date"/>
            <Calendar 
                onChange={date => setPredicate("startDate", date)}
                value={predicate.get("startDate") || new Date()}
                tileDisabled={() => loading}
            />
        </>
    )
}

export default GroupsFilter;