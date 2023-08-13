/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {Chart, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { apiURL } from "../helper";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip);

const TrackBar = ({ name, id, ratingScore, index }) => {
    const auth = useSelector(state => state.auth.value);

    const [defaultRating, setDefaultRating] = useState(ratingScore);
    const [currentRating, setCurrentRating] = useState(defaultRating);

    const [graphData, setGraphData] = useState([]);

    const handleRating = async (rating) => {
        const response = await fetch(`${apiURL}/music/rating/${id}`, {
            method: "POST",
            body: JSON.stringify({ ratingScore: rating }),
            headers: {
                "Content-Type": "application/json",
                ...(auth && { "Authorization": `Bearer ${auth.token}` })
            }
        });
        const json = await response.json();

        if (response.ok) {
            setDefaultRating(json.ratingScore);
        }
        else {
            toast.error(`Error: ${json.error}`);
        }
    };

    const handleGraph = async () => {
        const response = await fetch(`${apiURL}/music/rating/${id}`, {
            headers: {
                ...(auth && { "Authorization": `Bearer ${auth.token}` })
            }
        });
        const json = await response.json();
        
        if (response.ok) {
            setGraphData([json.one, json.two, json.three, json.four, json.five]);
        }
    }

    return (
        <div className="track">
            <span className="index">{index}</span>
            <span className="track-name">{name}</span>
            <span className="stars">
                {[1, 2, 3, 4, 5].map(i => (
                        <span 
                            className={"material-symbols-outlined star" + (i <= currentRating ? " active" : "")}
                            onMouseEnter={() => setCurrentRating(i)}
                            onMouseLeave={() => setCurrentRating(defaultRating)}
                            onClick={() => handleRating(i)}
                            key={i}
                        >star</span>
                ))}
            </span>
            {(defaultRating !== 0 && graphData.length === 0) && <span className="graph-button" onClick={handleGraph}>Show Others&apos; Ratings</span>}
            {graphData.length !== 0 && (
                <>
                    <div className="graph-container">
                    <Bar 
                        options={{
                            responsive: true,
                            // maintainAspectRatio: false,
                            scales: {
                                x: {
                                display: false
                                },
                                y: {
                                display: false
                                }
                            }
                        }}
                        data={{
                            labels: ["★1", "★2", "★3", "★4", "★5"],
                            datasets: [
                                {
                                    data: graphData,
                                    backgroundColor: "rgba(26, 112, 220, 0.5)",
                                },
                            ],
                        }}
                        // height={10}
                        // width={40}
                    />
                    </div>
                    <span className="material-symbols-outlined" onClick={() => setGraphData([])}>close</span> 
                </>
            )}
        </div>
    );
};

export default TrackBar;