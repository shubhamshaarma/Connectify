import { Link, useNavigate } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg";
import { MdOutlineEdit } from "react-icons/md";
import { RotatingLines } from "react-loader-spinner";
import { useState } from "react";
import { useAppDispatch } from "../redux/store";
import { toggleModal } from "../redux/modalReducer";

interface IFeedCard {
    profile: string;
    username: string;
    feed: {
        image?: string;
        text?: string;
    };
    caption?: string;
    id: string;
    hastags?: string;
}

function FeedCard(props: IFeedCard) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { profile, username, feed, caption, hastags, id } = props;
    const [isLoading, _] = useState<boolean>(false);

    return (
        <div className="bg-white border w-full rounded-md">
            <div className="flex items-center justify-between py-2 px-4 space-x-4">
                <div className="flex items-center space-x-4">
                    <Link to={`/${username}`} className="">
                        <img
                            src={profile || defaultProfile}
                            alt="profile"
                            className="w-10 h-10 rounded-full"
                        />
                    </Link>
                    <Link to={`/${username}`} className="max-w-80 overflow-hidden hover:underline">
                        <h1 className="truncate text-sm">{username}</h1>
                    </Link>
                </div>
                <button
                    className="hover:bg-gray-200 active:bg-gray-200/80 p-1.5 rounded-full"
                    onClick={() => {
                        dispatch(toggleModal(["editFeed", true]));
                        navigate(`/?id=${id}`);
                    }}
                >
                    <MdOutlineEdit className="text-2xl" />
                </button>
            </div>

            {feed.image && (
                <img
                    src={feed.image || defaultProfile}
                    alt="feed"
                    loading="lazy"
                    className="w-full max-h-[400px] object-cover bg-gray-100"
                />
            )}
            {!!hastags && (
                <div className="px-6 text-sm pt-1 text-justify text-blue-500">{hastags}</div>
            )}
            {feed.text && <div className="px-6 text-sm pt-1 text-justify">{feed.text}</div>}
            {caption && (
                <div className="px-6 text-sm pt-1 text-justify text-gray-500">
                    {username}: {caption}
                </div>
            )}

            <div className="pt-2 pb-4 px-4 flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Comment"
                    className="text-sm border py-2.5 px-5 rounded-sm"
                />
                <button className=" bg-blue-500 active:bg-blue-500/90 border capitalize text-white py-2.5 text-sm px-4 rounded-sm flex items-center justify-center">
                    <RotatingLines
                        visible={isLoading}
                        width="20"
                        strokeColor="#fff"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                    />
                    {!isLoading && "send"}
                </button>
            </div>
        </div>
    );
}

export default FeedCard;
