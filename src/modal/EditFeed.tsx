import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { useAppDispatch } from "../redux/store";
import { toggleModal } from "../redux/modalReducer";

function EditFeed() {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ caption: "", hashtags: "" });

    const updateContent = async () => {
        try {
            setIsLoading(true);
            await updateDoc(doc(db, "feeds", location.search.slice(4)), {
                caption: data.caption,
                hashtags: data.hashtags,
            });

            document.body.style.overflow = "scroll";
            dispatch(toggleModal(["editFeed", false]));
            navigate("/");
        } catch (error) {
            console.log("Update content error: " + error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.body.scrollIntoView({ behavior: "instant", block: "start" });
        document.body.style.overflow = "hidden";
    }, []);

    return (
        <div className="absolute top-0 z-50 h-screen bg-black/25 w-full flex items-center justify-center">
            <div className="bg-white w-full sm:w-[400px] px-6 py-2 rounded space-y-4">
                <h1 className="text-xl text-center">Edit Feed</h1>

                <input
                    type="text"
                    value={data.hashtags}
                    onChange={(e) => setData({ ...data, hashtags: e.target.value })}
                    className="border px-4 py-2 rounded text-sm"
                    placeholder="Add hashtags"
                />
                <input
                    type="text"
                    value={data.caption}
                    onChange={(e) => setData({ ...data, caption: e.target.value })}
                    className="border px-4 py-2 rounded text-sm"
                    placeholder="Add caption"
                />

                <button
                    className="w-full h-10 bg-blue-500 text-white rounded capitalize active:bg-blue-500/90 flex items-center justify-center text-sm"
                    onClick={updateContent}
                >
                    <RotatingLines
                        visible={isLoading}
                        width="20"
                        strokeColor="#fff"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                    />
                    {!isLoading && "update"}
                </button>
                <button
                    className="w-full h-10 rounded capitalize text-sm"
                    onClick={() => {
                        dispatch(toggleModal(["editFeed", false]));
                        document.body.style.overflow = "scroll";
                    }}
                >
                    cancel
                </button>
            </div>
        </div>
    );
}

export default EditFeed;
