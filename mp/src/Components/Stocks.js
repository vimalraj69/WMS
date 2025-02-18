import React, { useEffect, useState } from "react";
import "../Style/Stocks.css";

function Stocks() {
    const [stockDetails, setStockDetails] = useState({ total_stock: 0, low_stock_alert: "" });
    const [sareeTypes, setSareeTypes] = useState([]); // Stores saree types
    const [selectedSaree, setSelectedSaree] = useState("EMBOSE"); // Default saree type
    const [sareeData, setSareeData] = useState({ totalSold: 0, totalRevenue: 0, currentStock: 0 });

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
            .then(data => {
                console.log("Fetched saree types:", data);
                setSareeTypes(data);
            })
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

            {/* Saree Type Dropdown */}


            {/* Display Sales & Stock Details of Selected Saree */}
            <div className="midDiv">
                <div className="sareeDetails">
                    <h3>{selectedSaree} Sales & Stock</h3>
                    <p><strong>Total Sold Today:</strong> {sareeData.totalSold}</p>
                    <p><strong>Total Revenue:</strong> ₹{sareeData.totalRevenue}</p>
                    <p><strong>Current Stock:</strong> {sareeData.currentStock}</p>
                </div>
            </div>

            {/* Graph Placeholder (Replace with Actual Graph) */}
            <div className="botDiv">
                <div className="botInsideDiv">
                    <p>Graph will be displayed here for {selectedSaree}</p>
                </div>
                <div className="botInsideRightDiv"></div>
            </div>
        </div>
    );
}

export default Stocks;
