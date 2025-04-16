import React, { useEffect, useState } from "react";
import axios from "axios";
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line } from "recharts";
import { BarChart, Bar, Legend } from "recharts";
import "../Style/Stocks.css";

function Stocks() {
    const [stockDetails, setStockDetails] = useState({ total_stock: 0, low_stock_alert: "" });
    const [sareeTypes, setSareeTypes] = useState([]); // Stores saree types
    const [selectedSaree, setSelectedSaree] = useState("EMBOSE"); // Default saree type
    const [sareeData, setSareeData] = useState({ totalSold: 0, totalRevenue: 0, currentStock: 0 });
    const [salesTrend, setSalesTrend] = useState([]); // Stores sales trend data

    // Fetch stock summary (Total stock & low stock alert)
    useEffect(() => {
        fetch("http://127.0.0.1:5000/stock-summary")
            .then((res) => res.json())
            .then((data) => setStockDetails(data))
            .catch((err) => console.error("Error fetching stock summary:", err));
    }, []);

    // Fetch saree types from stock table
    useEffect(() => {
        fetch("http://127.0.0.1:5000/saree-types")
            .then(response => response.json())
            .then(data => setSareeTypes(data))
            .catch(error => console.error("Error fetching saree types:", error));
    }, []);

    // Fetch sales and stock details for the selected saree type
    useEffect(() => {
        if (!selectedSaree) return;

        fetch(`http://127.0.0.1:5000/sales-stock?sareeType=${selectedSaree}`)
            .then((res) => res.json())
            .then((data) => setSareeData(data))
            .catch((err) => console.error("Error fetching saree data:", err));
    }, [selectedSaree]);

    // Fetch sales trend data for the selected saree type
    useEffect(() => {
        if (!selectedSaree) return;

        fetch(`http://127.0.0.1:5000/sales-trend?sareeType=${selectedSaree}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Sales Trend Data:", data);
                setSalesTrend(data);
            })
            .catch((err) => console.error("Error fetching sales trend:", err));
    }, [selectedSaree]);

    const minY = Math.min(...salesTrend.map(d => parseInt(d.total_sold, 10))) - 5;  // Subtract for padding
    const maxY = Math.max(...salesTrend.map(d => parseInt(d.total_sold, 10))) + 5;

    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        if (!selectedSaree) return; // Prevent making requests if there's no sareeType

        axios.get("http://127.0.0.1:5000/api/weekly-sales", {
            params: { sareeType: selectedSaree }
        })
            .then(response => {
                console.log("API Response:", response.data);

                const formattedData = response.data.reduce((acc, curr) => {
                    const weekIndex = `Week ${curr.week}`;
                    if (!acc[weekIndex]) acc[weekIndex] = { week: weekIndex };
                    acc[weekIndex][curr.saree_type] = curr.total_sold;
                    return acc;
                }, {});

                setSalesData(Object.values(formattedData));
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                if (error.response) console.error("Server Error:", error.response.data);
            });
    }, [selectedSaree]); // Depend on selectedSaree to re-fetch when it changes

    const colorMap = {
        "EMBOSE": "#4CAF50",
        "COTTON": "#FF8931",
        "SOFT SILK": "#F94144",
        "OTHERS": "#ff7300"
    };

    return (
        <div className="rightsideCont">
            <div className="upperDiv">
                <div className="upInsideDiv">
                    <div className="lblInside">Total no. of Stock</div>
                    <div className="details">{stockDetails.total_stock}</div>
                </div>
                <div className="upInsideDiv">
                    <div className="lblInside" style={{ color: 'red' }}>Low Stock Alert!</div>
                    <div className="details">{stockDetails.low_stock_alert}</div>
                </div>

                <div className="upInsideDiv">
                    <label className="lblInside">Select Saree Type:</label>
                    <select
                        className="dropdown"
                        value={selectedSaree}
                        onChange={(e) => setSelectedSaree(e.target.value)}
                    >
                        {sareeTypes.length > 0 ? (
                            sareeTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))
                        ) : (
                            <option>Loading saree types...</option>
                        )}
                    </select>
                </div>
            </div>

            {/* Display Sales & Stock Details of Selected Saree */}

            <div className="midDiv">
                <h3 style={{ marginBottom: "20px", textAlign: 'left' }}>Monthly Update</h3>
                <div className="graph">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesTrend}>
                            <XAxis dataKey="month" stroke="black" />
                            <YAxis stroke="black" domain={[minY, maxY]} />
                            <Tooltip />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Line type="monotone" dataKey="total_sold" stroke="blue" strokeWidth={3} dot={{ fill: "red" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Graph Display */}
            <div className="botDiv">
                <div className="botInsideDiv">
                    <h3 style={{ margin: "20px", textAlign: 'left' }}>Sales Trend for {selectedSaree}</h3>

                    <h3 style={{ textAlign: 'center' }}>Weekly Sales Chart</h3>
                    <ResponsiveContainer width="100%" height={340}>
                        <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {salesData.length > 0 &&
                                Object.keys(salesData[0]).filter(key => key !== "week").map((key, index) => (
                                    <Bar key={index} dataKey={key} fill={colorMap[key] || "#ccc"} barSize={50} radius={[10, 10, 0, 0]} />
                                ))
                            }
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="botInsideDiv" style={{ backgroundColor: 'black' }}>
                </div>
            </div>
        </div>
    );
}

export default Stocks;
