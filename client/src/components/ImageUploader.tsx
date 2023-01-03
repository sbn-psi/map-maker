import React, {useState} from 'react';
import web from 'axios';
import Button from '@mui/material/Button';
import { Zone } from '../AppState';

type Props = {
	handler: (response: [Zone]) => void,
	cardinality: "multiple" | "single"
}

export default function ImageUploader({handler, cardinality = "single"}: Props){
	const [selectedFiles, setSelectedFiles] = useState<FileList | undefined | null>(null);

    const changeHandler = (event: React.FormEvent<HTMLInputElement>) => {
		const target = (event.target as HTMLInputElement)
		setSelectedFiles(target.files)
	};

	let fileDimensions:{[key: string]: {width: number, height: number}} = {}
	const handleSubmission = () => {
		if(!selectedFiles) return

        const formData = new FormData()

		for(let file of Array.from(selectedFiles)) {
			formData.append(file.name, file)
			getUploadedFileDimensions(file).then(dimensions => {
				fileDimensions[file.name] = dimensions
			})
		}

		web.post('/image/upload', formData).then(resp => {
			handler(resp.data.map((zone: any) => Zone.fromJson({...zone, naturalWidth: fileDimensions[zone.name].width, naturalHeight: fileDimensions[zone.name].height})))
			setSelectedFiles(null)
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
				<input type="file" name="file" onChange={changeHandler} hidden multiple={cardinality === "multiple"} accept=".jpg, .png, .jpeg, .gif, .bmp|image/*"/>
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

function getUploadedFileDimensions(file: File) {
	return new Promise<{width: number, height: number}>((resolve, reject) => {
		try {
			let img = new Image()

			img.onload = () => {
				const width  = img.naturalWidth,
					height = img.naturalHeight

				window.URL.revokeObjectURL(img.src)

				return resolve({width, height})
			}

			img.src = window.URL.createObjectURL(file)
		} catch (exception) {
			return reject(exception)
		}
	}
)}