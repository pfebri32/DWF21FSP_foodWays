import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Row } from 'react-bootstrap';

// Styles.
import '../../styles/Form.css';

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  'pk.eyJ1IjoicGZlYnJpMzIiLCJhIjoiY2ttNmU0NnM2MGtuMjJ0b2N1Y3lwYTZlcyJ9.cAIyN_pfCjVoyi3YSolyJg';

const DeliveryLocationForm = ({
  placeholder,
  value,
  coordinate,
  formStyle,
  onSubmit,
  disable,
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => !disable && setShow(true);
  const coordinateDefault = coordinate
    ? coordinate
    : {
        lat: -6.1537,
        lng: 106.8176,
      };

  // Set Map.
  const map = useRef();
  const marker = useRef();
  const mapContainer = useRef();
  const [lng, setLng] = useState(coordinateDefault.lng);
  const [lat, setLat] = useState(coordinateDefault.lat);
  const [lngClick, setLngClick] = useState(coordinateDefault.lng);
  const [latClick, setLatClick] = useState(coordinateDefault.lat);
  const [address, setAddress] = useState('');
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    var newMarker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current);
    marker.current = newMarker;

    map.current.on('click', function (e) {
      marker.current && marker.current.remove();
      var newMarker = new mapboxgl.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map.current);
      marker.current = newMarker;
      getAddress(e.lngLat.lng, e.lngLat.lat);
      setLngClick(e.lngLat.lng);
      setLatClick(e.lngLat.lat);
    });
    return () => map.current.remove();
  }, []);

  useEffect(() => {
    map.current.resize();
  }, [show]);

  // Queries.
  const getAddress = async (lng, lat) => {
    try {
      const res = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng}%2C%20${lat}.json?access_token=pk.eyJ1IjoicGZlYnJpMzIiLCJhIjoiY2ttNmU0NnM2MGtuMjJ0b2N1Y3lwYTZlcyJ9.cAIyN_pfCjVoyi3YSolyJg`
      );

      if (!(res.data.features.length > 0)) {
        return;
      }

      setAddress(res.data.features[0].place_name);
    } catch (error) {
      console.log(error);
    }
  };

  // Handler.
  const handleSubmit = () => {
    onSubmit(address, lngClick, latClick);
    handleClose();
  };

  return (
    <>
      {!formStyle && (
        <div className="form__location-header">Delivery Location</div>
      )}
      <Row style={{ marginTop: 15 }}>
        <div
          className={`form__location-field ${
            formStyle && 'form__input-group-style'
          }`}
        >
          {value ? value : placeholder}
        </div>
        <div className="form__location-button" onClick={handleShow}>
          <div className="form__location-title">Select On Map</div>
          <div className="form__location-icon">
            <img src="/assets/map.svg" alt="Map Icon" />
          </div>
        </div>
      </Row>
      <div className={`form__location-map ${show && 'show'}`}>
        <div className="form__location-area">
          <div
            className="map__container"
            ref={mapContainer}
            style={{ overflow: 'hidden' }}
          />
        </div>
        <div className="form__location-modal-controller">
          <div className="form__location-modal-controller-flex">
            <div className="form__location-modal" onClick={handleSubmit}>
              Change Location
            </div>
            <div className="form__location-modal" onClick={handleClose}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryLocationForm;
