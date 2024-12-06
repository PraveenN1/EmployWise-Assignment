import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, updateUser, deleteUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import Modal from "./EditModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const totalPages = 2;
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers(page);
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    loadUsers();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      const filtered = users.filter(
        (user) =>
          user.first_name
            .toLowerCase()
            .includes(debouncedQuery.toLowerCase()) ||
          user.last_name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [debouncedQuery, users]);

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editUser?.first_name || !editUser?.last_name || !editUser?.email) {
      toast.error("All fields are required!");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(editUser.email)) {
      toast.error("Invalid email address!");
      return;
    }

    try {
      await updateUser(editUser.id, editUser);
      toast.success("User updated successfully!");
      setEditUser(null);
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-6 font-serif">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white px-6 py-2 rounded font-sans md:absolute sm:right-32"
        >
          LogOut
        </button>

        {/* Search Input */}
        <div className="w-2/3 md:w-80 bg-slate-500 mx-auto border-2 rounded-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email"
            className="p-2 w-full rounded-full text-black"
          />
        </div>
      </div>

      {/* Edit user modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)}>
        <h3 className="font-bold mb-4 text-lg">Edit User</h3>
        <form onSubmit={handleEdit}>
          <input
            type="text"
            value={editUser?.first_name || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, first_name: e.target.value })
            }
            className="border p-2 mb-2 w-full"
            placeholder="First Name"
          />
          <input
            type="text"
            value={editUser?.last_name || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, last_name: e.target.value })
            }
            className="border p-2 mb-2 w-full"
            placeholder="Last Name"
          />
          <input
            type="email"
            value={editUser?.email || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
            className="border p-2 mb-2 w-full"
            placeholder="Email"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </form>
      </Modal>

      {/* User cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-slate-50 shadow-lg rounded-lg p-6 hover:shadow-xl transform hover:-translate-y-2 transition duration-300 max-w-xs w-full mx-auto"
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={user.avatar}
                alt={user.first_name}
                className="w-32 h-32 rounded-full mb-4 border-2 border-gray-200 shadow-lg"
              />
              <h3 className="font-bold text-lg text-gray-700">{`${user.first_name} ${user.last_name}`}</h3>
              <p className="text-gray-500 border-b">{user.email}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditUser(user)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300 w-full"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300 w-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length == 0 && (
        <p className="text-center text-xl text-red-500">No users found</p>
      )}

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        theme="colored"
      />
    </div>
  );
};

export default UsersList;
