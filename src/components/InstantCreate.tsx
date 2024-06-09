import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { db } from "../firebase";
import { useAppSelector } from "../redux/store";
import { userAuth } from "../redux/authReducer";
import { useNavigate } from "react-router-dom";

function InstantCreate() {
    const navigate = useNavigate();
    const user = useAppSelector(userAuth);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [text, setText] = useState<string>("");

    const createText = async () => {
        if (!text) return 0;

        try {
            navigate("/?instantCreate");
            setIsLoading(true);
            await addDoc(collection(db, "feeds"), {
                text,
                uploadedBy: user.email,
                timestamp: serverTimestamp(),
            });
            setText("");
            navigate("/");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white border rounded p-2 drop-shadow space-y-3">
            <h2 className="text-lg">Instant Feed</h2>
            <div className="space-y-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Let's connect with the world."
                    className="border rounded px-4 py-2.5 text-sm"
                />
                <button
                    className="w-full bg-blue-500 text-white h-9 uppercase text-sm rounded active:bg-blue-500/90 flex items-center justify-center"
                    onClick={createText}
                >
                    <RotatingLines
                        visible={isLoading}
                        width="20"
                        strokeColor="#fff"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                    />
                    {!isLoading && "create"}
                </button>
            </div>
        </div>
    );
}

export default InstantCreate;
