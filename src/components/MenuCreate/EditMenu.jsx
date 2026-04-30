import React, { useState, useEffect } from "react";
import { useAlert } from "../../AlertProvider";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function EditMenu({ data, close, onUpdate }) {
  const { showAlert, confirm } = useAlert();

  // ✅ PRE-FILL DATA
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");

  const [prices, setPrices] = useState(
    data?.prices?.length > 0 ? data.prices : [{ size: null, price: 0 }],
  );

  const [photo, setPhoto] = useState(""); // only new base64
  const [preview, setPreview] = useState(data?.photoUrl || "");

  const [ingredientsList, setIngredientsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const [selectedIngredients, setSelectedIngredients] = useState(
    data?.relate_ingredients || [],
  );

const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedMonths, setSelectedMonths] = useState(data?.get_months || []);

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

  // ✅ FETCH LISTS
  useEffect(() => {
    if (!data?.shop_id) return;

    const fetchAll = async () => {
      try {
        const [ingRes, catRes] = await Promise.all([
          fetch(`http://38.60.244.137:3000/ingredients/${data.shop_id}`),
          fetch(`http://38.60.244.137:3000/categories/${data.shop_id}`),
        ]);

        const ingData = await ingRes.json();
        const catData = await catRes.json();

        setIngredientsList(
          ingData.map((i) => ({
            ...i,
            photo: `http://38.60.244.137:3000/ingredients-uploads/${i.photo}`,
          })),
        );

        setCategoriesList(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, [data]);

  useEffect(() => {
  if (!data?.category || categoriesList.length === 0) return;

  // find matching category by name
  const found = categoriesList.find(
    (c) => c.name === data.category || c.id === data.category
  );

  if (found) {
    setSelectedCategory(found.id);
  }
}, [data, categoriesList]);

  // ✅ IMAGE HANDLE (ONLY IF USER CHANGE)
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result); // base64
      setPreview(reader.result); // preview
    };
    reader.readAsDataURL(file);
  };

  // ✅ PRICE LOGIC (SAME AS YOUR CREATE)
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
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // ✅ SUBMIT
//   const handleSubmit = async () => {
//     const ok = await confirm("Update this menu?");
//     if (!ok) return;

//     // const cleanedPrices = prices
//     //   .filter((p) => p.price > 0)
//     //   .map((p) => ({
//     //     size: p.size || null,
//     //     price: p.price,
//     //   }));
//     const cleanedPrices = prices.filter((p) => p.price > 0);

// if (cleanedPrices.length === 0) {
//   showAlert("Price must be greater than 0", "error");
//   return;
// }

// const payload = {
//   name: name.trim(),
// prices: cleanedPrices.map((p) => ({
//   size: p.size || null,
//   price: p.price,
// })),
//   size: cleanedPrices[0].size || null,
//   category: selectedCategory || null,
//   description: description || null,
//   relate_menu: null,
//   relate_ingredients:
//     selectedIngredients.length > 0 ? selectedIngredients : null,
//   get_months: selectedMonths.length > 0 ? selectedMonths : null,
//   photo: photo || null,
// };

//     if (!name.trim() || !selectedCategory || cleanedPrices.length === 0) {
//       showAlert("Please fill required fields", "error");
//       return;
//     }

//     try {
//       const payload = {
//         name: name.trim(),
//         prices: cleanedPrices[0]?.price || 0, // API expects number
//         size: cleanedPrices[0]?.size || null,
//         category: selectedCategory || null,
//         description: description || null,
//         relate_menu: null,
//         relate_ingredients:
//           selectedIngredients.length > 0 ? selectedIngredients : null,
//         get_months: selectedMonths.length > 0 ? selectedMonths : null,
//         photo: photo || null, // only send if changed
//       };

//       const res = await fetch(`http://38.60.244.137:3000/menu/${data.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         showAlert(result?.message || "Updated successfully", "success");
// onUpdate();
// setTimeout(() => {
//   close && close();
// }, 500);
//       } else {
//         showAlert(result?.error || "Update failed", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("Server error", "error");
//     }
//   };
const handleSubmit = async () => {
  const ok = await confirm("Update this menu?");
  if (!ok) return;

  const cleanedPrices = prices.filter((p) => p.price > 0);

  if (!name.trim() || !selectedCategory || cleanedPrices.length === 0) {
    showAlert("Please fill required fields", "error");
    return;
  }

  const payload = {
    name: name.trim(),

    // ✅ FIXED HERE
    prices: cleanedPrices.map((p) => ({
      size: p.size || null,
      price: p.price,
    })),

    // size: null, 

    category: selectedCategory || null,
    description: description || null,

    relate_menu: null,

relate_ingredients:
  selectedIngredients.length > 0
    ? selectedIngredients.map((i) =>
        typeof i === "object" ? i.id : i
      )
    : null,

    get_months:
      selectedMonths.length > 0 ? selectedMonths : null,

    photo: photo || null,
  };
console.log("PAYLOAD:", JSON.stringify(payload, null, 2));
  try {
    const res = await fetch(`http://38.60.244.137:3000/menu/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      showAlert(result?.message || "Updated successfully", "success");
      onUpdate();
      setTimeout(() => close && close(), 500);
    } else {
      showAlert(result?.error || "Update failed", "error");
    }
  } catch (err) {
    console.error(err);
    showAlert("Server error", "error");
  }
};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
      <div className="bg-[#111827] w-[550px] rounded-2xl p-6 border border-gray-700 shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold text-white mb-5">Edit Menu</h2>

        <div className="space-y-3">
          {/* PHOTO (SAME UI) */}
          <div>
            <label className="text-gray-300 font-medium mb-1 block">
              Menu Photo
            </label>

            <div
              className="relative w-full h-36 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center cursor-pointer bg-gray-900 hover:border-indigo-500"
              onClick={() => document.getElementById("editMenuPhoto").click()}
            >
              {!preview ? (
                <div className="text-gray-500 text-center">
                  <p>Click or drag image</p>
                </div>
              ) : (
                <>
                  <img
                    src={preview}
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhoto("");
                      setPreview("");
                    }}
                    className="absolute top-2 right-2 bg-gray-800/70 p-1 rounded-full"
                  >
                    ✕
                  </button>
                </>
              )}

              <input
                id="editMenuPhoto"
                type="file"
                className="hidden"
                onChange={handleImage}
              />
            </div>
          </div>

          {/* NAME */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-gray-900 text-white border border-gray-700"
          />

          {/* CATEGORY */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div
              onClick={() => setOpenCategory(!openCategory)}
              className="flex justify-between p-3 bg-gray-900 cursor-pointer"
            >
              <span className="text-white">Category</span>
              {openCategory ? <ChevronUp /> : <ChevronDown />}
            </div>

            {openCategory && (
              <div className="p-3 flex flex-wrap gap-2 bg-gray-950">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(String(cat.id))}
                    className={`px-3 py-1.5 rounded-full border text-sm ${
                      selectedCategory === String(cat.id)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-900 text-gray-300"
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-gray-900 text-white border border-gray-700"
          />

          {/* PRICES */}
          <div className="space-y-2">
            {prices.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={p.size || ""}
                  onChange={(e) => updatePrice(i, "size", e.target.value)}
                  className="flex-1 p-2 bg-gray-900 border border-gray-700"
                />
                <input
                  type="number"
                  value={p.price}
                  onChange={(e) => updatePrice(i, "price", e.target.value)}
                  className="w-24 p-2 bg-gray-900 border border-gray-700"
                />
                <button onClick={() => removePrice(i)}>X</button>
              </div>
            ))}
            <button onClick={addPrice} className="bg-indigo-600 px-3 py-1">
              Add Price
            </button>
          </div>

          {/* MONTHS (same UI) */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div
              onClick={() => setOpenMonths(!openMonths)}
              className="flex justify-between p-3 bg-gray-900 cursor-pointer"
            >
              <span className="text-white">
                Months ({selectedMonths.length})
              </span>
              {openMonths ? <ChevronUp /> : <ChevronDown />}
            </div>

            {openMonths && (
              <div className="p-3 flex flex-wrap gap-2">
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
                      className={`px-3 py-1 rounded-full ${
                        active ? "bg-green-600" : "bg-gray-800"
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
            Update Menu
          </button>
        </div>
      </div>
    </div>
  );
}
