function formatColumnHeader() {
  return [
    { label: "Crater ID", format: (d) => d.CRATER_ID },
    { label: "Lat", format: (d) => d.LAT_ELLI_IMG.toFixed(3) },
    { label: "Lon", format: (d) => d.LON_ELLI_IMG.toFixed(3) },
    { label: "Diameter (km)", format: (d) => d.DIAM_CIRC_IMG.toFixed(2) },
    { label: "Eccentricity", format: (d) => d.DIAM_ELLI_ECCEN_IMG.toFixed(3) },
    { label: "Ellipticity", format: (d) => d.DIAM_ELLI_ELLIP_IMG.toFixed(3) },
    {
      label: "Angle (from North)",
      format: (d) => d.DIAM_ELLI_ANGLE_IMG.toFixed(1),
    },

    { label: "Ejecta Layers", format: (d) => d.LAY_NUMBER },
    { label: "Ejecta Class", format: (d) => d.LAY_MORPH1 }, // @Aidan need a lookup table for this.
    { label: "Ejecta Texture", format: (d) => d.LAY_MORPH2 }, // @Aidan need a lookup table for this.
    { label: "Ejecta Shape", format: (d) => d.LAY_MORPH3 },
    { label: "Ejecta Notes", format: (d) => d.LAY_NOTES },

    { label: "Crater Class", format: (d) => d.INT_MORPH1 }, // @Aidan need a lookup table for this.
    { label: "Wall Morph", format: (d) => d.INT_MORPH2 },
    { label: "Floor Morph", format: (d) => d.INT_MORPH3 },

    { label: "Confidence", format: (d) => d.CONF },
    { label: "Notes", format: (d) => d.NOTES },

    { label: "Rim Degradation", format: (d) => d.DEG_RIM },
    { label: "Ejecta Degradation", format: (d) => d.DEG_EJC },
    { label: "Floor Degradation", format: (d) => d.DEG_FLR },
  ];
}

function updatePage(pageData, dataWrapper) {
  const totalPages = Math.ceil(pageData.rows / pageData.size);
  // Offset and slice to page size
  const offset = pageData.index * pageData.size;
  const end = Math.min(offset + pageData.size, pageData.rows); // Cap the end

  const tableData = dataWrapper.data.slice(offset, end);

  // Display all dimensions
  dataWrapper.allDims.filterFunction((d) => tableData.includes(d));


  // Location within table
  const pageText = `Showing rows ${offset + 1}–${offset + pageData.size} out of ${pageData.rows}`;
  document.getElementById("page-info").textContent = pageText;

  // Disable buttons when at min/max
  document.getElementById("next").disabled = pageData.index + 1 >= totalPages;
  document.getElementById("prev").disabled = pageData.index === 0;

  dc.redrawAll();
}

export { formatColumnHeader, updatePage };
