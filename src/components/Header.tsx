import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";
import defaultProfile from "../assets/defaultProfile.jpg";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAppSelector } from "../redux/store";
import { userAuth } from "../redux/authReducer";

function Header() {
    const user = useAppSelector(userAuth);

    const signOutAccount = async () => {
        try {
            await signOut(auth);
            window.location.href = "/";
        } catch (error) {
            console.log("signOutAccount Error: " + error);
        }
    };

    return (
        <header className="h-14 bg-white sticky top-0 drop-shadow z-50">
            <div className="flex items-center justify-between h-full m-auto px-7">
                <div>
                    <Link to="/">
                        <h1 className="text-2xl">Connectify</h1>
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link to="/feed/create">
                        <button className="h-9 px-4 border hover:bg-gray-100 rounded cursor-pointer active:scale-[0.98] flex items-center justify-center space-x-2">
                            <FaPlus className="text-base" />
                            <span className="uppercase text-sm">create</span>
                        </button>
                    </Link>
                    <button className="w-10 h-10 p-1 hover:bg-gray-100 rounded-full cursor-pointer active:scale-[0.98] flex items-center justify-center">
                        <IoNotificationsOutline className="text-2xl" />
                    </button>
                    <button
                        className="w-10 h-10 p-1 hover:bg-gray-100 rounded-full cursor-pointer active:scale-[0.98]"
                        onClick={signOutAccount}
                    >
                        <img
                            src={user.profile || defaultProfile}
                            alt="profile"
                            className="w-full h-full rounded-full bg-gray-300 object-cover"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
