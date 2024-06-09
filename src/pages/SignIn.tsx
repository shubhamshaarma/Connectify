import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { auth, db, googleAuthProvider } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function SignIn() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [form, setForm] = useState({ email: "", password: "" });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let name = e.target.name;
        let value = e.target.value;
        setForm({ ...form, [name]: value });
    };

    // sign in with email and password button.
    const signInWithEmailAndPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("Can't leave input fields empty.");
            return null;
        }

        try {
            setError("");
            setIsLoading(true);
            const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                password: form.password,
                provider: "EmailAndPassword",
            });
            setForm({ email: "", password: "" });
        } catch (error) {
            console.log("signInWithEmailAndPassword Error: " + error);
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { user } = await signInWithPopup(auth, googleAuthProvider);
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                name: user.displayName,
                profile: user.photoURL,
                provider: "Google",
            });
        } catch (error) {
            console.log("signInWithGoogle Error: " + error);
        }
    };

    return (
        <div className="py-28 flex items-center justify-center">
            <div className="w-full sm:w-[400px] px-6">
                <h1 className="text-4xl capitalize text-center">Connectify</h1>

                <form method="POST" className="mt-6 space-y-2">
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={form.email}
                        onChange={handleInput}
                        className="border px-4 py-2 rounded-md"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={form.password}
                        onChange={handleInput}
                        className="border px-4 py-2 rounded-md"
                    />
                    {error && (
                        <div className="bg-[#ffe2c8] px-6 py-2.5 rounded-lg text-sm">{error}</div>
                    )}
                    <button
                        className="w-full h-10 bg-blue-500 active:bg-blue-500/90 text-white uppercase rounded-md flex items-center justify-center"
                        onClick={signInWithEmailAndPassword}
                        disabled
                    >
                        <RotatingLines
                            visible={isLoading}
                            width="20"
                            strokeColor="#fff"
                            strokeWidth="5"
                            animationDuration="0.75"
                            ariaLabel="rotating-lines-loading"
                        />
                        {!isLoading && "sign in"}
                    </button>
                </form>

                <hr className="my-5" />
                <p className="text-center mb-2 text-sm capitalize">
                    try logged in with Google only. email and password authentication not working at
                    this moment.
                </p>

                <button
                    className="w-full border h-10 rounded-md capitalize active:bg-gray-100"
                    onClick={signInWithGoogle}
                >
                    sign in with Google
                </button>
            </div>
        </div>
    );
}

export default SignIn;
