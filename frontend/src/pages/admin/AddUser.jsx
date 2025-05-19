import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("employee");
    const [departmentId, setDepartmentId] = useState("");
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/departments");
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                console.error("Error fetching departments:", error);
                toast.error("❌ Failed to load departments");
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!departmentId) {
            toast.warn("⚠️ Please select a department.");
            return;
        }
        if (!email.includes("@")) {
            toast.warn("⚠️ Please enter a valid email.");
            return;
        }
        if (password.length < 6) {
            toast.warn("⚠️ Password must be at least 6 characters.");
            return;
        }

        const userData = { userId, name, email, password, role, departmentId };

        try {
            const response = await fetch("http://localhost:5000/api/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Failed to add user");
            }

            toast.success("✅ User added successfully!");
            setTimeout(() => navigate("/users"), 1500);
        } catch (error) {
            console.error("Error:", error);
            toast.error("❌ Failed to add user");
        }
    };

    return (
        <div>
            <AdminNavbar/>
            <div className="min-h-screen flex items-center justify-center bg-white p-4 relative">
            
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl z-10">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="userId" className="block mb-1 font-medium text-gray-700">User ID</label>
                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-sm text-blue-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="role" className="block mb-1 font-medium text-gray-700">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="administrator">Administrator</option>
                            <option value="storekeeper">Storekeeper</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                            <option value="D_Rh">D_Rh</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="department" className="block mb-1 font-medium text-gray-700">Department</label>
                        <select
                            id="department"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">{loading ? "Loading departments..." : "Select Department"}</option>
                            {!loading && departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-300"
                    >
                        Add User
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default AddUser;
