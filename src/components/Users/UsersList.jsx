import { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '../../services/users';
import UserCard from './UserCard';
import UserForm from './UserForm';
import { toast } from 'react-hot-toast';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(page);
      setUsers(data.data);
      setTotalPages(data.total_pages);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      // Optimistically update UI first
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      await deleteUser(userId);
      toast.success('User deleted successfully');
      
      // If we deleted the last user on a page, go back a page
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      // Revert if API call fails
      setUsers(users);
      toast.error('Failed to delete user');
    }
  };

  const handleUpdate = async (updatedUser) => {
    try {
      // Optimistically update UI
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id ? { ...user, ...updatedUser } : user
        )
      );
      
      const response = await updateUser(editingUser.id, updatedUser);
      toast.success('User updated successfully');
      setIsFormOpen(false);
      
      // Update with API response (though Reqres won't actually persist)
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id ? { ...user, ...response } : user
        )
      );
    } catch (error) {
      // Revert if API call fails
      setUsers(users);
      toast.error('Failed to update user');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users List</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={page === totalPages || loading}
            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : (
        <div className="grid gap-4">
          {users.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <UserForm 
          user={editingUser} 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default UsersList;