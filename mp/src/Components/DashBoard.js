import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/DashBoard.css";
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from "recharts";
import { LuLayoutDashboard, LuBox } from "react-icons/lu";
import { BiReceipt, BiError } from "react-icons/bi";
import { FaEdit, FaChartLine, FaCommentDots } from "react-icons/fa";
import kiot from "../Images/kiot.jpeg";

function DashBoard() {
  const [financialData, setFinancialData] = useState({});
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [financialRes, salesRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/financial-summary"),
          axios.get("http://localhost:5000/sales-data"),
          axios.get("http://localhost:5000/recent-orders"),
        ]);

        setFinancialData(financialRes.data);
        setSalesData(salesRes.data);
        setRecentOrders(ordersRes.data);
      } catch (err) {
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="outerContainer">
      {/* Sidebar Navigation */}
      <div className="navBar">
        <div className="kiotBar">
          <img className="kiotimg" src={kiot} alt="Logo" />
        </div>
        <button className="navButtons">
          <div className="Dboard">
            <LuLayoutDashboard className="img" />
            <div>Dashboard</div>
          </div>
        </button>
        <button className="navButtons">
          <div className="Dboard">
            <LuBox className="img" />
            <div>Stock</div>
          </div>
        </button>
        <button className="navButtons">
          <div className="Dboard">
            <BiReceipt className="img" />
            <div>Bills</div>
          </div>
        </button>
        <button className="navButtons">
          <div className="Dboard">
            <FaEdit className="img" />
            <div>Edit</div>
          </div>
        </button>
        <button className="navButtons">
          <div className="Dboard">
            <FaChartLine className="img" />
            <div>Predict</div>
          </div>
        </button>
        <button className="navButtons">
          <div className="Dboard">
            <FaCommentDots className="img" />
            <div>Chat Bot</div>
          </div>
        </button>
        <button className="navButtons">
          <div className="Dboard">
            <BiError className="img" />
            <div>Report</div>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="rightsideCont">
        <div className="profile">
          <div className="profileCont">
            <div className="profileImg"></div>
            <div className="profileName">Profile</div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="upperDB">
          <div className="leftChild"></div>
          <div className="chart-container">
            <h3 style={{marginBottom :"20px"}}>Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={600} height={200} data={salesData}>
                    <XAxis 
                        dataKey="month" 
                        stroke="black" 
                        tick={{ fontWeight: 'bold', fill: 'rgba(65, 65, 65, 0.6)' }} 
                    />
                    <YAxis 
                        stroke="black" 
                        tick={{ fontWeight: 'bold', fill: 'rgba(65, 65, 65, 0.6)' }} 
                    />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    {/* Bar Chart for Monthly Sales */}
                    <Bar dataKey="sales_amount" fill="rgba(0, 53, 128, 0.6)" barSize={40} />

                    {/* Line Chart for Sales Trend */}
                    <Line type="monotone" dataKey="sales_amount" stroke="rgba(11, 168, 32, 0.95)"  strokeWidth={3} dot={{ fill: 'red' }} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lowerDB">
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.order_number}</td>
                    <td>{order.order_date}</td>
                    <td>{order.product}</td>
                    <td>{order.customer_name}</td>
                    <td>${order.total_amount}</td>
                    <td>{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No recent orders available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
