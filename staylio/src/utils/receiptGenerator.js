import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateReceipt = (booking, hotel, logoBase64 = null) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* ===== COLORS ===== */
  const BLACK = [0, 0, 0];
  const GRAY = [90, 90, 90];
  const LIGHT_GRAY = [245, 245, 245];
  const BORDER = [200, 200, 200];
  const ACCENT = [30, 30, 30]; 
  const BRAND = [132, 0, 255]; // StayLio Purple

  /* ===== PAGE BORDER ===== */
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.6);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  let y = 18;

  /* ===== HEADER ===== */
  // Logo & Brand
  const logoSize = 12;
  
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 20, y, logoSize, logoSize);
  } else {
    // Fallback Icon (Simple Building)
    doc.setFillColor(...BRAND);
    doc.roundedRect(20, y, logoSize, logoSize, 2, 2, 'F');
    doc.setFillColor(255, 255, 255);
    // Windows
    const wSize = 2; 
    doc.rect(20 + 3, y + 3, wSize, wSize, 'F');
    doc.rect(20 + 7, y + 3, wSize, wSize, 'F');
    doc.rect(20 + 3, y + 7, wSize, wSize, 'F');
    doc.rect(20 + 7, y + 7, wSize, wSize, 'F');
  }

  // Brand Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...BRAND);
  doc.text("StayLio", 36, y + 9);

  // Receipt Title (Right Side)
  doc.setFontSize(16);
  doc.setTextColor(...ACCENT);
  doc.text("BOOKING RECEIPT", pageWidth - 20, y + 8, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, y + 14, {
    align: "right"
  });

  y += 20;
  doc.setDrawColor(230, 230, 230);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  /* ===== BOOKING SUMMARY ===== */
  autoTable(doc, {
    startY: y,
    head: [["Booking Ref", "Status", "Payment Method", "Transaction ID"]],
    body: [[
      booking.bookingReference,
      booking.status,
      booking.paymentMethod || "ONLINE",
      booking.razorpayPaymentId || "N/A"
    ]],
    styles: {
      fontSize: 9,
      textColor: BLACK,
      font: "helvetica"
    },
    headStyles: {
      fillColor: LIGHT_GRAY,
      fontStyle: "bold"
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 30 },
      2: { cellWidth: 35 },
      3: { cellWidth: 45 }
    }
  });

  y = doc.lastAutoTable.finalY + 10;

  /* ===== HOTEL & GUEST DETAILS ===== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BLACK);
  doc.text("Hotel Details", 20, y);
  doc.text("Guest Details", pageWidth / 2 + 10, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);

  doc.text(hotel.name, 20, y);
  doc.text(booking.guestName, pageWidth / 2 + 10, y);

  y += 5;
  doc.text(`${hotel.address}, ${hotel.city}, ${hotel.country}`, 20, y, { maxWidth: 80 });
  doc.text(booking.guestEmail, pageWidth / 2 + 10, y);

  y += 5;
  doc.text(hotel.phone || "", 20, y);
  doc.text(booking.guestPhone || "", pageWidth / 2 + 10, y);

  y += 12;

  /* ===== STAY DETAILS ===== */
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLACK);
  doc.text("Stay Details", 20, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);

  const stayDetails = [
    ["Check-in", booking.checkInDate],
    ["Check-out", booking.checkOutDate],
    ["Nights", booking.totalNights],
    ["Guests", booking.guests],
    ["Room Type", booking.roomType],
    ["Rooms", booking.rooms || 1]
  ];

  let x = 20;
  stayDetails.forEach(([label, value], i) => {
    doc.text(label, x, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLACK);
    doc.text(String(value), x, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    x += 40;
    if ((i + 1) % 3 === 0) {
      y += 14;
      x = 20;
    }
  });

  y += 18;

  /* ===== PAYMENT TABLE ===== */
  const subtotal = booking.pricePerNight * booking.totalNights * (booking.rooms || 1);
  const tax = booking.totalAmount - subtotal;

  autoTable(doc, {
    startY: y,
    head: [["Description", "Nights", "Rate / Night", "Amount"]],
    body: [
      [
        `Room Charge (${booking.roomType})`,
        booking.totalNights,
        `INR ${booking.pricePerNight.toFixed(2)}`,
        `INR ${subtotal.toFixed(2)}`
      ],
      [
        "Taxes & Fees",
        "-",
        "-",
        `INR ${tax.toFixed(2)}`
      ]
    ],
    styles: {
      fontSize: 9,
      textColor: BLACK,
      font: "helvetica"
    },
    headStyles: {
      fillColor: LIGHT_GRAY,
      fontStyle: "bold"
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 25, halign: "center" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 40, halign: "right" }
    }
  });

  y = doc.lastAutoTable.finalY + 10;

  /* ===== TOTAL AMOUNT BOX ===== */
  doc.setDrawColor(...BORDER);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(20, y, pageWidth - 40, 18, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL AMOUNT PAID", 25, y + 12);

  doc.setFontSize(16);
  doc.text(
    `INR ${booking.totalAmount.toFixed(2)}`,
    pageWidth - 25,
    y + 12,
    { align: "right" }
  );

  y += 25;

  /* ===== TERMS ===== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Terms & Conditions", 20, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(
    "• This receipt confirms payment made via StayLio.\n" +
    "• Free cancellation is subject to hotel policy.\n" +
    "• Refunds are processed to the original payment method.\n" +
    "• StayLio acts as a booking facilitator only.\n" +
    "• Disputes are subject to local jurisdiction.",
    20,
    y,
    { maxWidth: pageWidth - 40 }
  );

  /* ===== FOOTER ===== */
  doc.setFontSize(8);
  doc.text(
    "Thank you for booking with StayLio | support@staylio.com | www.staylio.com",
    pageWidth / 2,
    pageHeight - 18,
    { align: "center" }
  );

  doc.save(`StayLio_Receipt_${booking.bookingReference}.pdf`);
};
