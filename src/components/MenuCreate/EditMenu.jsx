import React, { useState, useEffect } from "react";
import { useAlert } from "../../AlertProvider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { apiFetch } from "../../api";

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
  const [menusList, setMenusList] = useState([]);

  const [selectedIngredients, setSelectedIngredients] = useState(
    data?.relate_ingredients
      ? data.relate_ingredients.map((i) =>
          typeof i === "object" ? i.id || i.ingredient_id : i,
        )
      : [],
  );

  const [selectedMenus, setSelectedMenus] = useState(
    data?.relate_menu
      ? data.relate_menu.map((m) => (typeof m === "object" ? m.id : m))
      : [],
  );

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedMonths, setSelectedMonths] = useState(data?.get_months || []);

  const [openCategory, setOpenCategory] = useState(false);
  const [openMenus, setOpenMenus] = useState(false);
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
  // useEffect(() => {
  //   if (!data?.shop_id) return;

  //   const fetchAll = async () => {
  //     try {
  //       const [ingRes, catRes, menuRes] = await Promise.all([
  //         fetch(`https://api.pwezayshops.com/ingredients/${data.shop_id}`, {
  //           method: "GET",
  //           headers: getAuthHeaders(),
  //         }),
  //         fetch(`https://api.pwezayshops.com/categories/${data.shop_id}`, {
  //           method: "GET",
  //           headers: getAuthHeaders(),
  //         }),
  //         fetch(`https://api.pwezayshops.com/menu/${data.shop_id}`, {
  //           method: "GET",
  //           headers: getAuthHeaders(),
  //         }),
  //       ]);

  //       const ingData = await ingRes.json();
  //       const catData = await catRes.json();
  //       const menuData = await menuRes.json();

  //       setIngredientsList(
  //         ingData.map((i) => ({
  //           ...i,
  //           photo: `https://api.pwezayshops.com/ingredients-uploads/${i.photo}`,
  //         })),
  //       );

  //       setMenusList(
  //         menuData.menus?.map((m) => ({
  //           ...m,
  //           photo: m.photo
  //             ? `https://api.pwezayshops.com/menu-uploads/${m.photo}`
  //             : null,
  //         })) || [],
  //       );

  //       setCategoriesList(Array.isArray(catData) ? catData : []);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchAll();
  // }, [data]);
  useEffect(() => {
  if (!data?.shop_id) return;

  const fetchAll = async () => {
    try {
      const [ingRes, catRes, menuRes] = await Promise.all([
        apiFetch(`https://api.pwezayshops.com/ingredients/${data.shop_id}`),
        apiFetch(`https://api.pwezayshops.com/categories/${data.shop_id}`),
        apiFetch(`https://api.pwezayshops.com/menu/${data.shop_id}`),
      ]);

      // ✅ token expire (401) ဖြစ်ရင် apiFetch က redirect လုပ်ပြီး null ပြန်မယ်
      if (!ingRes || !catRes || !menuRes) return;

      const ingData = await ingRes.json();
      const catData = await catRes.json();
      const menuData = await menuRes.json();

      setIngredientsList(
        ingData.map((i) => ({
          ...i,
          photo: `https://api.pwezayshops.com/ingredients-uploads/${i.photo}`,
        }))
      );

      setMenusList(
        (menuData.menus || []).map((m) => ({
          ...m,
          photo: m.photo
            ? `https://api.pwezayshops.com/menu-uploads/${m.photo}`
            : null,
        }))
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
      (c) => c.name === data.category || c.id === data.category,
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
  const toggleMenu = (id) => {
    setSelectedMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

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

      relate_menu: selectedMenus.length > 0 ? selectedMenus : null,

      relate_ingredients:
        selectedIngredients.length > 0
          ? selectedIngredients.map((i) => (typeof i === "object" ? i.id : i))
          : null,

      get_months: selectedMonths.length > 0 ? selectedMonths : null,

      photo: photo || null,
    };
    console.log("PAYLOAD:", JSON.stringify(payload, null, 2));
    try {
      const res = await apiFetch(`https://api.pwezayshops.com/menu/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
if (!res) return;
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
    <div className="fixed -inset-10 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
      <div className="bg-[#111827] w-[550px] rounded-2xl p-6 border border-gray-700 shadow-xl overflow-y-auto max-h-[85vh] custom-scrollbar">
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
              className="flex justify-between p-3 cursor-pointer"
            >
              <span className="text-white">Category</span>
              {openCategory ? <ChevronUp /> : <ChevronDown />}
            </div>

            {openCategory && (
              <div className="p-3 flex flex-wrap gap-2 ">
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
                  className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded-lg"
                />
                <input
                  type="number"
                  value={p.price}
                  onChange={(e) => updatePrice(i, "price", e.target.value)}
                  className="w-24 p-2 bg-gray-900 border border-gray-700 rounded-lg"
                />
                <button onClick={() => removePrice(i)}>X</button>
              </div>
            ))}
            <div className="flex items-center justify-end">
              <button
                onClick={addPrice}
                className="bg-indigo-600 px-3 py-1 rounded "
              >
                Add Price
              </button>
            </div>
          </div>

          {/* MENUS */}

          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div
              onClick={() => setOpenMenus(!openMenus)}
              className="flex justify-between items-center p-3 bg-gray-900 cursor-pointer"
            >
              <span className="text-white font-medium">
                Relate Menus ({selectedMenus.length})
              </span>

              {openMenus ? <ChevronUp /> : <ChevronDown />}
            </div>

            {openMenus && (
              <div className="p-2 max-h-40 overflow-y-auto">
                {menusList.length === 0 ? (
                  <p className="text-gray-400 text-sm py-2">Menu မရှိသေးပါ</p>
                ) : (
                  menusList.map((menu) => (
                    <label
                      key={menu.id}
                      className="flex items-center gap-2 p-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMenus.includes(menu.id)}
                        onChange={() => toggleMenu(menu.id)}
                        className="accent-indigo-400"
                      />

                      <img src={menu.photo} className="w-10 h-10 rounded" />

                      <span className="text-white">{menu.name}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
          {/* INGREDIENTS */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div
              onClick={() => setOpenIngredients(!openIngredients)}
              className="flex justify-between items-center p-3 bg-gray-900 cursor-pointer"
            >
              <span className="text-white font-medium">
                Relate Ingredients ({selectedIngredients.length})
              </span>

              {openIngredients ? <ChevronUp /> : <ChevronDown />}
            </div>

            {openIngredients && (
              <div className="p-2 max-h-40 overflow-y-auto">
                {ingredientsList.length === 0 ? (
                  <p className="text-gray-400 text-sm py-2">
                    Ingredient မရှိသေးပါ
                  </p>
                ) : (
                  ingredientsList.map((ing) => (
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
                  ))
                )}
              </div>
            )}
          </div>

          {/* MONTHS */}
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
              <div className="">
                {/* Month Buttons */}
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
                        className={`px-3 py-1.5 rounded-full text-sm border transition-all
                ${
                  active
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-gray-900 text-gray-300 border-gray-700 hover:border-indigo-400"
                }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                  {/* Select All Button */}
                  <div className="flex justify-end pl-[130px]">
                    <button
                      onClick={() => {
                        if (selectedMonths.length === monthsOptions.length) {
                          setSelectedMonths([]);
                        } else {
                          setSelectedMonths(monthsOptions);
                        }
                      }}
                      className="px-3 py-1 text-xs rounded-md bg-green-600 hover:bg-green-700 text-white"
                    >
                      {selectedMonths.length === monthsOptions.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={close} className="px-4 py-2 bg-gray-600 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 rounded-lg"
          >
            Update Menu
          </button>
        </div>
      </div>
    </div>
  );
}
