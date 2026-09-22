import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import AdminDashboard from "./AdminDashboard";
function App() {
     const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); const [adminMode, setAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);const [showOrderForm, setShowOrderForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
const [orderNumber, setOrderNumber] = useState("");
 const [trackingNumber, setTrackingNumber] = useState(""); 
const [trackingEmail, setTrackingEmail] = useState("");const [trackedOrder, setTrackedOrder] = useState(null);
const [trackingLoading, setTrackingLoading] = useState(false); const [formData, setFormData] = useState({
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  product: "",
  quantity: "",
  destination: "",
  message: "",
});

 const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

  const handleSubmit = async (e) => {
  e.preventDefault();

const newOrderNumber = `MBU-${new Date().getFullYear()}-${Date.now()}`;

const { error } = await supabase
  .from("orders")
  .insert([
    {
      ...formData,
      order_number: newOrderNumber,
    },
  ]);

  if (error) {
    console.error("Order submission error:", error);
    alert("Order error: " + error.message);
    return;
  }

  setOrderNumber(newOrderNumber);
setSubmitted(true);
};

  const openOrderForm = () => {
    setShowOrderForm(true);
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
const handleTrackOrder = async () => {
 if (!trackingNumber.trim()) {
  alert("Please enter your order number.");
  return;
}

if (!trackingEmail.trim()) {
  alert("Please enter your email address.");
  return;
}

  setTrackingLoading(true);
  setTrackedOrder(null);

 const { data, error } = await supabase
  .from("orders")
  .select("*")
.eq("order_number", trackingNumber.trim())
.eq("email", trackingEmail.trim())
.maybeSingle();

  setTrackingLoading(false);

  if (error) {
    console.error("Tracking error:", error);
    alert("Unable to track this order right now.");
    return;
  }

  if (!data) {
    alert("Order not found. Please check your order number.");
    return;
  }

 setTrackedOrder(data);

};
  const closeOrderForm = () => {
    setShowOrderForm(false);
    setSubmitted(false);
  };

  return (
      <>
        {showSplash ? (
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#211208",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
           src="/images/mbuhsa-symbol.png"
            alt="MBUHSA COCOA"
            style={{
              width: "280px",
              maxWidth: "80%",
              height: "auto",
            }}
          />
        </div>
      ) : ( <div style={styles.page}>

      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <img
  src="/images/mbuhsa-logo(1).png"
  alt="MBUHSA COCOA"
  style={{
    width: "180px",
    height: "auto",
    display: "block",
  }}
/>
        </div>

        <nav style={styles.nav}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#cocoa" style={styles.navLink}>Our Cocoa</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
       <a
  href="#track"
  style={{
    ...styles.navLink,
    fontWeight: "bold",
    color: "#9a6d2d",
  }}
>
  Track Order
</a>

                <button
          onClick={openOrderForm}
          style={styles.button}
        >
          Order Cocoa
        </button>
        </nav>
      </header>
<button
onClick={() => window.location.href = "/admin"}
  style={styles.adminButton}
>
  Admin
</button>
      {/* ORDER FORM */}
      {showOrderForm && (
        <section style={styles.orderPage}>
          <div style={styles.orderContainer}>

            <button
              onClick={closeOrderForm}
              style={styles.backButton}
            >
              ← Back to Website
            </button>

            {!submitted ? (
              <>
                <p style={styles.label}></p>

                <h1 style={styles.orderTitle}>
                  Request Cocoa Supply
                </h1>

                <p style={styles.orderIntro}>
                  Tell us about the cocoa you need. Our team will
                  review your request and contact you about availability,
                  quantity and pricing.
                </p>

                <form onSubmit={handleSubmit}>

                  <div style={styles.formGrid}>

                    <div>
                      <label>Full Name *</label>
                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        style={styles.input}
                      />
                    </div>

                    <div>
                      <label>Company Name</label>
                      <input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company name"
                        style={styles.input}
                      />
                    </div>

                    <div>
                      <label>Email Address *</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        style={styles.input}
                      />
                    </div>

                    <div>
                      <label>Phone / WhatsApp *</label>
                      <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+234..."
                        style={styles.input}
                      />
                    </div>

                    <div>
                      <label>Country *</label>
                      <input
                        required
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Your country"
                        style={styles.input}
                      />
                    </div>

                    <div>
                      <label>Cocoa Product *</label>
                      <select
                        required
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        style={styles.input}
                      >
                        <option value="">Select product</option>
                        <option value="Premium Cocoa Beans">
                          Premium Cocoa Beans
                        </option>
                        <option value="Bulk Cocoa Supply">
                          Bulk Cocoa Supply
                        </option>
                        <option value="Export Cocoa">
                          Export Cocoa
                        </option>
                      </select>
                    </div>

                    <div>
                      <label>Quantity Required *</label>
                      <input
                        required
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="e.g. 5 metric tons"
                        style={styles.input}
                      />
                    </div>

                    <div>
                      <label>Delivery / Shipping Location</label>
                      <input
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="City, country or port"
                        style={styles.input}
                      />
                    </div>

                  </div>

                  <label>Additional Requirements</label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us anything else about your cocoa requirements..."
                    rows="6"
                    style={styles.textarea}
                  />

                  <button
                    type="submit"
                    style={styles.submitButton}
                  >
                    Submit Cocoa Request
                  </button>

                </form>
              </>
            ) : (
              <div style={styles.successBox}>
                <div style={styles.successIcon}>✓</div>

                <h1>Request Received</h1>
<p>
  <strong>Your Order Number:</strong>
</p>

<p
  style={{
    fontSize: "22px",
    fontWeight: "bold",
    color: "#9a6d2d",
    letterSpacing: "1px",
  }}
>
  {orderNumber}
</p>
                <p>
                  Thank you, {formData.name}.
                </p>

              
              
                <button
                  onClick={closeOrderForm}
                  style={styles.button}
                >
                  Return to Website
                </button>
              </div>
            )}

          </div>
        </section>
      )}

      {/* MAIN WEBSITE */}
      {!showOrderForm && (
        <>
          {/* HERO */}
          <section id="home" style={styles.hero}>
            <div style={styles.heroContent}>

              <p style={styles.eyebrow}>
  PREMIUM AFRICAN COCOA • FARM TO GLOBAL MARKET
</p>

              <h1 style={styles.heroTitle}>
  Premium African Cocoa
  <br />
  <span>For Global Markets.</span>
</h1>

              <p style={styles.heroText}>
  MBUHSA COCOA connects quality African cocoa with trusted traders, processors, manufacturers and international buyers, building reliable supply from farm to global market.
</p>
              <button
                onClick={openOrderForm}
                style={styles.heroButton}
              >
                Order Cocoa Beans
              </button>

            </div>
          </section>

          {/* ABOUT */}
          <section id="about" style={styles.lightSection}>

            <p style={styles.label}>
              ABOUT MBUHSA COCOA
            </p>

           <h2 style={styles.sectionTitle}>
               Quality Cocoa.
              <br />
              Trusted Partnerships.
            </h2>

            <p style={styles.sectionText}>
             MBUHSA COCOA is building a trusted cocoa supply business focused on sourcing, buying, trading, processing and exporting premium African cocoa for local and international markets.
            </p>

          </section>

          {/* PRODUCTS */}
          <section id="cocoa" style={styles.productsSection}>

            <p style={styles.label}>
              OUR PRODUCTS
            </p>

            <h2 style={styles.sectionTitle}>
  Cocoa Supply For Global Buyers
</h2>

            <div style={styles.productGrid}>

              <Product
                title="Premium Cocoa Beans"
                text="Premium cocoa beans sourced with a focus on quality, consistency and reliable supply for buyers and processors."
                onOrder={openOrderForm}
              />

              <Product
                title="Bulk Cocoa Supply"
                text="Reliable bulk cocoa supply for traders, manufacturers and commercial buyers seeking consistent sourcing."
                onOrder={openOrderForm}
              />

              <Product
                title="Export Cocoa"
                text="Export-focused cocoa supply designed to connect African producers with international markets and buyers."
                onOrder={openOrderForm}
              />

            </div>

          </section>

          {/* ORDER CTA */}
          <section style={styles.darkSection}>

            <p style={styles.goldLabel}>
              COCOA ORDERS
            </p>

            <h2 style={styles.darkTitle}>
  Ready To Source Premium Cocoa?
</h2>

           Tell us what you need and MBUHSA COCOA can discuss cocoa availability, quantity, quality requirements, destination and pricing with you.

            <button
              onClick={openOrderForm}
              style={styles.button}
            >
             Request A Cocoa Quote
            </button>

          </section>

          {/* CONTACT */}
          <section id="contact" style={styles.contact}>

            <h2>Let's Build Something Great Together.</h2>

            <p>
              Interested in buying, supplying or partnering
              with MBUHSA COCOA?
            </p>

            <p style={styles.goldText}>
We work with cocoa buyers, traders, processors and international partners. Contact MBUHSA COCOA to discuss cocoa supply, bulk orders, export opportunities and strategic partnerships.
            </p>
        <a
  href="https://wa.me/2348131974977?text=Hello%20MBUHSA%20COCOA%2C%20I%20am%20interested%20in%20your%20cocoa%20supply."
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: "inline-block",
    marginTop: "25px",
    padding: "15px 28px",
    backgroundColor: "#25D366",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    borderRadius: "6px",
  }}
>
  WhatsApp MBUHSA COCOA
</a>  </section>

          {/* TRACK ORDER */}
          <section id="track" style={styles.contact}>

            <h2
  style={{
    fontSize: "42px",
    marginBottom: "15px",
    color: "#d4a64a",
    letterSpacing: "1px",
  }}
>
  Track Your MBUHSA Order
</h2>

            <p
  style={{
    maxWidth: "600px",
    margin: "0 auto 25px",
    color: "#d8cbbb",
    fontSize: "17px",
    lineHeight: "1.7",
  }}
>
  Enter your MBUHSA order number below to securely check
  your cocoa order status and shipment progress.
</p>

           <input
  type="text"
  placeholder="Enter Order Number"
  value={trackingNumber}
  onChange={(e) => setTrackingNumber(e.target.value)}
             style={{
  width: "100%",
  maxWidth: "500px",
  padding: "16px 18px",
  fontSize: "16px",
  border: "2px solid #9a6d2d",
  borderRadius: "8px",
  marginTop: "15px",
  boxSizing: "border-box",
  backgroundColor: "white",
  color: "#2b170c",
  outline: "none",
}}
            />
<input
  type="email"
  placeholder="Enter Email Address"
  value={trackingEmail}
  onChange={(e) => setTrackingEmail(e.target.value)}
  style={{
    width: "100%",
    maxWidth: "500px",
    padding: "16px 18px",
    fontSize: "16px",
    border: "2px solid #9a6d2d",
    borderRadius: "8px",
    marginTop: "12px",
    boxSizing: "border-box",
    backgroundColor: "white",
    color: "#2b170c",
    outline: "none",
  }}
/>
            <button
  onClick={handleTrackOrder}
  style={{
  marginTop: "18px",
  padding: "14px 30px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  backgroundColor: "#d4a64a",
  color: "#211208",
  boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
}}
            >
              Track Order
            </button>
{trackingLoading && (
  <p style={{ marginTop: "20px" }}>
    Checking your order...
  </p>
)}

{trackedOrder && (
  <div
    style={{
      marginTop: "30px",
      padding: "30px",
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
      background: "white",
      borderRadius: "12px",
      textAlign: "left",
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    }}
  >
<div
  style={{
    borderBottom: "2px solid #d4a64a",
    paddingBottom: "15px",
    marginBottom: "20px",
  }}
>
  <p
    style={{
      margin: 0,
      color: "#9a6d2d",
      fontSize: "13px",
      fontWeight: "bold",
      letterSpacing: "2px",
    }}
  >
    MBUHSA COCOA
  </p>

  <h3
    style={{
    margin: "6px 0 0",
      fontSize: "26px",
      color: "#2b170c",
    }}
  >
    Order Details
  </h3>
</div>

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "8px",
        margin: "30px 0",
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    margin: "30px 0",
    gap: "5px",
  }}
>
  {["New", "Processing", "Shipped", "Completed"].map((step, index) => {
    const statuses = ["New", "Processing", "Shipped", "Completed"];
    const currentIndex = statuses.indexOf(
      trackedOrder.status || "New"
    );
    const isActive = index <= currentIndex;

    return (
      <div
        key={step}
        style={{
          flex: 1,
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            lineHeight: "36px",
            borderRadius: "50%",
            margin: "0 auto 8px",
            backgroundColor:
  index < currentIndex
    ? "#9a6d2d"
    : index === currentIndex
    ? "#d4a64a"
    : "#e5e7eb",
            color: isActive ? "white" : "#6b7280",
            fontWeight: "bold",
            position: "relative",
            zIndex: 2,
          }}
        >
         {index < currentIndex ? "✓" : index + 1} 
        </div>

        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: isActive ? "#9a6d2d" : "#9ca3af",
          }}
        >
          {step}
        </div>

        {index < 3 && (
          <div
            style={{
              position: "absolute",
              top: "18px",
              left: "50%",
              width: "100%",
              height: "3px",
              backgroundColor:
                index < currentIndex ? "#9a6d2d" : "#e5e7eb",
              zIndex: 1,
            }}
          />
        )}
      </div>
    );
  })}
</div>
   
   </div>     
       

    <div
  style={{
    borderTop: "1px solid #eee",
    paddingTop: "20px",
    color: "#2b170c",
  }}
>
      <div
  style={{
    backgroundColor: "#f7f2e9",
    padding: "15px 18px",
    borderRadius: "8px",
    marginBottom: "20px",
  }}
>
  <p
    style={{
      margin: 0,
      fontSize: "13px",
      color: "#9a6d2d",
      fontWeight: "bold",
      letterSpacing: "1px",
    }}
  >
    ORDER NUMBER
  </p>

  <p
    style={{
      margin: "6px 0 0",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#2b170c",
      letterSpacing: "1px",
    }}
  >
    {trackedOrder.order_number}
  </p>
</div>
  <div
  style={{
    display: "grid",
    gap: "12px",
    marginBottom: "20px",
  }}
>
  <div
    style={{
      padding: "12px 0",
      borderBottom: "1px solid #eee",
    }}
  >
    <strong>Customer</strong>
    <div style={{ marginTop: "4px", color: "#66564a" }}>
      {trackedOrder.name}
    </div>
  </div>

  <div
    style={{
      padding: "12px 0",
      borderBottom: "1px solid #eee",
    }}
  >
    <strong>Product</strong>
    <div style={{ marginTop: "4px", color: "#66564a" }}>
      {trackedOrder.product}
    </div>
  </div>

  <div
    style={{
      padding: "12px 0",
      borderBottom: "1px solid #eee",
    }}
  >
    <strong>Quantity</strong>
    <div style={{ marginTop: "4px", color: "#66564a" }}>
      {trackedOrder.quantity} tons
    </div>
  </div>
</div>   
 <div
  style={{
    marginTop: "20px",
    padding: "18px",
    backgroundColor: "#f7f2e9",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  }}
>
  <div>
    <div
      style={{
        fontSize: "13px",
        color: "#9a6d2d",
        fontWeight: "bold",
        letterSpacing: "1px",
      }}
    >
      CURRENT STATUS
    </div>

    <div
      style={{
        marginTop: "5px",
        fontSize: "17px",
        fontWeight: "bold",
        color: "#2b170c",
      }}
    >
      {trackedOrder.status || "New"}
    </div>
  </div>

  <span
    style={{
      padding: "7px 14px",
      borderRadius: "20px",
      fontWeight: "bold",
      background:
        (trackedOrder.status || "New") === "New"
          ? "#e5e7eb"
          : (trackedOrder.status || "New") === "Processing"
          ? "#ffedd5"
          : (trackedOrder.status || "New") === "Shipped"
          ? "#dbeafe"
          : "#d1fae5",
      color:
        (trackedOrder.status || "New") === "New"
          ? "#374151"
          : (trackedOrder.status || "New") === "Processing"
          ? "#c2410c"
          : (trackedOrder.status || "New") === "Shipped"
          ? "#1d4ed8"
          : "#047857",
    }}
  >
    {trackedOrder.status || "New"}
  </span>
</div>     

      <p>
        <strong>Order Date:</strong>{" "}
        {trackedOrder.created_at
          ? new Date(trackedOrder.created_at).toLocaleString()
          : "—"}
      </p>
    </div>
  </div>
)}
          </section>

          {/* FOOTER */}
                  <footer style={styles.footer}>
          
            © 2026 MBUHSA COCOA — Quality Cocoa. Global Vision.
          </footer>
        </>
      )}

    </div>
    )}
  </>
  );
}

function Product({ title, text, onOrder }) {
  return (
 
    <div style={styles.productCard}>

      <div style={styles.productIcon}>
        🌱
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <button
        onClick={onOrder}
        style={styles.productButton}
      >
        Request Supply →
      </button>

    </div>
  );
}

const styles = {

  page: {
    margin: 0,
    fontFamily: "Arial, sans-serif",
    color: "#2b170c",
    backgroundColor: "#f7f2e9",
  },

 header: {
  backgroundColor: "#211208",
  color: "white",
  padding: "15px 5%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px",
},

  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "3px",
  },

  logoSub: {
    color: "#d4a64a",
    letterSpacing: "5px",
    fontSize: "12px",
  },

  nav: {
    display: "flex",
    gap: "25px",
    flexWrap: "wrap",
  },

  navLink: {
    color: "white",
    textDecoration: "none",
  },

  button: {
    backgroundColor: "#d4a64a",
    color: "#211208",
    border: "none",
    padding: "14px 24px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "3px",
  },

  hero: {
   background:
  'linear-gradient(rgba(33,18,8,0.72), rgba(33,18,8,0.72)), url("/images/mbuhsa-hero.png") center/cover no-repeat',
    color: "white",
    padding: "90px 5%",
    minHeight: "500px",
    display: "flex",
    alignItems: "center",
  },

  heroContent: {
  maxWidth: "750px",
  textShadow: "0 3px 12px rgba(0, 0, 0, 0.65)",
},

  eyebrow: {
    color: "#d4a64a",
    letterSpacing: "4px",
    fontWeight: "bold",
  },

  heroTitle: {
   fontSize: "clamp(38px, 7vw, 80px)",
    lineHeight: "1.05",
    margin: "20px 0",
  },

  heroText: {
    color: "#e5d8c9",
    fontSize: "clamp(16px, 2vw, 18px)",
    lineHeight: "1.8",
    maxWidth: "650px",
  },
heroButton: {
  marginTop: "25px",
 padding: "15px 26px",
  backgroundColor: "#d4a64a",
  color: "#211208",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
},
 

  lightSection: {
    backgroundColor: "#f7f2e9",
   padding: "70px 5%",
    textAlign: "center",
  },

  label: {
    color: "#9a6d2d",
    letterSpacing: "3px",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: "clamp(32px, 6vw, 45px)",
    color: "#2b170c",
  },

  sectionText: {
    maxWidth: "750px",
    margin: "auto",
    color: "#66564a",
   fontSize: "clamp(15px, 2vw, 17px)",
    lineHeight: "1.8",
  },

  productsSection: {
   padding: "70px 5%",
    backgroundColor: "#eadfce",
    textAlign: "center",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    maxWidth: "1100px",
    margin: "50px auto",
  },

  productCard: {
    backgroundColor: "white",
    padding: "28px",
    textAlign: "left",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },

  productIcon: {
    fontSize: "45px",
  },

  productButton: {
    border: "none",
    background: "none",
    color: "#9a6d2d",
    fontWeight: "bold",
    cursor: "pointer",
    padding: 0,
  },

  darkSection: {
    backgroundColor: "#2b170c",
    color: "white",
    padding: "70px 5%",
    textAlign: "center",
  },

  goldLabel: {
    color: "#d4a64a",
    letterSpacing: "3px",
    fontWeight: "bold",
  },

  darkTitle: {
    fontSize: "45px",
  },

  darkText: {
    maxWidth: "650px",
    margin: "20px auto",
    color: "#ddcec0",
    lineHeight: "1.8",
  },

  contact: {
    backgroundColor: "#211208",
    color: "white",
    padding: "65px 5%",
    textAlign: "center",
  },

  goldText: {
    color: "#d4a64a",
  },

  footer: {
    backgroundColor: "#120903",
    color: "#bca99a",
    padding: "30px 7%",
    textAlign: "center",
  },

  orderPage: {
    minHeight: "100vh",
    backgroundColor: "#f7f2e9",
    padding: "35px 5%",
  },

  orderContainer: {
    maxWidth: "950px",
    margin: "auto",
    backgroundColor: "white",
    padding: "30px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
  },

  backButton: {
    border: "none",
    background: "none",
    color: "#9a6d2d",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "30px",
  },

  orderTitle: {
    fontSize: "50px",
    color: "#2b170c",
    marginBottom: "15px",
  },

  orderIntro: {
    color: "#66564a",
    lineHeight: "1.7",
    maxWidth: "700px",
    marginBottom: "40px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    marginTop: "8px",
    border: "1px solid #d8cbbb",
    borderRadius: "3px",
    fontSize: "15px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    marginTop: "8px",
    marginBottom: "25px",
    border: "1px solid #d8cbbb",
    borderRadius: "3px",
    fontSize: "15px",
    resize: "vertical",
  },

  submitButton: {
    backgroundColor: "#2b170c",
    color: "white",
    border: "none",
    padding: "16px 28px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },

  successBox: {
    textAlign: "center",
    padding: "60px 20px",
  },

  successIcon: {
    width: "70px",
    height: "70px",
    margin: "auto",
    borderRadius: "50%",
    backgroundColor: "#d4a64a",
    color: "#211208",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "35px",
    fontWeight: "bold",
  },
};

export default App;
