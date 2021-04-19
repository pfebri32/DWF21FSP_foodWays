import { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router';
import DeliveryLocationForm from '../../components/Form/DeliveryLocationForm';

// Contexts.
import { UserContext } from '../../contexts/userContext';

// Configs.
import { API } from '../../config/api';

// Styles.
import '../../styles/Form.css';

const Edit = () => {
  // Contexts.
  // eslint-disable-next-line
  const [state, dispatch] = useContext(UserContext);

  // States and Variables.
  const history = useHistory();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    file: null,
  });
  const { name, phone, file } = form;
  const { user } = state;
  const { location, role } = user;

  const [address, setAddress] = useState('');
  const [coordinate, setCoordinate] = useState(null);

  // Queries.
  const getUserData = async () => {
    try {
      const res = await API.get('/user');
      const { data } = res.data;
      const { user } = data;
      setForm({
        ...form,
        name: user.name,
        phone: user.phone,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Handlers.
  const handleChange = (e) => {
    const name = e.target.name;
    setForm({
      ...form,
      [name]: e.target.type === 'file' ? e.target.files[0] : e.target.value,
    });
  };

  const handleAddress = (address, lng, lat) => {
    setAddress(address);
    setCoordinate({
      lng,
      lat,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = new FormData();

      body.append('name', form.name);
      body.append('img', form.file);
      body.append('phone', form.phone);
      body.append('loc_address', address);
      body.append('loc_lng', coordinate.lng);
      body.append('loc_lat', coordinate.lat);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const res = await API.patch('/user', body, config);

      if (res.data.status === 'invalid') {
        setError(res.data.message);
        return;
      }

      console.log(res);

      dispatch({
        type: 'UPDATE_PROFILE',
        payload: {
          name: form.name,
          phone: form.phone,
          img: res.data.data.img,
        },
      });
      history.push('/profile');
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <Container style={{ marginTop: 60, marginBottom: 0 }}>
      <div className="app__header" style={{ marginBottom: 30 }}>{`Edit Profile${
        role === 'partner' ? ' Partner' : ''
      }`}</div>
      {error && (
        <div className="form__error" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}
      <div className="form__container">
        <form onSubmit={handleSubmit}>
          <div className="form__input-group form__input-group-row">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={handleChange}
            />
            <div className="form__input-file">
              <input
                type="file"
                name="file"
                id="file"
                className="form__inputfile"
                onChange={handleChange}
              />
              <label for="file" style={{ position: 'relative' }}>
                <div
                  style={{
                    marginRight: 30,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {form.file ? form.file.name : 'Choose a file'}
                </div>
                <img
                  src="/assets/attach.svg"
                  alt="icon file"
                  style={{ position: 'absolute', right: 0 }}
                />
              </label>
            </div>
          </div>
          <div className="form__input-group">
            <input
              name="phone"
              type="phone"
              placeholder="Phone"
              value={phone}
              onChange={handleChange}
            />
          </div>
          <DeliveryLocationForm
            placeholder="Location"
            value={address}
            coordinate={coordinate}
            onSubmit={handleAddress}
            formStyle={true}
          />
          <input className="form__submit right" type="submit" value="Save" />
        </form>
      </div>
    </Container>
  );
};

export default Edit;
