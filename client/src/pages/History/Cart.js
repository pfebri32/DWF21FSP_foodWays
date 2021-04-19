import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import NumberFormat from 'react-number-format';
import { useContext, useEffect, useState, useRef } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router';

// Contexts.
import { RestaurantContext } from '../../contexts/restaurantContext';
import { HistoryContext } from '../../contexts/historyContext';

// Components.
import DeliveryLocationForm from '../../components/Form/DeliveryLocationForm';
import CartOrderCard from '../../components/Card/CartOrderCard';

// Styles.
import '../../styles/Cart.css';
import { API } from '../../config/api';

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  'pk.eyJ1IjoicGZlYnJpMzIiLCJhIjoiY2ttNmU0NnM2MGtuMjJ0b2N1Y3lwYTZlcyJ9.cAIyN_pfCjVoyi3YSolyJg';

const Cart = () => {
  // Contexts.
  // eslint-disable-next-line
  const [restaurantState, restaurantDispatch] = useContext(RestaurantContext);
  // eslint-disable-next-line
  const [historyState, historyDispatch] = useContext(HistoryContext);

  // Vars and States.
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [lng, setLng] = useState(-73.996);
  const [lat, setLat] = useState(40.732);
  const [zoom, setZoom] = useState(9);
  const map = useRef(null);
  const mapContainer = useRef(null);

  // Mapbox.
  // create a function to make a directions request
  var start = [-73.996, 40.732];

  function getRoute(end) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    var url =
      'https://api.mapbox.com/directions/v5/mapbox/driving/' +
      start[0] +
      ',' +
      start[1] +
      ';' +
      end[0] +
      ',' +
      end[1] +
      '?steps=true&geometries=geojson&access_token=' +
      mapboxgl.accessToken;

    // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function () {
      var json = JSON.parse(req.response);
      var data = json.routes[0];
      var route = data.geometry.coordinates;
      var geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route,
        },
      };
      // if the route already exists on the map, reset it using setData
      if (map.current.getSource('route')) {
        map.current.getSource('route').setData(geojson);
      } else {
        // otherwise, make a new request
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: geojson,
              },
            },
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        });
      }
      // add turn instructions here at the end
    };
    req.send();
  }

  // Maps.
  useEffect(() => {
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom,
      });

      var canvas = map.current.getCanvasContainer();

      map.current.on('load', function () {
        // make an initial directions request that
        // starts and ends at the same location

        // Add starting point to the map
        map.current.addLayer({
          id: 'point',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: start,
                  },
                },
              ],
            },
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#3887be',
          },
        });
        // this is where the code from the next step will go

        map.current.on('click', function (e) {
          var coordsObj = e.lngLat;
          canvas.style.cursor = '';
          var coords = Object.keys(coordsObj).map(function (key) {
            return coordsObj[key];
          });
          var end = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: coords,
                },
              },
            ],
          };
          if (map.current.getLayer('end')) {
            map.current.getSource('end').setData(end);
          } else {
            map.current.addLayer({
              id: 'end',
              type: 'circle',
              source: {
                type: 'geojson',
                data: {
                  type: 'FeatureCollection',
                  features: [
                    {
                      type: 'Feature',
                      properties: {},
                      geometry: {
                        type: 'Point',
                        coordinates: coords,
                      },
                    },
                  ],
                },
              },
              paint: {
                'circle-radius': 10,
                'circle-color': '#f30',
              },
            });
          }
          getRoute([-73.991, 40.735]);
        });
      });
    }
    return () => map.current.remove();
  }, [loading]);

  useEffect(() => {
    if (map.current) map.current.resize();
  }, [show]);

  // Queries.
  const getMyOrder = async () => {
    try {
      const res = await API.get(`/order/${id}`);
      const { data } = res.data;
      const { order } = data;
      const { products } = order;

      let totalPrice = 0;
      let totalQuantity = 0;

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        totalQuantity += product.quantity;
        totalPrice += product.quantity * product.price;
      }

      setOrder({
        ...data.order,
        totalPrice,
        totalQuantity,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyOrder();
  }, []);

  // Renders.
  const renderOrders = () =>
    order.products.map(({ name, quantity, id, price, img }) => (
      <CartOrderCard
        key={id}
        id={id}
        img={
          img
            ? img
            : 'https://www.starbucks.co.id/media/chocolate-croissant-reserve_tcm33-66591_w1024_n.jpg'
        }
        name={name}
        price={price}
        quantity={quantity}
      />
    ));
  return (
    <>
      <Container style={{ marginTop: 60, marginBottom: 60 }}>
        {!loading && order?.products?.length !== 0 ? (
          <>
            <div className="app__header">{order?.partner?.name}</div>
            <div style={{ marginTop: 30 }}>
              <DeliveryLocationForm
                placeholder="Pick Your Location"
                value={order?.loc_address}
                disable
              />
            </div>
            <div style={{ marginTop: 30 }}>
              <div className="cart__title">Review Your Order</div>
              <Row style={{ marginTop: 15 }}>
                <div className="cart__orders">{renderOrders()}</div>
                <div className="cart__info">
                  <div className="cart__detail-group">
                    <div className="cart__info-group">
                      <div className="cart__info-label">Subtotal</div>
                      <div className="cart__info-value app__text-red">
                        <NumberFormat
                          value={order.totalPrice}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="Rp "
                          displayType="text"
                        />
                      </div>
                    </div>
                    <div className="cart__info-group">
                      <div className="cart__info-label">Qty</div>
                      <div className="cart__info-value">
                        {order.totalQuantity}
                      </div>
                    </div>
                    <div className="cart__info-group">
                      <div className="cart__info-label">Ongkir</div>
                      {/* <div className="cart__info-value app__text-red">{`Rp ${deliveryCost}`}</div> */}
                    </div>
                  </div>
                  <div className="cart__total-group">
                    <div className="cart__info-group app__text-red app__text-bold">
                      <div className="cart__info-label">Total</div>
                      {/* <div className="cart__info-value">{`Rp ${totalCost}`}</div> */}
                    </div>
                  </div>
                </div>
              </Row>
            </div>
            <div className="cart__button" onClick={() => setShow(true)}>
              See How Far ?
            </div>
          </>
        ) : (
          <div className="app__header">Empty</div>
        )}
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
              <div
                className="form__location-modal"
                onClick={() => setShow(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;
