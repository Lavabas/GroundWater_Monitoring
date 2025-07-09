 # Groundwater Monitoring in Sri Lanka using GLDAS (2013–2023)
This project uses NASA's **GLDAS (Global Land Data Assimilation System)** daily soil moisture and groundwater data to analyze groundwater storage trends in **Sri Lanka** over the period **2013–2023**, using **Google Earth Engine (GEE)**.


## 🌍 Objectives

- Monitor spatio-temporal groundwater storage variations across Sri Lanka.
- Identify **drought-prone areas** based on low groundwater thresholds.
- Generate time series of groundwater for:
  - The **entire country**
  - Key cities: **Anuradhapura** and **Colombo**


![Screenshot (222)](https://github.com/user-attachments/assets/26ceb2ac-3ee8-4dc8-b0d5-441130815ada)
![Screenshot (224)](https://github.com/user-attachments/assets/2dce862c-17d1-4224-9e1e-c28e817a1b32)
![Screenshot (225)](https://github.com/user-attachments/assets/c062bf5b-8284-4031-88a5-39efc39f129b)


## 📦 Data Source

- **Dataset:** [NASA/GLDAS/V022/CLSM/G025/DA1D](https://developers.google.com/earth-engine/datasets/catalog/NASA_GLDAS_V022_CLSM_G025_DA1D)
- **Band Used:** `GWS_tavg` (Average Groundwater Storage)
- **Temporal Range:** `2013-01-01` to `2024-01-01`


## 🗺️ Features Included

### 1. **Study Region**
- Country boundary of Sri Lanka (USDOS/LSIB_SIMPLE/2017).
- Two key monitoring points:
  - **Anuradhapura**: [80.3880, 8.3114]
  - **Colombo**: [79.8612, 6.9271]

### 2. **Monthly Groundwater Analysis**
- Computes monthly mean groundwater images.
- Calculates:
  - **Mean Groundwater Storage** (2013–2023)
  - **Latest Month Groundwater Storage** (as of **December 2023**)
  - **Drought Risk Areas** (areas where groundwater < 1000 mm)

### 3. **Visualizations**
- **Map Layers**:
  - Mean groundwater storage
  - Latest month groundwater storage
  - Drought risk areas (< 1000 mm)
- **Legends** and **titles** added for interpretation.

### 4. **Time Series Charts**
- **National Trend**: Mean groundwater across Sri Lanka (2013–2023)
- **Point Trends**: Groundwater at Anuradhapura and Colombo

![ee-chart (1)](https://github.com/user-attachments/assets/7c5f0886-a84d-427c-af40-55d21f02ebb4)

Selected locations in Anuradhapura and Colombo
![Screenshot (226)](https://github.com/user-attachments/assets/4ba82955-e403-4fcc-b239-40ea38f0e49b)

![ee-chart (2)](https://github.com/user-attachments/assets/8105f1c5-2cd6-440f-b4b3-b5cee0b2ccc7)


## 📌 Notes
  -  Spatial resolution is ~0.25° (approx. 25–30 km), so local-scale variations may not be captured.
  -  Threshold of 1000 mm is used for drought risk indication and can be adjusted as needed.


