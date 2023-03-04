import React from 'react';
import {Route, Routes} from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header.js';
import Drawer from './components/Drawer.js';
import Home from './pages/Home.jsx';
import Favorites from './pages/Favorites.jsx';
import AppContext from './context.js';


function App() {

  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const cartResponse = await axios.get('https://63f91636970e3bebfb853a0b.mockapi.io/cart');
      // const favoritesResponse = await axios.get('https://63f91636970e3bebfb853a0b.mockapi.io/favorites');
      const itemsResponse = await axios.get('https://63f91636970e3bebfb853a0b.mockapi.io/items');

      setIsLoading(false);

      setCartItems(cartResponse.data);
      // setFavorites(favoritesResponse.data);
      setItems(itemsResponse.data);
    }
    fetchData();
  }, []);

  const onAddToCart = (obj) =>{
    if (cartItems.find((item) => Number(item.id) === Number(obj.id))){
      axios.delete(`https://63f91636970e3bebfb853a0b.mockapi.io/cart/${obj.id}`);
      setCartItems(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
    } else{
      axios.post('https://63f91636970e3bebfb853a0b.mockapi.io/cart', obj);
      setCartItems( [...cartItems, obj]);
    }
  };

  const onRemoveItem =(id) => {
    console.log(id)
    axios.delete(`https://63f91636970e3bebfb853a0b.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter(item => item.id !== id));
  }

  const onAddFavorite = async (obj) =>{
    try{
      if (favorites.find((favObj) => favObj.id === obj.id)){
        axios.delete(`https://63f91636970e3bebfb853a0b.mockapi.io/favorites/${obj.id}`);
        setFavorites((prev) => prev.filter((item) => item.id !== obj.id));
      } else {
        const {data} = await axios.post('https://63f91636970e3bebfb853a0b.mockapi.io/favorites', obj);
        setFavorites((prev) => [...prev, data]);
      }
    } catch(error){
      alert('Не удалось добавить в фавориты')
    }
  };

  const onChangeSearchInput = (event) => {
    console.log(event.target.value)
    setSearchValue(event.target.value);
  }

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.id) === Number(id));
  }
  

  return (
      <AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddFavorite }}>
          <div className="wrapper clear">
          {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem}/>}
          <Header onClickCart={() => setCartOpened(true)}/>

          <Routes>
            <Route path='/' exact element={
            <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddFavorite={onAddFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
                />}>
              </Route>
          </Routes>

          <Routes>
            <Route path='/favorites' exact element={<Favorites/>}>
              </Route>
          </Routes>  
        </div>
      </AppContext.Provider>
  );
}

export default App;
