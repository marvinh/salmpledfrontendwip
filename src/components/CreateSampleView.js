import { 
    Button, 
    Box, 
    Card, 
    CardContent, 
    Grid, 
    Typography, 
    TextField, 
    TableContainer, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    Paper, 
    Stack, 
    Dialog, 
    DialogActions, 
    DialogContent,
    DialogContentText,
    DialogTitle 
} from "@mui/material";

import Waveform from "./Waveform";
import { makeStyles, styled } from "@material-ui/core";
import { EditOutlined, LabelOutlined, RemoveCircleOutline } from "@mui/icons-material";
import { useState } from "react";


const useStyles = makeStyles({
    button:
    {
        border: "1px solid #DEDEDE",
        backgroundColor: "#181E22",
        color: '#DEDEDE',
        '&:hover': {
            backgroundColor: "#181E22",
            color: '#DEDEDE',
        }
    }
})

const RenameSampleDialog = (props) => {
    return (
        <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={props.handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    )
}
export function CreateSampleView1(props) {
    const classes = useStyles()
    const [openRename, setOpenRename] = useState(false);

    const handleClickRenameOpen = () => {
        setOpenRename(true);
      };
    
      const handleRenameClose = () => {
        setOpenRename(false);
      };

    return (
        <Grid container direction="row" spacing={1}>
            {props.state.map((acceptedFile, index) => (
                <Grid key={acceptedFile.id} item xs={12} md={3}>
                    <Card variant="outlined" sx={{ height: "100%", backgroundColor: '#181E22', color: "#DEDEDE", transform: 'translate(0, 1.5px) scale(0.75)' }}>
                        <CardContent>
                            <Typography component="div">
                                {acceptedFile.originalFileName}
                            </Typography>
                            {/* <Typography component="div">
                                    Date Added: {acceptedFile.createdAt}
                                </Typography> */}

                            <Box>
                                <Waveform url={URL.createObjectURL(acceptedFile.mp3File)} />
                            </Box>
                            <Stack spacing={2}>
                                <Button onClick={handleClickRenameOpen} className={classes.button}>
                                    <EditOutlined /> Rename
                                </Button>
                                <Button className={classes.button}>
                                    <LabelOutlined /> Tag
                                </Button>
                                <Button className={classes.button}>
                                    <RemoveCircleOutline />
                                    Remove
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                    <RenameSampleDialog open={openRename} handleClose={handleRenameClose} />
                </Grid>))
            }

        </Grid>
    )
}

export function CreateSampleView3(props) {
    const classes = useStyles()
    return (
        <TableContainer component={Paper} sx={{ backgroundColor: '#181E22', color: "#DEDEDE" }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '25%' }} sx={{ color: "#DEDEDE" }}>
                            Sample Name
                        </TableCell>
                        <TableCell style={{ width: '50%' }} sx={{ color: "#DEDEDE" }}>
                            Preview
                        </TableCell>
                        <TableCell style={{ width: '25%' }} sx={{ color: "#DEDEDE" }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.state.map((acceptedFile, index) => (
                        <TableRow key={acceptedFile.id}>
                            <TableCell sx={{ color: "#DEDEDE" }}>
                                {acceptedFile.originalFileName}
                            </TableCell>
                            <TableCell sx={{ color: "#DEDEDE" }}>
                                <Waveform url={URL.createObjectURL(acceptedFile.mp3File)} />
                            </TableCell>
                            <TableCell >

                            </TableCell>
                            <TableCell>
                                <Stack>
                                    <Button className={classes.button}>
                                        Rename
                                    </Button>
                                    <Button className={classes.button}>
                                        Tag
                                    </Button>
                                    <Button className={classes.button}>
                                        Remove
                                    </Button>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}