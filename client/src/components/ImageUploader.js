import React, {useState} from 'react';
import web from 'axios';


export default function ImageUploader({handler}){
	const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);

    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};

	const handleSubmission = () => {
        const formData = new FormData()

        formData.append('File', selectedFile)

		web.post('/image/upload', formData).then(resp => {
			handler(resp.data.url)
		}, err => {
			console.error(err)
		})
	};

	return(
        <div>
			<input type="file" name="file" onChange={changeHandler} />
            {isSelected ? (
				<div>
					<p>Filename: {selectedFile.name}</p>
				</div>
			) : (
				<p>Select an image</p>
			)}
			<div>
				<button onClick={handleSubmission}>Upload</button>
			</div>
		</div>
	)
}