import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");
    const [departmentId, setDepartmentId] = useState("");
    const [departments, setDepartments] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/departments");
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!departmentId) {
            alert("❌ Please select a department.");
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

            alert("✅ User added successfully!");
            navigate("/users");
        } catch (error) {
            console.error("Error:", error);
            alert("❌ Failed to add user");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
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
                    <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept._id} value={dept._id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-300"
                    >
                        Add User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
