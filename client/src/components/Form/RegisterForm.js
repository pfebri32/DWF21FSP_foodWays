import { useContext, useState } from 'react';
import { useHistory } from 'react-router';

// Contexts.
import { UserContext } from '../../contexts/userContext';

// Configs.
import { API, setAuthToken } from '../../config/api';

// Styles.
import styles from '../../styles/Form/AuthForm.module.css';

const RegisterForm = ({ onSwitch, onClose }) => {
  // Contexts.
  // eslint-disable-next-line
  const [state, dispatch] = useContext(UserContext);

  // States and Variables.
  const history = useHistory();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    gender: '',
    phone: '',
    role: 'user',
  });
  const { email, password, name, gender, phone, role } = form;

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
        name,
        gender,
        phone,
        role,
      });

      const res = await API.post('/register', body, config);
      const { data } = res.data;
      const { user } = data;

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          token: user.token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            img: user.img,
          },
        },
      });
      setAuthToken(user.token);
      onClose && onClose();
      history.push('/');
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className={styles.form}>
      <div className={styles.header}>Register</div>
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
          <div className={styles.input__group}>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input__group}>
            <input
              name="gender"
              type="text"
              placeholder="Gender"
              value={gender}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input__group}>
            <input
              name="phone"
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={handleChange}
            />
          </div>
          <div className={`${styles.input__group} ${styles.select__group}`}>
            <select name="role" onChange={handleChange}>
              <option value="user">Customer</option>
              <option value="partner">Restaurant</option>
            </select>
            <img
              className={styles.select__arrow}
              src="/assets/polygon.png"
              alt=""
            />
          </div>
        </div>
        <input className={styles.submit} type="submit" value="Submit" />
      </form>
      <div className={styles.footer}>
        <div className={styles.link} onClick={onSwitch}>
          Already have an account? Click <span>Here</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
