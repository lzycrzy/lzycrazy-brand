import React, { useState, useRef } from "react";
import './MyComponent.css';

const Card=()=> {
  const [title, setTitle] = useState("");
  const MAX_FILES = 20;

  // Create a state object for storing form data
  const [formData, setFormData] = useState({
    category: "For Rent: Houses & Apartments",
    type: "",
    bhk: "",
    bathrooms: "",
    furnishing: "",
    listedBy: "",
    superBuiltupArea: "",
    carpetArea: "",

    bachelorsAllowed: "",
    maintenance: "",
    totalFloors: "",
    floorNo: "",
    carParking: "",
    facing: "",
    projectName: "",
    title: "",
    projects: "",
    description: "",
    price: "",
    phone: "",
    state: "",
    name: "",
    focused: { superBuiltupArea: false },
    touched: {
      superBuiltupArea: false,
    },
  });
  const handleChange1 = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const [priceTouched, setPriceTouched] = React.useState(false);

  const priceIsValid = Number(formData.price) >= 1000;
  // Handle change for each input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [selectedIndex, setSelectedIndex] = useState(null);
  const handleImageSelect = (index) => {
    setSelectedIndex(index);
    fileInputRef.current?.click();
  };

  const options = ["No", "Yes"];
  // Handle the form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");
    // Do something with formData (e.g., send it to an API)
    console.log(formData);
  };
 
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(Array(20).fill(null));

  const handleCarpetAreaChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      carpetArea: e.target.value,
    }));
  };

  // const handleFileChange2 = (e) => {
  //   const files = Array.from(e.target.files);
  //   setImages((prevImages) => {
  //     const updated = [...prevImages];
  //     let i = 0;
  //     for (let j = 0; j < updated.length && i < files.length; j++) {
  //       if (!updated[j]) {
  //         updated[j] = URL.createObjectURL(files[i]);
  //         i++;
  //       }
  //     }
  //     return updated;
  //   });
  // };
  const MAX_IMAGES = 20;
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const ASPECT_RATIO = 21 / 9;
const ASPECT_TOLERANCE = 0.05; // Allow slight variation (±5%)
const [imageErrors, setImageErrors] = useState(Array(20).fill(false));

const handleFileChange2 = (e) => {
  const files = Array.from(e.target.files);
  const maxImages = 20;

  const updatedImages = [...images];
  const newErrors = [...imageErrors];

  let added = 0;

  files.forEach((file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const ratio = img.width / img.height;

        const nextIndex = updatedImages.findIndex((img) => img === null);

        if (nextIndex !== -1 && added < maxImages) {
          updatedImages[nextIndex] = event.target.result;
          newErrors[nextIndex] = ratio > 21 / 9; // true if aspect ratio is too wide
          added++;
        }

        setImages([...updatedImages]);
        setImageErrors([...newErrors]);
      };
      e.target.value = ""; 
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
};
const firstValidImageIndex = imageErrors.findIndex((err, idx) => !err && images[idx]);

  const [dragIndex, setDragIndex] = useState(null);

  const handleDragStart = (index) => {
    setDragIndex(index);
  };
  
  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
  
    setImages((prev) => {
      const newImages = [...prev];
      [newImages[dragIndex], newImages[index]] = [newImages[index], newImages[dragIndex]];
      return newImages;
    });
  
    setImageErrors((prev) => {
      const newErrors = [...prev];
      [newErrors[dragIndex], newErrors[index]] = [newErrors[index], newErrors[dragIndex]];
      return newErrors;
    });
  
    setDragIndex(null);
  };
  
  
  const handleDragOver = (e) => e.preventDefault();  
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleCarpetAreaBlur = (e) => {
    setFormData((prev) => ({
      ...prev,
      touched: {
        ...prev.touched,
        carpetArea: true,
      },
    }));
  };
  const [isFacingFocused, setIsFacingFocused] = useState(false);

  const [isMaintenanceFocused, setIsMaintenanceFocused] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);
  const handleBlur = (e) => {
    const { name } = e.target;
    setFormData((prev) => ({
      ...prev,
      touched: {
        ...prev.touched,
        [name]: true,
      },
    }));
  };
  const [isTotalFloorsFocused, setIsTotalFloorsFocused] = useState(false);

  const [activeTab, setActiveTab] = useState("list");

  const tabs = [
    { id: "list", label: "LIST" },
    { id: "current", label: "CURRENT LOCATION" },
  ];
  const [avatar, setAvatar] = useState(
    "https://apollo.olx.in:443/v1/files/5ogni1js03lv2-IN/image;s=120x120"
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };
  const [isFocused, setIsFocused] = useState(false);
  


  const [isProjectsFocused, setIsProjectsFocused] = useState(false);
  const [isProjectsTouched, setIsProjectsTouched] = useState(false);

  const isProjectsEmpty = formData.projects.trim() === "";
  const showError = isProjectsTouched && isProjectsEmpty;
  const [titleTouched1, setTitleTouched1] = React.useState(false);
  const [isFocused1, setIsFocused1] = React.useState(false);

  const [descriptionTouched2, setDescriptionTouched2] = React.useState(false);
  const [isFocused2, setIsFocused2] = React.useState(false);

  const [priceFocused, setPriceFocused] = React.useState(false);
  const [priceTouched1, setPriceTouched1] = React.useState(false);

  const [stateTouched, setStateTouched] = React.useState(false);
  const [stateFocused, setStateFocused] = React.useState(false);
  const [nameFocused, setNameFocused] = React.useState(false);
  const [nameTouched, setNameTouched] = React.useState(false);

  const [phoneFocused, setPhoneFocused] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const isPhoneValid = /^\d{10}$/.test(formData.phone);
  const isPhoneTouched = formData.phone.length > 0;
  const showPhoneError = isPhoneTouched && !isPhoneValid;
  const showPhoneSuccess = isPhoneValid;

  
  return (
    <main
      id="main_content"
      style={{
        fontFamily: "'Roboto', Arial, Helvetica, sans-serif",
        padding: "20px",
        backgroundColor: "#fff",
      }}
    >
     
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          background: "white",
          padding: "10px",
          textAlign: "left",
          paddingLeft: "30px",
          border: "1px solid rgba(14,4,5,0.2)",
          display: "flex",
          borderRadius: "4px",
          alignItems: "flex-start",
        }}
      >
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "500px",
          }}
        >
          {/* Selected Category */}
          <div
            style={{
              marginLeft: "-13px",
              marginBottom: "10px",
              position: "relative",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                color: "#002f34",
                marginBottom: "30px",
              }}
            >
              SELECTED CATEGORY
            </h2>
            <div>
              <ol
                style={{
                  paddingLeft: 0,
                  listStyle: "none",
                  display: "flex",
                  gap: "5px",
                  marginBottom: "22px",
                }}
              >
                <li style={{ fontSize: "12px", color: "#8D9094" }}>
                  Properties /
                </li>
                <li style={{ fontSize: "12px", color: "#8D9094" }}>
                  {formData.category}
                </li>
                <li style={{ fontSize: "12px", color: "#8D9094" }}>
                  <span>
                    <a
                      href="/"
                      style={{
                        textDecoration: "underline",
                        textDecorationThickness: "2px",
                        fontWeight: "bold",
                        fontSize: "14px",
                        gap: "6px",
                        color: "#004896",
                        marginLeft: "15px",
                      }}
                    >
                      Change
                    </a>
                  </span>
                </li>
              </ol>
            </div>
            <hr
              style={{
                width: "calc(100% + 328px)",
                margin: "20px 0",
                position: "relative",
                left: "-18px",
                border: "none",
                marginBottom: "30px",
                borderTop: "0.6px solid rgba(14,4,5,0.2)",
              }}
            />
          </div>

          {/* Include some details */}
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "20px", color: "#002f34" }}>
              INCLUDE SOME DETAILS
            </h2>

            {/* Type */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "14px" }}>Type *</label>
              <br />
              {[
                "Flats / Apartments",
                "Independent / Builder Floors",
                "Individual House / Villa",
              ].map((val) => {
                const isSelected = formData.type === val;
                return (
                  <button
                    type="button"
                    key={val}
                    className={`zhk-button ${isSelected ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, type: val })}
                  >
                    {val}
                  </button>
                );
              })}
            </div>

            {/* BHK */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "14px" }}>BHK</label>
              <br />
              {[1, 2, 3, 4, "4+"].map((val) => {
                const isSelected = formData.bhk === val;
                return (
                  <button
                    type="button"
                    key={val}
                    className={`bhk-button ${isSelected ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, bhk: val })}
                  >
                    {val}
                  </button>
                );
              })}
            </div>

            {/* Bathrooms */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                Bathrooms
              </label>

              {[1, 2, 3, 4, "4+"].map((val) => {
                const isSelected = formData.bathrooms === val;
                return (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setFormData({ ...formData, bathrooms: val })}
                    className={`bathroom-btn ${isSelected ? "selected" : ""}`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>

            {/* Furnishing */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                Furnishing
              </label>

              {["Furnished", "Semi-Furnished", "Unfurnished"].map((val) => {
                const isSelected = formData.furnishing === val;
                return (
                  <button
                    type="button"
                    key={val}
                    className={`lhk-button ${isSelected ? "selected" : ""}`}
                    onClick={() =>
                      setFormData({ ...formData, furnishing: val })
                    }
                  >
                    {val}
                  </button>
                );
              })}
            </div>
            {/* Listed by */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                Listed by
              </label>

              {["Builder", "Dealer", "Owner"].map((val) => {
                const isSelected = formData.listedBy === val;
                return (
                  <button
                    type="button"
                    key={val}
                    className={`mhk-button ${isSelected ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, listedBy: val })}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
            {/* Super Builtup area */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
  <label
    htmlFor="ft"
    style={{
      display: "block",
      fontSize: "14px",
      marginBottom: "6px",
      color:
        formData.touched.superBuiltupArea && !formData.superBuiltupArea
          ? "red"
          : formData.focused.superBuiltupArea
          ? "#004896"
          : "#000",
      fontWeight:
        formData.touched.superBuiltupArea && !formData.superBuiltupArea
          ? "bold"
          : formData.focused.superBuiltupArea
          ? "bold"
          : "normal",
    }}
  >
    Super Builtup area sqft *
  </label>

  <div style={{ position: "relative" }}>
    <input
      id="ft"
      name="superBuiltupArea"
      type="number"
      min="0"
      step="1"
      value={formData.superBuiltupArea}
      onFocus={() =>
        setFormData((prev) => ({
          ...prev,
          focused: { ...prev.focused, superBuiltupArea: true },
        }))
      }
      onBlur={() =>
        setFormData((prev) => ({
          ...prev,
          touched: { ...prev.touched, superBuiltupArea: true },
          focused: { ...prev.focused, superBuiltupArea: false },
        }))
      }
      onChange={handleChange1}
      style={{
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        border:
          formData.focused.superBuiltupArea
            ? "2px solid #004896"
            : formData.touched.superBuiltupArea &&
              !formData.superBuiltupArea
            ? "2px solid red"
            : "1px solid #ccc",
        borderRadius: "2px",
        outline: "none",
        paddingRight: "30px", // space for checkmark
        boxSizing: "border-box",
      }}
    />

    {/* Checkmark SVG icon */}
    {formData.touched.superBuiltupArea &&
      formData.superBuiltupArea &&
      !formData.focused.superBuiltupArea && (
        <svg
          width="16px"
          height="16px"
          viewBox="0 0 1024 1024"
          fillRule="evenodd"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color:"020812",
          }}
        >
          <path
            d="M744.727 450.484v-54.846h-54.846l-216.669 216.669-100.305-100.305h-54.846v54.846l127.728 127.728h54.846l244.092-244.092zM512 162.911c-192.485 0-349.091 156.606-349.091 349.091s156.606 349.091 349.091 349.091c192.485 0 349.091-156.606 349.091-349.091s-156.606-349.091-349.091-349.091v0zM512 938.669c-235.268 0-426.667-191.399-426.667-426.667s191.399-426.667 426.667-426.667c235.268 0 426.667 191.399 426.667 426.667s-191.399 426.667-426.667 426.667v0z"
            fill="#004896"
          />
        </svg>
      )}
  </div>

  {/* Error Message */}
  {formData.touched.superBuiltupArea && !formData.superBuiltupArea && (
    <span style={{ color: "red", fontSize: "13px" }}>
      Super Builtup area sqft is mandatory. Please complete the required field.
    </span>
  )}
</div>

            {/* Other Fields */}
            {/* Repeat the pattern for other fields like carpet area, bachelors allowed, etc. */}
            {/* Carpet Area */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
  <label
    htmlFor="carpetarea"
    style={{
      display: "block",
      fontSize: "14px",
      marginBottom: "6px",
      color:
        formData.focused?.carpetArea
          ? "#004896"
          : formData.touched?.carpetArea && !formData.carpetArea
          ? "red"
          : "#000",
      fontWeight:
        formData.focused?.carpetArea || (formData.touched?.carpetArea && !formData.carpetArea)
          ? "bold"
          : "normal",
    }}
  >
    Carpet Area sqft *
  </label>

  {/* Input container with relative positioning for checkmark */}
  <div style={{ position: "relative" }}>
    <input
      id="carpetarea"
      name="carpetArea"
      type="number"
      min="0"
      step="1"
      value={formData.carpetArea}
      onChange={handleCarpetAreaChange}
      onFocus={() =>
        setFormData((prev) => ({
          ...prev,
          focused: { ...(prev.focused || {}), carpetArea: true },
        }))
      }
      onBlur={() => {
        setFormData((prev) => ({
          ...prev,
          touched: { ...(prev.touched || {}), carpetArea: true },
          focused: { ...(prev.focused || {}), carpetArea: false },
        }));
        handleCarpetAreaBlur(); // Keep this if you use side effects
      }}
      style={{
        width: "100%",
        padding: "10px",
        paddingRight: "35px", // Add space for checkmark
        fontSize: "14px",
        border:
          formData.focused?.carpetArea
            ? "2px solid #004896"
            : formData.touched?.carpetArea && !formData.carpetArea
            ? "2px solid red"
            : "1px solid #ccc",
        borderRadius: "4px",
        outline: "none",
        boxSizing: "border-box",
      }}
    />

    {/* Checkmark SVG inside the input box */}
    {formData.touched?.carpetArea &&
      formData.carpetArea &&
      !formData.focused?.carpetArea && (
        <svg
          width="16px"
          height="16px"
          viewBox="0 0 1024 1024"
          fillRule="evenodd"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color:"020812",
          }}
        >
          <path
            d="M744.727 450.484v-54.846h-54.846l-216.669 216.669-100.305-100.305h-54.846v54.846l127.728 127.728h54.846l244.092-244.092zM512 162.911c-192.485 0-349.091 156.606-349.091 349.091s156.606 349.091 349.091 349.091c192.485 0 349.091-156.606 349.091-349.091s-156.606-349.091-349.091-349.091v0zM512 938.669c-235.268 0-426.667-191.399-426.667-426.667s191.399-426.667 426.667-426.667c235.268 0 426.667 191.399 426.667 426.667s-191.399 426.667-426.667 426.667v0z"
            fill="#004896"
          />
        </svg>
      )}
  </div>

  {/* Error Message */}
  {formData.touched?.carpetArea && !formData.carpetArea && (
    <span style={{ color: "red", fontSize: "13px" }}>
      Carpet Area sqft is mandatory. Please complete the required field.
    </span>
  )}
</div>


            {/* Bachelors Allowed */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                Bachelors Allowed
              </label>
              <div>
                {options.map((val) => {
                  const isSelected = formData.bachelorsAllowed === val;
                  return (
                    <button
                      type="button"
                      key={val}
                      className={`bn-button ${isSelected ? "selected" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, bachelorsAllowed: val })
                      }
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Maintenance */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
  <label
    htmlFor="maintenance"
    style={{
      display: "block",
      fontSize: "14px",
      marginBottom: "6px",
      color: isMaintenanceFocused ? "#004896" : "#000",
      fontWeight: isMaintenanceFocused ? "bold" : "initial",
    }}
  >
    Maintenance (Monthly)
  </label>

  <div style={{ position: "relative" }}>
    <input
      id="maintenance"
      name="maintenance"
      type="number"
      min="0"
      step="1"
      value={formData.maintenance || ""}
      onFocus={() => setIsMaintenanceFocused(true)}
      onBlur={() => {
        setIsMaintenanceFocused(false);
        setFormData((prev) => ({
          ...prev,
          touched: { ...(prev.touched || {}), maintenance: true },
        }));
      }}
      onChange={(e) =>
        setFormData({
          ...formData,
          maintenance: e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "10px",
        paddingRight: "35px",
        fontSize: "14px",
        border: isMaintenanceFocused
          ? "2px solid #004896"
          : "1px solid #ccc",
        borderRadius: "4px",
        outline: "none",
        boxSizing: "border-box",
      }}
    />

    {/* Show green checkmark if value is present, field is touched and not focused */}
    {formData.touched?.maintenance &&
      formData.maintenance &&
      !isMaintenanceFocused && (
        <svg
          width="16px"
          height="16px"
          viewBox="0 0 1024 1024"
          fillRule="evenodd"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color:"020812",
          }}
        >
          <path
            d="M744.727 450.484v-54.846h-54.846l-216.669 216.669-100.305-100.305h-54.846v54.846l127.728 127.728h54.846l244.092-244.092zM512 162.911c-192.485 0-349.091 156.606-349.091 349.091s156.606 349.091 349.091 349.091c192.485 0 349.091-156.606 349.091-349.091s-156.606-349.091-349.091-349.091v0zM512 938.669c-235.268 0-426.667-191.399-426.667-426.667s191.399-426.667 426.667-426.667c235.268 0 426.667 191.399 426.667 426.667s-191.399 426.667-426.667 426.667v0z"
            fill="#004896"
          />
        </svg>
      )}
  </div>
</div>

            {/* Total Floors */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
  <label
    htmlFor="totalfloors"
    style={{
      display: "block",
      fontSize: "14px",
      marginBottom: "6px",
      color: isTotalFloorsFocused ? "#004896" : "#000",
      fontWeight: isTotalFloorsFocused ? "bold" : "initial",
    }}
  >
    Total Floors
  </label>

  <div style={{ position: "relative" }}>
    <input
      id="totalfloors"
      name="totalfloors"
      type="number"
      min="0"
      step="1"
      value={formData.totalfloors || ""}
      onFocus={() => setIsTotalFloorsFocused(true)}
      onBlur={() => {
        setIsTotalFloorsFocused(false);
        setFormData((prev) => ({
          ...prev,
          touched: { ...(prev.touched || {}), totalfloors: true },
        }));
      }}
      onChange={(e) =>
        setFormData({ ...formData, totalfloors: e.target.value })
      }
      style={{
        width: "100%",
        padding: "10px",
        paddingRight: "35px",
        fontSize: "14px",
        border: isTotalFloorsFocused
          ? "2px solid #004896"
          : "1px solid #ccc",
        borderRadius: "4px",
        outline: "none",
        boxSizing: "border-box",
      }}
    />

    {/* Checkmark when touched + valid + not focused */}
    {formData.touched?.totalfloors &&
      formData.totalfloors &&
      !isTotalFloorsFocused && (
        <svg
          width="16px"
          height="16px"
          viewBox="0 0 1024 1024"
          fillRule="evenodd"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color:"020812",
          }}
        >
          <path
            d="M744.727 450.484v-54.846h-54.846l-216.669 216.669-100.305-100.305h-54.846v54.846l127.728 127.728h54.846l244.092-244.092zM512 162.911c-192.485 0-349.091 156.606-349.091 349.091s156.606 349.091 349.091 349.091c192.485 0 349.091-156.606 349.091-349.091s-156.606-349.091-349.091-349.091v0zM512 938.669c-235.268 0-426.667-191.399-426.667-426.667s191.399-426.667 426.667-426.667c235.268 0 426.667 191.399 426.667 426.667s-191.399 426.667-426.667 426.667v0z"
            fill="#004896"
          />
        </svg>
      )}
  </div>
</div>


            {/* Floor No */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
  <label
    htmlFor="floorno"
    style={{
      display: "block",
      fontSize: "14px",
      marginBottom: "6px",
      color: isFocused ? "#004896" : "#000",
      fontWeight: isFocused ? "bold" : "initial",
    }}
  >
    Floor No
  </label>

  <div style={{ position: "relative" }}>
    <input
      id="floorno"
      name="floorno"
      type="number"
      min="0"
      step="1"
      value={formData.floorno || ""}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        setFormData((prev) => ({
          ...prev,
          touched: { ...(prev.touched || {}), floorno: true },
        }));
      }}
      onChange={(e) =>
        setFormData({ ...formData, floorno: e.target.value })
      }
      style={{
        width: "100%",
        padding: "10px",
        paddingRight: "35px",
        fontSize: "14px",
        border: isFocused ? "2px solid #004896" : "1px solid #ccc",
        borderRadius: "4px",
        outline: "none",
        boxSizing: "border-box",
      }}
    />

    {/* ✅ Checkmark when touched, filled, and not focused */}
    {formData.touched?.floorno &&
      formData.floorno &&
      !isFocused && (
        <svg
          width="16px"
          height="16px"
          viewBox="0 0 1024 1024"
          fillRule="evenodd"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color:"020812",
          }}
        >
          <path
            d="M744.727 450.484v-54.846h-54.846l-216.669 216.669-100.305-100.305h-54.846v54.846l127.728 127.728h54.846l244.092-244.092zM512 162.911c-192.485 0-349.091 156.606-349.091 349.091s156.606 349.091 349.091 349.091c192.485 0 349.091-156.606 349.091-349.091s-156.606-349.091-349.091-349.091v0zM512 938.669c-235.268 0-426.667-191.399-426.667-426.667s191.399-426.667 426.667-426.667c235.268 0 426.667 191.399 426.667 426.667s-191.399 426.667-426.667 426.667v0z"
            fill="#004896"
          />
        </svg>
      )}
  </div>
</div>

            {/* Car Parking */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                Car Parking
              </label>
              <div>
                {["0", "1", "2", "3", "3+"].map((val) => {
                  const isSelected = formData.carParking === val;
                  return (
                    <button
                      type="button"
                      key={val}
                      className={`tt-button ${isSelected ? "selected" : ""}`}
                      onClick={() =>
                        setFormData({ ...formData, carParking: val })
                      }
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Facing */}
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="facing"
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "6px",
                  color: isFacingFocused ? "#004896" : "#000", 
                fontWeight: isFacingFocused ? "bold" : "initial",// Label color on focus
                }}
              >
                Facing
              </label>
              <select
                id="facing"
                name="facing"
                value={formData.facing}
                onFocus={() => setIsFacingFocused(true)}
                onBlur={() => setIsFacingFocused(false)}
                onChange={(e) =>
                  setFormData({ ...formData, facing: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  border: isFacingFocused
                    ? "2px solid #004896"
                    : "1px solid #ccc", // Border on focus
                  borderRadius: "4px",
                  outline: "none",
                }}
              >
                <option value=""></option>
                <option value="east">East</option>
                <option value="north">North</option>
                <option value="northeast">North-East</option>
                <option value="northwest">North-West</option>
                <option value="south">South</option>
                <option value="southeast">South-East</option>
                <option value="southwest">South-West</option>
                <option value="west">West</option>
              </select>
            </div>

            {/* Project Name */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
  <label
    htmlFor="projects"
    style={{
      display: "block",
      fontSize: "14px",
      marginBottom: "6px",
      color: isProjectsFocused
        ? "#004896"
        : showError
        ? "red"
        : "#000",
      fontWeight: isProjectsFocused || showError ? "bold" : "normal",
    }}
  >
    Project Name
  </label>

  <div style={{ position: "relative" }}>
    <input
      id="projects"
      name="projects"
      type="text"
      maxLength="70"
      value={formData.projects}
      onFocus={() => setIsProjectsFocused(true)}
      onBlur={() => {
        setIsProjectsFocused(false);
        setIsProjectsTouched(true);
      }}
      onChange={(e) =>
        setFormData({ ...formData, projects: e.target.value })
      }
      style={{
        width: "100%",
        padding: "10px",
        paddingRight: "35px",
        fontSize: "14px",
        border: isProjectsFocused
          ? "2px solid #004896"
          : showError
          ? "2px solid red"
          : "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
        outline: "none",
      }}
    />

    {/* ✅ Checkmark if valid, touched, and not focused */}
    {isProjectsTouched &&
      formData.projects?.trim() &&
      !isProjectsFocused &&
      !showError && (
        <svg
          width="16px"
          height="16px"
          viewBox="0 0 1024 1024"
          fillRule="evenodd"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color:"020812",
          }}
        >
          <path
            d="M744.727 450.484v-54.846h-54.846l-216.669 216.669-100.305-100.305h-54.846v54.846l127.728 127.728h54.846l244.092-244.092zM512 162.911c-192.485 0-349.091 156.606-349.091 349.091s156.606 349.091 349.091 349.091c192.485 0 349.091-156.606 349.091-349.091s-156.606-349.091-349.091-349.091v0zM512 938.669c-235.268 0-426.667-191.399-426.667-426.667s191.399-426.667 426.667-426.667c235.268 0 426.667 191.399 426.667 426.667s-191.399 426.667-426.667 426.667v0z"
            fill="#004896"
          />
        </svg>
      )}
  </div>

  {/* Character count */}
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "4px",
    }}
  >
    <span style={{ fontSize: "12px", color: "#666" }}>
      {formData.projects.length} / 70
    </span>
  </div>
</div>


            {/* Ad Title */}

            <div style={{ marginBottom: "20px", position: "relative" }}>
  <label
    htmlFor="title"
    style={{
      display: "block",
      fontSize: "14px",
      marginBottom: "6px",
      color:
        formData.focused?.title
          ? "#004896" // blue when focused
          : formData.touched?.title && formData.title.trim().length < 10
          ? "red" // red when touched and invalid
          : "inherit",
      fontWeight:
  formData.focused?.title || (formData.touched?.title && formData.title.trim().length < 10)
    ? "bold"
    : "normal",
    }}
  >
    Ad Title *
  </label>

  <div style={{ position: "relative" }}>
    <input
      id="title"
      name="title"
      type="text"
      maxLength="70"
      value={formData.title || ""}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, title: e.target.value }))
      }
      onFocus={() =>
        setFormData((prev) => ({
          ...prev,
          focused: { ...(prev.focused || {}), title: true },
        }))
      }
      onBlur={() =>
        setFormData((prev) => ({
          ...prev,
          touched: { ...(prev.touched || {}), title: true },
          focused: { ...(prev.focused || {}), title: false },
        }))
      }
      style={{
        width: "100%",
        padding: "10px",
        paddingRight: "35px", // space for SVG
        fontSize: "14px",
        border:
          formData.touched?.title && formData.title.trim().length < 10
            ? "3px solid red"
            : formData.focused?.title
            ? "3px solid #004896"
            : "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
        outline: "none",
      }}
    />

    {/* ✅ Checkmark if valid, touched, and not focused */}
    {formData.touched?.title &&
      formData.title.trim().length >= 10 &&
      !formData.focused?.title && (
        <svg
          width="16px"
          height="16px"
          viewBox="0 0 1024 1024"
          fillRule="evenodd"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color:"020812",
          }}
        >
          <path
            d="M744.727 450.484v-54.846h-54.846l-216.669 216.669-100.305-100.305h-54.846v54.846l127.728 127.728h54.846l244.092-244.092zM512 162.911c-192.485 0-349.091 156.606-349.091 349.091s156.606 349.091 349.091 349.091c192.485 0 349.091-156.606 349.091-349.091s-156.606-349.091-349.091-349.091v0zM512 938.669c-235.268 0-426.667-191.399-426.667-426.667s191.399-426.667 426.667-426.667c235.268 0 426.667 191.399 426.667 426.667s-191.399 426.667-426.667 426.667v0z"
            fill="#004896"
          />
        </svg>
      )}
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "4px",
    }}
  >
    <span
      style={{
        fontSize: "12px",
        color:
          formData.touched?.title && formData.title.trim().length < 10
            ? "red"
            : "#666",
      }}
    >
      {formData.touched?.title && formData.title.trim().length < 10
        ? "A minimum length of 10 characters is required. Please edit the field."
        : "Mention the key features of your item (e.g. brand, model, age, type)"}
    </span>

    <span style={{ fontSize: "12px", color: "#666" }}>
      {(formData.title || "").length} / 70
    </span>
  </div>
</div>


            {/* Description */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
  <label
    htmlFor="description"
    style={{
      display: "block",
      fontSize: "14px",
      marginBottom: "6px",
      color:
        isFocused2
          ? "#004896" // blue when focused
          : descriptionTouched2 && formData.description.trim().length < 10
          ? "red"
          : "inherit",
      fontWeight:
        isFocused2 || (descriptionTouched2 && formData.description.trim().length < 10)
          ? "bold"
          : "normal",
    }}
  >
    Description *
  </label>

  <textarea
    id="description"
    name="description"
    
    maxLength="4096"
    value={formData.description || ""}
    onChange={(e) =>
      setFormData({ ...formData, description: e.target.value })
    }
    onBlur={() => {
      setDescriptionTouched2(true);
      setIsFocused2(false);
    }}
    onFocus={() => setIsFocused2(true)}
    style={{
      width: "100%",
      height: "96px",
      padding: "10px",
      fontSize: "14px",
      resize: "none",
      border:
        descriptionTouched2 && formData.description.trim().length < 10
          ? "2px solid red"
          : isFocused2
          ? "2px solid #004896" // blue border when focused
          : "1px solid #ccc", // default
      borderRadius: "4px",
      boxSizing: "border-box",
      outline: "none",
      paddingRight: "32px", // extra padding for the SVG icon
    }}
  ></textarea>

  {/* Show checkmark SVG when valid and not focused */}
  {!isFocused2 && descriptionTouched2 && formData.description.trim().length >= 10 && (
   <svg
   width="16px"
   height="16px"
   viewBox="0 0 1024 1024"
   fillRule="evenodd"
   style={{
     position: "absolute",
     right: "10px",
     top: "30%",
     transform: "translateY(-50%)",
     pointerEvents: "none",
     color:"020812",
   }}
 >
   <path
     d="M744.727 450.484v-54.846h-54.846l-216.669 216.669-100.305-100.305h-54.846v54.846l127.728 127.728h54.846l244.092-244.092zM512 162.911c-192.485 0-349.091 156.606-349.091 349.091s156.606 349.091 349.091 349.091c192.485 0 349.091-156.606 349.091-349.091s-156.606-349.091-349.091-349.091v0zM512 938.669c-235.268 0-426.667-191.399-426.667-426.667s191.399-426.667 426.667-426.667c235.268 0 426.667 191.399 426.667 426.667s-191.399 426.667-426.667 426.667v0z"
     fill="#004896"
   />
 </svg>
  )}

  {/* Validation or helper message */}
  <div
    style={{
      fontSize: "12px",
      color:
        descriptionTouched2 && formData.description.trim().length < 10
          ? "red"
          : "#666",
      marginTop: "4px",
    }}
  >
    {descriptionTouched2 && formData.description.trim().length < 10
      ? "A minimum length of 10 characters is required. Please edit the field."
      : "Include condition, features and reason for selling"}
  </div>

  {/* Character counter */}
  <div
    style={{
      fontSize: "12px",
      color: "#666",
      position: "absolute",
      bottom: "0",
      right: "0",
      padding: "4px",
    }}
  >
    {formData.description.length} / 4096
  </div>
</div>


            {/* Price */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
  <hr
    style={{
      width: "calc(100% + 341px)",
      margin: "20px 0",
      position: "relative",
      left: "-30px",
      border: "none",
      marginBottom: "30px",
      borderTop: "0.6px solid rgba(14,4,5,0.2)",
    }}
  />
  <span
    style={{
      fontSize: "20px",
      color: "#020812",
      fontWeight: "bold",
      display: "block",
      marginBottom: "12px",
    }}
  >
    SET A PRICE
  </span>

  <label
    htmlFor="price"
    style={{
      display: "block",
      fontSize: "12px",
      marginTop: "16px",
      color: priceTouched1 && !priceIsValid ? "red" : "#8D9094",
      fontWeight: priceTouched1 && !priceIsValid ? "bold" : "initial",
      marginBottom: "6px",
    }}
  >
    Price *
  </label>

  <div style={{ position: "relative" }}>
    {/* Rupee Symbol */}
    <span
      style={{
        position: "absolute",
        top: "50%",
        left: "10px",
        transform: "translateY(-50%)",
        color: "#8D9094",
        borderRight: "1px solid #ccc",
        paddingRight: "10px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      ₹
    </span>

    {/* Input Field */}
    <input
      id="price"
      name="price"
      type="number"
      min="0"
      value={formData.price || ""}
      onChange={(e) =>
        setFormData({ ...formData, price: e.target.value })
      }
      onBlur={() => {
        setPriceTouched1(true);
        setPriceFocused(false);
      }}
      onFocus={() => setPriceFocused(true)}
      style={{
        width: "100%",
        padding: "10px 40px 10px 40px", // right padding increased for icon
        fontSize: "14px",
        borderRadius: "4px",
        height: "48px",
        boxSizing: "border-box",

        // Border color logic:
        border: priceFocused
          ? "3px solid #004896" // Blue when focused
          : priceTouched1 && !priceIsValid
          ? "3px solid red" // Red if invalid after blur
          : "1px solid #ccc", // Default grey
      }}
    />

    {/* Show checkmark SVG when valid and not focused */}
    {!priceFocused && priceTouched1 && priceIsValid && (
      <svg
      width="16px"
      height="16px"
      viewBox="0 0 1024 1024"
      fillRule="evenodd"
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none",
        color:"020812",
      }}
    >
      <path
        d="M744.727 450.484v-54.846h-54.846l-216.669 216.669-100.305-100.305h-54.846v54.846l127.728 127.728h54.846l244.092-244.092zM512 162.911c-192.485 0-349.091 156.606-349.091 349.091s156.606 349.091 349.091 349.091c192.485 0 349.091-156.606 349.091-349.091s-156.606-349.091-349.091-349.091v0zM512 938.669c-235.268 0-426.667-191.399-426.667-426.667s191.399-426.667 426.667-426.667c235.268 0 426.667 191.399 426.667 426.667s-191.399 426.667-426.667 426.667v0z"
        fill="#004896"
      />
    </svg>
    )}
  </div>

  {/* Error message */}
  {priceTouched1 && !priceIsValid && (
    <span style={{ color: "red", fontSize: "12px" }}>
      Price has a minimum value of 1000.
    </span>
  )}

  <hr
    style={{
      width: "calc(100% + 341px)",
      margin: "20px 0",
      position: "relative",
      left: "-30px",
      border: "none",
      marginTop: "30px",
      borderTop: "0.6px solid rgba(14,4,5,0.2)",
    }}
  />
</div>


            <div style={{}}>
              <h2 style={{ fontSize: "20px", position: "relative" }}>
                UPLOAD UPTO 20 PHOTOS
              </h2>

              {/* Hidden file input */}
              <input
                 type="file"
                 accept="image/*"
                 multiple
                 ref={fileInputRef}
                 style={{ display: "none" }}
                 onChange={handleFileChange2}
              />

              {/* Image upload grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  columnGap: "0px",
                  rowGap: "7px",
                  width: "450.5px",
                  padding: "0 10px",
                  marginTop: "6px",
                }}
              >
                {Array.from({ length: 20 }).map((_, index) => {
                  const isUploaded = !!images[index];
                  const firstEmptyIndex = images.findIndex((img) => !img);
                  const isNextToUpload = index === firstEmptyIndex;

                  return (
                    <div
                      key={index}
                      style={{ width: "100.5px", position: "relative" }}
                      draggable={isUploaded}
  onDragStart={() => handleDragStart(index)}
  onDrop={() => handleDrop(index)}
  onDragOver={handleDragOver}
                    >
                      <button
                        type="button"
                        title="Add Photo"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100.5px",
                          height: "100.5px",
                          border: isNextToUpload
                            ? "2px solid #002f34"
                            : "2px solid #aaa",
                          backgroundColor: "white",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          overflow: "hidden",
                          position: "relative",
                          padding: 0,
                        }}
                       
                        onClick={() => handleImageSelect(index)}
                      >
                        {isUploaded ? (
                          <>
                            <img
                              src={images[index]}
                              alt={`Preview ${index}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            {/* Overlay */}
                            <div
  style={{
    position: "absolute",
    bottom: "8px",
    left: "8px",
    right: "8px",
    height: "30%",
    backgroundColor: imageErrors[index] ? "red" : "#0078FA",
    color: "white",
    fontSize: "12px",
    fontWeight: "700",
    opacity: index !== firstValidImageIndex&&!imageErrors[index]? "0":"1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  }}
>
  {imageErrors[index] ? "ERROR" : index === firstValidImageIndex ? "COVER" : ""}
</div>



                            {/* Close icon */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(index);
                              }}
                              style={{
                                position: "absolute",
                                top: "0px",
                                right: "0px",
                                width: "24px",
                                height: "28px",

                                backgroundColor: "#8d9094",
                                color: "white",
                                fontSize: "16px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 2,
                                cursor: "pointer",
                                boxShadow: "0 0 2px rgba(0,0,0,0.4)",
                              }}
                            >
                              <svg
                                width="24px"
                                height="24px"
                                viewBox="0 0 1024 1024"
                                data-aut-id="icon"
                                class=""
                                fill="currentColor"
                              >
                                <path
                                  class="rui-o3KKi"
                                  d="M878.336 85.333l-366.336 366.315-366.336-366.315h-60.331v60.331l366.336 366.336-366.336 366.336v60.331h60.331l366.336-366.336 366.336 366.336h60.331v-60.331l-366.315-366.336 366.315-366.336v-60.331z"
                                ></path>
                              </svg>
                            </div>
                          </>
                        ) : (
                          <>
                            <svg
                              width="38px"
                              height="38px"
                              viewBox="0 0 1024 1024"
                              fill={isNextToUpload ? "#002f34" : "#ccc"}
                            >
                              <path d="M861.099 667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515 124.16l38.784 116.437h165.973l38.827 38.827v271.659l-38.827 38.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784 116.48h-183.083v426.923h426.667l38.784 38.357-38.784 39.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216 318.208c106.837 0 193.92 86.955 193.92 194.048 0 106.923-87.04 194.091-193.92 194.091s-193.963-87.168-193.963-194.091c0-107.093 87.083-194.048 193.963-194.048zM473.216 395.861c-64.213 0-116.352 52.181-116.352 116.395 0 64.256 52.139 116.437 116.352 116.437 64.171 0 116.352-52.181 116.352-116.437 0-64.213-52.181-116.437-116.352-116.437z"></path>
                            </svg>
                            {isNextToUpload && (
                              <span
                                style={{ fontSize: "14px", marginTop: "5px" }}
                              >
                                Add Photo
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
                {/* Error Box at the bottom if there's at least one invalid image */}
{imageErrors.some((error) => error) && (
  <div
    style={{
      backgroundColor: "rgba(255, 40, 0, .2)",
      border: "1px solid #ff2800",
      borderRadius: "5px",
      color: "#cc0000",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "416.5px",
      
    font:"16px",
    padding: "0px 16px 0px 24px",
   
    lineHeight: "2",
    marginTop: "8px",
      height:"56px",
    }}
  >
    <span style={{color:"#ff2800",   }}>Invalid image ratio. Max allowed: 21:9</span>
    <svg width="24px" height="24px" viewBox="0 0 1024 1024" data-aut-id="icon" class="" fill-rule="evenodd"><path class="rui-8kcgO" d="M512 85.333c235.264 0 426.667 191.403 426.667 426.667s-191.403 426.667-426.667 426.667c-235.264 0-426.667-191.403-426.667-426.667s191.403-426.667 426.667-426.667zM512 170.667c-188.203 0-341.333 153.131-341.333 341.333s153.131 341.333 341.333 341.333c188.203 0 341.333-153.131 341.333-341.333s-153.131-341.333-341.333-341.333zM512 640c23.552 0 42.667 19.115 42.667 42.667s-19.115 42.667-42.667 42.667c-23.552 0-42.667-19.115-42.667-42.667s19.115-42.667 42.667-42.667zM512 298.667l42.667 42.667v213.333l-42.667 42.667-42.667-42.667v-213.333l42.667-42.667z"></path></svg>
  </div>
)}

              </div>

              {/* Invisible backup file input */}
              <input
                accept="image/png, image/jpeg"
                type="file"
                multiple
                autoComplete="off"
                style={{
                  position: "absolute",
                  inset: "0px",
                  opacity: "1e-05",
                  pointerEvents: "none",
                }}
              />

{images.every((img) => !img) && (
  <p
    className="_35LX-"
    style={{ color: "red", fontSize: "14px", marginTop: "10px" }}
  >
    <span>This field is mandatory</span>
  </p>
)}

              <hr
                style={{
                  width: "calc(100% + 341px)",
                  margin: "20px 0",
                  position: "relative",
                  left: "-30px",
                  border: "none",
                  marginTop: "30px",
                  borderTop: "0.6px solid rgba(14,4,5,0.2)",
                }}
              />
            </div>

            <div className="_2J38C"></div>

            <div className="rui-jIycK rui-VAm0G" style={{ marginTop: "20px" }}>
              <div
                className="_3Z-2F rui-jIycK rui-J9Nqc rui-RVnVw rui-ZvM8x rui-VAm0G"
                data-aut-id="location"
              >
                <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
                  CONFIRM YOUR LOCATION
                </h2>
                <div data-aut-id="sphereLocationTabContainer">
                  <ul
                    role="tablist"
                    aria-label="Location selection tabs"
                    style={{
                      display: "flex",
                      padding: 0,
                      margin: 0,
                      listStyle: "none",
                      borderBottom: "2px solid #ccc",
                    }}
                  >
                    {tabs.map(({ id, label }) => {
                      const isActive = activeTab === id;
                      return (
                        <li
                          key={id}
                          style={{
                            flex: 1,
                            textAlign: "center",
                          }}
                        >
                          <div
                            role="tab"
                            tabIndex={0}
                            aria-selected={isActive}
                            onClick={() => setActiveTab(id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setActiveTab(id);
                              }
                            }}
                            style={{
                              padding: "12px 0",
                              cursor: "pointer",
                              fontWeight: isActive ? "bold" : "normal",
                              borderBottom: isActive
                                ? "5px solid #004896"
                                : "3px solid transparent",
                              userSelect: "none",
                              outline: "none",
                            }}
                          >
                            {label}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div
                    className="rui-8PlwS _2Z47H"
                    data-aut-id="sphereTabContentLocationSelector"
                  >
                    <div className="_1iLzt">
                      <div className="BM_Lq">
                        <div
                          className="rui-Bz2UM"
                          style={{ marginTop: "40px" }}
                        >
                          <label
                            htmlFor="State"
                            style={{ fontSize: "14px", lineHeight: "16px" }}
                          >
                            State *
                          </label>

                          <div className="rui-tLDMy rui-BoFpM rui-ou7AH">
                            <select
                              id="State"
                              name="State"
                              className="rui-2brBP rui-gEwdV"
                              data-aut-id="dd-state"
                              style={{
                                width: "432px",
                                height: "48px",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                fontSize: "16px",
                                border: stateFocused
                                  ? "3px solid #004896" // blue on focus
                                  : "1px solid #ccc", // normal grey
                              }}
                              value={formData.state}
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  state: e.target.value,
                                });
                              }}
                              onBlur={() => {
                                setStateFocused(false);
                                setStateTouched(true);
                              }}
                              onFocus={() => setStateFocused(true)}
                            >
                              <option value="unknown"></option>
                              <option value="2007598">
                                Andaman & Nicobar Islands
                              </option>
                              <option value="2001145">Andhra Pradesh</option>
                              <option value="2001146">Arunachal Pradesh</option>
                              <option value="2001147">Assam</option>
                              <option value="2001148">Bihar</option>
                              <option value="2001149">Chandigarh</option>
                              <option value="2001178">Chhattisgarh</option>
                              <option value="2001150">
                                Dadra & Nagar Haveli
                              </option>
                              <option value="2001151">Daman & Diu</option>
                              <option value="2001152">Delhi</option>
                              <option value="2001153">Goa</option>
                              <option value="2001154">Gujarat</option>
                              <option value="2001155">Haryana</option>
                              <option value="2001156">Himachal Pradesh</option>
                              <option value="2001157">Jammu & Kashmir</option>
                              <option value="2001158">Jharkhand</option>
                              <option value="2001159">Karnataka</option>
                              <option value="2001160">Kerala</option>
                              <option value="2001161">Lakshadweep</option>
                              <option value="2001162">Madhya Pradesh</option>
                              <option value="2001163">Maharashtra</option>
                              <option value="2001164">Manipur</option>
                              <option value="2001165">Meghalaya</option>
                              <option value="2001166">Mizoram</option>
                              <option value="2001167">Nagaland</option>
                              <option value="2001168">Odisha</option>
                              <option value="2001169">Pondicherry</option>
                              <option value="2001170">Punjab</option>
                              <option value="2001171">Rajasthan</option>
                              <option value="2001172">Sikkim</option>
                              <option value="2001173">Tamil Nadu</option>
                              <option value="2007599">Telangana</option>
                              <option value="2001174">Tripura</option>
                              <option value="2001176">Uttar Pradesh</option>
                              <option value="2001175">Uttaranchal</option>
                              <option value="2001177">West Bengal</option>
                            </select>
                          </div>

                          {/* Message only, no red border */}
                          {stateTouched &&
                            (!formData.state ||
                              formData.state === "unknown") && (
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "12px",
                                  marginTop: "6px",
                                  display: "block",
                                }}
                              >
                                This field is mandatory.
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rui-jIycK rui-VAm0G"
              style={{ width: "100%", position: "relative" }}
            >
              <div className="_2J38C"></div>
              <hr
                style={{
                  width: "calc(100% + 341px)",
                  margin: "20px 0",
                  position: "relative",
                  left: "-30px",
                  border: "none",
                  marginTop: "30px",
                  borderTop: "0.6px solid rgba(14,4,5,0.2)",
                }}
              />
              <div
                className="_3Z-2F rui-jIycK rui-J9Nqc rui-RVnVw rui-ZvM8x rui-VAm0G"
                data-aut-id="contact"
              >
                <h2>Review your details</h2>

                <div
                  className="rui-JOX86 rui-v22So rui-w0uzm rui-5xHoL"
                  style={{
                    display: "flex",
                    gap: "30px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Avatar Upload */}
                  <div className="_1UjBf">
                    <div
                      className="_2LCMK"
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "100px",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/jpg,image/jpeg,image/png"
                        style={{ display: "none" }}
                        id="avatarUpload"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="avatarUpload"
                        style={{ cursor: "pointer" }}
                      >
                        <figure
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            backgroundImage: `url(${avatar})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            border: "2px solid #ccc",
                            margin: "0px 0px",
                            position: "relative",
                            overflow: "hidden", // keeps everything inside the circle
                          }}
                        >
                          {/* Bottom overlay */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              width: "100%",
                              height: "35%",
                              background: "rgba(5, 5, 5, 0.61)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {/* Custom camera SVG */}
                            <svg
                              width="28px"
                              height="28px"
                              viewBox="0 0 1024 1024"
                              fill="#ccc"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M861.099 667.008v78.080h77.568v77.653h-77.568v77.141h-77.568v-77.184h-77.611v-77.611h77.611v-78.080h77.568zM617.515 124.16l38.784 116.437h165.973l38.827 38.827v271.659l-38.827 38.357-38.741-38.4v-232.832h-183.125l-38.784-116.48h-176.853l-38.784 116.48h-183.083v426.923h426.667l38.784 38.357-38.784 39.253h-465.493l-38.741-38.869v-504.491l38.784-38.827h165.973l38.827-116.437h288.597zM473.216 318.208c106.837 0 193.92 86.955 193.92 194.048 0 106.923-87.04 194.091-193.92 194.091s-193.963-87.168-193.963-194.091c0-107.093 87.083-194.048 193.963-194.048zM473.216 395.861c-64.213 0-116.352 52.181-116.352 116.395 0 64.256 52.139 116.437 116.352 116.437 64.171 0 116.352-52.181 116.352-116.437 0-64.213-52.181-116.437-116.352-116.437z"></path>
                            </svg>
                          </div>
                        </figure>
                      </label>
                    </div>
                  </div>

                  {/* Name and Price Input */}
                  <div
                    className="rui-C7oc3"
                    style={{ flexGrow: 1, maxWidth: "350px" }}
                  >
                    <div className="rui-Bz2UM" style={{ marginBottom: "15px" }}>
                      <label
                        htmlFor="name"
                        style={{
                          width: "100%",
                          fontSize: "14px",
                          lineHeight: "16px",
                          color: nameFocused
                            ? "#004896" // Blue when focused
                            : nameTouched && formData.name.trim() === ""
                            ? "red" // Red when touched and empty
                            : "#000", // Default black
                          fontWeight: (nameFocused || (nameTouched && formData.name.trim() === "")) ? "bold" : "initial",
                        }}
                      >
                        Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        maxLength={30}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        onFocus={() => setNameFocused(true)}
                        onBlur={() => {
                          setNameFocused(false);
                          setNameTouched(true);
                        }}
                        style={{
                          width: "316px",
                          padding: "10px",
                          fontSize: "14px",
                          height: "48px",
                          border: nameFocused
                            ? "3px solid #004896" // Blue on focus
                            : nameTouched && formData.name.trim() === ""
                            ? "3px solid red" // Red on error
                            : "1px solid #ccc", // Default
                          borderRadius: "4px",
                          boxSizing: "border-box",
                          marginTop: "5px",
                          outline: "none",
                        }}
                      />

                      {/* Red error message */}
                      {nameTouched && formData.name.trim() === "" && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "12px",
                            marginTop: "4px",
                            display: "block",
                          }}
                        >
                          This field is mandatory.
                        </span>
                      )}

                      {/* Character count */}
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-end",
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "5px",
                        }}
                      >
                        {formData.name.length} / 30
                      </div>
                    </div>
                  </div>

                  <div>
                    {" "}
                    <h3>Let's verify your account</h3>
                    <span>
                      We will send you a confirmation code by sms on the next
                      step.
                    </span>
                  </div>
                  <div>
  <div className="rui-C7oc3" style={{ flexGrow: 1, minWidth: "250px" }}>
    <div className="rui-Bz2UM" style={{ marginBottom: "15px" }}>
      <label
        htmlFor="phone"
        style={{
          width: "100%",
          fontSize: "14px",
          lineHeight: "16px",
          color: showPhoneError
            ? "red"
            : showPhoneSuccess
            ? "#004896"
            : "#000",
          fontWeight:showPhoneError? "bold":"initial",
        }}
      >
        Mobile Phone Number*
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: showPhoneError
            ? "3px solid red"
            : showPhoneSuccess
            ? "3px solid #004896"
            : "1px solid #ccc",
          borderRadius: "4px",
          marginTop: "5px",
          overflow: "hidden",
        }}
      >
        {/* +91 Prefix */}
        <span
          style={{
            padding: "10px",
            backgroundColor: "#fff",
            borderRight: "1px solid #ccc",
            fontSize: "14px",
            color: "#c0c1c4",
            height: "32px",
            lineHeight: "32px",
            whiteSpace: "nowrap",
          }}
        >
          +91
        </span>

        {/* Input field */}
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            setFormData({
              ...formData,
              phone: e.target.value,
            });
          }}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "14px",
            border: "none",
            width: "436px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {showPhoneError && (
        <span
          style={{
            color: "red",
            fontSize: "12px",
            marginTop: "4px",
            display: "block",
          }}
        >
          Please enter a valid 10-digit phone number.
        </span>
      )}
    </div>
  </div>
</div>

                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: "20px", position: "relative" }}>
              <hr
                style={{
                  width: "calc(100% + 341px)",
                  margin: "20px 0",

                  position: "relative",
                  left: "-30px",
                  border: "none",
                  marginTop: "30px",
                  borderTop: "0.6px solid rgba(14,4,5,0.2)",
                }}
              />
              <button
                type="submit"
                disabled={
                  !formData.type ||
                  !formData.superBuiltupArea ||
                  !formData.carpetArea ||
                  !formData.title ||
                  !formData.description ||
                  !formData.price ||
                  !formData.state ||
                  !formData.phone
                }
                style={{
                  padding: "10px 20px",
                  height: "50px",
                  backgroundColor:
                    formData.type &&
                    formData.superBuiltupArea &&
                    formData.carpetArea &&
                    formData.title &&
                    formData.description &&
                    formData.price &&
                    formData.state &&
                    formData.phone
                      ? "#004896"
                      : "#ccc",
                  color: "white",
                  marginTop: "14px",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "16px",
                  borderRadius: "4px",
                  cursor:
                    formData.type &&
                    formData.superBuiltupArea &&
                    formData.carpetArea &&
                    formData.title &&
                    formData.description &&
                    formData.price &&
                    formData.state &&
                    formData.phone
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                Post now
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );}

  export default Card;