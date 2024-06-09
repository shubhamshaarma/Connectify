import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "./redux/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { fetchAuth } from "./redux/authReducer";

function AuthProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, function (user) {
            if (!user) {
                setIsLoading(false);
                return null;
            }

            dispatch(
                fetchAuth({
                    auth: true,
                    email: user.email || "",
                    profile: user.photoURL || "",
                    name: user.displayName || "",
                })
            );
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return <div>Loading....</div>;
    return children;
}

export default AuthProvider;
