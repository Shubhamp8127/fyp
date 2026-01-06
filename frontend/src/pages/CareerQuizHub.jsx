import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/careerQuizHub.css";
import { Play, RefreshCw } from "lucide-react";

const CareerQuizHub = () => {
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRecentActivity([]);
      return;
    }

    const controller = new AbortController();

    const fetchActivity = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setRecentActivity(Array.isArray(data.recentActivity) ? data.recentActivity : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load dashboard activity", error);
          setRecentActivity([]);
        }
      }
    };

    fetchActivity();

    return () => controller.abort();
  }, [apiBaseUrl]);

  return (
    <div className="cq-page">
      <header className="cq-header">
        <div className="cq-title">
          <div className="cq-icon"><span>🧭</span></div>
          <h1>Career <span className="highlight">Quiz Hub</span></h1>
          <p>Discover your perfect career path with AI-powered assessments</p>
        </div>
      </header>

      <div className="cq-cards">
        <div className="cq-card start-assessment" onClick={() => navigate("/quiz")}>
          <div className="cq-card-icon play-icon"><Play /></div>
          <h2>Start New Assessment</h2>
          <p>Take our AI-powered career assessment to discover your ideal path.</p>
          <span className="powered">Powered by AI</span>
        </div>

        <div className="cq-card view-history">
          <div className="cq-card-icon refresh-icon"><RefreshCw /></div>
          <h2>View Quiz History</h2>
          <p>Track your assessment progress over time.</p>
          <span className="quiz-count">
            {recentActivity.filter(a => a.type==="quiz").length} Quizzes Completed
          </span>
        </div>
      </div>
    </div>
  );
};

export default CareerQuizHub;
