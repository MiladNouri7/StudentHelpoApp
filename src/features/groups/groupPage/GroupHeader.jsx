import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Segment, Image, Item, Header, Button } from "semantic-ui-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  addGroupAttendee,
  leaveGroup,
} from "../../../application/firebase/firestoreService";
import { useSelector } from "react-redux";
import UnauthorisedModal from "../../authentication/UnauthorisedModal";

const groupImgStyle = {
  filter: "brightness(30%)",
};

const groupImgTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

const GroupHeader = (props) => {
  const { group, isGroupHost, isJoining } = props;
  const [loading, setLoading] = useState(false);
  const { authenticated } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  const handleUserJoiningGroup = async () => {
    setLoading(true);
    try {
      await addGroupAttendee(group);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleUserLeavingGroup = async () => {
    setLoading(true);
    try {
      await leaveGroup(group);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {modalOpen && <UnauthorisedModal setModalOpen={setModalOpen} />}

      <Segment.Group>
        <Segment basic attached="top" style={{ padding: "0" }}>
          <Image
            src={`/assets/categoryImages/${group.category}.jpg`}
            fluid
            style={groupImgStyle}
          />

          <Segment basic style={groupImgTextStyle}>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Header
                    size="huge"
                    content={group.title}
                    style={{ color: "white" }}
                  />
                  <p>{format(group.date, "MMMM d, yyyy h:mm a")}</p>
                  <p>
                    Hosted by{" "}
                    <strong>
                      <Link to={`/profile/${group.hostId}`}>
                        {group.hostName}
                      </Link>
                    </strong>
                  </p>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>

        <Segment attached="bottom" clearing>
          {!isGroupHost && (
            <>
              {isJoining ? (
                <Button onClick={handleUserLeavingGroup} loading={loading}>
                  Leave Group
                </Button>
              ) : (
                <Button
                  onClick={authenticated ? handleUserJoiningGroup : () => setModalOpen(true)}
                  loading={loading}
                  className="btn"
                >
                  Join Group
                </Button>
              )}
            </>
          )}
          {isGroupHost && (
            <Button
              as={Link}
              to={`/manage/${group.id}`}
              className="pink-btn"
              floated="right"
            >
              Manage Group
            </Button>
          )}
        </Segment>
      </Segment.Group>
    </>
  );
}

export default GroupHeader;
