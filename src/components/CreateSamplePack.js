import { useReducer, useState } from "react";
import { axinstance } from "../services/axios";
import { useEffect } from "react";
import axios from "axios";
import { auth } from "../services/firebase";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { WaveFileParser } from 'wavefile-parser';
import {
    createTheme,
    Grid,
    Box,
    Button,
    TextField,
    Chip,
    Typography,
    Switch,
    FormGroup,
    FormControlLabel
} from '@mui/material';
import { FileUpload } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import {encodeStereo, encodeMono, FloatArray2Int16} from '../misc/mp3conversion'
import {CreateSampleView1, CreateSampleView3} from "./CreateSampleView";
import { useParams } from "react-router-dom";


function MyDropzone(props) {

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files

        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                console.log(binaryStr)
                let wav = new WaveFileParser();
                wav.fromBuffer(new Uint8Array(reader.result));
                console.log('wav:', wav);
                const offset = wav.signature.subChunks[1].chunkData.start;
                const length = wav.signature.subChunks[1].chunkSize;
                const numChannels = wav.fmt.numChannels;
                const sampleRate = wav.fmt.sampleRate;
                var samples = null;
                switch (wav.fmt.bitsPerSample) {
                    case 32:
                        samples = FloatArray2Int16(new Float32Array(reader.result), offset, length / 2);
                        break;
                    case 24:
                        // to do
                        break;
                    case 16:
                        samples = new Int16Array(reader.result, offset, length / 2);
                        break;
                }

                if (numChannels == 2) {
                    const originalFile = file
                    const mp3File = encodeStereo(numChannels, sampleRate, samples)

                    props.filesDispatch({
                        type: 'addFiles', payload: {
                            id: uuidv4(),
                            originalFile: originalFile,
                            mp3File: mp3File,
                            originalFileName: file.name,
                            renamedFileName: file.name.split('.')[0],
                            tags: [],
                            createdAt: Date()
                        }
                    })
                } else if (numChannels == 1) {
                    const originalFile = file
                    const mp3File = encodeMono(numChannels, sampleRate, samples)
                    props.filesDispatch({
                        type: 'addFiles', payload: {
                            id: uuidv4(),
                            originalFile: originalFile,
                            mp3File: mp3File,
                            originalFileName: file.name,
                            renamedFileName: file.name.split('.')[0],
                            tags: [],
                            createdAt: Date()

                        }
                    })
                } else {
                    console.log("unsupported number of channels");
                }

            }
            reader.readAsArrayBuffer(file)

        })


    }, [props.filesState])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'audio/wav, audio/aif' })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                <Grid border="2px dashed #181E22"
                    container
                    direction="row"
                    sx={{ height: "50vh" }}
                    align="center" justify="center" alignItems="center"
                >
                    <Grid item xs={12}>
                        <FileUpload sx={{ fontSize: 128 }} />
                    </Grid>
                    <Grid item xs={12}>

                        <Typography component="div" variant="h5">
                            Drag and drop .wav files here or click to select .wav files.
                        </Typography>
                    </Grid>
                </Grid>
            }
        </div>
    )
}
const initialFiles = [];

function reducer(state, action) {
    switch (action.type) {
        case 'addFiles':
            return [...state, action.payload];
        case 'removeFile':
            return { count: state.count - 1 };
        default:
            throw new Error();
    }
}

const GenreField = (props) => {

    return (
        <Grid container direction="row">
            <Grid item xs={12} sx={{ pt: 4 }}>
                <TextField
                    style={{ width: "100%" }}
                    label="Genres For This Sample Pack"
                    aria-label="genre textarea"
                    placeholder="What genres would match these samples?"
                    value={props.currentGenre}
                    onChange={(event) => props.handleSetCurrentGenre(event)}
                    onKeyPress={(event) => props.enterAddGenre(event)}
                    variant="outlined"> </TextField>
            </Grid>
            <Grid item xs={12} sx={{ pt: 4 }}>
                <Button
                    onClick={() => props.addGenre()}
                    variant="contained"
                    color="primary"> Add Genre(s)
                </Button>
            </Grid>
            <Grid item xs={12} sx={{ pt: 4 }}>
                {
                    props.genres.map(g => (
                        <Chip key={g.id} label={g.genreName} />
                    ))
                }
            </Grid>
        </Grid>
    )

}

const darkThemeInverted = createTheme({
    palette: {
        primary: {
            main: "#DEDEDE",//"#181E22",
        },
        secondary: {
            main: "#181E22",//"#DEDEDE",
        },
    },
});

const SamplePackContainer = (props) => {
    const [viewTable, setViewTable] = useState(true)
    return (

        <Grid container direction="row" spacing={1}>
            
            <CreateSampleView1 state={props.state} />
                {/* <FormGroup>
                    <FormControlLabel control={<Switch defaultChecked onChange={() => setViewTable(!viewTable)} />} label="View As Table" />
                </FormGroup>
                { 
                    viewTable ? (<CreateSampleView3 state={props.state}/>)
                    :
                    (<CreateSampleView1 state={props.state}/>)
                }
             */}
        </Grid>

    )
}

const steps = [
    "Step 1: Drag and drop audio files from your computer or click to select files.",
    "Step 2: Rename samples add tags or select more samples.",
    "Step 3: (Optional) Add an image to be associated with your sample pack and select genres for this sample pack.",
    "Step 4: Publish samplepack."
]
export default function CreateSamplePack() {
    const {username, packid} = useParams();
    
    const [state, dispatch] = useReducer(reducer, initialFiles);
    const [currentGenre, setCurrentGenre] = useState('');
    const [genres, setGenres] = useState([]);
    const handleOnDrop = (acceptedFiles) => {
        dispatch({ type: 'addFiles', payload: acceptedFiles })
    }

    function addGenre() {
        setGenres(genres.concat({id: uuidv4(), genreName: currentGenre}))
        setCurrentGenre('')
    }

    function keyPressAddGenre(event) {

        if(event.key === "Enter") {
            setGenres(genres.concat({id: uuidv4(), genreName: currentGenre}))
            setCurrentGenre('')
        }
    }
    function handleSetCurrentGenre(event) {
        setCurrentGenre(event.target.value)
    }



    return (
        <Box m={2} pt={1} sx={{ flexGrow: 1 }}>
            <h4>  </h4>
            <Box pb={3}>
                <MyDropzone filesState={state} filesDispatch={dispatch} handleOnDrop={handleOnDrop}> </MyDropzone>
            </Box>
            {state.length > 0 ? (
                <>
                    <GenreField
                        genres={genres}
                        currentGenre={currentGenre}
                        addGenre={addGenre}
                        handleSetCurrentGenre={handleSetCurrentGenre}
                        enterAddGenre={keyPressAddGenre}
                    />
                    <SamplePackContainer
                        state={state} />
                </>
            ) : <> </>
            }
        </Box>
    )
}