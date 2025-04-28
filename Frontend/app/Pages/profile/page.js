"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiImage, FiTrash2, FiEdit, FiLogOut } from "react-icons/fi";
import NavBar from "@/app/Components/NavBar/NavBar";
function ProfilePage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("Token");
            if (!token) return router.push("/login");

            try {
                const response = await fetch("https://task-manager-pied-sigma-54.vercel.app/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    router.push("/login");
                }
            } catch {
                router.push("/login");
            }
        };

        fetchUserDetails();
    }, [router]);

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        const token = localStorage.getItem("Token");
        if (!token) return;

        try {
            const response = await fetch("https://task-manager-pied-sigma-54.vercel.app/api/users/me", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Account deleted successfully");
                localStorage.removeItem("Token");
                router.push("/Pages/register");
            }
        } catch {
            alert("Failed to delete account");
        }
    };

    if (!user) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );
    const isExternalImage = user.picture && (user.picture.startsWith('http://') || user.picture.startsWith('https://'));
    const isGoogleUser = user.authProvider === 'google' || isExternalImage;
    return (
        <div>
            <NavBar />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                    <div className="p-8">
                        <div className="flex justify-center">
                            {user.picture ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100"
                                    src={isExternalImage ? user.picture : `https://task-manager-pied-sigma-54.vercel.app/uploads/${user.picture}`}
                                    alt="Profile_img"
                                />
                            ) : (
                                <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <FiUser className="h-16 w-16 text-indigo-600" />
                                </div>
                            )}
                        </div>

                        <div className="mt-6 text-center">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-center text-gray-600">
                                    <FiMail className="mr-2" />
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                            {!isGoogleUser && (
                                <button
                                    onClick={() => router.push("/Pages/updateAccount")}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <FiEdit className="mr-2" />
                                    Update Profile
                                </button>
                            )}
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <FiTrash2 className="mr-2" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ProfilePage;