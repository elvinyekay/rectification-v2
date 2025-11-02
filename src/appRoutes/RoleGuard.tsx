import {useAppSelector} from "../store/hooks.ts";
import {Navigate} from "react-router";


type Props = {
    allow: Array<'admin' | 'operator' | 'supervisor'>;
    children: React.ReactNode;
};

const RoleGuard = ({allow, children}:Props) => {
    const user = useAppSelector(state => state.auth.user);
    if (!user) return null;
    if(!allow.includes(user.role)) return <Navigate to={"/403"} replace />;
    return <>{children}</>;
};

export default RoleGuard;