import { createContext, useState, useReducer} from "react";
import { DUMMY_PRODUCTS } from '../dummy-products.js';


export const CartContext = createContext({
  items:[],
  onUpdateCartItemQuantity : ()=>{},
  onAddItemToCart : ()=>{}
})

const shoppingCartStateReducer = (state, action) =>{
  if(action.type=="ADD_ITEM"){
    let updatedItems = [...state.items];
    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload.id
    );
    const existingCartItem = updatedItems[existingCartItemIndex];
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload.id);
      updatedItems.push({
        id: action.payload.id,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }
    return {
      items: updatedItems,
    };
  }
  if(action.type=="UPDATE_ITEM"){
        let updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId
        );
        
        const updatedItem = {
          ...updatedItems[updatedItemIndex],
        };
        
        updatedItem.quantity += action.payload.amount;
        
        if (updatedItem.quantity <= 0) {
          updatedItems.splice(updatedItemIndex, 1);
        } else {
          updatedItems[updatedItemIndex] = updatedItem;
        }
        
        return {
          items: updatedItems,
        };

    }
}

export const CartContextProvider = ({children}) => {
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartStateReducer,
    {
      items:[]
    }
  )

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type:'ADD_ITEM',
      payload : {
        id
      }
    })
  }

  function handleUpdateCartItemQuantity(productId, amount) {
      shoppingCartDispatch({
      type:'UPDATE_ITEM',
      payload : {
        productId,
        amount
      }
    })
  }

  const cartCxt = {
    items : shoppingCartState.items,
    onUpdateCartItemQuantity : handleUpdateCartItemQuantity,
    onAddItemToCart : handleAddItemToCart
  }
  return(
    <CartContext.Provider value={cartCxt}>
      {children}
    </CartContext.Provider>
  )
}