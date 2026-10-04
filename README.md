This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Blue-Green Haven 🌊🍃
### Urban Freshwater Microclimate & One Health Resilience Engine

An operational climate resilience platform engineered for the **IEEE OneAquaHealth Global Hackathon 2026** (Track 6: Resilience Informatics). Blue-Green Haven transforms urban streams into active, navigable thermal refuges during extreme heatwaves, connecting freshwater ecological integrity directly to human survival.

<img width="508" height="356" alt="image" src="https://github.com/user-attachments/assets/95ec67e6-8719-4957-b3b4-518f78b13025" />

---

##  Executive Summary

Summer heatwaves across European cities claim more than 60,000 lives annually. In dense urban centers like Athens, Madrid, and Rome, asphalt and concrete create severe heat island effects.

Urban streams and riparian zones naturally mitigate this danger by providing evaporative cooling corridors that lower localized temperatures by **2.8°C to 4.2°C**. However, when urban waterways dry up, stagnate, or choke with trash, this natural microclimatic shield collapses. Stagnant water pockets instead become breeding grounds for disease vectors (*Culex* mosquitoes carrying West Nile Virus) and toxic cyanobacterial blooms.

**Blue-Green Haven** implements the **One Health** paradigm: **Human survival during extreme heat events depends directly on the biological health of freshwater ecosystems.** The platform synchronizes real-time European climate data, open-source waterway cartography, and frictionless citizen bio-monitoring to deliver an operational heat mitigation and biosecurity platform.

---

##  The Dual-Persona System

Blue-Green Haven serves two distinct stakeholders through dedicated operational modes:

### 1.  Citizen Safe Router & Thermal Refuge Navigation
* **Thermal Comfort Routing:** Pedestrian route planning that diverts vulnerable citizens away from radiation-heavy concrete avenues (37.4°C) toward shaded riparian greenways (34.6°C).
* **Zero-Friction Observation Portal:** Non-expert citizens report stream conditions using GPS auto-detection or direct map clicks. Uses intuitive visual cues (**Flowing & Clear** vs. **Stagnant / Dirty**) rather than technical hydrological parameters.
* **Microclimate Attenuation Analytics:** Quantifies real-time temperature drops ($\Delta T = -2.8^\circ\text{C}$) along healthy stream canopies.
* **Stewardship Gamification:** Citizens earn verified stewardship points and level up (e.g., *Watershed Guardian*), encouraging ongoing community monitoring.

### 2. Municipal & Research Hub
* **Automated Remediation Workorders:** Automatically aggregates degraded stream flags into structured municipal maintenance tickets (e.g., `WO-2026-EU-089: Culvert Eutrophication & Flow Stagnation`) for emergency public works dispatch.
* **Biosecurity Hazard Flagging:** Immediately revokes cooling buffer zones when stagnation is reported, converting them into epidemiological warning zones for cyanotoxins and mosquito vectors.
* **Open Geospatial Interoperability:** One-click **GeoJSON** data export formatted for municipal GIS pipelines, QGIS, ArcGIS, and the European OneAquaHealth Open Information Hub.

---

## Dashboard Metrics Explained

| Metric | Scientific Basis & Real-World Utility |
| :--- | :--- |
| **Urban Concrete Heat** | Real-time 2-meter ground air temperature pulled live from Open-Meteo European climate models, reflecting ambient heat stress on city streets. |
| **Riparian Cooling Oasis** | The attenuated microclimatic temperature calculated within healthy vegetative stream corridors ($\Delta T = -2.8^\circ\text{C}$). |
| **Water Biosecurity** | Ratio of active cooling corridors vs. degraded waterways flagged by real-time citizen observations. |
| **Corridor Coverage** | Estimated count of vulnerable residents living within an accessible 800-meter walk of a verified thermal refuge. |
| **Emergency Advisory** | An automated alert triggered when ambient temperatures exceed safety thresholds ($\ge 30^\circ\text{C}$), directing citizens to thermal corridors. |

---

## System Architecture & Data Pipelines

The platform runs entirely on open European standards and live public APIs, avoiding proprietary database lock-in:

* **Frontend & State:** Next.js (App Router), React, TypeScript
* **Styling & Design:** Tailwind CSS (Dark-Mode Scientific UI)
* **Spatial Mapping:** Leaflet, React-Leaflet, GeoJSON
* **Meteorological Feeds:** [Open-Meteo API](https://open-meteo.com/) (real-time European 2m air temperature)
* **Waterway Cartography:** [OpenStreetMap Overpass API](https://overpass-turbo.eu/) (dynamic spatial queries for urban stream geometries)
* **Spatial Export:** RFC 7946-compliant GeoJSON

## Continental Scalability

Blue-Green Haven includes a multi-city selector covering Mediterranean hubs vulnerable to summer heatwaves:
* **Athens, Greece** ($37.98^\circ\text{N}, 23.72^\circ\text{E}$ — Ilissos & Kifissos Basins)
* **Madrid, Spain** ($40.41^\circ\text{N}, -3.70^\circ\text{E}$ — Manzanares River Corridor)
* **Rome, Italy** ($41.90^\circ\text{N}, 12.49^\circ\text{E}$ — Tiber River Basin)

Dynamic spatial and meteorological queries allow the system to scale to any European municipality without re-engineering the backend.

---

## Getting Started

First, run the development server:

```bash
# 1. Clone the repository
git clone [https://github.com/harmonicm/blue-green-haven.git](https://github.com/harmonicm/blue-green-haven.git)
cd blue-green-haven

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

