import { useHistory } from "react-router";
import LoginForm from "../components/Form/LoginForm";

const Login = () => {
    const history = useHistory();
    return (
        <div className='app__main-center'>
            <LoginForm onSwitch={() => history.push('/register')}/>
        </div>
    )
}

export default Login;
