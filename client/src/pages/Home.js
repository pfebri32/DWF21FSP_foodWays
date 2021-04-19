// Components.
import Hero from '../components/Hero';
import NearestRestaurant from '../components/NearestRestaurant';
import PopularRestaurant from '../components/PopularRestaurant';

const Home = () => {
  return (
    <>
      <Hero />
      <PopularRestaurant style={{ marginTop: 60 }} />
      <NearestRestaurant style={{ marginTop: 60, marginBottom: 60 }} />
    </>
  );
};

export default Home;
