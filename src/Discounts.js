import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore"; // Firebase SDK
import { db } from "./firebase"; // Ensure this path points to your firebase configuration
import { Button, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Create a new discount
  const createDiscount = async () => {
    if (newDescription) {
      await addDoc(collection(db, "discounts"), {
        description: newDescription,
      });

      // Clear the input after creating the discount
      setNewDescription("");
      fetchDiscounts();
    }
  };

  // Fetch discounts from Firestore
  const fetchDiscounts = async () => {
    const querySnapshot = await getDocs(collection(db, "discounts"));
    const discountsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDiscounts(discountsData);
  };

  // Update a discount
  const updateDiscount = async (id) => {
    const discountDoc = doc(db, "discounts", id);
    await updateDoc(discountDoc, {
      description: newDescription,
    });

    setEditingId(null);
    setNewDescription("");
    fetchDiscounts(); // Refresh data after update
  };

  // Delete a discount
  const deleteDiscount = async (id) => {
    const discountDoc = doc(db, "discounts", id);
    await deleteDoc(discountDoc);
    fetchDiscounts(); // Refresh data after delete
  };

  // Handle edit click
  const handleEdit = (discount) => {
    setEditingId(discount.id);
    setNewDescription(discount.description);
  };

  useEffect(() => {
    fetchDiscounts(); // Fetch discounts on component load
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Discounts</h1>

      {/* Back to Dashboard Button */}
      <div className="mb-6">
        <Link to="/dashboard">
          <Button variant="outlined" color="primary">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <TextField
          placeholder="Discount Description"
          className="w-full"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />

        {editingId ? (
          <Button
            variant="contained"
            className="mt-4"
            onClick={() => updateDiscount(editingId)}
          >
            Update Discount
          </Button>
        ) : (
          <Button
            variant="contained"
            className="mt-4"
            onClick={createDiscount}
          >
            <AddIcon /> Add Discount
          </Button>
        )}
      </div>

      {/* Display Discounts */}
      <div className="space-y-4">
        {discounts.map((discount) => (
          <div
            key={discount.id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded shadow-md"
          >
            <div>
              <p className="text-lg font-semibold">{discount.description}</p>
            </div>
            <div>
              <IconButton onClick={() => handleEdit(discount)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteDiscount(discount.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discounts;
