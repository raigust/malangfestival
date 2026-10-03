import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { store, EVENT_STATUSES, BORDER_STYLES, uniqueSlug, saveEvent, ensureStoreLoaded } from "@/lib/store";

function has(body, key) {
  return Object.prototype.hasOwnProperty.call(body, key);
}

function value(body, key) {
  return typeof body[key] === "string" ? body[key].trim() : body[key];
}

function validDate(date) {
  return date && !Number.isNaN(new Date(date).getTime());
}

function validateEvent(body, isUpdate = false) {
  const errors = [];
  const required = ["title", "category", "posterUrl", "date", "time", "venue", "performer", "synopsis"];
  if (!isUpdate) {
    required.forEach((field) => {
      if (!value(body, field)) errors.push(field + " wajib diisi.");
    });
  }
  required.forEach((field) => {
    if (isUpdate && has(body, field) && !value(body, field)) {
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
  if (!existing) {
    data.borderStyle = data.borderStyle || "washi-tape";
    data.pinRotation = data.pinRotation || 0;
    data.venueAddress = data.venueAddress || data.venue;
    data.priceType = data.priceType || "Gratis";
    data.price = data.price || (data.priceType === "Gratis" ? "Gratis" : "Donasi Terbuka");
    data.status = data.status || "DRAFT";
    data.likesCount = 0;
    data.stickers = [];
  } else if (has(body, "priceType") && !has(body, "price") && data.priceType === "Gratis") {
    data.price = "Gratis";
  }
  return data;
}

export async function GET(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  await ensureStoreLoaded();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  let events = [...store.events];

  if (status && status !== "ALL" && EVENT_STATUSES.includes(status)) {
    events = events.filter((e) => e.status === status);
  }

  if (search) {
    const query = search.toLowerCase();
    events = events.filter((e) =>
      (e.title || "").toLowerCase().includes(query) ||
      (e.venue || "").toLowerCase().includes(query) ||
      (e.performer || "").toLowerCase().includes(query)
    );
  }

  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return NextResponse.json({
    success: true,
    count: events.length,
    data: events,
  });
}

export async function POST(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const errors = validateEvent(body);
    if (errors.length) {
      return NextResponse.json(
        { success: false, message: "Periksa data poster.", errors },
        { status: 400 }
      );
    }

    const data = buildEventData(body);
    data.id = store.nextEventId++;
    data.slug = uniqueSlug(data.title);
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();

    await saveEvent(data);

    return NextResponse.json(
      {
        success: true,
        message: "Poster berhasil ditambahkan ke mading.",
        data,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
