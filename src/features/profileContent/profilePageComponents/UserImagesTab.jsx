import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import UploadPhotoComponent from "../../../application/utilities/images/UploadPhotoComponent";
import { deleteImageFromFbStorage } from "../../../application/firebase/firebaseService";
import { deleteImageFromUserCollection, getUserImages, setMainProfilePhoto } from "../../../application/firebase/firestoreService";
import useFirestoreDocumentsColl from "../../../application/hooks/useFirestoreDocumentsColl.js";
import { listenToUserPhotos } from "../profileActions";

const UserImagesTab = (props) => {

  const { profile, isCurrentUser } = props;
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const { loading } = useSelector((state) => state.async);
  const { photos } = useSelector((state) => state.profile);
  const [updating, setUpdating] = useState({isUpdating: false, target: null});
  const [deleting, setDeleting] = useState({isDeleting: false, target: null});

  useFirestoreDocumentsColl({
    query: () => getUserImages(profile.id),
    data: (photos) => dispatch(listenToUserPhotos(photos)),
    deps: [profile.id, dispatch],
  });

  const handleSetMainProfilePhoto = async (photo, target) => {
      setUpdating({isUpdating: true, target});
      try {
        await setMainProfilePhoto(photo);
      } catch(error) {
        toast.error(error.message);
      } finally {
          setUpdating({isUpdating: false, target: null});
      }
  }

  const handleDeletePhoto = async (photo, target) => {
      setDeleting({isDeleting: true, target});
      try {
        await deleteImageFromFbStorage(photo.name);
        await deleteImageFromUserCollection(photo.id);
      } catch(error) {
        toast.error(error.message);
      } finally {
          setDeleting({isDeleting: false, target: null});
      }
  }

  return (
    <Tab.Pane loading={loading}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="user" content={`Photos`} />
          {isCurrentUser && (
            <Button
              onClick={() => setEditMode(!editMode)}
              floated="right"
              basic
              content={editMode ? "Cancel" : "Add Photo"}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <UploadPhotoComponent setEditMode={setEditMode} />
          ) : (
            <Card.Group itemsPerRow={5}>
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  <Button.Group fluid widths={2}>
                    <Button name={photo.id} loading={updating.isUpdating && updating.target === photo.id} 
                    onClick={(e) => handleSetMainProfilePhoto(photo, e.target.name)} 
                    disabled={photo.url === profile.photoURL || !isCurrentUser}
                    basic color="green" content="Main" />
                    <Button name={photo.id} 
                    onClick={(e) => handleDeletePhoto(photo, e.target.name)} 
                    loading={deleting.isDeleting && deleting.target === photo.id}
                    disabled={photo.url === profile.photoURL || !isCurrentUser}
                    basic color="red" icon="trash" />
                  </Button.Group>
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}

export default UserImagesTab;
