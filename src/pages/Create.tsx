import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { RotatingLines } from "react-loader-spinner";
import { db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { userAuth } from "../redux/authReducer";

interface ISelectedFile {
    file?: string | ArrayBuffer | null | undefined;
    caption?: string;
    hashtags?: string;
    filename?: string;
}

function Create() {
    const navigate = useNavigate();
    const user = useAppSelector(userAuth);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<ISelectedFile>({
        file: "",
        caption: "",
        hashtags: "",
        filename: "",
    });

    // handle file
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: FileList | null = e.target.files;
        if (!file) return null;

        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file[0]);

        reader.addEventListener("load", function (e) {
            setSelectedFile({ ...selectedFile, file: e.target?.result, filename: file[0].name });
        });
        reader.addEventListener("error", function (e) {
            console.log("handleFile Error: " + e.target?.result);
        });
    };

    // finally upload to database.
    const uploadFile = async (_: React.MouseEvent<HTMLButtonElement>) => {
        const { caption, file, filename, hashtags } = selectedFile;

        // if one of this is not present throw error.
        if (!file || !filename) return null;

        try {
            setIsLoading(true);
            // upload file to firebase storage. And get the downloadURL...
            const uploadedFile = await uploadString(
                ref(storage, filename),
                String(file),
                "data_url"
            );

            // get the download url of the file.
            const uploadedFileDownloadURL = await getDownloadURL(uploadedFile.ref);

            // save download url to user data...
            await addDoc(collection(db, "feeds"), {
                fileURL: uploadedFileDownloadURL,
                caption: caption,
                hashtags: hashtags,
                uploadedBy: user.email,
                timestamp: serverTimestamp(),
            });
            navigate("/");
        } catch (error) {
            console.log("uploadFile Error: " + error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl m-auto px-4 py-10 flex items-center justify-center">
            <div className="space-y-5">
                <div className="space-y-2">
                    <h1 className="text-4xl text-center">Create Post</h1>
                    <p className="text-base text-center">
                        Share your photos and videos with your friends and followers.
                    </p>
                </div>

                <div className="w-full sm:w-[400px] m-auto space-y-4">
                    <div className="w-full h-44 rounded-lg border border-dashed relative flex items-center justify-center flex-col px-10 space-y-4">
                        <FiUpload className="text-3xl" />
                        <p className="text-center text-sm">
                            <span>PNG, JPG, GIF up to 10MB</span>
                            <br />
                            <span
                                className="hover:underline cursor-pointer text-blue-500"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload a file
                            </span>
                            {selectedFile.file && (
                                <span className="block text-green-500 mt-4">
                                    File Choose Succefully
                                </span>
                            )}
                        </p>
                        <input
                            type="file"
                            typeof="image/*"
                            onChange={handleFile}
                            ref={fileInputRef}
                            hidden
                        />
                    </div>

                    <input
                        className="w-full border outline-none rounded-md px-4 py-2 text-sm"
                        placeholder="Hashtags"
                        spellCheck="false"
                        value={selectedFile.hashtags}
                        onChange={(e) =>
                            setSelectedFile({ ...selectedFile, hashtags: e.target.value })
                        }
                    />
                    <textarea
                        className="w-full border outline-none rounded-md px-4 py-2 text-sm"
                        rows={3}
                        placeholder="Write your caption"
                        spellCheck="false"
                        value={selectedFile.caption}
                        onChange={(e) =>
                            setSelectedFile({ ...selectedFile, caption: e.target.value })
                        }
                    />

                    <button
                        className="w-full bg-blue-500 active:bg-blue-500/90 text-white h-10 rounded-md capitalize flex items-center justify-center"
                        onClick={uploadFile}
                    >
                        <RotatingLines
                            visible={isLoading}
                            width="20"
                            strokeColor="#fff"
                            strokeWidth="5"
                            animationDuration="0.75"
                            ariaLabel="rotating-lines-loading"
                        />
                        {!isLoading && "upload"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Create;
