import {useAppSelector} from "../../store/hooks.ts";
import {Navigate} from "react-router";
import AdminHome from "./AdminHome.tsx";
import OperatorHome from "./Operator/OperatorHome.tsx";

const RoleLanding = () => {
    const role = useAppSelector(s => s.auth.user?.role);
    if (!role) return null;

    if(role === "admin"){
        return <AdminHome />
    }if(role === "operator"){
        return <OperatorHome />
    }
    
    return <Navigate to={"/tables"} replace />;
};

export default RoleLanding;