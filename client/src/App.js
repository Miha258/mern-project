import React from "react"
import 'materialize-css'
import { useAuth } from "./hooks/auth.hook"
import { AuthContext } from "./context"
import { useRoutes } from "./routes"

function App() {
  const routes = useRoutes()
  const { token, userId, login, logout, password } = useAuth()
  const isAuth = !!token
  return (
      <AuthContext.Provider value={{
        token, userId, login, logout, isAuth, password
      }}>
        <div>
          {routes}
        </div>
      </AuthContext.Provider>
  );
}

export default App;
