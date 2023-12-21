import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './Context/UserContext';
import { ItemDataProvider } from './Context/ItemContext';
import { CategoryDataProvider } from './Context/CategoryContext';
import Login from './Components/Login';
import MainPage from './Components/MainPage';
import CategoryPage from './Components/CategoryPage';
import HomePage from './Components/HomePage';
import Register from './Components/RegisterPage'
import ItemPage from './Components/ItemPage'

const App = () => {
  return (
    <div className="custom-background-light">
      <Router>
        <div>
          <UserProvider>
            <CategoryDataProvider>
              <ItemDataProvider>
                <div>
                  <Routes>
                    <Route path="/" element={<HomePage />}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/main" element={<PrivateRouteMain />} />
                    <Route path="/categories" element={<PrivateRouteCategory />} />
                    <Route path="/items" element={<PrivateRouteItem />} />
                  </Routes>
                </div>
              </ItemDataProvider>
            </CategoryDataProvider>
          </UserProvider>
        </div>
      </Router>
    </div>
  );
};

const PrivateRouteMain = () => {
  const { user } = useUser();

  return user.isLoggedIn ? <MainPage /> : <Navigate to="/login" replace />;
};

const PrivateRouteCategory = () => {
  const { user } = useUser();

  return user.isLoggedIn ? <CategoryPage /> : <Navigate to="/login" replace />;
};

const PrivateRouteItem = () => {
  const { user } = useUser();

  return user.isLoggedIn ? <ItemPage /> : <Navigate to="/login" replace />;
};

export default App;
