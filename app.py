import streamlit as st
import pandas as pd
import plotly.express as px
import folium
from streamlit_folium import folium_static

# Load dataset
df = pd.read_csv('crime_data.csv')

st.set_page_config(page_title="HerSafety Dashboard", layout="wide")
st.title("🛡️ HerSafety: Women's Safety Dashboard")

# Sidebar filters
st.sidebar.header("🔍 Filter Crime Data")
crime_types = st.sidebar.multiselect("Select Crime Type(s):", options=df["Crime_Type"].unique(), default=df["Crime_Type"].unique())
hours = st.sidebar.slider("Select Hour Range (24h)", 0, 23, (0, 23))

# Convert time column if needed
df['Hour'] = pd.to_datetime(df['Time'], format="%H:%M").dt.hour
filtered_df = df[(df["Crime_Type"].isin(crime_types)) & (df["Hour"].between(hours[0], hours[1]))]

# ----- 1. Heatmap Section -----
st.subheader("🔥 Heatmap of Unsafe Locations")
m = folium.Map(location=[df["Latitude"].mean(), df["Longitude"].mean()], zoom_start=12)
for _, row in filtered_df.iterrows():
    folium.CircleMarker(
        location=[row["Latitude"], row["Longitude"]],
        radius=5,
        popup=row["Crime_Type"],
        fill=True,
        color='red',
        fill_opacity=0.6
    ).add_to(m)
folium_static(m, width=700)

# ----- 2. Bar Chart: Crime Type Count -----
st.subheader("📊 Crime Types Distribution")
bar_fig = px.bar(filtered_df['Crime_Type'].value_counts().reset_index(),
                 x='index', y='Crime_Type',
                 labels={'index': 'Crime Type', 'Crime_Type': 'Count'},
                 color='index', title="Crime Type Frequency")
st.plotly_chart(bar_fig, use_container_width=True)

# ----- 3. Line Graph: Crimes by Hour -----
st.subheader("⏰ Crimes Over Time of Day")
line_fig = px.line(filtered_df.groupby('Hour').size().reset_index(name='Crimes'),
                   x='Hour', y='Crimes',
                   title="Crime Occurrence by Hour")
st.plotly_chart(line_fig, use_container_width=True)

# ----- 4. Route Suggestion Placeholder -----
st.subheader("📍 Suggested Safer Routes (Placeholder)")
st.info("Use Google Maps API to generate safer routes here based on crime density.")
