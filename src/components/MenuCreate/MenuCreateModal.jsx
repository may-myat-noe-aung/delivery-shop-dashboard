// import React, { useState, useEffect } from "react";
// import { useAlert } from "../../AlertProvider";
// import { ChevronDown, ChevronUp } from "lucide-react"; // ✅ ADDED ONLY THIS

// export default function MenuCreateModal({ shopId, close, onSuccess }) {
//   const { showAlert } = useAlert();

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [prices, setPrices] = useState([{ size: "M", price: 6000 }]);
//   const [photo, setPhoto] = useState("");

//   const [ingredientsList, setIngredientsList] = useState([]);
//   const [categoriesList, setCategoriesList] = useState([]);
//   const [selectedIngredients, setSelectedIngredients] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedMenus, setSelectedMenus] = useState([]);
//   const [selectedMonths, setSelectedMonths] = useState([]);

//   // =========================
//   // ✅ ADDED ONLY (ACCORDION STATE)
//   // =========================
//   const [openCategory, setOpenCategory] = useState(false);
//   const [openIngredients, setOpenIngredients] = useState(false);
//   const [openMonths, setOpenMonths] = useState(false);

//   const monthsOptions = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   useEffect(() => {
//     if (!shopId) return;

//     const fetchIngredients = async () => {
//       try {
//         const res = await fetch(
//           `http://38.60.244.137:3000/ingredients/${shopId}`,
//         );
//         const data = await res.json();

//         const withPhoto = data.map((item) => ({
//           ...item,
//           photo: `http://38.60.244.137:3000/ingredients-uploads/${item.photo}`,
//         }));
//         setIngredientsList(withPhoto);
//       } catch (err) {
//         console.error("Failed to fetch ingredients", err);
//       }
//     };

//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(
//           `http://38.60.244.137:3000/categories/${shopId}`,
//         );
//         const data = await res.json();
//         setCategoriesList(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to fetch categories", err);
//       }
//     };

//     fetchIngredients();
//     fetchCategories();
//   }, [shopId]);

//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => setPhoto(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const addPrice = () => setPrices([...prices, { size: null, price: 0 }]);

//   const updatePrice = (index, field, value) => {
//     const updated = [...prices];
//     updated[index][field] = field === "price" ? Number(value) : value;
//     setPrices(updated);
//   };

//   const removePrice = (index) => {
//     const updated = [...prices];
//     updated.splice(index, 1);
//     setPrices(updated);
//   };

//   const toggleIngredient = (id) => {
//     if (selectedIngredients.includes(id)) {
//       setSelectedIngredients(selectedIngredients.filter((i) => i !== id));
//     } else {
//       setSelectedIngredients([...selectedIngredients, id]);
//     }
//   };

//   const toggleMenu = (id) => {
//     if (selectedMenus.includes(id)) {
//       setSelectedMenus(selectedMenus.filter((i) => i !== id));
//     } else {
//       setSelectedMenus([...selectedMenus, id]);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!name.trim() || !selectedCategory.trim() || prices.length === 0) {
//       showAlert("Please fill required fields", "error");
//       return;
//     }

//     // ✅ ADD THIS HERE
//     // const cleanedPrices = prices.map((p) => ({
//     //   size: p.size || null,
//     //   price: p.price || 0,
//     // }));
//     const cleanedPrices = prices
//       .filter((p) => p.price > 0) // remove empty price
//       .map((p) => ({
//         size: p.size || null,
//         price: p.price,
//       }));

//     try {
//       const res = await fetch("http://38.60.244.137:3000/menu", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           shop_id: shopId,
//           name: name.trim(),
//           category: selectedCategory ? selectedCategory : null,
//           description: description.trim() || null,
//           prices: cleanedPrices.length > 0 ? cleanedPrices : null,
//           relate_menu: selectedMenus.length > 0 ? selectedMenus : null,
//           relate_ingredients:
//             selectedIngredients.length > 0 ? selectedIngredients : null,
//           get_months: selectedMonths.length > 0 ? selectedMonths : null,
//           photo: photo || null,
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         showAlert(data.message || "Menu created successfully", "success");
//         onSuccess();
//       } else {
//         showAlert(data.message || "Failed to create menu", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("Server error", "error");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-[#111827] w-[550px] rounded-2xl p-6 border border-gray-700 shadow-xl overflow-y-auto max-h-[90vh]">
//         <h2 className="text-2xl font-semibold text-white mb-5">Create Menu</h2>

//         {/* ================= PHOTO ================= */}
//         <div className="space-y-3">
//           {/* KEEP YOUR PHOTO EXACT SAME */}
//           <div>
//             <label className="text-gray-300 font-medium mb-1 block">
//               Menu Photo
//             </label>

//             <div
//               className="relative w-full h-40 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center cursor-pointer bg-gray-900 hover:border-indigo-500 transition-colors"
//               onClick={() => document.getElementById("menuPhotoInput").click()}
//             >
//               {!photo ? (
//                 <div className="text-gray-500 text-center">
//                   <p className="font-medium">Click or drag image here</p>
//                   <p className="text-sm">PNG, JPG, GIF up to 5MB</p>
//                 </div>
//               ) : (
//                 <>
//                   <img
//                     src={photo}
//                     className="absolute inset-0 w-full h-full object-cover rounded-xl"
//                   />
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setPhoto(null);
//                     }}
//                     className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full"
//                   >
//                     ✕
//                   </button>
//                 </>
//               )}

//               <input
//                 id="menuPhotoInput"
//                 type="file"
//                 className="hidden"
//                 onChange={handleImage}
//               />
//             </div>
//           </div>

//           {/* NAME */}
//           <input
//             placeholder="Menu Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-2.5 rounded-lg bg-gray-900 text-white border border-gray-700"
//           />

//           {/* ================= CATEGORY (ACCORDION) ================= */}
//           {/* <div className="border border-gray-700 rounded-lg overflow-hidden">
//             <div
//               onClick={() => setOpenCategory(!openCategory)}
//               className="flex justify-between items-center p-3 bg-gray-900 cursor-pointer"
//             >
//               <span className="text-white font-medium">Category</span>
//               {openCategory ? <ChevronUp /> : <ChevronDown />}
//             </div>

//             {openCategory && (
//               <div className="p-2 max-h-32 overflow-y-auto bg-gray-950">
//                 {Array.isArray(categoriesList) &&
//                   categoriesList.map((cat) => (
//                     <label
//                       key={cat.id}
//                       className="flex items-center gap-2 p-1 hover:bg-gray-800 rounded"
//                     >
//                       <input
//                         type="radio"
//                         checked={selectedCategory === cat.id}
//                         onChange={() => setSelectedCategory(cat.id)}
//                         className="accent-indigo-400"
//                       />
//                       <span className="text-white">
//                         {cat.icon_id} - {cat.name}
//                       </span>
//                     </label>
//                   ))}
//               </div>
//             )}
//           </div> */}
//           <div className="border border-gray-700 rounded-lg overflow-hidden">
//             <div
//               onClick={() => setOpenCategory(!openCategory)}
//               className="flex justify-between items-center p-3 bg-gray-900 cursor-pointer"
//             >
//               <span className="text-white font-medium">
//                 Category {selectedCategory && "(1 selected)"}
//               </span>
//               {openCategory ? <ChevronUp /> : <ChevronDown />}
//             </div>

//             {openCategory && (
//               <div className="p-3 flex flex-wrap gap-2 bg-gray-950">
//                 {categoriesList.map((cat) => (
//                   <button
//                     key={cat.id}
//                     onClick={() => setSelectedCategory(String(cat.id))}
//                     className={`px-3 py-1.5 rounded-full border text-sm transition-all
//             ${
//               selectedCategory === String(cat.id)
//                 ? "bg-indigo-600 text-white border-indigo-500"
//                 : "bg-gray-900 text-gray-300 border-gray-700 hover:border-indigo-400"
//             }`}
//                   >
//                     {cat.name}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* DESCRIPTION */}
//           <textarea
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2.5 rounded-lg bg-gray-900 text-white border border-gray-700"
//           />

//           {/* ================= PRICES (UNCHANGED) ================= */}
//           <div className="space-y-2">
//             <label className="text-white font-medium">Prices</label>
//             {prices.map((p, i) => (
//               <div key={i} className="flex gap-2">
//                 <input
//                   value={p.size}
//                   onChange={(e) => updatePrice(i, "size", e.target.value)}
//                   className="flex-1 p-2 rounded bg-gray-900 border border-gray-700"
//                 />
//                 <input
//                   type="number"
//                   value={p.price}
//                   onChange={(e) => updatePrice(i, "price", e.target.value)}
//                   className="w-24 p-2 rounded bg-gray-900 border border-gray-700"
//                 />
//                 <button onClick={() => removePrice(i)}>X</button>
//               </div>
//             ))}
//             <div className="flex items-center justify-end">
//               {" "}
//               <button
//                 onClick={addPrice}
//                 className="bg-indigo-600 px-3 py-1 rounded "
//               >
//                 Add Price
//               </button>
//             </div>
//           </div>

//           {/* ================= INGREDIENTS (ACCORDION) ================= */}
//           <div className="border border-gray-700 rounded-lg overflow-hidden">
//             <div
//               onClick={() => setOpenIngredients(!openIngredients)}
//               className="flex justify-between items-center p-3 bg-gray-900 cursor-pointer"
//             >
//               <span className="text-white font-medium">Relate Ingredients</span>
//               {openIngredients ? <ChevronUp /> : <ChevronDown />}
//             </div>

//             {openIngredients && (
//               <div className="p-2 max-h-40 overflow-y-auto">
//                 {ingredientsList.map((ing) => (
//                   <label key={ing.id} className="flex items-center gap-2 p-1">
//                     <input
//                       type="checkbox"
//                       checked={selectedIngredients.includes(ing.id)}
//                       onChange={() => toggleIngredient(ing.id)}
//                       className="accent-indigo-400"
//                     />
//                     <img src={ing.photo} className="w-10 h-10 rounded" />
//                     <span className="text-white">{ing.name}</span>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ================= MONTHS (ACCORDION) ================= */}
//           {/* <div className="border border-gray-700 rounded-lg overflow-hidden">
//             <div
//               onClick={() => setOpenMonths(!openMonths)}
//               className="flex justify-between items-center p-3 bg-gray-900 cursor-pointer"
//             >
//               <span className="text-white font-medium">Available Months</span>
//               {openMonths ? <ChevronUp /> : <ChevronDown />}
//             </div>

//             {openMonths && (
//               <div className="p-3 flex flex-wrap gap-2 bg-gray-950">
//                 {monthsOptions.map((m) => (
//                   <label key={m} className="flex gap-1">
//                     <input
//                       type="checkbox"
//                       checked={selectedMonths.includes(m)}
//                       onChange={() =>
//                         selectedMonths.includes(m)
//                           ? setSelectedMonths(
//                               selectedMonths.filter((x) => x !== m),
//                             )
//                           : setSelectedMonths([...selectedMonths, m])
//                       }
//                     />
//                     <span className="text-white">{m}</span>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div> */}
//           <div className="border border-gray-700 rounded-lg overflow-hidden">
//             <div
//               onClick={() => setOpenMonths(!openMonths)}
//               className="flex justify-between items-center p-3 bg-gray-900 cursor-pointer"
//             >
//               <span className="text-white font-medium">
//                 Available Months ({selectedMonths.length})
//               </span>
//               {openMonths ? <ChevronUp /> : <ChevronDown />}
//             </div>

//             {openMonths && (
//               <div className="p-3 flex flex-wrap gap-2 bg-gray-950">
//                 {monthsOptions.map((m) => {
//                   const active = selectedMonths.includes(m);

//                   return (
//                     <button
//                       key={m}
//                       onClick={() =>
//                         active
//                           ? setSelectedMonths(
//                               selectedMonths.filter((x) => x !== m),
//                             )
//                           : setSelectedMonths([...selectedMonths, m])
//                       }
//                       className={`px-3 py-1.5 rounded-full text-sm border transition-all
//               ${
//                 active
//                   ? "bg-green-600 text-white border-green-500"
//                   : "bg-gray-900 text-gray-300 border-gray-700 hover:border-green-400"
//               }`}
//                     >
//                       {m}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* BUTTONS */}
//         <div className="flex justify-end gap-3 mt-5">
//           <button onClick={close} className="px-4 py-2 bg-gray-600 rounded">
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-indigo-600 rounded"
//           >
//             Create Menu
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useAlert } from "../../AlertProvider";
import { ChevronDown, ChevronUp } from "lucide-react"; // ✅ ADDED ONLY THIS

export default function MenuCreateModal({ shopId, close, onSuccess }) {
  const { showAlert } = useAlert();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prices, setPrices] = useState([{ size: "M", price: 6000 }]);
  const [photo, setPhoto] = useState("");

  const [ingredientsList, setIngredientsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);

  // =========================
  // ✅ ADDED ONLY (ACCORDION STATE)
  // =========================
  const [openCategory, setOpenCategory] = useState(false);
  const [openIngredients, setOpenIngredients] = useState(false);
  const [openMonths, setOpenMonths] = useState(false);

  const monthsOptions = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    if (!shopId) return;

    const fetchIngredients = async () => {
      try {
        const res = await fetch(
          `http://38.60.244.137:3000/ingredients/${shopId}`,
        );
        const data = await res.json();

        const withPhoto = data.map((item) => ({
          ...item,
          photo: `http://38.60.244.137:3000/ingredients-uploads/${item.photo}`,
        }));
        setIngredientsList(withPhoto);
      } catch (err) {
        console.error("Failed to fetch ingredients", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `http://38.60.244.137:3000/categories/${shopId}`,
        );
        const data = await res.json();
        setCategoriesList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchIngredients();
    fetchCategories();
  }, [shopId]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const addPrice = () => setPrices([...prices, { size: null, price: 0 }]);

  const updatePrice = (index, field, value) => {
    const updated = [...prices];
    updated[index][field] = field === "price" ? Number(value) : value;
    setPrices(updated);
  };

  const removePrice = (index) => {
    const updated = [...prices];
    updated.splice(index, 1);
    setPrices(updated);
  };

  const toggleIngredient = (id) => {
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== id));
    } else {
      setSelectedIngredients([...selectedIngredients, id]);
    }
  };

  const toggleMenu = (id) => {
    if (selectedMenus.includes(id)) {
      setSelectedMenus(selectedMenus.filter((i) => i !== id));
    } else {
      setSelectedMenus([...selectedMenus, id]);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !selectedCategory.trim() || prices.length === 0) {
      showAlert("Please fill required fields", "error");
      return;
    }

    // ✅ ADD THIS HERE
    // const cleanedPrices = prices.map((p) => ({
    //   size: p.size || null,
    //   price: p.price || 0,
    // }));
    const cleanedPrices = prices
      .filter((p) => p.price > 0) // remove empty price
      .map((p) => ({
        size: p.size || null,
        price: p.price,
      }));

    try {
      const res = await fetch("http://38.60.244.137:3000/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_id: shopId,
          name: name.trim(),
          category: selectedCategory ? selectedCategory : null,
          description: description.trim() || null,
          prices: cleanedPrices.length > 0 ? cleanedPrices : null,
          relate_menu: selectedMenus.length > 0 ? selectedMenus : null,
          relate_ingredients:
            selectedIngredients.length > 0 ? selectedIngredients : null,
          get_months: selectedMonths.length > 0 ? selectedMonths : null,
          photo: photo || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showAlert(data.message || "Menu created successfully", "success");
        onSuccess();
        setTimeout(() => {
          close();
        }, 500);
      } else {
        showAlert(data.message || "Failed to create menu", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111827] w-[550px] rounded-2xl p-6 border border-gray-700 shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold text-white mb-5">Create Menu</h2>

        {/* ================= PHOTO ================= */}
        <div className="space-y-3">
          {/* KEEP YOUR PHOTO EXACT SAME */}
          <div>
            <label className="text-gray-300 font-medium mb-1 block">
              Menu Photo
            </label>

            <div
              className="relative w-full h-36 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center cursor-pointer bg-gray-900 hover:border-indigo-500 transition-colors"
              onClick={() => document.getElementById("menuPhotoInput").click()}
            >
              {!photo ? (
                <div className="text-gray-500 text-center">
                  <p className="font-medium">Click or drag image here</p>
                  <p className="text-sm">PNG, JPG, GIF up to 5MB</p>
                </div>
              ) : (
                <>
                  <img
                    src={photo}
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhoto(null);
                    }}
                    className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full"
                  >
                    ✕
                  </button>
                </>
              )}

              <input
                id="menuPhotoInput"
                type="file"
                className="hidden"
                onChange={handleImage}
              />
            </div>
          </div>

          {/* NAME */}
          <input
            placeholder="Menu Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-gray-900 text-white border border-gray-700"
          />

          {/* ================= CATEGORY (ACCORDION) ================= */}

          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div
              onClick={() => setOpenCategory(!openCategory)}
              className="flex justify-between items-center p-3 bg-gray-900 cursor-pointer"
            >
              <span className="text-white font-medium">
                Category {selectedCategory && "(1 selected)"}
              </span>
              {openCategory ? <ChevronUp /> : <ChevronDown />}
            </div>

            {openCategory && (
              <div className="p-3 flex flex-wrap gap-2 bg-gray-950">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(String(cat.id))}
                    className={`px-3 py-1.5 rounded-full border text-sm transition-all
            ${
              selectedCategory === String(cat.id)
                ? "bg-indigo-600 text-white border-indigo-500"
                : "bg-gray-900 text-gray-300 border-gray-700 hover:border-indigo-400"
            }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-gray-900 text-white border border-gray-700"
          />

          {/* ================= PRICES (UNCHANGED) ================= */}
          <div className="space-y-2">
            <label className="text-white font-medium">Prices</label>
            {prices.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={p.size}
                  onChange={(e) => updatePrice(i, "size", e.target.value)}
                  className="flex-1 p-2 rounded bg-gray-900 border border-gray-700"
                />
                <input
                  type="number"
                  value={p.price}
                  onChange={(e) => updatePrice(i, "price", e.target.value)}
                  className="w-24 p-2 rounded bg-gray-900 border border-gray-700"
                />
                <button onClick={() => removePrice(i)}>X</button>
              </div>
            ))}
            <div className="flex items-center justify-end">
              {" "}
              <button
                onClick={addPrice}
                className="bg-indigo-600 px-3 py-1 rounded "
              >
                Add Price
              </button>
            </div>
          </div>

          {/* ================= INGREDIENTS (ACCORDION) ================= */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div
              onClick={() => setOpenIngredients(!openIngredients)}
              className="flex justify-between items-center p-3 bg-gray-900 cursor-pointer"
            >
              <span className="text-white font-medium">Relate Ingredients</span>
              {openIngredients ? <ChevronUp /> : <ChevronDown />}
            </div>

            {openIngredients && (
              <div className="p-2 max-h-40 overflow-y-auto">
                {ingredientsList.map((ing) => (
                  <label key={ing.id} className="flex items-center gap-2 p-1">
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(ing.id)}
                      onChange={() => toggleIngredient(ing.id)}
                      className="accent-indigo-400"
                    />
                    <img src={ing.photo} className="w-10 h-10 rounded" />
                    <span className="text-white">{ing.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* ================= MONTHS (ACCORDION) ================= */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div
              onClick={() => setOpenMonths(!openMonths)}
              className="flex justify-between items-center p-3 bg-gray-900 cursor-pointer"
            >
              <span className="text-white font-medium">
                Available Months ({selectedMonths.length})
              </span>
              {openMonths ? <ChevronUp /> : <ChevronDown />}
            </div>

            {openMonths && (
              <div className="p-3 flex flex-wrap gap-2 bg-gray-950">
                {monthsOptions.map((m) => {
                  const active = selectedMonths.includes(m);

                  return (
                    <button
                      key={m}
                      onClick={() =>
                        active
                          ? setSelectedMonths(
                              selectedMonths.filter((x) => x !== m),
                            )
                          : setSelectedMonths([...selectedMonths, m])
                      }
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all
              ${
                active
                  ? "bg-green-600 text-white border-green-500"
                  : "bg-gray-900 text-gray-300 border-gray-700 hover:border-green-400"
              }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={close} className="px-4 py-2 bg-gray-600 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 rounded"
          >
            Create Menu
          </button>
        </div>
      </div>
    </div>
  );
}
