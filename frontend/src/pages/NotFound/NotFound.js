import classes from './NotFound.module.css'
import NotFoundSource from '../../assets/notFound.gif'

const NotFound = () => {
    return (
        <div className={classes.container}>
            <p className={classes.notFound}> 404 route not found</p>
            <img src={NotFoundSource} className={classes.gif} />
            <p className={classes.reRoute}>
                Click here to <a href={'/'}>login to Blabber</a>
            </p>
        </div>)
}

export default NotFound