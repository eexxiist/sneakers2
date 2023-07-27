import React from 'react';
import styles from './Card.module.scss';
import ContentLoader from "react-content-loader";
import AppContext from '../../context';


function Card({
    id,
    onFavorite, 
    imageUrl, 
    title, 
    price, 
    onPlus, 
    favorited = false, 
    loading = false
}) {

    const {isItemAdded} = React.useContext(AppContext);
    const [isFavorite, setIsFavorite] = React.useState(favorited);
    const obj = {id, parentId: id, title, imageUrl, price};

    // console.log(title, isItemAdded(id))

    const onClickPlus = () =>{
        onPlus(obj);
    }

    const onClickFavorite = () => {
        onFavorite(obj)
        setIsFavorite(!isFavorite);
    }

    return ( 
        <div className={styles.card}>
            {
                loading ? 
                (<ContentLoader 
                    speed={2}
                    width={150}
                    height={265}
                    viewBox="0 0 150 265"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
               
              >
                <rect x="0" y="0" rx="10" ry="10" width="150" height="90" /> 
                <rect x="0" y="105" rx="5" ry="5" width="150" height="15" /> 
                <rect x="0" y="130" rx="5" ry="5" width="80" height="15" /> 
                <rect x="0" y="166" rx="5" ry="5" width="80" height="27" /> 
                <rect x="120" y="167" rx="5" ry="5" width="27" height="27" />
              </ContentLoader>) : 
              (<>
                <div className={styles.favorite}>
                    {onFavorite && <img onClick={onClickFavorite} src={isFavorite ? "/img/liked.svg" : "/img/unliked.svg"}  alt="Unliked" />}
                </div>
                <img width='100%' height={130} src={imageUrl} alt="Sneakers" />
                <h5>{title}</h5>
                <div className="d-flex justify-between align-center">
                    <div className="d-flex flex-column">
                        <span>Цена:</span>
                        <b>{price} руб.</b>
                    </div>
                    {onPlus && <img 
                    className={styles.plus} 
                    onClick={onClickPlus} 
                    src={isItemAdded(id) ? "/img/btn-checked.svg" : "/img/plus.svg"} 
                    alt="Plus" />}
                </div>
              </>)
            }
        </div>
    )
}

export default Card;
