import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";


const PhotoCropper = (props) => {
    const {setPhoto, photoPreview} = props;
    const imageCropper = useRef(null);

    function cropPhoto(){
        if(typeof imageCropper.current.getCroppedCanvas() === "undefined"){
            return;
        }

        imageCropper.current.getCroppedCanvas().toBlob(blob => {
            setPhoto(blob);
        }, "image/jpeg")
    }

    return (
        <Cropper 
            ref={imageCropper}
            src={photoPreview}
            cropBoxResizable={true}
             style={{height: 200, width: "100%"}}
             dragMode="move"
             scalable={true}
             viewMode={1}
             preview=".img-preview"
             guides={false}
             aspectRatio={1}
             cropBoxMovable={true}
             crop={cropPhoto}

        />
    );
}

export default PhotoCropper;