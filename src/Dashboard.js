
// import React, { useState, useEffect } from "react";
// import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"; 
// import { db } from "./firebase"; 
// import { Box, Button, Input, IconButton, TextField } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { DataGrid } from "@mui/x-data-grid";
// import { DatePicker } from "antd"; 
// import dayjs from "dayjs"; 
// import { Link } from "react-router-dom"; 
// const { RangePicker } = DatePicker;

// const Dashboard = () => {
//   const [data, setData] = useState([]);
//   const [newName, setNewName] = useState("");
//   const [price, setPrice] = useState("");
//   const [discount, setDiscount] = useState("");
//   const [description, setDescription] = useState(""); // New description state
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [editingId, setEditingId] = useState(null);

//   // Create a new document
//   const createData = async () => {
//     const formattedDateRange = (dateRange || []).map((date) =>
//       dayjs(date).format("YYYY-MM-DD")
//     );
    
//     if (newName && price) {
//       await addDoc(collection(db, "users"), {
//         name: newName,
//         price: price,
//         discount: discount,
//         description: description, // Include description in document
//         dateRange: formattedDateRange,
//       });
  
//       // Clear the input fields after successful creation
//       setNewName("");
//       setPrice("");
//       setDiscount("");
//       setDescription(""); // Clear description field
//       setDateRange([null, null]);
  
//       fetchData(); // Refresh the data after adding
//     }
//   };

//   // Fetch data from Firestore
//   const fetchData = async () => {
//     const querySnapshot = await getDocs(collection(db, "users"));
//     const userData = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     setData(userData);
//   };

//   // Update a document
//   const updateData = async (id) => {
//     const formattedDateRange = (dateRange || []).map((date) =>
//       dayjs(date).format("YYYY-MM-DD")
//     );
    
//     const userDoc = doc(db, "users", id);
//     await updateDoc(userDoc, {
//       name: newName,
//       price: price,
//       discount: discount,
//       description: description, // Include description in update
//       dateRange: formattedDateRange,
//     });
//     setEditingId(null);
//     setNewName("");
//     setPrice("");
//     setDiscount("");
//     setDescription(""); // Clear description after update
//     setDateRange([null, null]);
//     fetchData(); // Refresh data after update
//   };

//   // Delete a document
//   const deleteData = async (id) => {
//     const userDoc = doc(db, "users", id);
//     await deleteDoc(userDoc);
//     fetchData(); // Refresh data after delete
//   };

//   // Handle edit click
//   const handleEdit = (user) => {
//     setEditingId(user.id);
//     setNewName(user.name);
//     setPrice(user.price);
//     setDiscount(user.discount);
//     setDescription(user.description); // Set description for editing

//     let parsedDateRange = user.dateRange
//       ? [dayjs(user.dateRange[0]), dayjs(user.dateRange[1])]
//       : ["2025-05-05", "2025-05-06"];
    
//     if (user.dateRange[0] === "Invalid Date" || user.dateRange[0] === "null") {
//       parsedDateRange = [null, null];
//     }

//     setDateRange(parsedDateRange);
//   };

//   useEffect(() => {
//     fetchData(); // Fetch data on component load
//   }, []);

//   // Define columns for DataGrid, with Edit and Delete buttons
//   const columns = [
//     {
//       field: 'name',
//       headerName: 'Test name',
//       width: 200,
//     },
//     {
//       field: 'price',
//       headerName: 'Price',
//       width: 100,
//     },
//     {
//       field: 'discount',
//       headerName: 'Discount',
//       width: 100,
//     },
//     {
//       field: 'description', // New description column
//       headerName: 'Description',
//       width: 250,
//     },
//     {
//       field: 'dateRange',
//       headerName: 'Date Range',
//       width: 200,
//       valueGetter: (params) => {
//         let dateRange = [null, null];
//         if (params[0]) {
//           dateRange = [params[0], params[1]];
//         }
//         return `${dateRange[0]} - ${dateRange[1]}`;
//       },
//     },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       width: 150,
//       renderCell: (params) => (
//         <div>
//           <IconButton onClick={() => handleEdit(params.row)}>
//             <EditIcon />
//           </IconButton>
//           <IconButton onClick={() => deleteData(params.row.id)}>
//             <DeleteIcon />
//           </IconButton>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl mb-4">Dashboard</h1>

//       {/* Button to navigate to the Discounts page */}
//       <div className="mb-6">
//         <Link to="/discounts">
//           <Button variant="contained" color="primary">
//             Go to Discounts
//           </Button>
//         </Link>
//       </div>

//       <div className="flex flex-wrap space-x-4 w-full">
//         <TextField
//           placeholder="Test Name"
//           className="w-1/2"
//           value={newName}
//           onChange={(e) => setNewName(e.target.value)}
//         />
//         <TextField
//           placeholder="Price"
//           className="w-1/4"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//         />
//         <TextField
//           placeholder="Discount"
//           className="w-1/4"
//           value={discount}
//           onChange={(e) => setDiscount(e.target.value)}
//         />
//         <TextField
//           placeholder="Description" // New input for description
//           className="w-1/2"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <RangePicker
//           className="w-1/2"
//           value={dateRange}
//           onChange={(dates) => setDateRange(dates)}
//         />
//         {editingId ? (
//           <Button variant="outlined" onClick={() => updateData(editingId)}>
//             Update
//           </Button>
//         ) : (
//           <Button variant="outlined" onClick={createData}>
//             <AddIcon /> Add
//           </Button>
//         )}
//       </div>

//       <Box sx={{ height: "100%", width: '100%', marginTop: 2 }}>
//         <DataGrid
//           rows={data}
//           columns={columns}
//           initialState={{
//             pagination: {
//               paginationModel: {
//                 pageSize: 10,
//               },
//             },
//           }}
//           pageSizeOptions={[10]}
//           checkboxSelection
//           disableRowSelectionOnClick
//         />
//       </Box>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"; 
import { db } from "./firebase"; 
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "antd"; 
import dayjs from "dayjs"; 
import { Link } from "react-router-dom"; 
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [newName, setNewName] = useState("");
  const [tamilName, setTamilName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [editingId, setEditingId] = useState(null);

  // Create a new document
  const createData = async () => {
    if (!newName || !price) {
      alert("Name and Price are required fields.");
      return;
    }

    const formattedDateRange = (dateRange || []).map((date) =>
      dayjs(date).format("YYYY-MM-DD")
    );
    
    await addDoc(collection(db, "users"), {
      name: newName,
      tamilName: tamilName,
      price: price,
      discount: discount,
      description: description,
      dateRange: formattedDateRange,
    });

    // Clear input fields
    setNewName("");
    setTamilName("");
    setPrice("");
    setDiscount("");
    setDescription("");
    setDateRange([null, null]);
  
    fetchData(); // Refresh data
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
      tamilName: tamilName,
      price: price,
      discount: discount,
      description: description,
      dateRange: formattedDateRange,
    });

    setEditingId(null);
    setNewName("");
    setTamilName("");
    setPrice("");
    setDiscount("");
    setDescription("");
    setDateRange([null, null]);
    fetchData();
  };

  // Delete a document
  const deleteData = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    fetchData();
  };

  // Handle edit click
  const handleEdit = (user) => {
    setEditingId(user.id);
    setNewName(user.name);
    setTamilName(user.tamilName);
    setPrice(user.price);
    setDiscount(user.discount);
    setDescription(user.description);

    // let parsedDateRange = user.dateRange
    //   ? [dayjs(user.dateRange[0]), dayjs(user.dateRange[1])]
    //   : ["2025-05-05", "2025-05-06"];
    
    // if (user.dateRange[0] === "Invalid Date" || user.dateRange[0] === "null") {
    //   parsedDateRange = [null, null];
    // }
    let parsedDateRange = user.dateRange
      ? [dayjs(user.dateRange[0]), dayjs(user.dateRange[1])]
      : ["2025-05-05", "2025-05-06"];
    
    if (user.dateRange[0] === "Invalid Date" || user.dateRange[0] === "null") {
      parsedDateRange = [null, null];
    }
    setDateRange(parsedDateRange);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Define columns for DataGrid
  const columns = [
    { field: 'name', headerName: 'Test name', width: 150 },
    { field: 'tamilName', headerName: 'Tamil Name', width: 150 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'discount', headerName: 'Discount', width: 100 },
    { field: 'description', headerName: 'Description', width: 250 },
    {
      field: 'dateRange',
      headerName: 'Date Range',
      width: 200,
      valueGetter: (params) => {
        let dateRange = [null, null];
        if (params[0]) {
          dateRange = [params[0], params[1]];
        }
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
      <h1 className="text-3xl mb-4">Dashboard</h1>
      
      <div className="mb-6">
        <Link to="/discounts">
          <Button variant="contained" color="primary">
            Go to Discounts
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap space-x-4 w-full">
        <div className="w-1/2">
          <Typography variant="caption" color="error">* Required</Typography>
          <TextField
            placeholder="Test Name *"
            className="w-full"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <TextField
          placeholder="Tamil Name"
          className="w-1/2"
          value={tamilName}
          onChange={(e) => setTamilName(e.target.value)}
        />
        <div className="w-1/4">
          <TextField
            placeholder="Price *"
            className="w-full"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <TextField
          placeholder="Discount"
          className="w-1/4"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
        <TextField
          placeholder="Description"
          className="w-1/2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            <AddIcon /> Add
          </Button>
        )}
      </div>

      <Box sx={{ height: "100%", width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={data}
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
