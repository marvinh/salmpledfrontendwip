import { makeStyles, styled } from "@material-ui/core";
import { PauseCircle, PlayArrow, PlayArrowOutlined, PlayCircle, VolumeDown, VolumeUp } from "@mui/icons-material";
import { Box, Slider, Stack, Button } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";

import WaveSurfer from "wavesurfer.js";

const formWaveSurferOptions = ref => ({
    container: ref,
    waveColor: "#181E22",
    progressColor: "#DA4E4D",
    cursorColor: "#DA4E4D",
    barWidth: 2,
    responsive: true,
    height: 64,
    backend: 'MediaElement',
    // If true, normalize by the maximum peak instead of 1.0.
    normalize: true,
    // Use the PeakCache to improve rendering speed of large waveforms.
    partialRender: false,
    splitChannels: false,
});

const useStyles = makeStyles({
    button: 
    {
      backgroundColor: "#181E22",
      color: '#DEDEDE',
      '&:hover': {
        backgroundColor: "#181E22",
        color: '#DEDEDE',
    }
}})

const WaveformSlider = styled(Slider)(({ theme }) => ({
    '& .MuiSlider-thumb': {
      backgroundColor: '#DEDEDE',
    },
    '& .MuiSlider-track': {
      border: 'none',
      color: '#DEDEDE'
    },
    '& .MuiSlider-rail': {
      opacity: 0.5,
      backgroundColor: '#DEDEDE',
      color: '#000'
    },
    '& .MuiSlider-mark': {
      backgroundColor: '#bfbfbf',
      height: 8,
      width: 1,
      '&.MuiSlider-markActive': {
        opacity: 1,
        backgroundColor: '#DEDEDE',
      },
    },
  }));

export default function Waveform({ url }) {
    const classes = useStyles()
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlay] = useState(false);
    const [playCount, setPlayCount] = useState(0);
    const [volume, setVolume] = useState(0.5);

    // create new WaveSurfer instance
    // On component mount and when url changes
    useEffect(() => {
    
        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);

        wavesurfer.current.load(url);

        wavesurfer.current.on("ready", function () {
            // https://wavesurfer-js.org/docs/methods.html
            // wavesurfer.current.play();
            //setPlay(true);

            // make sure object stillavailable when file loaded
            if (wavesurfer.current) {
                wavesurfer.current.setVolume(volume);
                setVolume(volume);
            }
        });

        wavesurfer.current.on("finish", function () {
            if (wavesurfer.current) {
                setPlay(true);
                console.log("finish", playing);
            }
            
        })

        // Removes events, elements and disconnects Web Audio nodes.
        // when component unmount
        return () => wavesurfer.current.destroy();
    }, []);

    const handlePlayPause = () => {
        wavesurfer.current.playPause();
        setPlay(wavesurfer.current.isPlaying())
        const newPlayCount = playCount + 1
        setPlayCount(newPlayCount)
    };

    const onVolumeChange = e => {
        const { target } = e;
        const newVolume = +target.value;

        if (newVolume) {
            setVolume(newVolume);
            wavesurfer.current.setVolume(newVolume || 1);
        }
    };

    return (
        <Box>
            <div id="waveform" style={{backgroundColor: "#DEDEDE"}} ref={waveformRef} />
            <Box className="controls" style={{textAlign: 'center'}}>
                <Button className={classes.button} onClick={handlePlayPause}>{ playing ? (<PlayCircle />) : (<PauseCircle />)}</Button>
                <Stack spacing={2}
                    direction="row"
                    sx={{ mb: 1 }}
                    alignItems="center">
                    <VolumeDown />
                    <WaveformSlider aria-label="Volume"
                        className={classes.slider}
                        min={0.01}
                        max={1}
                        step={0.01}
                        defaultValue={0.5}
                        value={volume}
                        onChange={onVolumeChange} />
                    <VolumeUp />
                </Stack>
                {/* <
          type="range"
          id="volume"
          name="volume"
          // waveSurfer recognize value of `0` same as `1`
          //  so we need to set some zero-ish value for silence
          min="0.01"
          max="1"
          step=".025"
          onChange={onVolumeChange}
          defaultValue={volume}
        /> */}

            </Box>
        </Box>
    );
}
