import React, { useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import PhotoCropper from './PhotoCropper';
import PhotoDropzone from './PhotoDropzon';
import cuid from 'cuid';
import { getTheImageFileExtension } from '../helper/helper';
import { uploadImageToFbStorage } from '../../firebase/firebaseService';
import { toast } from 'react-toastify';
import { updateUserProfileImage } from '../../firebase/firestoreService';

const UploadPhotoComponent = (props) => {

    const {setEditMode} = props;

    const [files, setFiles] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    function handlePhotoUpload() {
        setLoading(true);
        const filename = cuid() + '.' + getTheImageFileExtension(files[0].name);
        const uploadTask = uploadImageToFbStorage(photo, filename);
        uploadTask.on("state_change", snapshot => {
            //You can add more here for image upload progression

        }, error => {
            toast.error(error.message);
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(photoURL => {
                updateUserProfileImage(photoURL, filename).then(() => {
                    setLoading(false);
                    handleCancelingCrop();
                    setEditMode(false);
                }).catch(error => {
                    toast.error(error.message)
                    setLoading(false);
                });
            })
        })
    }

    function handleCancelingCrop(){
        setFiles([]);
        setPhoto(null);
    }

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header color="blue" sub content="Step 1 - Add a Photo"/>
                <PhotoDropzone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header color="blue" sub content="Step 2 - Resize the Photo"/>
                {files.length > 0 &&
                    <PhotoCropper setPhoto={setPhoto} photoPreview={files[0].preview} />
                }
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header color="blue" sub content="Step 3 - Preview and upload"/>
                {files.length > 0 &&
                    <>
                        <div className="img-preview" style={{minHeight: 200, minWidth: 200,
                        overflow: "hidden"}}/>
                        <Button.Group>
                            <Button loading={loading} onClick={handlePhotoUpload} style={{width: 100}} positive icon="check" />
                            <Button disabled={loading} onClick={handleCancelingCrop} style={{width: 100}} icon="close" />
                        </Button.Group>
                    </>
                }
            </Grid.Column>
        </Grid>
    )
}

export default UploadPhotoComponent;