import React, {useState} from 'react';
import web from 'axios';
import Button from '@mui/material/Button';

type Props = {
	handler: (url: string) => void,
	cardinality: "multiple" | "single"
}

export default function ImageUploader({handler, cardinality = "single"}: Props){
	const [selectedFiles, setSelectedFiles] = useState<FileList | undefined | null>(null);

    const changeHandler = (event: React.FormEvent<HTMLInputElement>) => {
		const target = (event.target as HTMLInputElement)
		setSelectedFiles(target.files)
	};

	const handleSubmission = () => {
		if(!selectedFiles) return

        const formData = new FormData()

		for(let file of Array.from(selectedFiles)) {
			formData.append(file.name, file)
		}

		web.post('/image/upload', formData).then(resp => {
			handler(cardinality == 'single' ? resp.data[0].url : resp.data)
		}, err => {
			console.error(err)
		})
	};

	return(
        <div>
			<Button
				component="label"
				>
				Select File
				<input type="file" name="file" onChange={changeHandler} hidden multiple={cardinality == "multiple"}/>
				</Button>
            {selectedFiles && <>
				<ul>
					{Array.from(selectedFiles).map( (file) => 
						<li key={file.name}>
							Filename: {file.name}
						</li>
					)}
				</ul>
				<Button variant="contained" onClick={handleSubmission}>Upload</Button>
			</>}
			
		</div>
	)
}