import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone from 'react-dropzone';
import { useSelector } from 'react-redux';
import Axios from 'axios';


const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions= [
    {value : 0, label: "Private"},
    {value : 1, label : "Public"}
]

const CategoryOptions= [
    { value : 0, label : "Film & Animation"},
    { value : 1, label : "Autos & Vehicles"},
    { value : 2, label : "Music"},
    { value : 3, label : "Pets & Animals"}
]



function VideoUploadPage(props) {
    const user = useSelector(state => state.user); // state에서 user를 가져옴 (user의 모든 정보를 가진 채)
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");
    
    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop =  (files) => {
        
        let formData = new FormData;
        const config = {
            header : {'content-type' : 'multipart/form-data'}
        }
        formData.append("file", files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            if(response.data.success) {
                
                let variable = {
                    url : response.data.url,
                    fileName : response.data.fileName
                }

                setFilePath(response.data.url)

                Axios.post('/api/video/thumbnail', variable)
                .then(response => {
                    if(response.data.success) {
                        console.log(response.data)
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)
                        
                    } else {
                        alert('Failed to create thumbnail')
                    }
                })




            } else {
                alert('Failed to upload a video')
            }
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();

        // if (user.userData && !user.userData.isAuth) {
        //     return alert('Please Log in First')
        // }

        // if (title === "" || Description === "" ||
        //     Categories === "" || FilePath === "" ||
        //     Duration === "" || Thumbnail === "") {
        //     return alert('Please first fill all the fields')
        // }

        const variables = {
            writer: user.userData._id,
            title : VideoTitle,
            description : Description,
            privacy : Private,
            filePath : FilePath,
            category : Category,
            duration : Duration,
            thumbnail : ThumbnailPath,
        }


        Axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if(response.data.success) {

                message.success('Successfully upload')

                setTimeout(()=> {
                    props.history.push('/')
                }, 3000)

            } else {
                alert('Failed to upload a Video')
            }
        })
    }



    return (
        <div style = {{ maxWidth : '700px', margin: '2rem auto'}}>
            <div style = {{ textAlign : 'center', marginBottom : '2rem'}}>
                <Title level = {2}> Upload Video</Title>

            </div>
            
            <Form onSubmit = {onSubmit}>
                <div style ={{ display: 'flex', justifyContent: 'space-between'}}>
                    {/* DropZone */}

                    <Dropzone
                        onDrop ={onDrop}
                        multiple ={false} // file number
                        maxSize ={10000000000}
                    >
                        {({ getRootProps, getInputProps}) => (
                            <div style ={{ width: '300px', height: '240px', border : '1px solid lightgray', display : 'flex',
                        alignItems : 'center', justifyContent: 'center'}} {...getRootProps()}>
                            <input {...getInputProps()}/>
                            <Icon type ="plus" style  = {{ fontSize : '3rem'}} />
                        </div>
                        )} 

                    </Dropzone>

                    {/* Thumbnail */}
                    { ThumbnailPath &&
                        <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                    
                </div>

            <br />
            <br />

            <label>Title</label>
            <Input
                onChange = {onTitleChange}
                value = {VideoTitle}
            />
            <br />
            <br />
            <label>Description</label>
            <TextArea
                onChange = {onDescriptionChange}
                value = {Description}
            />

            <br />
            <br />

            <select onChange = {onPrivateChange}>
                {PrivateOptions.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>

            <br />
            <br />

            <select onChange = {onCategoryChange}>
                {CategoryOptions.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>

            <br />
            <br />
            <Button type="primary" size="large" onClick = {onSubmit}>
                Submit
            </Button>
            </Form>

        </div>
    )
}

export default VideoUploadPage
