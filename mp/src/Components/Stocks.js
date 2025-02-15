import React, { useEffect, useState } from "react";
import "../Style/Stocks.css";
import axios from "axios";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { LuLayoutDashboard, LuBox } from "react-icons/lu";
import { BiReceipt, BiError } from "react-icons/bi";
import { FaEdit, FaChartLine, FaCommentDots } from "react-icons/fa";
import kiot from "../Images/kiot.jpeg";
import { useNavigate } from "react-router-dom";


function Stocks() {
    return (

        <div className="rightsideCont">
            <div className="upperDiv">
                <div className="upInsideDiv"></div>
                <div className="upInsideDiv"></div>
                <div className="upInsideDiv" style={{ height: '45px' }}></div>
                <div className="upInsideDiv" style={{ height: '45px' }}></div>
            </div>

            <div className="midDiv"></div>
            <div className="botDiv">
                <div className="botInsideDiv"></div>
                <div className="botInsideRightDiv"></div>
            </div>
        </div>


    )
}

export default Stocks