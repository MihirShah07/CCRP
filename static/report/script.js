async function generatePDF() {
    try {
      const response = await fetch("/api/generatePDF", { method: "POST" });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }