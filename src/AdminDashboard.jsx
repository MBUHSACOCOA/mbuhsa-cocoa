import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");const [selectedOrder, setSelectedOrder] = useState(null);const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const totalQuantity = orders.reduce((total, order) => {
  const quantity = parseFloat(order.quantity) || 0;
  return total + quantity;
}, 0);

const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoggedIn(true);
    await fetchOrders();
    setLoading(false);
  }

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error loading orders:", error);
      setError("Unable to load orders.");
      return;
    }

    setOrders(data || []);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setOrders([]);
    setEmail("");
    setPassword("");
  }

  if (!loggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f7f2e9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
          }}
        ><div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  }}
>
  <div>
    <h1 style={{ margin: 0, fontSize: "32px" }}>MBUHSA COCOA</h1>
    <h2
      style={{
        margin: "5px 0 0",
        fontSize: "18px",
        fontWeight: "normal",
      }}
    >
      Admin Dashboard
    </h2>
  </div>

  <button
    onClick={async () => {
      await supabase.auth.signOut();
      window.location.href = "/admin";
    }}
    style={{
      padding: "10px 18px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Logout
  </button>
</div>
         
          <h2>Admin Login</h2>

          <p>Sign in to manage customer cocoa orders.</p>

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleLogin}>
            <label>Email</label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                margin: "8px 0 20px",
              }}
            />

            <label>Password</label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                margin: "8px 0 20px",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "#2b170c",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        background: "#f7f2e9",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
       <h1 style={{ margin: 0, fontSize: "32px" }}>MBUHSA COCOA</h1>
<h2 style={{ margin: "5px 0 0", fontSize: "18px", fontWeight: "normal" }}>
  Admin Dashboard
</h2>  
          
  <div style={{ marginTop: "25px", marginBottom: "25px" }}>
  <input
    type="text"
    placeholder="Search orders by name, email, phone, country or product..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      width: "100%",
      boxSizing: "border-box",
      padding: "14px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "15px",
    }}
  />
</div>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  }}
>
<div style={statCardStyle}>
  Total Orders<span style={statLabelStyle}></span>
  <strong style={statNumberStyle}>{orders.length}</strong>
</div>

<div style={statCardStyle}>
  Total Quantity
  <span style={statLabelStyle}>tons</span>
  <strong style={statNumberStyle}>{totalQuantity}</strong>
</div>

 <div style={statCardStyle}>
  <span style={statLabelStyle}>New Orders</span>
  <strong style={statNumberStyle}>
    {orders.filter((order) => (order.status || "New") === "New").length}
  </strong>
</div>
<div style={statCardStyle}>
  <span style={statLabelStyle}>Processing</span>
  <strong style={statNumberStyle}>
    {orders.filter((order) => order.status === "Processing").length}
  </strong>
</div><div style={statCardStyle}>
  <span style={statLabelStyle}>Shipped</span>
  <strong style={statNumberStyle}>
    {orders.filter((order) => order.status === "Shipped").length}
  </strong>
</div><div style={statCardStyle}>
  <span style={statLabelStyle}>Completed</span>
  <strong style={statNumberStyle}>
    {orders.filter((order) => order.status === "Completed").length}
  </strong>
</div>
  <div style={statCardStyle}>
    <span style={statLabelStyle}>Products Requested</span>
    <strong style={statNumberStyle}>
      {new Set(orders.map((order) => order.product)).size}
    </strong>
  </div>

  <div style={statCardStyle}>
    <span style={statLabelStyle}>Countries</span>
    <strong style={statNumberStyle}>
      {new Set(orders.map((order) => order.country)).size}
    </strong>
  </div>
</div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "12px 20px",
            background: "#2b170c",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}
{selectedOrder && (
  <div
    style={{
      background: "white",
      padding: "25px",
      borderRadius: "10px",
      marginBottom: "25px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    }}
  >
    <h2>Order Details</h2>

    <p><strong>Name:</strong> {selectedOrder.name}</p>
    <p><strong>Company:</strong> {selectedOrder.company}</p>
    <p><strong>Email:</strong> {selectedOrder.email}</p>
    <p><strong>Phone:</strong> {selectedOrder.phone}</p>
    <p><strong>Country:</strong> {selectedOrder.country}</p>
    <p><strong>Product:</strong> {selectedOrder.product}</p>
    <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
    <p><strong>Destination:</strong> {selectedOrder.destination}</p>
    <p><strong>Message:</strong> {selectedOrder.message}</p>
    <p><strong>Status:</strong> {selectedOrder.status || "New"}</p>

    <button
      onClick={() => setSelectedOrder(null)}
      style={{
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Close
    </button>
  </div>
)}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
      <div style={{ overflowX: "auto" }}> 
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
            }}
          >
            <thead><th style={cellStyle}>Order #</th>
              <tr><th style={cellStyle}>Name</th>
                
                <th style={cellStyle}>Company</th>
                <th style={cellStyle}>Email</th>
                <th style={cellStyle}>Phone</th>
                <th style={cellStyle}>Country</th>
                <th style={cellStyle}>Product</th>
                <th style={cellStyle}>Quantity</th>
                <th style={cellStyle}>Destination</th>
                <th style={cellStyle}>Message</th> <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Action</th></tr>
            </thead>

            <tbody>
  {orders
    .filter((order) => {
      const search = searchTerm.toLowerCase();

      return (
        String(order.name || "").toLowerCase().includes(search) ||
        String(order.email || "").toLowerCase().includes(search) ||
        String(order.phone || "").toLowerCase().includes(search) ||
        String(order.country || "").toLowerCase().includes(search) ||
        String(order.product || "").toLowerCase().includes(search)
      );
    })
    .map((order, index) => (
      <tr key={order.id}>
        <td style={cellStyle}>{index + 1}</td><td style={cellStyle}>{order.name}</td>
        <td style={cellStyle}>{order.company}</td>
        <td style={cellStyle}>{order.email}</td>
        <td style={cellStyle}>{order.phone}</td>
        <td style={cellStyle}>{order.country}</td>
        <td style={cellStyle}>{order.product}</td>
        <td style={cellStyle}>{order.quantity}</td>
        <td style={cellStyle}>{order.destination}</td>
        <td style={cellStyle}>{order.message}</td>
<td style={cellStyle}>
  {order.created_at
    ? new Date(order.created_at).toLocaleString()
    : "—"}
</td>
        <td style={cellStyle}>
          <select
            value={order.status || "New"}
            onChange={async (e) => {
              const newStatus = e.target.value;

              const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", order.id);

              if (error) {
                console.error("Status update error:", error);
                alert("Unable to update order status.");
                return;
              }

              setOrders((currentOrders) =>
                currentOrders.map((item) =>
                  item.id === order.id
                    ? { ...item, status: newStatus }
                    : item
                )
              );
            }}
            style={{
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontWeight: "bold",
  cursor: "pointer",
  background:
    (order.status || "New") === "New"
      ? "#f3f4f6"
      : (order.status || "New") === "Processing"
      ? "#fff7ed"
      : (order.status || "New") === "Shipped"
      ? "#eff6ff"
      : "#ecfdf5",
}}
          >
            <option value="New">New</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
          </select>
        </td>

        <td style={cellStyle}>
          <button
            onClick={() => setSelectedOrder(order)}
            style={{
              padding: "8px 12px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            View
          </button>
        </td>
      </tr>
    ))}
</tbody>
          </table>
        </div>
      )}

      <button
        onClick={fetchOrders}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          cursor: "pointer",
        }}
      >
        Refresh Orders
      </button>
    </div>
  );
}

const cellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};const statCardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
};

const statLabelStyle = {
  display: "block",
  fontSize: "14px",
  marginBottom: "10px",
  color: "#666",
};

const statNumberStyle = {
  display: "block",
  fontSize: "30px",
  fontWeight: "bold",
};