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

// FIXME: Needs rework with filter
// If already on a page beyond the filtered data, then the page will remain blank
function displayPage(pageIndex, totalRows, pageSize, myFunctionHolder) {
  // Get data for page slice
  const offset = pageIndex * pageSize;
  const pageData = myFunctionHolder.enrichedData.slice(
    offset,
    offset + pageSize,
  );

  myFunctionHolder.allDims.filterFunction((d) => pageData.includes(d));

  dc.redrawAll();

  const pageText = `Showing rows ${offset + 1}–${offset + pageSize} out of ${totalRows}`;
  document.getElementById("page-info").textContent = pageText;

  // Disable buttons when at min/max
  const totalPages = Math.ceil(totalRows / pageSize);
  document.getElementById("next").disabled = pageIndex + 1 >= totalPages;
  document.getElementById("prev").disabled = pageIndex === 0;
}

export { formatColumnHeader, displayPage };
