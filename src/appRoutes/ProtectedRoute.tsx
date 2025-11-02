import {useAppSelector} from "../store/hooks.ts";
import {Navigate, Outlet, useLocation} from "react-router";

const ProtectedRoute = () => {

    const token = useAppSelector(s => s.auth.token)
    const location = useLocation();

    if (!token) {
        return <Navigate to={"/login"} replace state={{from: location}} />
    }
    return <Outlet/>;
};

export default ProtectedRoute;