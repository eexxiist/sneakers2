import React from 'react';
import {Route, Routes} from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header.js';
import Drawer from './components/Drawer/index.js';
import Home from './pages/Home.jsx';
import Favorites from './pages/Favorites.jsx';
import AppContext from './context.js';
import Orders from './pages/Orders.jsx';


function App() {

  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const cartResponse = await axios.get('https://63f91636970e3bebfb853a0b.mockapi.io/cart');
        const favoritesResponse = await axios.get('https://640cc96094ce1239b0b5c507.mockapi.io/favorites');
        const itemsResponse = await axios.get('https://63f91636970e3bebfb853a0b.mockapi.io/items');

        setIsLoading(false);

        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Ошибка при запросе данных')
      }
    }
    fetchData();
  }, []);

  const onAddToCart = async (obj) =>{
    try{
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id))
      if (findItem){
        setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(`https://63f91636970e3bebfb853a0b.mockapi.io/cart/${findItem.id}`);
      } else{
        const {data} = await axios.post('https://63f91636970e3bebfb853a0b.mockapi.io/cart', obj);
        setCartItems((prev) => [...prev, data]);
      }
    }catch(err){
      alert('Ошибка при добавлении в корзину');
      // console.error(error);
    }
  };

  const onRemoveItem = (id) => {
   try {
    axios.delete(`https://63f91636970e3bebfb853a0b.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
   } catch (error) {
      alert('Ошибка при удалении из корзины');
      // console.error(error);
   }
  }

  const onAddFavorite = async (obj) =>{
    try{
      if (favorites.findIndex(e => +e.id === +obj.id) > -1){
        axios.delete(`https://640cc96094ce1239b0b5c507.mockapi.io/favorites/${obj.id}`);
        setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
      } else {
        const {data} = await axios.post('https://640cc96094ce1239b0b5c507.mockapi.io/favorites', obj);
        setFavorites((prev) => [...prev, data]);
      }
    } catch(error){
      alert('Не удалось добавить в фавориты');
      console.error(error);
    }
  };

  const onChangeSearchInput = (event) => {
    console.log(event.target.value)
    setSearchValue(event.target.value);
  }

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  }
  

  return (
      <AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddFavorite, onAddToCart, setCartOpened, setCartItems }}>
        <div className="wrapper clear">
          <div>
            <Drawer 
            items={cartItems} 
            onClose={() => setCartOpened(false)} 
            onRemove={onRemoveItem} 
            opened={cartOpened}/>
          </div>

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
              />}
            />

            <Route path='/favorites' exact
              element={<Favorites onAddFavorite={onAddFavorite}/>}>
             </Route>

            <Route path='/orders' exact 
              element={<Orders/>}>
            </Route>
            
          </Routes> 
        </div>
      </AppContext.Provider>
  );
}

export default App;
