import { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Redirect, useHistory } from 'react-router';

import { UserContext } from '../../contexts/userContext';

import { API } from '../../config/api';

import '../../styles/Form.css';

const Add = () => {
  // Contexts.
  const [state] = useContext(UserContext);

  // States and Variables.
  const history = useHistory();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    price: null,
    file: null,
  });
  const { title, price, file } = form;

  // Handlers.
  const handleChange = (e) => {
    const name = e.target.name;
    setForm({
      ...form,
      [name]: e.target.type === 'file' ? e.target.files[0] : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = new FormData();

      body.append('name', title);
      body.append('img', file);
      body.append('price', price);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const res = await API.post('/product', body, config);

      if (res.data.status === 'invalid') {
        setError(res.data.message);
        return;
      }

      history.push(`/shop/${state.user.id}`);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <>
      {state.user.role === 'partner' ? (
        <Container style={{ marginTop: 60, marginBottom: 0 }}>
          <div className="app__header" style={{ marginBottom: 30 }}>
            Add Product
          </div>
          {error && (
            <div className="form__error" style={{ marginBottom: 20 }}>
              {error}
            </div>
          )}
          <div className="form__container">
            <form onSubmit={handleSubmit}>
              <div className="form__input-group form__input-group-row">
                <input
                  name="title"
                  type="text"
                  placeholder="Title"
                  value={title}
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
                  name="price"
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={handleChange}
                />
              </div>
              <input
                className="form__submit right"
                type="submit"
                value="Save"
              />
            </form>
          </div>
        </Container>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
};

export default Add;
