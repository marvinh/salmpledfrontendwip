
import { useState } from "react";
import { axinstance } from "../services/axios";
import { useEffect } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { auth } from "../services/firebase";
import { Box } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import AlbumIcon from '@mui/icons-material/Album';
import { v4 as uuidv4 } from "uuid";
import {
    FormControl,
    Input,
    InputLabel,
    FormHelperText,
    Card,
    Grid,
    CardContent,
    Button,
    CardActions,
    CardMedia,
    Typography,
    Avatar,
    CardHeader,
    TextareaAutosize,
    TextField,
    CssBaseline,
    CircularProgress
} from '@mui/material';
import { Redirect } from "react-router-dom";


const DashboardDetails = (props) => {

    const history = useHistory();


    const routeChange = (route) => {
        history.push(route);
    }

    return (
        <Grid
            container
            direction="row"
        >
            <Grid item xs={6}>
                <Card variant="contained">
                    <CardHeader
                        title={`@${props.username}`}
                    >

                    </CardHeader>

                    <CardContent>
                        <Grid container direction="row">

                            <Grid item xs={12} sx={{pt:2}}
                            >
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Choose Profile Image
                                    <input
                                        type="file"
                                        hidden
                                    />
                                </Button>
                            </Grid>
                            <Grid item xs={12} sx={{pt:2}}>
                                <TextField
                                    label="Headline"
                                    multiline
                                    rows={2}
                                    aria-label="empty textarea"
                                    placeholder="Headline."
                                    variant="outlined"

                                />
                            </Grid>
                            <Grid item xs={12} sx={{pt:2}}>

                                <TextField
                                    sx={{ pt: 2 }}
                                    label="Bio"
                                    multiline
                                    rows={8}
                                    aria-label="empty textarea"
                                    placeholder="A little bit about yourself..."
                                    variant="outlined"

                                />

                            </Grid>
                        </Grid>



                    </CardContent>
                    <CardActions>
                        <Button
                            onClick={props.submitHeadlineAndBio}
                            variant="contained"
                            color="primary"> Save
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid
                item xs={6}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => routeChange("/createsamplepack/"+props.username+"/"+uuidv4())}> <AlbumIcon></AlbumIcon> Create A Sample Pack
                </Button>

            </Grid>
        </Grid>
    )
}

const UsernameSelection = (props) => {
    console.log("Available", props.available)
    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center">
            <Grid item xs={8}>
                <Card variant="outlined">
                    <CardContent>
                        <FormControl>
                            <InputLabel htmlFor="username-input">Set a username.</InputLabel>
                            <Input
                                // value={props.username} errorText={!props.available ? "Username not available." : ""}
                                value={props.username}
                                onChange={props.handleUsernameChange}
                                id="username-input"
                                aria-describedby="my-helper-text" />
                            <FormHelperText id="my-helper-text">Set a username for your account.</FormHelperText>
                        </FormControl>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center' }}>
                        <Button
                            onClick={props.submitUserName}
                            variant="contained"
                            disabled={props.available === true ? false : true}
                            color="primary"> Submit Username </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    )

}

export default function Dashboard() {
    const [userInfo, setUserInfo] = useState({})
    const [username, setUsername] = useState('')
    const [available, setAvailable] = useState(false)
    const [loading, setLoading] = useState(true)
    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const submitUserName = () => {
        const updatedUser = { ...userInfo, username: username }
        axinstance.put('/users/setUsername', updatedUser)
            .then((res) => {
                console.log(res)
                setUserInfo(updatedUser);
            })
    }

    useEffect(() => {
        console.log(username);
        axinstance.get(`/users/usernameAvailable?username=${username}`)
            .then((res) => {
                if (res.data === true) {
                    setAvailable(true)
                } else {
                    setAvailable(false)
                }
            })
    }, [username])


    useEffect(() => {
        const source = axios.CancelToken.source()
        const fetchDashboard = async () => {
            try {
                await axinstance.post('/users/existsOrCreate', {
                    cancelToken: source.token,
                })
                    .then((res) => {
                        setUserInfo(res.data)
                        setLoading(false)
                    })

            } catch (error) {
                if (axios.isCancel(error)) {
                } else {
                    console.log(error)
                }
            }
        }
        fetchDashboard()
        return () => {
            source.cancel()
        }

    }, [userInfo.username, username])

    return (
        <Box m={2} pt={3} sx={{ flexGrow: 1 }}>
            
            {
                loading ? <CircularProgress />  : (
                !userInfo.username ?
                    (<UsernameSelection
                        available={available}
                        submitUserName={submitUserName}
                        handleUsernameChange={handleUsernameChange} />) :
                    (<DashboardDetails
                        avatar={userInfo.avatar}
                        username={userInfo.username}
                        headline={userInfo.headline}
                        bio={userInfo.bio} />)
                )
            }
        </Box>
    )

}