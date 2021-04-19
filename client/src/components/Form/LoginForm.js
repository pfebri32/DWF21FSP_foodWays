import { useContext, useState } from 'react';
import { useHistory } from 'react-router';

// Contexts.
import { UserContext } from '../../contexts/userContext';

// Configs.
import { API, setAuthToken } from '../../config/api';

// Styles.
import styles from '../../styles/Form/AuthForm.module.css';

const LoginForm = ({ onSwitch, onClose }) => {
  // Contexts.
  // eslint-disable-next-line
  const [state, dispatch] = useContext(UserContext);

  // States and Variables.
  const history = useHistory();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const { email, password } = form;

  // Handlers.
  const handleChange = (e) => {
    const name = e.target.name;
    setForm({
      ...form,
      [name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({
        email,
        password,
      });

      const res = await API.post('/login', body, config);
      const { data } = res.data;

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: data.user.token,
          user: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            phone: data.user.phone,
            img: data.user.img,
          },
        },
      });
      setAuthToken(data.user.token);
      onClose && onClose();
      history.push('/');
    } catch (error) {
      console.log(error);
      // setError(error.response.data.message);
    }
  };
  return (
    <div className={styles.form}>
      <div className={styles.header}>Login</div>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className={styles.container}>
          <div className={styles.input__group}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input__group}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
          </div>
        </div>
        <input className={styles.submit} type="submit" value="Submit" />
      </form>
      <div className={styles.footer}>
        <div className={styles.link} onClick={onSwitch}>
          Don't have an account? Click <span>Here</span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
