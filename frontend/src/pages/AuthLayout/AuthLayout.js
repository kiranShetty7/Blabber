import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Login from '../../components/Auth/Login/Login';
import SignUp from '../../components/Auth/SignUp/SignUp';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import classes from './AuthLayout.module.css'


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}




const AuthLayout = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className={classes.background}>
            <div className={classes.content}>
            <span className={classes.title}>Blabber</span>
                <span className={classes.subTitle}>Unleash the Blabber, Embrace the Fun!</span>
                <Card className={ `${classes.card} `}>
                    <CardContent>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered >  
                                    <Tab label="Login" {...a11yProps(0)} sx={{ textTransform: 'initial'}} />
                                    <Tab label="Sign Up" {...a11yProps(1)} sx={{ textTransform: 'initial'}} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={0}>
                                <Login />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                              <SignUp/>
                            </CustomTabPanel>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AuthLayout