import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "./redux/store";
import { userAuth } from "./redux/authReducer";
import { modalState } from "./redux/modalReducer";

const Home = lazy(() => import("./pages/Home"));
const Header = lazy(() => import("./components/Header"));
const Create = lazy(() => import("./pages/Create"));
const EditFeed = lazy(() => import("./modal/EditFeed"));
const SignIn = lazy(() => import("./pages/SignIn"));

function App() {
    const user = useAppSelector(userAuth);
    const modal = useAppSelector(modalState);

    if (!user.auth)
        return (
            <Routes>
                <Route
                    path="/"
                    element={
                        <Suspense>
                            <SignIn />
                        </Suspense>
                    }
                />
            </Routes>
        );

    return (
        <>
            <Suspense>
                <Header />
            </Suspense>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Suspense>
                            <Home />
                        </Suspense>
                    }
                />
                <Route
                    path="/feed/create"
                    element={
                        <Suspense>
                            <Create />
                        </Suspense>
                    }
                />
            </Routes>
            {modal.editFeed && (
                <Suspense>
                    <EditFeed />
                </Suspense>
            )}
        </>
    );
}

export default App;
