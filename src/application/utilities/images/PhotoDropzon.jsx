import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Icon, Header} from 'semantic-ui-react'

const PhotoDropzone = (props) => {

    const {setFiles} = props;

    const dropzoneWidgetStyles = {
        textAlign: "center",
        border: "dashed 3px #eee",
        paddingTop: "30px",
        borderRadius: "5%"
    }

    const activeDropzone = {
        border: "dashed 3px green"
    }

    const onDrop = useCallback(acceptedImageFiles => {
        setFiles(acceptedImageFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, [setFiles])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
    <div {...getRootProps()} style={isDragActive ? {...dropzoneWidgetStyles, ...activeDropzone} : 
        dropzoneWidgetStyles}>
        <input {...getInputProps()} />
        <Icon name="upload" size="huge"/>
        <Header content="Drop photo here" />
    </div>
    )
}

export default PhotoDropzone;