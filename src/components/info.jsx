import React from 'react';
import AppContext from '../context';

const Info = ({title, image, description}) => {
    const {setCartOpened} = React.useContext(AppContext);

  return (
    <div>
      <div className="cartEmpty d-flex align-center fustify-center flex-column flex">
        <img className="mb-20" width='120px' src={image} alt="Cart" />
        <h2>{title}</h2>
        <p className="opacity-6">{description}</p>
        <button onClick={() => setCartOpened(false)} className="greenButton">
            <img src="/img/arrow.svg" alt="Arrow"/>Вернуться назад
        </button>
    </div>
    </div>
  )
}

export default Info;
