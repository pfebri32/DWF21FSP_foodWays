import { useHistory } from "react-router";
import RegisterForm from "../components/Form/RegisterForm"

const Register = () => {
    const history = useHistory();
    return (
        <div className='app__main-center'>
            <RegisterForm onSwitch={() => history.push('/login')}/>
        </div>
    )
}

export default Register;
