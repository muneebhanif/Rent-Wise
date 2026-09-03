import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AuthLayout from "./Layouts/AuthLayout";
import MainLayout from "./Layouts/MainLayout";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./components/Home";
import Cookies from "js-cookie";
import decodeToken from "./utils/jwt";
import { AuthProvider } from "./hooks/AuthContext";
import Otp from "./components/Otp";
import LandingPage from "./Pages/LandingPage";

import { ListingsProvider } from "./hooks/ListingsContext";
import Media from "../src/Pages/Listings/Media";
import ListingDetails from "../src/Pages/Listings/ListingDetails";
import Dashboard from "./Pages/Dashboard/Dashboard";
import MyAccount from "../src/Pages/Account/MyAccount";
import DashboardUserContextProvider from "./hooks/DashboardUserContext";

import MainChat from "./Pages/Conversation/MainChat";
import AgreementTemplate from "./Pages/Agreement/AgreementTemplate";
// import UpdateAgreement from "./Pages/Agreement/UpdateAgreement";
// import CarAgreement from "./Pages/Agreement/Car/CarAgreement";
import UpdateCarAgrr from "./Pages/Agreement/Car/UpdateCarAgrr";
import UpdateHouseAgrr from "./Pages/Agreement/House/UpdateHouseAgrr";
import SendToTenant from "./Pages/Agreement/SendToTenant";
import ViewHouseAgr from "./Pages/Agreement/ViewAgreement.jsx/ViewHouseAgr";
import ViewCarAgr from "./Pages/Agreement/ViewAgreement.jsx/ViewCarAgr";
import HostelListing from "./Pages/Listings/CategoryBased/HostelListing";
import HouseListing from "./Pages/Listings/CategoryBased/HouseListing";
import CarListing from "./Pages/Listings/CategoryBased/CarListing";
import DisplayAgreements from "./Pages/Agreement/Admin/DisplayAgreements";
import Integration from "./Pages/Agreement/Admin/Integration";
import UserProfile from "./Pages/profile/owner/ownerProfile";

import { NotificationProvider } from "./hooks/NotificationContext";
import ColorTubeLoader from "./components/Style/ColorTubeLoader";
import Loacation from "./Pages/Location/Loacation";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminOverview from "./Pages/Admin/AdminOverview";
import AdminLayout from "./Layouts/adminLayout";
import UserManagement from "./Pages/Admin/UserManagement";
import ListingManagement from "./Pages/Admin/ListingManagement";
import { AgreementProvider } from "./hooks/AdminAgreementContext";
import LocationPicker from "./Pages/Location/Loacation";
import UpdateListing from "./Pages/Listings/UpdateListing";
import ViewHostelAgr from "./Pages/Agreement/ViewAgreement.jsx/ViewHostelAgr";
import UpdateHostelAgrr from "./Pages/Agreement/Hostel/UpdateHostelAgrr";
import { useAuth } from "./hooks/AuthContext";

//  import TestListingDetails from "./Pages/Listings/Test/TestHome";


const router = createBrowserRouter(
  createRoutesFromElements(
    
    <>
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/signUp" element={<SignUp />} />
        <Route element={<ProtectedRoute requiredStatus="unauthenticated" />}>
          <Route path="/auth/signIn" element={<SignIn />} />
        </Route>
        <Route path="/auth/forgetPassword" element={<ForgotPassword />} />
        <Route path="/auth/resetPassword" element={<ResetPassword />} />
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/auth/otp" element={<Otp/>} />
      </Route>
      
      {/* home */}

      {/* admin Application Routes */}
      {/* <Route element={<AdminLayout />}>
      <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/adminDashboard" element={<AdminDashboard/>}/>
          <Route path="/adminOverview" element={<AdminOverview/>}/>
          <Route path="/admin/users" element={<AdminOverview/>}/>
          <Route path="/admin/listings" element={<AdminOverview/>}/>
        </Route>
      </Route> */}
      {/* Admin Application Routes */}
      {/* <Route element={<AdminLayout />}> */}
      <Route element={<MainLayout />}>
      <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/adminDashboard" element={<AdminDashboard/>}/>
          <Route path="/adminOverview" element={<AdminOverview/>}/>
          <Route path="/admin/users" element={<UserManagement/>}/>
          <Route path="/admin/listings" element={<ListingManagement/>}/>
        </Route>
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/category/*" element={<Home />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/agreements-protected" element={<DisplayAgreements />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/integration" element={<Integration/>} />
        </Route>
      {/* </Route> */}
      </Route>
       
      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route path="/getAll" element={<Home />} />
        </Route>

        <Route path="/rental/:id" element={<ListingDetails />} />
        <Route path="/loc" element={<Loacation />} />

        {/* listing on basis of catagories */}
        
        <Route path="/categories/hostels" element={<HostelListing />} />
        <Route path="/categories/houses" element={<HouseListing />} />
        <Route path="/categories/cars" element={<CarListing />} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/spin" element={<ColorTubeLoader />} />

         {/* owner profile */}
         <Route path="/profile/:_id" element={<UserProfile/>} />
         <Route path="/loc" element={<LocationPicker/>} />
        

        
        
        {/* <Route path="/media" element={<Media />} /> */}
        {/* <Route path="/rental/:id" element={<ListingDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/acc" element={<MyAccount />} />
        <Route path="/listings/:id" element={<UpdateListing />} /> */}

        {/* <Route path="/chat" element={<MainChat/>} /> */}

        {/* <Route path="/agreement" element={<AgreementTemplate/>} />
        <Route path="/sendToTenant" element={<SendToTenant/>} />
        <Route path="/agreementCar/:id" element={<UpdateCarAgrr/>} />
        <Route path="/agreementHouse/:id" element={<UpdateHouseAgrr/>} /> */}

        {/* profile Views */}
        {/* <Route path="/profile/:_id" element={<UserProfile/>} /> */}

  
        {/* view of agreement */}

        {/* <Route path="/viewHouseAgreement/:_id" element={<ViewHouseAgr/>} />
        <Route path="/viewCarAgreement/:_id" element={<ViewCarAgr/>} /> */}

        {/* <Route path="/UpdateAgreement" element={<UpdateAgreement/>} /> */}
        {/* <Route path="/chat" element={<MainChat/>} /> */}

        {/* <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route path="/getAll" element={<LandingPage />} />
        </Route> */}


       {/* protected routes */}
        <Route element={<ProtectedRoute requiredRole="user" />}>

        {/* listing routes */}
        <Route path="/media" element={<Media />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/listings/:id" element={<UpdateListing />} />

         {/* chat routes */}
        <Route path="/chat" element={<MainChat />} />

        {/* agreeements routes */}
        <Route path="/agreement" element={<AgreementTemplate/>} />
        <Route path="/sendToTenant" element={<SendToTenant/>} />
        <Route path="/agreementCar/:id" element={<UpdateCarAgrr/>} />
        <Route path="/agreementHouse/:id" element={<UpdateHouseAgrr/>} />
        <Route path="/agreementHostel/:id" element={<UpdateHostelAgrr/>} />

        {/* profile routes */}
          
            {/* user account profile */}
        <Route path="/acc" element={<MyAccount />} />
        

        {/* view agreements */}
        <Route path="/viewHouseAgreement/:_id" element={<ViewHouseAgr/>} />
        <Route path="/viewCarAgreement/:_id" element={<ViewCarAgr/>} />
        <Route path="/viewHostelAgreement/:_id" element={<ViewHostelAgr/>} />

        </Route>
       

      </Route>
    </>
  )
);

function App() {
  return (
    <AuthProvider>
      <DashboardUserContextProvider>
        <NotificationProvider>
        <ListingsProvider>
          <AgreementProvider>
          <RouterProvider router={router} />
          </AgreementProvider>
        </ListingsProvider>
        </NotificationProvider>
      </DashboardUserContextProvider>
    </AuthProvider>
  );
}

export default App;
