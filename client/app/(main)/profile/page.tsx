"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) router.push("/login")
    }, [user, loading, router])

    function handleSignOut() {
        signOut()
        router.push("/login")
    }

    if (loading) return null
    if (!user) return null

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FAFAF8",
            backdropFilter: "blur(12px)",
            zIndex: 30,
            fontFamily: "var(--font-cormorant), Georgia, serif",
            display: "flex"
        }}>

            {/* Left sidebar — 1/3 */}
            <div style={{
                width: "20%",
                height: "100%",
                padding: "48px 40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexShrink: 0,
                borderRight: "1px solid #D4D0C8"
            }}>
                <div>
                    {/* Back link */}
                    <Link href="/map" style={{ textDecoration: "none" }}>
                        <p style={{
                            fontSize: 11,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#9C9086",
                            marginBottom: 48
                        }}>
                            ← Back to map
                        </p>
                    </Link>

                    {/* Avatar */}
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "#7A5F55",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16
                    }}>
                        <span style={{
                            fontSize: 22,
                            fontWeight: 600,
                            color: "#ECF0F1"
                        }}>
                            {user.first_name.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <h2 style={{
                        fontSize: 22,
                        fontWeight: 600,
                        color: "#262626",
                        marginBottom: 4
                    }}>
                        {user.first_name}
                    </h2>
                    <p style={{
                        fontSize: 12,
                        color: "#9C9086",
                        letterSpacing: "0.04em",
                        marginBottom: 8
                    }}>
                        @{user.username}
                    </p>
                    <div style={{
                        display: "inline-block",
                        backgroundColor: "#F0EDE8",
                        borderRadius: 8,
                        padding: "4px 10px",
                        marginBottom: 48
                    }}>
                        <span style={{
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: user.account_type === "contributor" ? "#7A5F55" : "#B0A898"
                        }}>
                            {user.account_type}
                        </span>
                    </div>

                    {/* Section nav */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <a href="#details" style={{ textDecoration: "none" }}>
                            <p style={{
                                fontSize: 13,
                                color: "#7A5F55",
                                letterSpacing: "0.04em",
                                padding: "6px 0",
                                borderLeft: "2px solid #D4D0C8",
                                paddingLeft: 12
                            }}>
                                Account details
                            </p>
                        </a>
                        <a href="#notifications" style={{ textDecoration: "none" }}>
                            <p style={{
                                fontSize: 13,
                                color: "#7A5F55",
                                letterSpacing: "0.04em",
                                padding: "6px 0",
                                borderLeft: "2px solid #D4D0C8",
                                paddingLeft: 12
                            }}>
                                Notifications
                            </p>
                        </a>
                        <a href="#contributor" style={{ textDecoration: "none" }}>
                            <p style={{
                                fontSize: 13,
                                color: "#7A5F55",
                                letterSpacing: "0.04em",
                                padding: "6px 0",
                                borderLeft: "2px solid #D4D0C8",
                                paddingLeft: 12
                            }}>
                                Contributor
                            </p>
                        </a>
                    </div>
                </div>

                {/* Sign out */}
                <button
                    onClick={handleSignOut}
                    style={{
                        background: "none",
                        border: "none",
                        fontSize: 13,
                        letterSpacing: "0.06em",
                        color: "#C0786A",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        padding: 0,
                        textAlign: "left"
                    }}
                >
                    Sign out
                </button>
            </div>

            {/* Right content — 2/3 */}
            <div style={{
                flex: 1,
                height: "100%",
                overflowY: "auto",
                padding: "48px 120px",
                fontSize: 10
            }}>
                <div style={{ display: "flex", flexDirection: "column" }}>

                    {/* Account details */}
                    <section id="details" style={{ paddingBottom: 40 }}>
                        <p style={{
                            fontSize: 11,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "#B0A898",
                            marginBottom: 20
                        }}>
                            Account details
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 16, color: "#7A7570" }}>Email</span>
                                <span style={{ fontSize: 16, color: "#262626" }}>{user.email}</span>
                            </div>
                            {user.location && (
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 16, color: "#7A7570" }}>Area</span>
                                    <span style={{ fontSize: 16, color: "#262626" }}>{user.location}</span>
                                </div>
                            )}
                            {user.phone_number && (
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 16, color: "#7A7570" }}>Phone</span>
                                    <span style={{ fontSize: 16, color: "#262626" }}>{user.phone_number}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 16, color: "#7A7570" }}>Member since</span>
                                <span style={{ fontSize: 16, color: "#262626" }}>
                                    {new Date(user.member_since).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>
                        </div>
                    </section>

                    <div style={{ borderTop: "1px solid #D4D0C8", marginBottom: 40 }} />

                    {/* Notifications */}
                    <section id="notifications" style={{ paddingBottom: 40 }}>
                        <p style={{
                            fontSize: 11,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "#B0A898",
                            marginBottom: 20
                        }}>
                            Notifications
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <p style={{ fontSize: 16, color: "#262626", marginBottom: 4 }}>
                                        SMS notifications
                                    </p>
                                    <p style={{ fontSize: 13, color: "#B0A898" }}>
                                        Application updates via text
                                    </p>
                                </div>
                                <div style={{
                                    width: 40,
                                    height: 22,
                                    borderRadius: 11,
                                    backgroundColor: user.sms_notifications ? "#7A5F55" : "#D4D0C8",
                                    position: "relative",
                                    opacity: 0.7,
                                    flexShrink: 0
                                }}>
                                    <div style={{
                                        position: "absolute",
                                        top: 3,
                                        left: user.sms_notifications ? 21 : 3,
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        backgroundColor: "white",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                                    }} />
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <p style={{ fontSize: 16, color: "#262626", marginBottom: 4 }}>
                                        Availability alerts
                                    </p>
                                    <p style={{ fontSize: 13, color: "#B0A898" }}>
                                        Text me when a saved spot clears up
                                    </p>
                                </div>
                                <div style={{
                                    width: 40,
                                    height: 22,
                                    borderRadius: 11,
                                    backgroundColor: user.availability_alerts ? "#7A5F55" : "#D4D0C8",
                                    position: "relative",
                                    opacity: 0.7,
                                    flexShrink: 0
                                }}>
                                    <div style={{
                                        position: "absolute",
                                        top: 3,
                                        left: user.availability_alerts ? 21 : 3,
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        backgroundColor: "white",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                                    }} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div style={{ borderTop: "1px solid #D4D0C8", marginBottom: 40 }} />

                    {/* Contributor */}
                    <section id="contributor" style={{ paddingBottom: 40 }}>
                        <p style={{
                            fontSize: 11,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "#B0A898",
                            marginBottom: 20
                        }}>
                            Contributor
                        </p>
                        {user.account_type === "contributor" || user.account_type === "admin" ? (
                            <p style={{ fontSize: 16, color: "#7A5F55", lineHeight: 1.6 }}>
                                {user.account_type === "admin"
                                    ? "You're an admin. You can manage locations and approve contributors."
                                    : "You're an approved contributor. Thank you for helping the community."
                                }
                            </p>
                        ) : user.status === "pending" ? (
                            <p style={{ fontSize: 16, color: "#9C9086", lineHeight: 1.6 }}>
                                Your application is under review. We'll notify you by SMS when a decision is made.
                            </p>
                        ) : (
                            <>
                                <p style={{
                                    fontSize: 16,
                                    color: "#7A7570",
                                    lineHeight: 1.6,
                                    marginBottom: 20
                                }}>
                                    Contributors can submit real-time crowd reports and help the community find available spaces.
                                </p>
                                <Link href="/apply" style={{ textDecoration: "none" }}>
                                    <div style={{
                                        backgroundColor: "#7A5F55",
                                        borderRadius: 10,
                                        padding: "10px 16px",
                                        display: "inline-block"
                                    }}>
                                        <span style={{
                                            fontSize: 13,
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            color: "#ECF0F1"
                                        }}>
                                            Apply to contribute
                                        </span>
                                    </div>
                                </Link>
                            </>
                        )}
                    </section>

                </div>
            </div>
        </div>
    )
}