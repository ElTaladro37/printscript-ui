import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH_SERVER_URI;
const clientId = import.meta.env.VITE_AUTH_CLIENT_ID;

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen/>
    },
    {
        path: '/rules',
        element: <RulesScreen/>
    }
]);

export const queryClient = new QueryClient()
const App = () => {
    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{ redirect_uri: window.location.origin }}
        >
            <_App />
        </Auth0Provider>
    );
};

const _App = withAuthenticationRequired(
    () => (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    ),
    {
        onRedirecting: () => (
            <div>Redirecting to your page...</div>
        ),
    }
);

// To enable Auth0 integration change the following line
export default App;
// for this one:
// export default withAuthenticationRequired(App);
