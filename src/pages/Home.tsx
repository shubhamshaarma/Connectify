import { useEffect, useState } from "react";
import FeedCard from "../components/FeedCard";
import InstantCreate from "../components/InstantCreate";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAppSelector } from "../redux/store";
import { userAuth } from "../redux/authReducer";
import { useLocation } from "react-router-dom";

interface IFeed {
    file?: string;
    username: string;
    profile: string;
    caption?: string;
    hashtags?: string;
    id: string;
    text?: string;
}

function Home() {
    const user = useAppSelector(userAuth);
    const location = useLocation();
    const [feed, setFeed] = useState<IFeed[]>([]);

    useEffect(() => {
        // fetch all logged in user feed.
        (async function () {
            try {
                const getFeed = await getDocs(
                    query(
                        collection(db, "feeds"),
                        where("uploadedBy", "==", user.email),
                        orderBy("timestamp", "desc")
                    )
                );

                const getFeedArray = getFeed.docs.map((feed) => {
                    return {
                        username: user.email,
                        profile: user.profile,
                        file: feed.data().fileURL || "",
                        text: feed.data().text || "",
                        caption: feed.data().caption || "",
                        hashtags: feed.data().hashtags || "",
                        id: feed.id,
                    };
                });

                setFeed(getFeedArray);
            } catch (error) {
                console.log("Home Error: " + error);
            }
        })();
    }, [location]);

    return (
        <div className="max-w-5xl m-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <InstantCreate />
            </div>
            <div className="col-span-2 space-y-4">
                {feed.length <= 0 && (
                    <p className="text-center">
                        Go to Create button and post your first connectify feed.
                    </p>
                )}
                {feed.map((feed, i) => {
                    return (
                        <FeedCard
                            profile={feed.profile}
                            username={feed.username}
                            feed={{
                                image: feed.file,
                                text: feed.text,
                            }}
                            caption={feed.caption}
                            hastags={feed.hashtags}
                            id={feed.id}
                            key={i}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Home;
