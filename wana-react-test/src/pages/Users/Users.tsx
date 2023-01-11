import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

interface FormData {
  name: string;
  email: string;
}

const Users:React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({ name: '', email: '' });
  const [sort, setSort] = useState({ column: 'name', order: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setLoading] = useState(false);
  const [isAdding, setAdding] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
  });
  const [editId, setEditId] = useState(0);

  useEffect(() => {
    // Fetch the list of users from an API

    setLoading(true);
    axios.get('https://jsonplaceholder.typicode.com/users').then((response) => {
      setUsers(response.data);
      setLoading(false);
    });
  }, []);

  // function to apply filters
  const applyFilters = (data: User[]) => {
    return data.filter((user) => {
      return Object.keys(filters).every((key) => {
        if (key === 'name') {
          return (
            user[key].toLowerCase().indexOf(filters[key].toLowerCase()) !== -1
          );
        }

        if (key === 'email') {
          return (
            user[key].toLowerCase().indexOf(filters[key].toLowerCase()) !== -1
          );
        }
        return true;
      });
    });
  };

  // function to sort data
  const sortData = (data: User[]) => {
    return data.sort((a, b) => {
      let column = sort.column;
      let order = sort.order === 'asc' ? 1 : -1;
      if (a[column] > b[column]) {
        return order;
      } else if (a[column] < b[column]) {
        return order * -1;
      }
      return 0;
    });
  };

  // function to get current data
  const getCurrentData = () => {
    let filteredData = applyFilters(users);
    let sortedData = sortData(filteredData);
    let begin = (currentPage - 1) * itemsPerPage;
    let end = begin + itemsPerPage;
    return sortedData.slice(begin, end);
  };

  // handle filters input change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // handle sort click
  const handleSortClick = (column: string) => {
    if (sort.column === column) {
      setSort({
        column,
        order: sort.order === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSort({
        column,
        order: 'asc',
      });
    }
  };

  // handle pagination click
  const handlePaginationClick = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) {
      // send post request to server to create user
      axios
        .post('https://jsonplaceholder.typicode.com/users', formData)
        .then((response) => {
          setUsers([...users, response.data]);
          setAdding(false);
          setFormData({ name: '', email: '' });
        });
    }
    if (isEditing) {
      // send put request to server to update user
      axios
        .put(`https://jsonplaceholder.typicode.com/users/${editId}`, formData)
        .then((response) => {
          setUsers(
            users.map((user) => (user.id === editId ? response.data : user))
          );
          setEditing(false);
          setFormData({ name: '', email: '' });
          setEditId(0);
        });
    }
  };

  // handle delete user
  const handleDeleteUser = (id: number) => {
    // send delete request to server
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => {
        setUsers(users.filter((user) => user.id !== id));
      });
  };

  // handle edit user
  const handleEditUser = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setEditing(true);
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  };

  // handle close modal
  const handleCloseModal = () => {
    setAdding(false);
    setEditing(false);
    setFormData({ name: '', email: '' });
    setEditId(0);
  };

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <form>
            <input
              type="text"
              placeholder="Filter by name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              placeholder="Filter by email"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
            />
          </form>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSortClick('name')}>Name</th>
                <th onClick={() => handleSortClick('email')}>Email</th>
                <th>Actions</th>
                
              </tr>
            </thead>
            <tbody>
              {getCurrentData().map((user: User) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleEditUser(user.id)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button
              onClick={() => handlePaginationClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              onClick={() => handlePaginationClick(currentPage + 1)}
              disabled={currentPage === Math.ceil(users.length / itemsPerPage)}
            >
              Next
            </button>
          </div>
          <button onClick={() => setAdding(true)}>Add User</button>
          {(isAdding || isEditing) && (
            <div>
              <h3>{isAdding ? 'Add' : 'Edit'} User</h3>
              <form onSubmit={handleFormSubmit}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </label>

                <label>
                  <input type="submit" value={isAdding ? 'Add' : 'Edit'} />
                  <button onClick={handleCloseModal}>Cancel</button>
                </label>
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Users;
