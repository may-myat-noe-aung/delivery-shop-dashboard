import React, { useState, useEffect } from "react";
import axios from "axios";
import AddDeliveryForm from "./AddDeliveryForm";
import DeliveryTable from "./DeliveryTable";

const AddDeliveryMan = ({ shopId }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    status: "Full time",
    photo: "",
  });
  const [deliveryMen, setDeliveryMen] = useState([]);

  const fetchDeliveryMen = async () => {
    try {
      const res = await axios.get(`http://38.60.244.137:3000/deliverymen-shop/${shopId}`);
      setDeliveryMen(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch every 500ms
  useEffect(() => {
    fetchDeliveryMen();
    const interval = setInterval(fetchDeliveryMen, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col  bg-gray-900 text-gray-100">
      {showForm && (
        // <AddDeliveryForm
        //   formData={formData}
        //   setFormData={setFormData}
        //   onClose={() => setShowForm(false)}
        //   refreshList={fetchDeliveryMen}
        // />
        <AddDeliveryForm
          shopId={shopId}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowForm(false)}
          refreshList={fetchDeliveryMen}
        />
      )}

      <DeliveryTable
       shopId={shopId}
        deliveryMen={deliveryMen}
        setShowForm={setShowForm} // ← pass this prop to table
        onOpenChat={(man) => {
          setActiveChat(man);
          setChatOpen(true);
          if (!messages[man.id])
            setMessages((prev) => ({ ...prev, [man.id]: [] }));
        }}
      />
    </div>
  );
};

export default AddDeliveryMan;
