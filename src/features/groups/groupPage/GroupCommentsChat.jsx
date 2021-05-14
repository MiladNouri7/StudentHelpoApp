import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Segment, Comment, Header } from "semantic-ui-react";
import {
  convertFbObjectIntoArray,
  getGroupChatReference,
} from "../../../application/firebase/firebaseService";
import { CLEAR_COMMENTS, listenToGroupCommentsChat } from "../groupActions";
import GroupChatCommentForm from "./GroupChatCommentForm";
import { formatDistance } from "date-fns";
import { createDataTree } from "../../../application/utilities/helper/helper";

const GroupCommentsChat = (props) => {
  const { groupId } = props;
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.group);
  const { authenticated } = useSelector((state) => state.auth);
  const [showReplyForm, setShowReplyForm] = useState({
    open: false,
    commentId: null,
  });

  const handleClosingReplyField = () => {
    setShowReplyForm({ open: false, commentId: null });
  }

  useEffect(() => {
    getGroupChatReference(groupId).on("value", (snapshot) => {
      if (!snapshot.exists()) return;
      dispatch(
        listenToGroupCommentsChat(convertFbObjectIntoArray(snapshot.val()).reverse())
      );
    });
    return () => {
      dispatch({ type: CLEAR_COMMENTS });
      getGroupChatReference().off();
    };
  }, [groupId, dispatch]);

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        style={{border: 'none', backgroundColor: "#ed1165"}}
      >
        <Header>{authenticated ? "Chat about this group" : "Sign in to view and comment"}</Header>
      </Segment>

      {authenticated &&
      <Segment attached>
        <GroupChatCommentForm
          groupId={groupId}
          parentId={0}
          closeCommentFormField={setShowReplyForm}
        />
        <Comment.Group>
          {createDataTree(comments).map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.photoURL || "/assets/user.png"} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                  {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistance(comment.date, new Date())}</div>
                </Comment.Metadata>
                <Comment.Text>
                  {comment.text.split("\n").map((text, i) => (
                    <span key={i}>
                      {text}
                      <br />
                    </span>
                  ))}
                </Comment.Text>
                <Comment.Actions>
                  <Comment.Action
                    onClick={() =>
                      setShowReplyForm({ open: true, commentId: comment.id })
                    }
                  >
                    Reply
                  </Comment.Action>
                  {showReplyForm.open &&
                    showReplyForm.commentId === comment.id && (
                      <GroupChatCommentForm
                        groupId={groupId}
                        parentId={comment.id}
                        closeCommentFormField={handleClosingReplyField}
                      />
                    )}
                </Comment.Actions>
              </Comment.Content>
              {comment.childNodes.length > 0 && (
                <Comment.Group>
                  {comment.childNodes.reverse().map((child) => (
                    <Comment key={child.id}>
                      <Comment.Avatar
                        src={child.photoURL || "/assets/user.png"}
                      />
                      <Comment.Content>
                        <Comment.Author as={Link} to={`/profile/${child.uid}`}>
                          {child.displayName}
                        </Comment.Author>
                        <Comment.Metadata>
                          <div>{formatDistance(child.date, new Date())}</div>
                        </Comment.Metadata>
                        <Comment.Text>
                          {child.text.split("\n").map((text, i) => (
                            <span key={i}>
                              {text}
                              <br />
                            </span>
                          ))}
                        </Comment.Text>
                        <Comment.Actions>
                          <Comment.Action
                            onClick={() =>
                              setShowReplyForm({
                                open: true,
                                commentId: child.id,
                              })
                            }
                          >
                            Reply
                          </Comment.Action>
                          {showReplyForm.open &&
                            showReplyForm.commentId === child.id && (
                              <GroupChatCommentForm
                                groupId={groupId}
                                parentId={child.parentId}
                                closeCommentFormField={handleClosingReplyField}
                              />
                            )}
                        </Comment.Actions>
                      </Comment.Content>
                    </Comment>
                  ))}
                </Comment.Group>
              )}
            </Comment>
          ))}
        </Comment.Group>
      </Segment>}
    </>
  );
}

export default GroupCommentsChat;
