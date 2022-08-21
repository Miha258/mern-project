import React from "react"
import 'materialize-css'
import { useAuth } from "./hooks/auth.hook"
import { AuthContext } from "./context"
import { useRoutes } from "./routes"

function App() {
  const routes = useRoutes()
  const { token, userId, login, logout, password, isManager} = useAuth()
  const isAuth = !!token
  const storageData = JSON.parse(localStorage.getItem('userData'))
  return (
      <AuthContext.Provider value={{
        token: token ? token : storageData.token, userId:  userId ? userId : storageData.userId, login, logout, isAuth, password: password ? password : storageData.password, isManager
      }}>
        <div>
          {routes}
        </div>
      </AuthContext.Provider>
  );
}

export default App;
