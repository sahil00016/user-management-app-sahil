const UserCard = ({ user, onEdit, onDelete }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center space-x-4">
          <img 
            src={user.avatar} 
            alt={`${user.first_name} ${user.last_name}`} 
            className="w-16 h-16 rounded-full"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg">{user.first_name} {user.last_name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => onEdit(user)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(user.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default UserCard;