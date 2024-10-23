
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore"; // Correct import from Firebase SDK
import { db } from "./firebase"; // Ensure this path points to your firebase configuration file
import { Box, Button, Input, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "antd"; // Import Ant Design's DatePicker
import dayjs from "dayjs"; // Import dayjs for handling dates

const { RangePicker } = DatePicker; // Destructure RangePicker from DatePicker

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [newName, setNewName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [editingId, setEditingId] = useState(null);

  // Create a new document
  const createData = async () => {
    const formattedDateRange = (dateRange || []).map((date) =>
      dayjs(date).format("YYYY-MM-DD")
    );
    
    if (newName && price) {
      await addDoc(collection(db, "users"), {
        name: newName,
        price: price,
        discount: discount,
        dateRange: formattedDateRange,
      });
  
      // Clear the input fields after successful creation
      setNewName("");
      setPrice("");
      setDiscount("");
      setDateRange([null, null]);
  
      fetchData(); // Refresh the data after adding
    }
  };
  

  // Fetch data from Firestore
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const userData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(userData);
  };

  // Update a document
  const updateData = async (id) => {
    const formattedDateRange = (dateRange || []).map((date) =>
      dayjs(date).format("YYYY-MM-DD")
    );
    
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, {
      name: newName,
      price: price,
      discount: discount,
      dateRange: formattedDateRange,
    });
    setEditingId(null);
    setNewName("");
    setPrice("");
    setDiscount("");
    setDateRange([null, null]);
    fetchData(); // Refresh data after update
  };
  

  // Delete a document
  const deleteData = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    fetchData(); // Refresh data after delete
  };

  // Handle edit click
  const handleEdit = (user) => {
    setEditingId(user.id);
    setNewName(user.name);
    setPrice(user.price);
    setDiscount(user.discount);
console.log( user.dateRange)
let parsedDateRange = user.dateRange
? [dayjs(user.dateRange[0]), dayjs(user.dateRange[1])] // Convert date strings to dayjs objects
: ["2025-05-05", "2025-05-06"]; // Default if no date range exists
if(user.dateRange[0]==="Invalid Date" ||user.dateRange[0]=== "null"){
  parsedDateRange=[null,null]
}
   
  
  setDateRange(parsedDateRange);
  };

  useEffect(() => {
    fetchData(); // Fetch data on component load
  }, []);

  // Define columns for DataGrid, with Edit and Delete buttons
  const columns = [
    {
      field: 'name',
      headerName: 'Test name',
      width: 300,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
    },
    {
      field: 'discount',
      headerName: 'Discount',
      width: 150,
    },
    {
      field: 'dateRange',
      headerName: 'Date Range',
      width: 300,
      valueGetter: (params) => {
        console.log(params)
        let dateRange = [null, null];

        if (params[0]) {
          dateRange=[params[0],params[1]]
        }
        // const startDate = dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : "";
        // const endDate = dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : "";
        return `${dateRange[0]} - ${dateRange[1]}`;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteData(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4"> Dash Board</h1>
      <div className="flex flex-wrap space-x-4 w-full">
        <TextField
          placeholder="Test Name"
          className="w-1/2"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <TextField
          placeholder="Price"
          className="w-1/4"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          placeholder="Discount"
          className="w-1/4"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
        <RangePicker
          className="w-1/2"
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
        />
        {editingId ? (
          <Button variant="outlined" onClick={() => updateData(editingId)}>
            Update
          </Button>
        ) : (
          <Button variant="outlined" onClick={createData}>
            <AddIcon />Add
          </Button>
        )}
      </div>

      <Box sx={{ height: "100%", width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={data} // Use data from Firestore
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};

export default Dashboard;
