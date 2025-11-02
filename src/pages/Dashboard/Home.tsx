import {useAppSelector} from "../../store/hooks.ts";
import AdminHome from "./AdminHome.tsx";
import OperatorHome from "./Operator/OperatorHome.tsx";
import SupervisorHome from "./SupervisorHome.tsx";


export default function Home() {
    const role = useAppSelector(s => s.auth.user?.role);


    if (!role) return <div className="p-6">Səlahiyyət tapılmadı.</div>;
    if(role === "admin") return <AdminHome/>
    if(role === "operator") return <OperatorHome/>
    if(role === "supervisor") return <SupervisorHome/>

    return null;
}
