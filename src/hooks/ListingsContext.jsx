import React, { createContext, useEffect, useReducer } from "react";
import { getAlListingsofSpecificUser } from "../Api/ListingApi";
import { useAuth } from "./AuthContext";


export const ListingsContext = createContext();

const listingsReducer = (state, action) => {
  switch (action.type) {
    case "GET_LISTINGS":
     
      return { ...state, listings: action.payload };

    case "GET_ONE_LISTING": 
      return { ...state, currentListing: action.payload };

      case "GET_USER_LISTINGS":
      return { ...state, userListings: action.payload };

    case "ADD_LISTING":
      return {
        ...state,
        listings: [...state.listings, action.payload], // Add to all listings
        userListings: [...state.userListings, action.payload], // Add to user-specific listings
      };

    case "UPDATE_LISTING":
        const updatedListings = state.listings.map((listing) =>
          listing._id === action.payload._id ? action.payload : listing
        );
      
        const updatedUserListings = state.userListings.map((listing) =>
          listing._id === action.payload._id ? action.payload : listing
        );
      
        return {
          ...state,
          listings: updatedListings,
          userListings: updatedUserListings, 
        };

    case "DELETE_LISTING":
      return {
        ...state,
        listings: state.listings.filter((listing) => listing._id !== action.payload),
      };

    default:
      return state;
  }
};



const initialState = {
  listings: [],
  currentListing: null,
  userListings: [],
};

export const ListingsProvider = ({ children }) => {
  
   const { user } = useAuth();
  const [state, dispatch] = useReducer(listingsReducer, initialState);
  useEffect(() => {
    async function getOwnerListings() {
      if (user && user._id) {
        const user_id = user._id;
        const response = await getAlListingsofSpecificUser(user_id);
        dispatch({ type: "GET_USER_LISTINGS", payload: response.data.listing });
      }
    }
    getOwnerListings();
  }, [user]);

  return (
    <ListingsContext.Provider value={{ state, dispatch }}>
      {children}
    </ListingsContext.Provider>
  );
};


