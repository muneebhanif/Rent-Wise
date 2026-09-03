import React from 'react'
import "../../App.css";

export default function ColorTubeLoader() {
  return (
    <div>
        <section className="loader">
  <div className="slider" style={{ "--i": 0 }}></div>
  <div className="slider" style={{ "--i": 1 }}></div>
  <div className="slider" style={{ "--i": 2 }}></div>
  <div className="slider" style={{ "--i": 3 }}></div>
</section>

      
    </div>
  )
}
