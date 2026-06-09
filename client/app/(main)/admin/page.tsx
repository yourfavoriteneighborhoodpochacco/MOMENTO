"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

interface Application {
    id: string
    username: string
    email: string
    status: string
    note: string | null
}

async function getPendingApplications(token: string): Promise<Application[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/pending`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error("Failed to fetch applications")
    return res.json()

}

async function approveApplication(userId: string, token: string): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${userId}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error("Failed to approve application")
}

async function suspendUser(userId: string, token: string): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${userId}/suspend`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error("Failed to suspend user")
}

export default function AdminPage() {
    const { user, token, loading } = useAuth()
    const router = useRouter()
    const [applications, setApplications] = useState<Application[]>([])
    const [fetching, setFetching] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const [showAddLocation, setShowAddLocation] = useState(false)
    const [locationForm, setLocationForm] = useState({
        name: "",
        category: "study",
        latitude: "",
        longitude: "",
        capacity_estimate: "",
        parent_id: "",
        admin_tag: ""
    })
    const [locationLoading, setLocationLoading] = useState(false)
    const [locationSuccess, setLocationSuccess] = useState(false)
    const [allLocations, setAllLocations] = useState<any[]>([])

    const [editingLocation, setEditingLocation] = useState<any | null>(null)
    const [editForm, setEditForm] = useState({
        name: "",
        category: "study",
        latitude: "",
        longitude: "",
        capacity_estimate: "",
        parent_id: "",
        admin_tag: ""
    })
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    useEffect(() => {
        if (!loading && !user) router.push("/login")
        if (!loading && user?.account_type !== "admin") router.push("/map")
    }, [user, loading, router])

    useEffect(() => {
        if (!token || !user || user.account_type !== "admin") return
        getPendingApplications(token)
            .then(setApplications)
            .catch(console.error)
            .finally(() => setFetching(false))

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/`)
            .then(r => r.json())
            .then(setAllLocations)
            .catch(console.error)
    }, [token, user])

    async function handleApprove(userId: string) {
        if (!token) return
        setActionLoading(userId)
        try {
            await approveApplication(userId, token)
            setApplications(prev => prev.filter(a => a.id !== userId))
        } catch (e) {
            console.error(e)
        } finally {
            setActionLoading(null)
        }
    }

    async function handleSuspend(userId: string) {
        if (!token) return
        setActionLoading(userId)
        try {
            await suspendUser(userId, token)
            setApplications(prev => prev.filter(a => a.id !== userId))
        } catch (e) {
            console.error(e)
        } finally {
            setActionLoading(null)
        }
    }

    async function handleAddLocation() {
        if (!token) return
        if (!locationForm.name || !locationForm.latitude || !locationForm.longitude || !locationForm.capacity_estimate) {
            alert("Please fill in all required fields")
            return
        }
        setLocationLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: locationForm.name,
                    category: locationForm.category,
                    latitude: parseFloat(locationForm.latitude),
                    longitude: parseFloat(locationForm.longitude),
                    capacity_estimate: parseInt(locationForm.capacity_estimate),
                    parent_id: locationForm.parent_id || null,
                    admin_tag: locationForm.admin_tag || null
                })
            })
            if (!res.ok) throw new Error("Failed to add location")

            const locations = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/locations/`
            ).then(r => r.json())

            setAllLocations(locations)

            setLocationSuccess(true)
            setLocationForm({
                name: "",
                category: "study",
                latitude: "",
                longitude: "",
                capacity_estimate: "",
                parent_id: "",
                admin_tag: ""
            })
            setLocationSuccess(true)
            setLocationForm({
                name: "",
                category: "study",
                latitude: "",
                longitude: "",
                capacity_estimate: "",
                parent_id: "",
                admin_tag: ""
            })
            setTimeout(() => setLocationSuccess(false), 3000)
        } catch (e) {
            console.error(e)
        } finally {
            setLocationLoading(false)
        }
    }

    async function handleEditLocation() {
        if (!token || !editingLocation) return
        setLocationLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/${editingLocation.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editForm.name,
                    category: editForm.category,
                    latitude: parseFloat(editForm.latitude),
                    longitude: parseFloat(editForm.longitude),
                    capacity_estimate: parseInt(editForm.capacity_estimate),
                    parent_id: editForm.parent_id || null,
                    admin_tag: editForm.admin_tag || null
                })
            })
            if (!res.ok) throw new Error("Failed to update location")
            const updated = await res.json()
            setAllLocations(prev => prev.map(l => l.id === updated.id ? updated : l))
            setEditingLocation(null)
        } catch (e) {
            console.error(e)
        } finally {
            setLocationLoading(false)
        }
    }

    async function handleDeleteLocation(locationId: string) {
        if (!token) return
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/${locationId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error("Failed to delete location")
            setAllLocations(prev => prev.filter(l => l.id !== locationId))
            setDeleteConfirm(null)
        } catch (e) {
            console.error(e)
        }
    }

    if (loading || fetching) return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#FAFAF8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-cormorant), Georgia, serif"
        }}>
            <p style={{ color: "#B0A898" }}>Loading...</p>
        </div>
    )

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#FAFAF8",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            padding: "48px 40px"
        }}>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>

                <Link href="/map" style={{ textDecoration: "none" }}>
                    <p style={{
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#9C9086",
                        marginBottom: 32
                    }}>
                        ← Back to map
                    </p>
                </Link>

                <h1 style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: "#262626",
                    letterSpacing: "0.04em",
                    marginBottom: 8
                }}>
                    Admin
                </h1>
                <p style={{
                    fontSize: 13,
                    color: "#9C9086",
                    marginBottom: 40
                }}>
                    Pending contributor applications
                </p>

                {applications.length === 0 ? (
                    <div style={{
                        backgroundColor: "#FAFAF8",
                        borderRadius: 16,
                        padding: "32px 24px",
                        textAlign: "center",
                        boxShadow: "0 2px 16px rgba(0,0,0,0.06)"
                    }}>
                        <p style={{ fontSize: 15, color: "#B0A898" }}>
                            No pending applications
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {applications.map(app => (
                            <div
                                key={app.id}
                                style={{
                                    backgroundColor: "#FAFAF8",
                                    borderRadius: 16,
                                    padding: "20px 24px",
                                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: 20
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <p style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: "#262626",
                                        marginBottom: 4
                                    }}>
                                        @{app.username}
                                    </p>
                                    <p style={{
                                        fontSize: 13,
                                        color: "#9C9086",
                                        marginBottom: app.note ? 10 : 0
                                    }}>
                                        {app.email}
                                    </p>
                                    {app.note && (
                                        <p style={{
                                            fontSize: 13,
                                            color: "#7A7570",
                                            fontStyle: "italic",
                                            lineHeight: 1.5
                                        }}>
                                            "{app.note}"
                                        </p>
                                    )}
                                </div>

                                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                    <button
                                        onClick={() => handleApprove(app.id)}
                                        disabled={actionLoading === app.id}
                                        style={{
                                            padding: "8px 16px",
                                            borderRadius: 8,
                                            border: "none",
                                            backgroundColor: actionLoading === app.id ? "#C8C4BA" : "#7A5F55",
                                            color: "#ECF0F1",
                                            fontSize: 12,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            cursor: actionLoading === app.id ? "not-allowed" : "pointer",
                                            fontFamily: "inherit"
                                        }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleSuspend(app.id)}
                                        disabled={actionLoading === app.id}
                                        style={{
                                            padding: "8px 16px",
                                            borderRadius: 8,
                                            border: "1px solid #E0DDD6",
                                            backgroundColor: "transparent",
                                            color: "#C0786A",
                                            fontSize: 12,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            cursor: actionLoading === app.id ? "not-allowed" : "pointer",
                                            fontFamily: "inherit"
                                        }}
                                    >
                                        Suspend
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Add location section */}
            <div style={{ marginTop: 48 }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20
                }}>
                    <div>
                        <h2 style={{
                            fontSize: 20,
                            fontWeight: 500,
                            color: "#262626",
                            marginBottom: 4
                        }}>
                            Locations
                        </h2>
                        <p style={{ fontSize: 13, color: "#9C9086" }}>
                            Add new locations to the map
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddLocation(!showAddLocation)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 8,
                            border: "none",
                            backgroundColor: "#7A5F55",
                            color: "#ECF0F1",
                            fontSize: 12,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            fontFamily: "inherit"
                        }}
                    >
                        {showAddLocation ? "Cancel" : "+ Add location"}
                    </button>
                </div>

                {showAddLocation && (
                    <div style={{
                        backgroundColor: "#FAFAF8",
                        borderRadius: 16,
                        padding: "24px",
                        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                        marginBottom: 16
                    }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                            {/* Name */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: 10,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#9C9086",
                                    marginBottom: 6
                                }}>
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={locationForm.name}
                                    onChange={e => setLocationForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Langson Library — Floor 4"
                                    style={{
                                        width: "100%",
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        border: "1px solid #E0DDD6",
                                        backgroundColor: "#F5F3EF",
                                        fontSize: 14,
                                        color: "#262626",
                                        outline: "none",
                                        boxSizing: "border-box",
                                        fontFamily: "inherit"
                                    }}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: 10,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#9C9086",
                                    marginBottom: 6
                                }}>
                                    Category *
                                </label>
                                <select
                                    value={locationForm.category}
                                    onChange={e => setLocationForm(p => ({ ...p, category: e.target.value }))}
                                    style={{
                                        width: "100%",
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        border: "1px solid #E0DDD6",
                                        backgroundColor: "#F5F3EF",
                                        fontSize: 14,
                                        color: "#262626",
                                        outline: "none",
                                        fontFamily: "inherit"
                                    }}
                                >
                                    <option value="study">Study</option>
                                    <option value="gym">Gym</option>
                                    <option value="cafe">Cafe</option>
                                </select>
                            </div>

                            {/* Lat and Lng side by side */}
                            <div style={{ display: "flex", gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        display: "block",
                                        fontSize: 10,
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: "#9C9086",
                                        marginBottom: 6
                                    }}>
                                        Latitude *
                                    </label>
                                    <input
                                        type="number"
                                        value={locationForm.latitude}
                                        onChange={e => setLocationForm(p => ({ ...p, latitude: e.target.value }))}
                                        placeholder="33.6471"
                                        style={{
                                            width: "100%",
                                            padding: "10px 14px",
                                            borderRadius: 10,
                                            border: "1px solid #E0DDD6",
                                            backgroundColor: "#F5F3EF",
                                            fontSize: 14,
                                            color: "#262626",
                                            outline: "none",
                                            boxSizing: "border-box",
                                            fontFamily: "inherit"
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        display: "block",
                                        fontSize: 10,
                                        letterSpacing: "0.12em",
                                        textTransform: "uppercase",
                                        color: "#9C9086",
                                        marginBottom: 6
                                    }}>
                                        Longitude *
                                    </label>
                                    <input
                                        type="number"
                                        value={locationForm.longitude}
                                        onChange={e => setLocationForm(p => ({ ...p, longitude: e.target.value }))}
                                        placeholder="-117.8411"
                                        style={{
                                            width: "100%",
                                            padding: "10px 14px",
                                            borderRadius: 10,
                                            border: "1px solid #E0DDD6",
                                            backgroundColor: "#F5F3EF",
                                            fontSize: 14,
                                            color: "#262626",
                                            outline: "none",
                                            boxSizing: "border-box",
                                            fontFamily: "inherit"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Capacity */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: 10,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#9C9086",
                                    marginBottom: 6
                                }}>
                                    Capacity estimate *
                                </label>
                                <input
                                    type="number"
                                    value={locationForm.capacity_estimate}
                                    onChange={e => setLocationForm(p => ({ ...p, capacity_estimate: e.target.value }))}
                                    placeholder="100"
                                    style={{
                                        width: "100%",
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        border: "1px solid #E0DDD6",
                                        backgroundColor: "#F5F3EF",
                                        fontSize: 14,
                                        color: "#262626",
                                        outline: "none",
                                        boxSizing: "border-box",
                                        fontFamily: "inherit"
                                    }}
                                />
                            </div>

                            {/* Parent location */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: 10,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#9C9086",
                                    marginBottom: 6
                                }}>
                                    Parent location{" "}
                                    <span style={{ textTransform: "none", letterSpacing: 0, color: "#C0B8B0" }}>
                                        (optional — for floors/zones)
                                    </span>
                                </label>
                                <select
                                    value={locationForm.parent_id}
                                    onChange={e => setLocationForm(p => ({ ...p, parent_id: e.target.value }))}
                                    style={{
                                        width: "100%",
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        border: "1px solid #E0DDD6",
                                        backgroundColor: "#F5F3EF",
                                        fontSize: 14,
                                        color: "#262626",
                                        outline: "none",
                                        fontFamily: "inherit"
                                    }}
                                >
                                    <option value="">None</option>
                                    {allLocations
                                        .filter(l => !l.parent_id)
                                        .map(l => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Admin tag */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: 10,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "#9C9086",
                                    marginBottom: 6
                                }}>
                                    Admin tag{" "}
                                    <span style={{ textTransform: "none", letterSpacing: 0, color: "#C0B8B0" }}>
                                        (optional)
                                    </span>
                                </label>
                                <select
                                    value={locationForm.admin_tag}
                                    onChange={e => setLocationForm(p => ({ ...p, admin_tag: e.target.value }))}
                                    style={{
                                        width: "100%",
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        border: "1px solid #E0DDD6",
                                        backgroundColor: "#F5F3EF",
                                        fontSize: 14,
                                        color: "#262626",
                                        outline: "none",
                                        fontFamily: "inherit"
                                    }}
                                >
                                    <option value="">None</option>
                                    <option value="usually active">Usually active</option>
                                    <option value="usually empty">Usually empty</option>
                                </select>
                            </div>

                            {locationSuccess && (
                                <p style={{ fontSize: 13, color: "#4CAF50" }}>
                                    Location added successfully
                                </p>
                            )}

                            <button
                                onClick={handleAddLocation}
                                disabled={locationLoading}
                                style={{
                                    padding: "11px",
                                    borderRadius: 10,
                                    border: "none",
                                    backgroundColor: locationLoading ? "#C8C4BA" : "#7A5F55",
                                    color: "#ECF0F1",
                                    fontSize: 12,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    cursor: locationLoading ? "not-allowed" : "pointer",
                                    fontFamily: "inherit"
                                }}
                            >
                                {locationLoading ? "Adding..." : "Add location"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Existing locations list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {allLocations.map(loc => (
                        <div key={loc.id}>
                            {editingLocation?.id === loc.id ? (
                                /* Edit form inline */
                                <div style={{
                                    backgroundColor: "#FAFAF8",
                                    borderRadius: 12,
                                    padding: "20px",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
                                }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                                            style={{
                                                width: "100%",
                                                padding: "10px 14px",
                                                borderRadius: 10,
                                                border: "1px solid #E0DDD6",
                                                backgroundColor: "#F5F3EF",
                                                fontSize: 14,
                                                color: "#262626",
                                                outline: "none",
                                                boxSizing: "border-box",
                                                fontFamily: "inherit"
                                            }}
                                        />
                                        <select
                                            value={editForm.category}
                                            onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                                            style={{
                                                width: "100%",
                                                padding: "10px 14px",
                                                borderRadius: 10,
                                                border: "1px solid #E0DDD6",
                                                backgroundColor: "#F5F3EF",
                                                fontSize: 14,
                                                color: "#262626",
                                                outline: "none",
                                                fontFamily: "inherit"
                                            }}
                                        >
                                            <option value="study">Study</option>
                                            <option value="gym">Gym</option>
                                            <option value="cafe">Cafe</option>
                                        </select>
                                        <div style={{ display: "flex", gap: 12 }}>
                                            <input
                                                type="number"
                                                value={editForm.latitude}
                                                onChange={e => setEditForm(p => ({ ...p, latitude: e.target.value }))}
                                                placeholder="Latitude"
                                                style={{
                                                    flex: 1,
                                                    padding: "10px 14px",
                                                    borderRadius: 10,
                                                    border: "1px solid #E0DDD6",
                                                    backgroundColor: "#F5F3EF",
                                                    fontSize: 14,
                                                    color: "#262626",
                                                    outline: "none",
                                                    fontFamily: "inherit"
                                                }}
                                            />
                                            <input
                                                type="number"
                                                value={editForm.longitude}
                                                onChange={e => setEditForm(p => ({ ...p, longitude: e.target.value }))}
                                                placeholder="Longitude"
                                                style={{
                                                    flex: 1,
                                                    padding: "10px 14px",
                                                    borderRadius: 10,
                                                    border: "1px solid #E0DDD6",
                                                    backgroundColor: "#F5F3EF",
                                                    fontSize: 14,
                                                    color: "#262626",
                                                    outline: "none",
                                                    fontFamily: "inherit"
                                                }}
                                            />
                                        </div>
                                        <input
                                            type="number"
                                            value={editForm.capacity_estimate}
                                            onChange={e => setEditForm(p => ({ ...p, capacity_estimate: e.target.value }))}
                                            placeholder="Capacity"
                                            style={{
                                                width: "100%",
                                                padding: "10px 14px",
                                                borderRadius: 10,
                                                border: "1px solid #E0DDD6",
                                                backgroundColor: "#F5F3EF",
                                                fontSize: 14,
                                                color: "#262626",
                                                outline: "none",
                                                boxSizing: "border-box",
                                                fontFamily: "inherit"
                                            }}
                                        />
                                        <select
                                            value={editForm.admin_tag}
                                            onChange={e => setEditForm(p => ({ ...p, admin_tag: e.target.value }))}
                                            style={{
                                                width: "100%",
                                                padding: "10px 14px",
                                                borderRadius: 10,
                                                border: "1px solid #E0DDD6",
                                                backgroundColor: "#F5F3EF",
                                                fontSize: 14,
                                                color: "#262626",
                                                outline: "none",
                                                fontFamily: "inherit"
                                            }}
                                        >
                                            <option value="">No tag</option>
                                            <option value="usually active">Usually active</option>
                                            <option value="usually empty">Usually empty</option>
                                        </select>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button
                                                onClick={handleEditLocation}
                                                disabled={locationLoading}
                                                style={{
                                                    flex: 1,
                                                    padding: "10px",
                                                    borderRadius: 8,
                                                    border: "none",
                                                    backgroundColor: "#7A5F55",
                                                    color: "#ECF0F1",
                                                    fontSize: 12,
                                                    letterSpacing: "0.08em",
                                                    textTransform: "uppercase",
                                                    cursor: "pointer",
                                                    fontFamily: "inherit"
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingLocation(null)}
                                                style={{
                                                    flex: 1,
                                                    padding: "10px",
                                                    borderRadius: 8,
                                                    border: "1px solid #E0DDD6",
                                                    backgroundColor: "transparent",
                                                    color: "#9C9086",
                                                    fontSize: 12,
                                                    letterSpacing: "0.08em",
                                                    textTransform: "uppercase",
                                                    cursor: "pointer",
                                                    fontFamily: "inherit"
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : deleteConfirm === loc.id ? (
                                /* Delete confirmation */
                                <div style={{
                                    backgroundColor: "#FAFAF8",
                                    borderRadius: 12,
                                    padding: "16px 20px",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <p style={{ fontSize: 13, color: "#C0786A" }}>
                                        Delete "{loc.name}"? This cannot be undone.
                                    </p>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button
                                            onClick={() => handleDeleteLocation(loc.id)}
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: 8,
                                                border: "none",
                                                backgroundColor: "#C0786A",
                                                color: "white",
                                                fontSize: 11,
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                                cursor: "pointer",
                                                fontFamily: "inherit"
                                            }}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(null)}
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: 8,
                                                border: "1px solid #E0DDD6",
                                                backgroundColor: "transparent",
                                                color: "#9C9086",
                                                fontSize: 11,
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                                cursor: "pointer",
                                                fontFamily: "inherit"
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Normal row */
                                <div style={{
                                    backgroundColor: "#FAFAF8",
                                    borderRadius: 12,
                                    padding: "14px 20px",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: "#262626", marginBottom: 2 }}>
                                            {loc.name}
                                        </p>
                                        <p style={{ fontSize: 11, color: "#B0A898" }}>
                                            {loc.category}
                                            {loc.parent_id && " · sublocation"}
                                            {loc.admin_tag && ` · ${loc.admin_tag}`}
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <p style={{ fontSize: 11, color: "#C0B8B0", marginRight: 8 }}>
                                            {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setEditingLocation(loc)
                                                setEditForm({
                                                    name: loc.name,
                                                    category: loc.category,
                                                    latitude: String(loc.latitude),
                                                    longitude: String(loc.longitude),
                                                    capacity_estimate: String(loc.capacity_estimate),
                                                    parent_id: loc.parent_id || "",
                                                    admin_tag: loc.admin_tag || ""
                                                })
                                            }}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 8,
                                                border: "1px solid #E0DDD6",
                                                backgroundColor: "transparent",
                                                color: "#7A5F55",
                                                fontSize: 11,
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                                cursor: "pointer",
                                                fontFamily: "inherit"
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(loc.id)}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 8,
                                                border: "1px solid #E0DDD6",
                                                backgroundColor: "transparent",
                                                color: "#C0786A",
                                                fontSize: 11,
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                                cursor: "pointer",
                                                fontFamily: "inherit"
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}