import {createBrowserRouter} from "react-router";
import AuthLayout from "../layout/AuthLayout.tsx";
import Login from "../pages/AuthPages/SignIn.tsx"
import ProtectedRoute from "./ProtectedRoute.tsx";
import AppLayout from "../layout/AppLayout.tsx";
import Blank from "../pages/Blank.tsx";
import BasicTables from "../pages/Tables/BasicTables.tsx";

import NotFound from "../pages/OtherPage/NotFound.tsx";
import RoleLanding from "../pages/Dashboard/RoleLanding.tsx";
import OperatorHome from "../pages/Dashboard/Operator/OperatorHome.tsx";
import AutoTrimPage from "../pages/Dashboard/Operator/AutoTrimPage.tsx";
import HotkeyManagementPage from "../pages/HotkeyPage/Hotkeymanagementpage.tsx";

export const router = createBrowserRouter([
    {
        element:<AuthLayout/>,
        children: [
            {path: '/login', element: <Login/>}
        ],
    },
    {
        element: <ProtectedRoute/>,
        children: [
            {
                element: <AppLayout/>,
                children: [
                    {
                        path: '/',
                        element: <RoleLanding/>
                    },
                    {
                        path: '/rectify/auto',
                        element: <AutoTrimPage/>
                    },
                    {
                        path: '/operator/hotkeys',
                        element: <HotkeyManagementPage/>
                    },
                    // {
                    //     path: '/profile',
                    //     element: <UserProfiles />
                    // },
                    // {
                    //     path: '/calendar',
                    //     element: <Calendar />
                    // },
                    {
                        path: '/blank',
                        element: <Blank />
                    },
                    // {
                    //     path: '/form-elements',
                    //     element: <FormElements />
                    // },
                    {
                        path: '/tables',
                        element: <BasicTables />
                    },
                    {
                        path: '/operator/work',
                        element: <OperatorHome />
                    },
                    // {
                    //     path: '/alerts',
                    //     element: <Alerts />
                    // },
                    // {
                    //     path: '/avatars',
                    //     element: <Avatars />
                    // },
                    // {
                    //     path: '/badge',
                    //     element: <Badges />
                    // },
                    // {
                    //     path: '/buttons',
                    //     element: <Buttons />
                    // },
                ]
            }
        ]
    },
    {
        path:"*",
        element: <NotFound/>
    }
])