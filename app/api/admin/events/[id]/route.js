import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { store, EVENT_STATUSES, BORDER_STYLES, uniqueSlug } from "@/lib/store";

function has(body, key) {
  return Object.prototype.hasOwnProperty.call(body, key);
}

function value(body, key) {
  return typeof body[key] === "string" ? body[key].trim() : body[key];
}

function validDate(date) {
  return date && !Number.isNaN(new Date(date).getTime());
}

function validateEvent(body) {
  const errors = [];
  const required = ["title", "category", "posterUrl", "date", "time", "venue", "performer", "synopsis"];
  required.forEach((field) => {
    if (has(body, field) && !value(body, field)) {
      errors.push(field + " tidak boleh kosong.");
    }
  });
  if (has(body, "date") && !validDate(body.date)) {
    errors.push("Tanggal pertunjukan tidak valid.");
  }
  if (has(body, "borderStyle") && !BORDER_STYLES.some((style) => style.id === body.borderStyle)) {
    errors.push("Gaya bingkai tidak tersedia.");
  }
  if (has(body, "status") && !EVENT_STATUSES.includes(body.status)) {
    errors.push("Status poster tidak valid.");
  }
  if (has(body, "pinRotation") && (!Number.isFinite(Number(body.pinRotation)) || Math.abs(Number(body.pinRotation)) > 12)) {
    errors.push("Rotasi poster harus antara -12 sampai 12 derajat.");
  }
  return errors;
}

function buildEventData(body, existing) {
  const data = {};
  const stringFields = [
    "title",
    "category",
    "posterUrl",
    "time",
    "venue",
    "venueAddress",
    "priceType",
    "price",
    "performer",
    "synopsis",
    "status",
    "borderStyle",
  ];
  stringFields.forEach((field) => {
    if (has(body, field)) data[field] = value(body, field);
  });
  ["ticketUrl", "curator", "highlight"].forEach((field) => {
    if (has(body, field)) data[field] = value(body, field) || null;
  });
  if (has(body, "date")) data.date = new Date(body.date).toISOString();
  if (has(body, "pinRotation")) data.pinRotation = Number.parseInt(body.pinRotation, 10) || 0;
  if (has(body, "priceType") && !has(body, "price") && data.priceType === "Gratis") {
    data.price = "Gratis";
  }
  return data;
}

export async function PUT(request, { params }) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  const id = Number(params.id);
  const existingIndex = store.events.findIndex((e) => e.id === id);
  if (existingIndex === -1) {
    return NextResponse.json(
      { success: false, message: "Poster tidak ditemukan." },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const errors = validateEvent(body);
    if (errors.length) {
      return NextResponse.json(
        { success: false, message: "Periksa data poster.", errors },
        { status: 400 }
      );
    }

    const existing = store.events[existingIndex];
    const updateData = buildEventData(body, existing);
    if (updateData.title && updateData.title !== existing.title) {
      updateData.slug = uniqueSlug(updateData.title, id);
    }
    updateData.updatedAt = new Date().toISOString();

    const updated = {
      ...existing,
      ...updateData,
    };

    store.events[existingIndex] = updated;

    return NextResponse.json({
      success: true,
      message: "Poster berhasil diperbarui.",
      data: updated,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  const id = Number(params.id);
  const index = store.events.findIndex((e) => e.id === id);
  if (index === -1) {
    return NextResponse.json(
      { success: false, message: "Poster tidak ditemukan." },
      { status: 404 }
    );
  }

  store.events.splice(index, 1);

  return NextResponse.json({
    success: true,
    message: "Poster berhasil dicopot dari mading.",
  });
}
